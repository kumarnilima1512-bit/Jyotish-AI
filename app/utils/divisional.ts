// utils/divisional.ts
// Navamsa (D9) and Chalit Chart calculations

import { normalizeDeg, type PlanetName, type ChartResult } from '~/utils/astrology'

// ─── Navamsa (D9) ─────────────────────────────────────────────────────────────

export interface NavamsaResult {
  lagnaSign: number
  planetsByHouse: { name: PlanetName; retrograde?: boolean }[][]
}

function getNavamsaSign(lon: number): number {
  const n         = normalizeDeg(lon)
  const sign      = Math.floor(n / 30)
  const degInSign = n % 30
  const pada      = Math.floor(degInSign / (30 / 9))  // 0–8
  const starts: Record<number, number> = {
    0: 0, 4: 0, 8: 0,
    1: 9, 5: 9, 9: 9,
    2: 6, 6: 6, 10: 6,
    3: 3, 7: 3, 11: 3,
  }
  return ((starts[sign] ?? 0) + pada) % 12
}

export function calculateNavamsa(chart: ChartResult): NavamsaResult {
  const lagnaSign = getNavamsaSign(chart.ascendant.longitude)

  const planetsByHouse: { name: PlanetName; retrograde?: boolean }[][] =
    Array.from({ length: 12 }, () => [])

  for (const [pl, data] of Object.entries(chart.positions) as [PlanetName, typeof chart.positions[PlanetName]][]) {
    const navSign = getNavamsaSign(data.longitude)
    const isNode  = pl === 'Rahu' || pl === 'Ketu'
    const shift   = isNode ? 0 : 2
    const hIdx    = (navSign - lagnaSign + 12) % 12
    const shifted = (hIdx - shift + 12) % 12
    planetsByHouse[shifted]?.push({ name: pl, retrograde: data.retrograde })
  }

  return { lagnaSign, planetsByHouse }
}

// ─── Chalit Chart (Equal House) ───────────────────────────────────────────────

export interface ChalitResult {
  lagnaSign: number
  planetsByHouse: { name: PlanetName; retrograde?: boolean }[][]
}

export function calculateChalit(chart: ChartResult): ChalitResult {
  const ascDeg    = chart.ascendant.longitude
  const lagnaSign = chart.lagnaSign

  const cusps = Array.from({ length: 12 }, (_, i) =>
    normalizeDeg(ascDeg + i * 30)
  )

  const planetsByHouse: { name: PlanetName; retrograde?: boolean }[][] =
    Array.from({ length: 12 }, () => [])

  for (const [pl, data] of Object.entries(chart.positions) as [PlanetName, typeof chart.positions[PlanetName]][]) {
    const pLon = data.longitude
    let houseIdx = 0
    for (let i = 0; i < 12; i++) {
      const from = cusps[i] ?? 0
      const to   = normalizeDeg(from + 30)
      const inHouse = from < to
        ? pLon >= from && pLon < to
        : pLon >= from || pLon < to
      if (inHouse) { houseIdx = i; break }
    }
    planetsByHouse[houseIdx]?.push({ name: pl, retrograde: data.retrograde })
  }

  return { lagnaSign, planetsByHouse }
}