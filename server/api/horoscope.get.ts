// server/api/horoscope.get.ts

import { defineEventHandler, getQuery, createError } from 'h3'

function getApiKey(): string {
  return process.env.GEMINI_API_KEY ?? ''
}

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

const SIGNS    = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const SIGN_IDS = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces']

const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati',
]

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
const DASHA_TOTAL_YEARS = 120
const NAKSHATRA_DASHA_START = [0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8, 0,1,2,3,4,5,6,7,8]

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

interface DashaInfo {
  mahadasha: string; mahaDaysLeft: number
  antardasha: string; antarDaysLeft: number
  mahaEndDate: string; antarEndDate: string
}

function computeTransitDasha(moonLon: number, jd: number): DashaInfo {
  const nak = nakshatraOf(moonLon)
  const dashaIdx = NAKSHATRA_DASHA_START[nak.index] ?? 0
  const nakWidth = 360 / 27
  const nakFrac  = (moonLon % nakWidth) / nakWidth
  const maha     = DASHA_SEQUENCE[dashaIdx]!
  const mahaYearsLeft = maha.years * (1 - nakFrac)
  const mahaDaysLeft  = Math.round(mahaYearsLeft * 365.25)
  const mahaElapsedFrac = nakFrac
  let antarElapsed = 0
  let antarIdx = dashaIdx
  for (let i = 0; i < 9; i++) {
    const aIdx   = (dashaIdx + i) % 9
    const aEntry = DASHA_SEQUENCE[aIdx]!
    const aDur   = (aEntry.years / DASHA_TOTAL_YEARS) * maha.years
    const aFrac  = aDur / maha.years
    if (antarElapsed + aFrac >= mahaElapsedFrac) { antarIdx = aIdx; break }
    antarElapsed += aFrac
  }
  const antar      = DASHA_SEQUENCE[antarIdx]!
  const antarYears = (antar.years / DASHA_TOTAL_YEARS) * maha.years
  const antarFracLeft = 1 - ((mahaElapsedFrac - antarElapsed) / (antarYears / maha.years))
  const antarDaysLeft = Math.round(antarFracLeft * antarYears * 365.25)
  const today    = new Date((jd - 2440587.5) * 86400000)
  const mahaEnd  = new Date(today.getTime() + mahaDaysLeft * 86400000)
  const antarEnd = new Date(today.getTime() + Math.max(1, antarDaysLeft) * 86400000)
  return {
    mahadasha: maha.planet, mahaDaysLeft,
    antardasha: antar.planet, antarDaysLeft: Math.max(1, antarDaysLeft),
    mahaEndDate:  mahaEnd.toISOString().split('T')[0]!,
    antarEndDate: antarEnd.toISOString().split('T')[0]!,
  }
}

function buildAstroContext(jd: number, dateStr: string): string {
  const lons    = getPlanetLons(jd)
  const moonNak = nakshatraOf(lons.Moon!)
  const sunNak  = nakshatraOf(lons.Sun!)

  const planetBlock = Object.entries(lons).map(([p, lon]) => {
    const nak  = nakshatraOf(lon)
    const deg  = (lon % 30).toFixed(2)
    const sign = signOf(lon)
    return `  ${p.padEnd(8)}: ${deg}° ${sign.padEnd(12)} Nakshatra: ${nak.name} Pada ${nak.pada}`
  }).join('\n')

  const signBlocks = SIGNS.map((sign, idx) => {
    const signMid = idx * 30 + 15
    const houseMap = Object.entries(lons).map(([p, lon]) => {
      const house  = ((Math.floor(lon / 30) - idx + 12) % 12) + 1
      const dist   = angDist(lon, signMid)
      const asp    = aspectName(dist)
      const aspStr = asp !== 'none' ? ` [${asp} ${dist.toFixed(0)}°]` : ''
      return `    ${p}: House ${house}${aspStr}`
    }).join('\n')
    const adjustedMoonLon = ((lons.Moon! + idx * (360 / 12)) % 360)
    const dasha = computeTransitDasha(adjustedMoonLon, jd)
    return `${sign.toUpperCase()}:
  Houses & aspects:\n${houseMap}
  Mahadasha: ${dasha.mahadasha} (${dasha.mahaDaysLeft}d left, ends ${dasha.mahaEndDate})
  Antardasha: ${dasha.antardasha} (${dasha.antarDaysLeft}d left, ends ${dasha.antarEndDate})`
  }).join('\n\n')

  return `DATE: ${dateStr}
PLANETS (Sidereal/Lahiri):\n${planetBlock}
MOON: ${signOf(lons.Moon!)} | ${moonNak.name} Pada ${moonNak.pada}
SUN:  ${signOf(lons.Sun!)} | ${sunNak.name} Pada ${sunNak.pada}

PER-SIGN:\n${signBlocks}`
}

async function generateSignPrediction(
  astroContext: string,
  dateStr: string,
  signName: string,
  signId: string,
): Promise<SignPrediction> {

  const apiKey = getApiKey()
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const prompt = `You are a precise Vedic astrology prediction engine. Generate a daily horoscope for ${signName} on ${dateStr}.

${astroContext}

Generate prediction for ${signName.toUpperCase()} only. Return ONLY valid JSON, no markdown, no extra text:
{
  "summary": "2-4 sentences referencing specific planetary positions",
  "love":      { "score": 7, "text": "2-4 sentences", "tip": "one concrete tip" },
  "career":    { "score": 8, "text": "2-4 sentences", "tip": "one concrete tip" },
  "health":    { "score": 6, "text": "2-4 sentences", "tip": "one concrete tip" },
  "travel":    { "score": 5, "text": "2-4 sentences", "tip": "one concrete tip" },
  "education": { "score": 9, "text": "2-4 sentences", "tip": "one concrete tip" },
  "overallScore": 7,
  "affirmation": "one sentence",
  "luckyColor": "color name",
  "luckyNumber": 4,
  "luckyDay": "Wednesday",
  "luckyGem": "gem name"
}`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 4000, temperature: 0.7 },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API ${res.status}: ${err.slice(0, 300)}`)
  }

  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  // Strip markdown code fences first
  const stripped = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim()

  // Find first { and last } to extract pure JSON
  const firstBrace = stripped.indexOf('{')
  const lastBrace  = stripped.lastIndexOf('}')
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error(`No JSON in response: ${stripped.slice(0, 200)}`)
  }
  const clean = stripped.slice(firstBrace, lastBrace + 1)

  try {
    return JSON.parse(clean) as SignPrediction
  } catch {
    throw new Error(`Failed to parse JSON: ${clean.slice(0, 200)}`)
  }
}

export default defineEventHandler(async (event) => {
  const query  = getQuery(event)
  const signId = (query.sign as string | undefined)?.toLowerCase()

  if (!signId || !SIGN_IDS.includes(signId)) {
    throw createError({ statusCode: 400, statusMessage: 'Valid sign parameter required' })
  }

  const signIndex = SIGN_IDS.indexOf(signId)
  const signName  = SIGNS[signIndex]!

  const now   = new Date()
  const istMs = now.getTime() + 5.5 * 3600 * 1000
  const ist   = new Date(istMs)
  const today = ist.toISOString().split('T')[0] as string

  // Serve from cache if same IST day and sign cached
  if (cache && cache.date === today && cache.predictions[signId]) {
    return { date: today, cached: true, predictions: { [signId]: cache.predictions[signId] } }
  }

  try {
    const jd       = dateToJD(ist)
    const astroCtx = buildAstroContext(jd, today)
    const pred     = await generateSignPrediction(astroCtx, today, signName, signId)

    if (!cache || cache.date !== today) {
      cache = { date: today, predictions: {} }
    }
    cache.predictions[signId] = pred

    return { date: today, cached: false, predictions: { [signId]: pred } }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[horoscope]', msg)
    throw createError({ statusCode: 500, statusMessage: `Horoscope generation failed: ${msg}` })
  }
})