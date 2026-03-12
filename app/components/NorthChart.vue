<template>
  <div class="flex flex-col items-center w-full">
    <h3 class="font-cinzel text-gold-400 text-lg mb-4 tracking-widest uppercase">
      North Indian Birth Chart
    </h3>

    <svg
      :width="S" :height="S"
      :viewBox="`0 0 ${S} ${S}`"
      class="drop-shadow-2xl w-full max-w-[480px]"
    >
      <!-- Background -->
      <rect :width="S" :height="S" fill="#07071a" stroke="#e8b400" stroke-width="1.5" rx="3"/>

      <!-- Grid lines: 2 full diagonals + 4 inner diamond edges -->
      <line :x1="0" :y1="0" :x2="S" :y2="S" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="S" :y1="0" :x2="0" :y2="S" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="H" :y1="0" :x2="S" :y2="H" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="S" :y1="H" :x2="H" :y2="S" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="H" :y1="S" :x2="0" :y2="H" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="0" :y1="H" :x2="H" :y2="0" stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>

      <!-- Render each cell -->
      <g v-for="cell in renderedCells" :key="cell.cellIdx">
        <!-- Lagna cell highlight -->
        <polygon
          :points="cell.pts"
          :fill="cell.isLagna ? 'rgba(232,180,0,0.10)' : 'transparent'"
          stroke="none"
        />

        <!-- Rashi name (always shown) -->
        <text
          :x="cell.tx"
          :y="cell.ty"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="cell.isLagna ? '#f5c842' : '#7070a8'"
          :font-size="RS"
          font-family="EB Garamond, serif"
          font-weight="600"
        >{{ cell.rashiName }}</text>

        <!-- Lagna label below rashi in lagna cell -->
        <text
          v-if="cell.isLagna"
          :x="cell.tx"
          :y="cell.ty + LH * 0.85"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#e8b400"
          :font-size="LS"
          font-family="Cinzel, serif"
          letter-spacing="1"
        >Lagna</text>

        <!-- Planets — stacked below rashi (or below Lagna label) -->
        <text
          v-for="(pl, pi) in cell.planets"
          :key="pl.name"
          :x="cell.tx"
          :y="cell.ty + LH * (cell.isLagna ? 1.8 + pi : 0.9 + pi)"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="pl.color"
          :font-size="PS"
          font-family="sans-serif"
          font-weight="700"
        >{{ pl.symbol }}<tspan :font-size="PS * 0.85" font-family="EB Garamond,serif"> {{ pl.abbr }}</tspan><tspan v-if="pl.retro" fill="#f87171" :font-size="PS * 0.7">ᴿ</tspan></text>
      </g>

      <!-- Lagna apex triangle marker at top tip of lagna cell -->
      <polygon
        :points="`${H},${lagY1} ${H - lagW},${lagY2} ${H + lagW},${lagY2}`"
        fill="#e8b400" fill-opacity="0.85"
      />
    </svg>

    <!-- Planet legend -->
    <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 justify-center max-w-md">
      <div v-for="pl in legendPlanets" :key="pl.name"
        class="flex items-center gap-1 font-garamond text-xs">
        <span :style="{ color: pl.color }">{{ pl.symbol }}</span>
        <span class="text-gray-500">{{ pl.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SIGNS,
  PLANET_SYMBOLS,
  PLANET_COLORS,
  type ChartResult,
  type EnrichedPlanetPosition,
  type PlanetName,
} from '~/utils/astrology'

const props = defineProps<{
  chart: ChartResult
  enrichedPositions: Record<PlanetName, EnrichedPlanetPosition>
  size?: number
}>()

// ─── Dimensions ───────────────────────────────────────────────────────────────
const S  = computed(() => props.size ?? 440)
const H  = computed(() => S.value / 2)
const Q  = computed(() => S.value / 4)

const LH = computed(() => Math.max(11, Math.round(S.value * 0.037)))  // line height
const RS = computed(() => Math.max(8,  Math.round(S.value * 0.030)))  // rashi font
const LS = computed(() => Math.max(7,  Math.round(S.value * 0.024)))  // lagna label font
const PS = computed(() => Math.max(8,  Math.round(S.value * 0.028)))  // planet font

// Lagna triangle marker at very top of H1 cell
const lagY1 = computed(() => Q.value * 0.12)
const lagY2 = computed(() => Q.value * 0.26)
const lagW  = computed(() => Q.value * 0.15)

// ─── Geometry ─────────────────────────────────────────────────────────────────
type Pt = [number, number]

function pStr(...pts: Pt[]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}

function cen(...pts: Pt[]): Pt {
  const n = pts.length
  return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n]
}

// bias outer corner toward inner centroid so text stays inside triangle
function cornerBias(corner: Pt, others: Pt[], w = 0.52): Pt {
  const [icx, icy] = cen(...others)
  return [corner[0] * w + icx * (1 - w), corner[1] * w + icy * (1 - w)]
}

/*
  NORTH INDIAN CHART — correct layout explained:
  ─────────────────────────────────────────────
  The chart is a FIXED grid of 12 cells. Their positions never change.
  What changes person-to-person is which RASHI (sign) occupies each cell.

  Cell positions (clockwise from top, traditional North Indian):
    Cell 0  = TOP      (Lagna / Ascendant sign always goes here)
    Cell 1  = top-right triangle #1
    Cell 2  = top-right triangle #2
    Cell 3  = RIGHT    (4th house sign)
    Cell 4  = bottom-right triangle #1
    Cell 5  = bottom-right triangle #2
    Cell 6  = BOTTOM   (7th house sign)
    Cell 7  = bottom-left triangle #1
    Cell 8  = bottom-left triangle #2
    Cell 9  = LEFT     (10th house sign)
    Cell 10 = top-left triangle #1
    Cell 11 = top-left triangle #2

  Signs fill anticlockwise starting from Lagna:
    Cell 0 → Lagna sign (1st house)
    Cell 11 → 2nd house sign      (anticlockwise = going left from top)
    Cell 10 → 3rd house sign
    Cell 9  → 4th house sign
    Cell 8  → 5th house sign
    Cell 7  → 6th house sign
    Cell 6  → 7th house sign
    Cell 5  → 8th house sign
    Cell 4  → 9th house sign
    Cell 3  → 10th house sign
    Cell 2  → 11th house sign
    Cell 1  → 12th house sign

  Planets are placed in whichever cell contains their sign.
*/

// Anti-clockwise mapping: cellIdx → house index (0-based)
// house[0] = lagna sign, house[1] = 2nd sign, etc.
const CELL_TO_HOUSE = [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

interface CellDef {
  cellIdx: number
  pts: string
  tx: number
  ty: number  // y of rashi text line
}

const cellDefs = computed<CellDef[]>(() => {
  const s = S.value, h = H.value, q = Q.value, q3 = 3 * q

  const TL: Pt = [0, 0],  T: Pt  = [h, 0],  TR: Pt = [s, 0]
  const L:  Pt = [0, h],                      R:  Pt = [s, h]
  const BL: Pt = [0, s],  B: Pt  = [h, s],  BR: Pt  = [s, s]
  const P1: Pt = [q,  q], P2: Pt = [q3, q]
  const P3: Pt = [q3, q3], P4: Pt = [q, q3]
  const C:  Pt = [h, h]

  // For quad cells: use centroid shifted slightly toward outer edge
  // For tri cells:  bias toward outer corner
  const defs: Array<{ pts: string; tx: number; ty: number }> = [
    // 0: top inner quad (Lagna)
    (() => { const [cx, cy] = cen(T, P2, C, P1); return { pts: pStr(T,P2,C,P1), tx: cx, ty: cy - LH.value * 0.6 } })(),
    // 1: top-right tri #1 (T,TR,P2) — 12th house sign
    (() => { const [bx,by] = cornerBias(TR,[T,P2],0.50); return { pts: pStr(T,TR,P2), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 2: top-right tri #2 (P2,TR,R) — 11th house sign
    (() => { const [bx,by] = cornerBias(TR,[P2,R],0.50); return { pts: pStr(P2,TR,R), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 3: right inner quad (R,P3,C,P2) — 10th house sign
    (() => { const [cx,cy] = cen(R,P3,C,P2); return { pts: pStr(R,P3,C,P2), tx: cx + (s-cx)*0.15, ty: cy - LH.value * 0.6 } })(),
    // 4: bottom-right tri #1 (R,BR,P3) — 9th house sign
    (() => { const [bx,by] = cornerBias(BR,[R,P3],0.50); return { pts: pStr(R,BR,P3), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 5: bottom-right tri #2 (P3,BR,B) — 8th house sign
    (() => { const [bx,by] = cornerBias(BR,[P3,B],0.50); return { pts: pStr(P3,BR,B), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 6: bottom inner quad (B,P4,C,P3) — 7th house sign
    (() => { const [cx,cy] = cen(B,P4,C,P3); return { pts: pStr(B,P4,C,P3), tx: cx, ty: cy - LH.value * 0.6 } })(),
    // 7: bottom-left tri #1 (B,BL,P4) — 6th house sign
    (() => { const [bx,by] = cornerBias(BL,[B,P4],0.50); return { pts: pStr(B,BL,P4), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 8: bottom-left tri #2 (P4,BL,L) — 5th house sign
    (() => { const [bx,by] = cornerBias(BL,[P4,L],0.50); return { pts: pStr(P4,BL,L), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 9: left inner quad (L,P1,C,P4) — 4th house sign
    (() => { const [cx,cy] = cen(L,P1,C,P4); return { pts: pStr(L,P1,C,P4), tx: cx - (cx)*0.15, ty: cy - LH.value * 0.6 } })(),
    // 10: top-left tri #1 (L,TL,P1) — 3rd house sign
    (() => { const [bx,by] = cornerBias(TL,[L,P1],0.50); return { pts: pStr(L,TL,P1), tx: bx, ty: by - LH.value * 0.5 } })(),
    // 11: top-left tri #2 (P1,TL,T) — 2nd house sign
    (() => { const [bx,by] = cornerBias(TL,[P1,T],0.50); return { pts: pStr(P1,TL,T), tx: bx, ty: by - LH.value * 0.5 } })(),
  ]

  return defs.map((d, i) => ({ ...d, cellIdx: i }))
})

// ─── Rendered cells ───────────────────────────────────────────────────────────
interface PlanetEntry {
  name: PlanetName
  symbol: string
  abbr: string
  color: string
  retro: boolean
}

interface RenderedCell extends CellDef {
  isLagna: boolean
  rashiName: string
  planets: PlanetEntry[]
}

// 3-letter rashi abbreviation
const RASHI_ABB: string[] = ['Ari','Tau','Gem','Can','Leo','Vir','Lib','Sco','Sag','Cap','Aqu','Pis']

const renderedCells = computed<RenderedCell[]>(() => {
  if (!props.chart) return []

  const lagnaSign = props.chart.lagnaSign

  return cellDefs.value.map((cell) => {
    // Which house does this cell correspond to?
    const houseIdx  = CELL_TO_HOUSE[cell.cellIdx]       // 0-based house index
    // Which sign occupies this cell?
    const signIdx   = (lagnaSign + houseIdx) % 12
    const isLagna   = houseIdx === 0

    // Planets in this house (houseIdx is also planetsByHouse index)
    const planets: PlanetEntry[] = (props.chart.planetsByHouse[houseIdx] ?? []).map(p => ({
      name:   p.name,
      symbol: PLANET_SYMBOLS[p.name],
      abbr:   p.name.slice(0, 2),
      color:  PLANET_COLORS[p.name],
      retro:  p.retrograde,
    }))

    return {
      ...cell,
      isLagna,
      rashiName: RASHI_ABB[signIdx],
      planets,
    }
  })
})

// ─── Legend ───────────────────────────────────────────────────────────────────
const legendPlanets = computed(() =>
  (Object.keys(PLANET_SYMBOLS) as PlanetName[]).map(name => ({
    name,
    symbol: PLANET_SYMBOLS[name],
    color:  PLANET_COLORS[name],
  }))
)
</script>