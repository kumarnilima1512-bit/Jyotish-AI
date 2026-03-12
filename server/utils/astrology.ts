// utils/astrology.ts
// Vedic (Sidereal) Astrology — Northern Indian Style
// Geocentric ecliptic positions via full Keplerian orbital elements (Meeus Ch.33)
// Lahiri Ayanamsha | Whole-sign houses | Vimshottari Dasha

// ─── Constants & metadata ────────────────────────────────────────────────────

export const SIGNS: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

export const SIGNS_HINDI: string[] = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
]

export type PlanetName =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury'
  | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu'

export const PLANETS: PlanetName[] = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
]

export const PLANET_SYMBOLS: Record<PlanetName, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
  Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
}

export const PLANET_COLORS: Record<PlanetName, string> = {
  Sun: '#f5c842', Moon: '#c0c8d8', Mars: '#ef4444', Mercury: '#4ade80',
  Jupiter: '#fb923c', Venus: '#f472b6', Saturn: '#94a3b8',
  Rahu: '#a78bfa', Ketu: '#f87171',
}

export const NAKSHATRA_NAMES: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface NakshatraInfo {
  index: number
  name: string
  pada: number
}

export interface PlanetPosition {
  longitude: number      // sidereal ecliptic longitude 0–360°
  sign: number           // 0=Aries … 11=Pisces
  signName: string
  degInSign: number      // 0–30°
  nakshatra: NakshatraInfo
  retrograde: boolean
}

export interface EnrichedPlanetPosition extends PlanetPosition {
  symbol: string
  color: string
  dignity: string
}

export interface PlanetInHouse extends PlanetPosition {
  name: PlanetName
}

export interface Dasha {
  planet: PlanetName
  years: number
  start: string
  end: string
  isActive: boolean
}

export interface ChartResult {
  jd: number
  ayanamsha: number
  ascendant: PlanetPosition
  lagnaSign: number
  positions: Record<PlanetName, PlanetPosition>
  houses: number[]
  planetsByHouse: PlanetInHouse[][]
  dashas: Dasha[]
  moonNakshatra: NakshatraInfo
}

// ─── Math utilities ──────────────────────────────────────────────────────────

const JD_J2000 = 2451545.0

export function normalizeDeg(d: number): number {
  return ((d % 360) + 360) % 360
}

function rad(d: number): number { return d * (Math.PI / 180) }
function deg(r: number): number { return r * (180 / Math.PI) }

export function getSign(lon: number): number {
  return Math.floor(normalizeDeg(lon) / 30)
}

export function getDegInSign(lon: number): number {
  return normalizeDeg(lon) % 30
}

export function getNakshatra(lon: number): NakshatraInfo {
  const n = normalizeDeg(lon)
  const NAK_SIZE = 360 / 27
  const nakIdx = Math.floor(n / NAK_SIZE) % 27
  const pada = Math.floor((n % NAK_SIZE) / (NAK_SIZE / 4)) + 1
  return { index: nakIdx, name: NAKSHATRA_NAMES[nakIdx] ?? '', pada }
}

// ─── Julian Day Number ───────────────────────────────────────────────────────

export function toJulianDay(
  year: number, month: number, day: number,
  hour: number, minute: number, second = 0, tzOffset = 0,
): number {
  const utcHour = hour + minute / 60 + second / 3600 - tzOffset
  let y = year
  let m = month
  const d = day + utcHour / 24
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5
}

// ─── Lahiri Ayanamsha ────────────────────────────────────────────────────────
// Based on IAU / Astronomical Almanac. Epoch value 23.85472° at J2000.0,
// precession rate 1.396042°/century (= 50.2564"/yr).

export function getLahiriAyanamsha(jd: number): number {
  const T = (jd - JD_J2000) / 36525
  return 23.85472 + 1.396042 * T - 0.000308 * T * T
}

// ─── Kepler's equation solver ────────────────────────────────────────────────

function solveKepler(M: number, e: number): number {
  let E = M
  for (let i = 0; i < 100; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E))
    E += dE
    if (Math.abs(dE) < 1e-12) break
  }
  return E
}

// ─── Orbital elements at J2000.0 (Meeus Table 33.a) ─────────────────────────
// L  = mean longitude (°), dL per Julian century
// e  = eccentricity, de per century
// i  = inclination (°), di per century
// O  = longitude of ascending node (°), dO per century
// w  = longitude of perihelion (°), dw per century
// a  = semi-major axis (AU)

interface OrbitalElements {
  L: number; dL: number
  e0: number; de: number
  i: number;  di: number
  O: number;  dO: number
  w: number;  dw: number
  a: number
}

const PLANET_ELEMENTS: Record<string, OrbitalElements> = {
  Mercury: { L:252.250906, dL:149474.0722491, e0:0.20563075, de: 0.000020407, i:7.004986, di:-0.0059516, O:48.330766, dO:-0.1254227, w:77.457796,  dw:0.1588643, a:0.38709831 },
  Venus:   { L:181.979801, dL: 58519.2130302, e0:0.00677188, de:-0.000047766, i:3.394662, di:-0.0008568, O:76.679920, dO:-0.2780559, w:131.563708, dw:0.0107337, a:0.72332102 },
  Mars:    { L:355.433275, dL: 19141.6964746, e0:0.09341233, de: 0.000090484, i:1.849726, di:-0.0081477, O:49.578540, dO:-0.2950333, w:336.040731, dw:0.4439016, a:1.52371243 },
  Jupiter: { L: 34.351484, dL:  3034.9056746, e0:0.04839266, de:-0.000162374, i:1.303270, di:-0.0019877, O:100.464441,dO: 0.1010530, w:14.331266,  dw:0.2155209, a:5.20248019 },
  Saturn:  { L: 50.077444, dL:  1222.1138488, e0:0.05415060, de:-0.000213767, i:2.488878, di: 0.0025515, O:113.663379,dO:-0.2566722, w:93.057234,  dw:0.8397171, a:9.54149883 },
}

// Earth's elements (used for geocentric conversion)
const EARTH_ELEMENTS: OrbitalElements = {
  L:100.466457, dL:36000.7698278, e0:0.01671022, de:-0.000042037,
  i:0, di:0, O:0, dO:0, w:102.937348, dw:0.3225557, a:1.000001018,
}

interface XY { x: number; y: number }

/**
 * Heliocentric ecliptic XY (J2000 ecliptic plane) using Meeus Eq.33.7
 */
function helioXY(el: OrbitalElements, T: number): XY {
  const L   = normalizeDeg(el.L + el.dL * T)
  const e   = el.e0 + el.de * T
  const w   = normalizeDeg(el.w + el.dw * T)          // long of perihelion
  const O   = normalizeDeg(el.O + el.dO * T)          // long of ascending node
  const inc = rad(el.i + el.di * T)
  const ap  = rad(normalizeDeg(w - O))                 // argument of perihelion
  const M   = rad(normalizeDeg(L - w))                 // mean anomaly
  const E   = solveKepler(M, e)

  const xp = el.a * (Math.cos(E) - e)
  const yp = el.a * Math.sqrt(1 - e * e) * Math.sin(E)

  const cosO = Math.cos(rad(O)), sinO = Math.sin(rad(O))
  const cosAP = Math.cos(ap),   sinAP = Math.sin(ap)
  const cosI  = Math.cos(inc)

  return {
    x: (cosO * cosAP - sinO * sinAP * cosI) * xp + (-cosO * sinAP - sinO * cosAP * cosI) * yp,
    y: (sinO * cosAP + cosO * sinAP * cosI) * xp + (-sinO * sinAP + cosO * cosAP * cosI) * yp,
  }
}

/**
 * Earth heliocentric XY — uses simpler direct formula since i=0, O=0
 */
function earthXY(T: number): XY {
  const el  = EARTH_ELEMENTS
  const Le  = normalizeDeg(el.L + el.dL * T)
  const ee  = el.e0 + el.de * T
  const we  = normalizeDeg(el.w + el.dw * T)
  const Me  = rad(normalizeDeg(Le - we))
  const Ee  = solveKepler(Me, ee)
  const nue = 2 * Math.atan2(Math.sqrt(1 + ee) * Math.sin(Ee / 2), Math.sqrt(1 - ee) * Math.cos(Ee / 2))
  const lonE = normalizeDeg(deg(nue) + we)
  const re   = el.a * (1 - ee * Math.cos(Ee))
  return { x: re * Math.cos(rad(lonE)), y: re * Math.sin(rad(lonE)) }
}

/**
 * Geocentric ecliptic longitude of a planet (tropical).
 * Uses light-time-corrected position (one iteration, ~4–8 min correction).
 */
function getGeocentricLon(planet: string, jd: number): number {
  const T   = (jd - JD_J2000) / 36525
  const e   = earthXY(T)
  const elements = PLANET_ELEMENTS[planet]
  if (!elements) return 0
  const p   = helioXY(elements, T)
  const dx  = p.x - e.x
  const dy  = p.y - e.y
  const dist = Math.sqrt(dx * dx + dy * dy)  // AU

  // Light-time correction: 0.0057755 days per AU
  const jdCorr = jd - 0.0057755 * dist
  const Tc  = (jdCorr - JD_J2000) / 36525
  const pc  = helioXY(elements, Tc)
  const dx2 = pc.x - e.x
  const dy2 = pc.y - e.y

  let lon = normalizeDeg(deg(Math.atan2(dy2, dx2)))

  // Jupiter–Saturn mutual perturbations (Meeus 33.a)
  if (planet === 'Jupiter') {
    const Mj = rad(normalizeDeg(20.020 + 3034.906 * T))
    const Ms = rad(normalizeDeg(316.967 + 1221.552 * T))
    lon = normalizeDeg(
      lon
      - 0.332 * Math.sin(2 * Mj - 5 * Ms - rad(67.6))
      - 0.056 * Math.sin(2 * Mj - 2 * Ms + rad(21))
      + 0.042 * Math.sin(3 * Mj - 5 * Ms + rad(21))
      - 0.036 * Math.sin(Mj - 2 * Ms)
      + 0.022 * Math.cos(Mj - Ms)
      + 0.023 * Math.sin(2 * Mj - 3 * Ms + rad(52))
    )
  }
  if (planet === 'Saturn') {
    const Mj = rad(normalizeDeg(20.020 + 3034.906 * T))
    const Ms = rad(normalizeDeg(316.967 + 1221.552 * T))
    lon = normalizeDeg(
      lon
      + 0.812 * Math.sin(2 * Mj - 5 * Ms - rad(67.6))
      - 0.229 * Math.cos(2 * Mj - 4 * Ms - rad(2))
      + 0.119 * Math.sin(Mj - 2 * Ms - rad(3))
      + 0.046 * Math.sin(2 * Mj - 6 * Ms - rad(69))
      + 0.014 * Math.sin(Mj - 3 * Ms + rad(32))
    )
  }

  return lon
}

/**
 * Retrograde: check if geocentric longitude is decreasing (compare ±1 day).
 * Only applicable for the 5 classical planets (not Sun, Moon, Rahu, Ketu).
 */
function isRetrograde(planet: string, jd: number): boolean {
  if (!PLANET_ELEMENTS[planet]) return false
  const lon0 = getGeocentricLon(planet, jd - 1)
  const lon1 = getGeocentricLon(planet, jd + 1)
  let diff = lon1 - lon0
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

// ─── Sun (high-precision Meeus, accurate to <0.01°) ─────────────────────────

export function getSunLongitude(jd: number): number {
  const T = (jd - JD_J2000) / 36525

  // Geometric mean longitude and mean anomaly
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  const M  = rad(normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T))

  // Equation of centre
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M)

  // Sun's true longitude
  let sunLon = L0 + C

  // Apparent longitude (nutation + aberration)
  const omega = rad(125.04 - 1934.136 * T)
  sunLon = sunLon - 0.00569 - 0.00478 * Math.sin(omega)

  return normalizeDeg(sunLon)
}

// ─── Moon (Meeus Ch.47, 60-term series, accurate to ~0.1°) ───────────────────

export function getMoonLongitude(jd: number): number {
  const T = (jd - JD_J2000) / 36525

  // Fundamental arguments (degrees)
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T ** 3 / 538841 - T ** 4 / 65194000)
  const D  = normalizeDeg(297.8501921 + 445267.1114034  * T - 0.0018819 * T * T + T ** 3 / 545868  - T ** 4 / 113065000)
  const M  = normalizeDeg(357.5291092 + 35999.0502909   * T - 0.0001536 * T * T + T ** 3 / 24490000)
  const Mp = normalizeDeg(134.9633964 + 477198.8675055  * T + 0.0087414 * T * T + T ** 3 / 69699   - T ** 4 / 14712000)
  const F  = normalizeDeg(93.2720950  + 483202.0175233  * T - 0.0036539 * T * T - T ** 3 / 3526000 + T ** 4 / 863310000)

  const Dr = rad(D), Mr = rad(M), Mpr = rad(Mp), Fr = rad(F)

  // E correction for Sun's eccentricity
  const E  = 1 - 0.002516 * T - 0.0000074 * T * T
  const E2 = E * E

  // Longitude sum (μas → divide by 1e6 for degrees)
  const dL =
      6288774 * Math.sin(Mpr)
    + 1274027 * Math.sin(2*Dr - Mpr)
    +  658314 * Math.sin(2*Dr)
    +  213618 * Math.sin(2*Mpr)
    - 185116 * E * Math.sin(Mr)
    -  114332 * Math.sin(2*Fr)
    +   58793 * Math.sin(2*Dr - 2*Mpr)
    +   57066 * E * Math.sin(2*Dr - Mr - Mpr)
    +   53322 * Math.sin(2*Dr + Mpr)
    +   45758 * E * Math.sin(2*Dr - Mr)
    -   40923 * Math.sin(Mr - Mpr)
    -   34720 * Math.sin(Dr)
    -   30383 * Math.sin(Mr + Mpr)
    +   15327 * Math.sin(2*Dr - 2*Fr)
    -   12528 * Math.sin(Mpr + 2*Fr)
    +   10980 * Math.sin(Mpr - 2*Fr)
    +   10675 * Math.sin(4*Dr - Mpr)
    +   10034 * Math.sin(3*Mpr)
    +    8548 * Math.sin(4*Dr - 2*Mpr)
    -    7888 * E * Math.sin(2*Dr + Mr - Mpr)
    -    6766 * E * Math.sin(2*Dr + Mr)
    -    5163 * Math.sin(Dr - Mpr)
    +    4987 * E * Math.sin(Dr + Mr)
    +    4036 * E * Math.sin(2*Dr - Mr + Mpr)
    +    3994 * Math.sin(2*Dr + 2*Mpr)
    +    3861 * Math.sin(4*Dr)
    +    3665 * Math.sin(2*Dr - 3*Mpr)
    -    2689 * E * Math.sin(Mr - 2*Mpr)
    -    2602 * Math.sin(2*Dr - Mpr + 2*Fr)
    +    2390 * E2 * Math.sin(2*Dr - 2*Mr - Mpr)
    -    2348 * Math.sin(Dr + Mpr)
    +    2236 * E2 * Math.sin(2*Dr - 2*Mr)
    -    2120 * E * Math.sin(2*Mr + Mpr)
    -    2069 * E2 * Math.sin(2*Mr)
    +    2048 * E2 * Math.sin(2*Dr - 2*Mr + Mpr)
    -    1773 * Math.sin(2*Dr + Mpr - 2*Fr)
    -    1595 * Math.sin(2*Dr + 2*Fr)
    +    1215 * E * Math.sin(4*Dr - Mr - Mpr)
    -    1110 * Math.sin(2*Mpr + 2*Fr)
    -     892 * Math.sin(3*Dr - Mpr)
    -     810 * E * Math.sin(2*Dr + Mr + Mpr)
    +     759 * E * Math.sin(4*Dr - Mr - 2*Mpr)
    -     713 * E2 * Math.sin(2*Mr - Mpr)
    -     700 * E * Math.sin(2*Dr + 2*Mr - Mpr)
    +     691 * E * Math.sin(2*Dr + Mr - 2*Mpr)
    +     596 * E * Math.sin(2*Dr - Mr - 2*Fr)
    +     549 * Math.sin(4*Dr + Mpr)
    +     537 * Math.sin(4*Mpr)
    +     520 * E * Math.sin(4*Dr - Mr)
    -     487 * Math.sin(Dr - 2*Mpr)
    -     399 * E * Math.sin(2*Dr + Mr - 2*Fr)
    -     381 * Math.sin(2*Mpr - 2*Fr)
    +     351 * E * Math.sin(Dr + Mr + Mpr)
    -     340 * Math.sin(3*Dr - 2*Mpr)
    +     330 * Math.sin(4*Dr - 3*Mpr)
    +     327 * E * Math.sin(2*Dr - Mr + 2*Mpr)
    -     323 * E2 * Math.sin(2*Mr + Mpr)
    +     299 * E * Math.sin(Dr + Mr - Mpr)
    +     294 * Math.sin(2*Dr + 3*Mpr)

  // Nutation in longitude (simplified, arcseconds)
  const omega = rad(125.04452 - 1934.136261 * T)
  const dPsi  = -17.20 * Math.sin(omega)
              - 1.32 * Math.sin(2 * rad(Lp))
              - 0.23 * Math.sin(2 * rad(Mp))
              + 0.21 * Math.sin(2 * omega)

  // Assemble: Lp (degrees) + periodic terms (degrees) + nutation (arcsec→deg)
  const moonLon = Lp + dL / 1000000 + dPsi / 3600

  return normalizeDeg(moonLon)
}

// ─── Rahu (True node is better; using mean node + correction) ────────────────

export function getRahuLongitude(jd: number): number {
  const T = (jd - JD_J2000) / 36525
  // Mean ascending node (Meeus Eq.47.7)
  const omega = normalizeDeg(
    125.04452
    - 1934.136261 * T
    + 0.0020708 * T * T
    + T ** 3 / 450000,
  )
  // Small correction toward true node
  const D  = rad(normalizeDeg(297.8502 + 445267.1115 * T))
  const M  = rad(normalizeDeg(357.5291 + 35999.0503 * T))
  const Mp = rad(normalizeDeg(134.9634 + 477198.8676 * T))
  const F  = rad(normalizeDeg(93.2721 + 483202.0175 * T))
  const corr =
    -1.4979 * Math.sin(2 * (D - F))
    - 0.1500 * Math.sin(M)
    - 0.1226 * Math.sin(2 * D)
    + 0.1176 * Math.sin(2 * F)
    - 0.0801 * Math.sin(2 * (Mp - F))
  return normalizeDeg(omega + corr)
}

// ─── Ascendant (Lagna) ────────────────────────────────────────────────────────
// Uses GMST → Local Sidereal Time → obliquity → ascendant formula

export function getAscendant(jd: number, latitude: number, longitude: number): number {
  const T = (jd - JD_J2000) / 36525

  // Greenwich Mean Sidereal Time (degrees)
  const GMST = normalizeDeg(
    280.46061837
    + 360.98564736629 * (jd - JD_J2000)
    + 0.000387933 * T * T
    - T ** 3 / 38710000,
  )
  const LST = normalizeDeg(GMST + longitude)   // Local Sidereal Time in degrees
  const RAMC = LST                              // RA of Midheaven (in degrees)

  // True obliquity of ecliptic
  const eps0 = 23.439291111 - 0.013004167 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T
  // Nutation correction to obliquity
  const omega = rad(125.04452 - 1934.136261 * T)
  const deps  = 0.00256 * Math.cos(omega)
  const eps   = rad(eps0 + deps)

  const ramc_r  = rad(RAMC)
  const lat_r   = rad(latitude)

  // Ascendant = ecliptic point rising on the eastern horizon
  const y = -Math.cos(ramc_r)
  const x = Math.sin(eps) * Math.tan(lat_r) + Math.cos(eps) * Math.sin(ramc_r)
  return normalizeDeg(deg(Math.atan2(y, x)))
}

// ─── Main chart calculation ───────────────────────────────────────────────────

export function calculateChart(
  birthDate: string,
  birthTime: string,
  lat: number,
  lon: number,
  tzOffset: number,
): ChartResult {
  const dateArr = birthDate.split('-').map(Number)
  const year = dateArr[0] ?? 0
  const month = dateArr[1] ?? 1
  const day = dateArr[2] ?? 1
  const parts = birthTime.split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  const s = parts[2] ?? 0
  const jd                   = toJulianDay(year, month, day, h, m, s, tzOffset)
  const ayanamsha            = getLahiriAyanamsha(jd)

  // Tropical geocentric longitudes
  const tropicalMap: Partial<Record<PlanetName, number>> = {
    Sun:     getSunLongitude(jd),
    Moon:    getMoonLongitude(jd),
    Mars:    getGeocentricLon('Mars', jd),
    Mercury: getGeocentricLon('Mercury', jd),
    Jupiter: getGeocentricLon('Jupiter', jd),
    Venus:   getGeocentricLon('Venus', jd),
    Saturn:  getGeocentricLon('Saturn', jd),
    Rahu:    getRahuLongitude(jd),
  }

  // Convert tropical → sidereal (subtract Lahiri ayanamsha)
  const positions = {} as Record<PlanetName, PlanetPosition>

  for (const [pl, lonT] of Object.entries(tropicalMap) as [PlanetName, number][]) {
    const sid  = normalizeDeg(lonT - ayanamsha)
    const sign = getSign(sid)
    // Retrograde: Sun, Moon, Rahu have no retrograde motion in Vedic astrology
    const retro =
      pl !== 'Sun' && pl !== 'Moon' && pl !== 'Rahu'
        ? isRetrograde(pl, jd)
        : false
    positions[pl] = {
      longitude:  sid,
      sign,
      signName:   SIGNS[sign] ?? '',
      degInSign:  parseFloat(getDegInSign(sid).toFixed(2)),
      nakshatra:  getNakshatra(sid),
      retrograde: retro,
    }
  }

  // Ketu = opposite Rahu, always retrograde by definition
  const ketuSid  = normalizeDeg(positions.Rahu.longitude + 180)
  const ketuSign = getSign(ketuSid)
  positions.Ketu = {
    longitude:  ketuSid,
    sign:       ketuSign,
    signName:   SIGNS[ketuSign] ?? '',
    degInSign:  parseFloat(getDegInSign(ketuSid).toFixed(2)),
    nakshatra:  getNakshatra(ketuSid),
    retrograde: true,
  }

  // Ascendant (Lagna)
  const ascTrop    = getAscendant(jd, lat, lon)
  const ascSid     = normalizeDeg(ascTrop - ayanamsha)
  const lagnaSign  = getSign(ascSid)
  const ascendant: PlanetPosition = {
    longitude:  ascSid,
    sign:       lagnaSign,
    signName:   SIGNS[lagnaSign] ?? '',
    degInSign:  parseFloat(getDegInSign(ascSid).toFixed(2)),
    nakshatra:  getNakshatra(ascSid),
    retrograde: false,
  }

  // Whole-sign houses from Lagna
  const houses = Array.from({ length: 12 }, (_, i) => (lagnaSign + i) % 12)

  // Place planets in houses
  const planetsByHouse: PlanetInHouse[][] = Array.from({ length: 12 }, () => [])
  for (const [pl, data] of Object.entries(positions) as [PlanetName, PlanetPosition][]) {
    if (!data) continue
    const hIdx = (data.sign - lagnaSign + 12) % 12
    if (planetsByHouse[hIdx]) {
      planetsByHouse[hIdx].push({ name: pl, ...data })
    }
  }

  // ── Vimshottari Dasha ──────────────────────────────────────────────────────
  const DASHA_ORDER: PlanetName[] = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']
  const DASHA_YEARS: Record<PlanetName, number> = {
    Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17,
  }

  const moonNakIdx       = positions.Moon.nakshatra.index
  const startDashaIdx    = moonNakIdx % 9
  const birthLord        = DASHA_ORDER[startDashaIdx] as PlanetName

  // Fraction of nakshatra traversed at birth → fraction of dasha already elapsed
  const NAK_SIZE         = 360 / 27
  const moonDegInNak     = normalizeDeg(positions.Moon.longitude) % NAK_SIZE
  const fracElapsed      = moonDegInNak / NAK_SIZE
  const daysElapsed      = fracElapsed * DASHA_YEARS[birthLord] * 365.25

  // Cursor = start of birth lord's dasha
  const birthJD          = jd
  let cursorJD           = birthJD - daysElapsed

  const dashas: Dasha[] = DASHA_ORDER.map((_, i) => {
    const idx    = (startDashaIdx + i) % 9
    const planet = DASHA_ORDER[idx] as PlanetName
    const years  = DASHA_YEARS[planet]
    const durDays = years * 365.25

    const startJD = cursorJD
    const endJD   = cursorJD + durDays

    const dasha: Dasha = {
      planet,
      years,
      start: jdToDateStr(startJD),
      end:   jdToDateStr(endJD),
      isActive: birthJD >= startJD && birthJD < endJD,
    }
    cursorJD = endJD
    return dasha
  })

  return {
    jd,
    ayanamsha: parseFloat(ayanamsha.toFixed(4)),
    ascendant,
    lagnaSign,
    positions,
    houses,
    planetsByHouse,
    dashas,
    moonNakshatra: positions.Moon.nakshatra,
  }
}

/** Convert Julian Day to readable date string */
function jdToDateStr(jd: number): string {
  // JD to Gregorian
  const jdInt = Math.floor(jd + 0.5)
  const A = jdInt >= 2299161 ? Math.floor((jdInt - 1867216.25) / 36524.25) : 0
  const B = jdInt >= 2299161 ? jdInt + 1 + A - Math.floor(A / 4) : jdInt
  const C = B + 1524
  const D = Math.floor((C - 122.1) / 365.25)
  const E = Math.floor(365.25 * D)
  const G = Math.floor((C - E) / 30.6001)
  const day   = C - E - Math.floor(30.6001 * G)
  const month = G < 14 ? G - 1 : G - 13
  const year  = month > 2 ? D - 4716 : D - 4715
  const date  = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
}

// ─── Planetary dignity ────────────────────────────────────────────────────────

interface DignityRecord { exalted: number; debilitated: number; own: number[] }

export function getPlanetDignity(planet: PlanetName, signIndex: number): string {
  const D: Record<PlanetName, DignityRecord> = {
    Sun:     { exalted: 0,  debilitated: 6,  own: [4]    },
    Moon:    { exalted: 1,  debilitated: 7,  own: [3]    },
    Mars:    { exalted: 9,  debilitated: 3,  own: [0, 7] },
    Mercury: { exalted: 5,  debilitated: 11, own: [2, 5] },
    Jupiter: { exalted: 3,  debilitated: 9,  own: [8,11] },
    Venus:   { exalted: 11, debilitated: 5,  own: [1, 6] },
    Saturn:  { exalted: 6,  debilitated: 0,  own: [9,10] },
    Rahu:    { exalted: 1,  debilitated: 7,  own: []     },
    Ketu:    { exalted: 7,  debilitated: 1,  own: []     },
  }
  const d = D[planet]
  if (d.exalted     === signIndex) return 'Exalted'
  if (d.debilitated === signIndex) return 'Debilitated'
  if (d.own.includes(signIndex))   return 'Own Sign'
  return ''
}