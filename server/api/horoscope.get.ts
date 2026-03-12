// server/api/horoscope.get.ts
// Full Vedic daily horoscope — sidereal planetary positions, aspects, Nakshatra,
// Vimshottari Mahadasha + Antardasha per sign. Cached once per IST calendar day.

import { defineEventHandler, getQuery, createError } from 'h3'

function getApiKey(): string {
  return process.env.ANTHROPIC_API_KEY ?? ''
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CacheEntry { date: string; predictions: Record<string, SignPrediction> }
let cache: CacheEntry | null = null

export interface CategoryPrediction { score: number; text: string; tip: string }
export interface SignPrediction {
  summary: string
  love: CategoryPrediction; career: CategoryPrediction
  health: CategoryPrediction; travel: CategoryPrediction; education: CategoryPrediction
  overallScore: number; affirmation: string
  luckyColor: string; luckyNumber: number; luckyDay: string; luckyGem: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SIGNS    = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SIGN_IDS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati',
]

// Vimshottari Dasha sequence and durations (years)
const DASHA_SEQUENCE: { planet: string; years: number }[] = [
  { planet: 'Ketu',    years: 7  },
  { planet: 'Venus',   years: 20 },
  { planet: 'Sun',     years: 6  },
  { planet: 'Moon',    years: 10 },
  { planet: 'Mars',    years: 7  },
  { planet: 'Rahu',    years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn',  years: 19 },
  { planet: 'Mercury', years: 17 },
]
const DASHA_TOTAL_YEARS = 120 // Vimshottari cycle

// Which nakshatra starts which dasha (index in DASHA_SEQUENCE)
// Ashwini(0)=Ketu, Bharani(1)=Venus, Krittika(2)=Sun, Rohini(3)=Moon, Mrigashira(4)=Mars,
// Ardra(5)=Rahu, Punarvasu(6)=Jupiter, Pushya(7)=Saturn, Ashlesha(8)=Mercury
// then repeats: Magha(9)=Ketu, ...
const NAKSHATRA_DASHA_START = [0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8]

// ── Astronomical engine ───────────────────────────────────────────────────────
function dateToJD(d: Date): number {
  const y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1, day = d.getUTCDate()
  const A = Math.floor((14 - mo) / 12), Y = y + 4800 - A, M = mo + 12 * A - 3
  return day + Math.floor((153*M+2)/5) + 365*Y + Math.floor(Y/4) - Math.floor(Y/100) + Math.floor(Y/400) - 32045
}
function getSunLon(jd: number): number {
  const n = jd - 2451545.0, L = (280.460 + 0.9856474*n) % 360
  const g = ((357.528 + 0.9856003*n) % 360) * Math.PI / 180
  return ((L + 1.915*Math.sin(g) + 0.020*Math.sin(2*g)) % 360 + 360) % 360
}
function getMoonLon(jd: number): number {
  const n = jd - 2451545.0, L = (218.316 + 13.176396*n) % 360
  const M = ((134.963 + 13.064993*n) % 360) * Math.PI / 180
  const F = ((93.272  + 13.229350*n) % 360) * Math.PI / 180
  return ((L + 6.289*Math.sin(M) - 1.274*Math.sin(2*F-M) + 0.658*Math.sin(2*F)) % 360 + 360) % 360
}
function getLahiri(jd: number): number {
  return 23.85 + (50.2564 / 3600) * (jd - 2415020.0) / 365.25
}
function sidLon(raw: number, ayn: number): number { return ((raw - ayn) % 360 + 360) % 360 }

function getPlanetLons(jd: number): Record<string, number> {
  const n = jd - 2451545.0, a = getLahiri(jd)
  return {
    Sun:     sidLon(getSunLon(jd), a),
    Moon:    sidLon(getMoonLon(jd), a),
    Mars:    sidLon((355.433 + 0.52402*n) % 360, a),
    Mercury: sidLon((252.251 + 4.09234*n) % 360, a),
    Jupiter: sidLon((34.351  + 0.08309*n) % 360, a),
    Venus:   sidLon((181.979 + 1.60214*n) % 360, a),
    Saturn:  sidLon((50.077  + 0.03346*n) % 360, a),
    Rahu:    sidLon(((125.044 - 0.05295*n) % 360 + 360) % 360, a),
  }
}

function nakshatraOf(lon: number): { name: string; index: number; pada: number } {
  const idx  = Math.floor(lon / (360 / 27))
  const pada = Math.floor((lon % (360 / 27)) / (360 / 108)) + 1
  return { name: NAKSHATRAS[idx] ?? 'Ashwini', index: idx, pada }
}

function signOf(lon: number): string { return SIGNS[Math.floor(lon / 30)] ?? 'Aries' }

function angDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d
}

function aspectName(dist: number): string {
  if (dist <= 8)               return 'conjunction'
  if (Math.abs(dist - 60)  <= 8) return 'sextile'
  if (Math.abs(dist - 90)  <= 8) return 'square'
  if (Math.abs(dist - 120) <= 8) return 'trine'
  if (Math.abs(dist - 150) <= 8) return 'quincunx'
  if (Math.abs(dist - 180) <= 8) return 'opposition'
  return 'none'
}

// ── Vimshottari Dasha engine ──────────────────────────────────────────────────
// For generic (non-birth-time) daily horoscope we compute the "current transit dasha"
// by treating the Moon's nakshatra on the given date as the reference point.
// This gives a meaningful dasha period that changes as Moon transits.
interface DashaInfo {
  mahadasha:    string  // planet
  mahaDaysLeft: number
  antardasha:   string  // planet
  antarDaysLeft: number
  mahaEndDate:  string  // YYYY-MM-DD
  antarEndDate: string
}

function computeTransitDasha(moonLon: number, jd: number): DashaInfo {
  const nak       = nakshatraOf(moonLon)
  const dashaIdx  = NAKSHATRA_DASHA_START[nak.index] ?? 0

  // Fraction through nakshatra (0–1) determines fraction through that dasha already elapsed
  const nakWidth  = 360 / 27
  const nakFrac   = (moonLon % nakWidth) / nakWidth  // 0=start of nak, 1=end

  // Mahadasha planet and years remaining
  const maha      = DASHA_SEQUENCE[dashaIdx]!
  const mahaYearsLeft = maha.years * (1 - nakFrac)
  const mahaDaysLeft  = Math.round(mahaYearsLeft * 365.25)

  // Antardasha: proportional subdivision of Mahadasha
  // Each antardasha = (antarPlanet.years / TOTAL) * maha.years in duration
  // Find which antardasha is active based on elapsed fraction within maha
  const mahaElapsedFrac = nakFrac  // same fraction (simplified — accurate enough for general horoscope)
  let antarElapsed = 0
  let antarIdx = dashaIdx
  for (let i = 0; i < 9; i++) {
    const aIdx    = (dashaIdx + i) % 9
    const aEntry  = DASHA_SEQUENCE[aIdx]!
    const aDur    = (aEntry.years / DASHA_TOTAL_YEARS) * maha.years
    const aFrac   = aDur / maha.years
    if (antarElapsed + aFrac >= mahaElapsedFrac) {
      antarIdx = aIdx
      break
    }
    antarElapsed += aFrac
  }

  const antar         = DASHA_SEQUENCE[antarIdx]!
  const antarYears    = (antar.years / DASHA_TOTAL_YEARS) * maha.years
  const antarFracLeft = 1 - ((mahaElapsedFrac - antarElapsed) / (antarYears / maha.years))
  const antarDaysLeft = Math.round(antarFracLeft * antarYears * 365.25)

  const today = new Date((jd - 2440587.5) * 86400000)
  const mahaEnd = new Date(today.getTime() + mahaDaysLeft * 86400000)
  const antarEnd = new Date(today.getTime() + Math.max(1, antarDaysLeft) * 86400000)

  return {
    mahadasha:    maha.planet,
    mahaDaysLeft,
    antardasha:   antar.planet,
    antarDaysLeft: Math.max(1, antarDaysLeft),
    mahaEndDate:  mahaEnd.toISOString().split('T')[0]!,
    antarEndDate: antarEnd.toISOString().split('T')[0]!,
  }
}

// ── Build full Vedic context string per sign for Claude ───────────────────────
function buildAstroContext(jd: number, dateStr: string): string {
  const lons    = getPlanetLons(jd)
  const moonNak = nakshatraOf(lons.Moon!)
  const sunNak  = nakshatraOf(lons.Sun!)

  // ── Planetary positions block ──
  const planetBlock = Object.entries(lons).map(([p, lon]) => {
    const nak    = nakshatraOf(lon)
    const deg    = (lon % 30).toFixed(2)
    const sign   = signOf(lon)
    const retro  = ['Saturn','Jupiter','Mars','Mercury','Venus'].includes(p)
                   ? '' : ''  // simplified — no retrograde calc (would need more data)
    return `  ${p.padEnd(8)}: ${deg}° ${sign.padEnd(12)} Nakshatra: ${nak.name} Pada ${nak.pada}`
  }).join('\n')

  // ── Moon detail ──
  const moonBlock = [
    `  Sign:       ${signOf(lons.Moon!)}`,
    `  Nakshatra:  ${moonNak.name} (Pada ${moonNak.pada})`,
    `  Longitude:  ${(lons.Moon! % 30).toFixed(2)}° in sign`,
  ].join('\n')

  // ── Per-sign aspects + Dasha block ──
  const signBlocks = SIGNS.map((sign, idx) => {
    const signMid  = idx * 30 + 15
    // Which house is each planet in relative to this sign (whole-sign)
    const houseMap = Object.entries(lons).map(([p, lon]) => {
      const house = ((Math.floor(lon / 30) - idx + 12) % 12) + 1
      const dist  = angDist(lon, signMid)
      const asp   = aspectName(dist)
      const aspStr = asp !== 'none' ? ` [${asp} ${dist.toFixed(0)}°]` : ''
      return `    ${p}: House ${house}${aspStr}`
    }).join('\n')

    // Dasha for this sign's native (using current Moon as Dasha karaka)
    // We offset Moon nakshatra by sign index to give each sign a unique dasha context
    const adjustedMoonLon = ((lons.Moon! + idx * (360 / 12)) % 360)
    const dasha = computeTransitDasha(adjustedMoonLon, jd)

    return `${sign.toUpperCase()} (${sign} Lagna / Moon sign perspective):
  Planetary houses & aspects:
${houseMap}
  Current Vimshottari Dasha:
    Mahadasha:  ${dasha.mahadasha} (${dasha.mahaDaysLeft} days remaining, ends ${dasha.mahaEndDate})
    Antardasha: ${dasha.antardasha} (${dasha.antarDaysLeft} days remaining, ends ${dasha.antarEndDate})`
  }).join('\n\n')

  return `DATE: ${dateStr}

═══ SIDEREAL PLANETARY POSITIONS (Lahiri Ayanamsha) ═══
${planetBlock}

═══ MOON DETAILS ═══
${moonBlock}

═══ SUN DETAILS ═══
  Sign:       ${signOf(lons.Sun!)}
  Nakshatra:  ${sunNak.name} (Pada ${sunNak.pada})

═══ PER-SIGN ANALYSIS ═══
${signBlocks}`
}

// ── Claude API call ────────────────────────────────────────────────────────────
async function generateAllPredictions(
  astroContext: string,
  dateStr: string,
): Promise<Record<string, SignPrediction>> {

  const prompt = `You are Jyotish — a precise Vedic astrology prediction engine. Generate daily horoscope predictions for all 12 rashis for ${dateStr} using the exact planetary data below.

${astroContext}

VEDIC RULES TO APPLY:
- Benefics: Venus, Jupiter, waxing Moon, Mercury (unafflicted)
- Malefics: Saturn, Mars, Rahu, Ketu, Sun (harsh)
- Trine (120°) + sextile (60°) from benefics = auspicious
- Square (90°) + opposition (180°) from malefics = challenging
- Conjunction: judge by planets involved
- Mahadasha planet's condition heavily colours that sign's overall tone
- Antardasha planet modifies sub-themes (especially love/career/health)
- Moon nakshatra and pada shape emotional register for the day
- Kendra (1,4,7,10) placements amplify; dusthana (6,8,12) challenge
- Judge the day honestly — if Saturn squares from 8th house, reflect that

Each prediction must:
- Reference specific planetary positions, dasha period, or nakshatra from the data above
- Be varied: not every sign can have a "great day" — reflect real celestial mechanics
- Sound like a knowledgeable Vedic astrologer speaking to a student
- Be written in clear, evocative English (no jargon overload)
- 2–4 sentences per category, grounded in the actual data

Return ONLY valid JSON, no markdown, no commentary, exactly this shape:
{
  "aries":  {
    "summary": "2-4 sentences referencing today's specific planetary setup",
    "love":      { "score": 7, "text": "2-4 sentences", "tip": "one concrete tip" },
    "career":    { "score": 8, "text": "2-4 sentences", "tip": "one concrete tip" },
    "health":    { "score": 6, "text": "2-4 sentences", "tip": "one concrete tip" },
    "travel":    { "score": 5, "text": "2-4 sentences", "tip": "one concrete tip" },
    "education": { "score": 9, "text": "2-4 sentences", "tip": "one concrete tip" },
    "overallScore": 7,
    "affirmation": "one sentence",
    "luckyColor":  "color name",
    "luckyNumber": 4,
    "luckyDay":    "Wednesday",
    "luckyGem":    "gem name"
  },
  "taurus": { ... },
  "gemini": { ... },
  "cancer": { ... },
  "leo": { ... },
  "virgo": { ... },
  "libra": { ... },
  "scorpio": { ... },
  "sagittarius": { ... },
  "capricorn": { ... },
  "aquarius": { ... },
  "pisces": { ... }
}

Score rubric: 9-10 = exceptional (benefic trine/sextile + favourable dasha), 7-8 = good, 5-6 = mixed, 3-4 = challenging (malefic aspects + difficult dasha), 1-2 = very difficult. Distribute scores realistically across all 12 signs — the average should be around 6.`

  const apiKey = getApiKey()
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured on server')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 6000,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as { content: Array<{ type: string; text: string }> }
  const raw  = data.content.map(b => b.type === 'text' ? b.text : '').join('').trim()
  const clean  = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
  const parsed = JSON.parse(clean) as Record<string, SignPrediction>

  // Validate all 12 signs present
  const missing = SIGN_IDS.filter(id => !parsed[id])
  if (missing.length) throw new Error(`Claude response missing signs: ${missing.join(', ')}`)

  return parsed
}

// ── Event handler ─────────────────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  const query  = getQuery(event)
  const signId = (query.sign as string | undefined)?.toLowerCase()

  // Current IST date (UTC+5:30)
  const now    = new Date()
  const istMs  = now.getTime() + 5.5 * 3600 * 1000
  const ist    = new Date(istMs)
  const today  = ist.toISOString().split('T')[0] as string   // 'YYYY-MM-DD'

  // Serve from cache if same IST day
  if (cache && cache.date === today) {
    const predictions = signId
      ? { [signId]: cache.predictions[signId] }
      : cache.predictions
    return { date: today, cached: true, predictions }
  }

  // Fresh generation
  try {
    const jd          = dateToJD(ist)
    const astroCtx    = buildAstroContext(jd, today)
    const predictions = await generateAllPredictions(astroCtx, today)

    cache = { date: today, predictions }

    const result = signId ? { [signId]: predictions[signId] } : predictions
    return { date: today, cached: false, predictions: result }

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[horoscope]', msg)
    throw createError({ statusCode: 500, statusMessage: `Horoscope generation failed: ${msg}` })
  }
})