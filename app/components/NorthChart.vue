<template>
  <div class="flex flex-col items-center w-full">
    <h3 class="font-cinzel text-gold-400 text-lg mb-4 tracking-widest uppercase">
      North Indian Birth Chart
    </h3>

    <svg :width="S" :height="S" :viewBox="`0 0 ${S} ${S}`" class="drop-shadow-2xl w-full max-w-[480px]">
      <!-- Background -->
      <rect :width="S" :height="S" fill="#07071a" stroke="#e8b400" stroke-width="1.5" rx="3"/>

      <!-- Grid lines -->
      <line :x1="0"  :y1="0"  :x2="S"  :y2="S"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="S"  :y1="0"  :x2="0"  :y2="S"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="H"  :y1="0"  :x2="S"  :y2="H"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="S"  :y1="H"  :x2="H"  :y2="S"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="H"  :y1="S"  :x2="0"  :y2="H"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>
      <line :x1="0"  :y1="H"  :x2="H"  :y2="0"  stroke="#e8b400" stroke-width="0.8" stroke-opacity="0.5"/>

      <!-- Cells -->
      <g v-for="cell in renderedCells" :key="cell.cellIdx">
        <polygon :points="cell.pts" :fill="cell.isLagna ? 'rgba(232,180,0,0.10)' : 'transparent'" stroke="none"/>

        <!-- Rashi name -->
        <text :x="cell.tx" :y="cell.ty" text-anchor="middle" dominant-baseline="middle"
          :fill="cell.isLagna ? '#f5c842' : '#7070a8'"
          :font-size="RS" font-family="EB Garamond, serif" font-weight="600">{{ cell.rashiName }}</text>

        <!-- Lagna label -->
        <text v-if="cell.isLagna" :x="cell.tx" :y="cell.ty + LH * 0.85"
          text-anchor="middle" dominant-baseline="middle"
          fill="#e8b400" :font-size="LS" font-family="Cinzel, serif" letter-spacing="1">Lagna</text>

        <!-- Planets -->
        <text v-for="(pl, pi) in cell.planets" :key="pl.name"
          :x="cell.tx" :y="cell.ty + LH * (cell.isLagna ? 1.8 + pi : 0.9 + pi)"
          text-anchor="middle" dominant-baseline="middle"
          :fill="pl.color" :font-size="PS" font-family="sans-serif" font-weight="700">
          {{ pl.symbol }}<tspan :font-size="PS * 0.85" font-family="EB Garamond,serif"> {{ pl.abbr }}</tspan><tspan v-if="pl.retro" fill="#f87171" :font-size="PS * 0.7">ᴿ</tspan>
        </text>
      </g>

      <!-- Lagna triangle marker -->
      <polygon :points="`${H},${lagY1} ${H - lagW},${lagY2} ${H + lagW},${lagY2}`" fill="#e8b400" fill-opacity="0.85"/>
    </svg>

    <!-- Legend -->
    <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 justify-center max-w-md">
      <div v-for="pl in legendPlanets" :key="pl.name" class="flex items-center gap-1 font-garamond text-xs">
        <span :style="{ color: pl.color }">{{ pl.symbol }}</span>
        <span class="text-gray-500">{{ pl.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SIGNS, PLANET_SYMBOLS, PLANET_COLORS, type ChartResult, type EnrichedPlanetPosition, type PlanetName } from '~/utils/astrology'

const props = defineProps<{
  chart: ChartResult
  enrichedPositions: Record<PlanetName, EnrichedPlanetPosition>
  size?: number
}>()

const S  = computed(() => props.size ?? 440)
const H  = computed(() => S.value / 2)
const Q  = computed(() => S.value / 4)
const LH = computed(() => Math.max(11, Math.round(S.value * 0.037)))
const RS = computed(() => Math.max(8,  Math.round(S.value * 0.030)))
const LS = computed(() => Math.max(7,  Math.round(S.value * 0.024)))
const PS = computed(() => Math.max(8,  Math.round(S.value * 0.028)))
const lagY1 = computed(() => Q.value * 0.12)
const lagY2 = computed(() => Q.value * 0.26)
const lagW  = computed(() => Q.value * 0.15)

type Pt = [number, number]
function pStr(...pts: Pt[]): string { return pts.map(([x,y]) => `${x},${y}`).join(' ') }
function cen(...pts: Pt[]): Pt {
  const n = pts.length
  return [pts.reduce((s,p) => s+p[0], 0)/n, pts.reduce((s,p) => s+p[1], 0)/n]
}
function cornerBias(corner: Pt, others: Pt[], w = 0.52): Pt {
  const [icx,icy] = cen(...others)
  return [corner[0]*w + icx*(1-w), corner[1]*w + icy*(1-w)]
}

// CELL → HOUSE mapping (anticlockwise from top)
// Cell 0 = top (Lagna=house 0)
// Cell 11 = top-left tri closest to top = house 1 (2nd house)
// etc.
const CELL_TO_HOUSE = [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

interface CellDef { cellIdx: number; pts: string; tx: number; ty: number }

const cellDefs = computed<CellDef[]>(() => {
  const s=S.value, h=H.value, q=Q.value, q3=3*q
  const TL: Pt=[0,0], T: Pt=[h,0], TR: Pt=[s,0]
  const L: Pt=[0,h],               R: Pt=[s,h]
  const BL: Pt=[0,s], B: Pt=[h,s], BR: Pt=[s,s]
  const P1: Pt=[q,q], P2: Pt=[q3,q], P3: Pt=[q3,q3], P4: Pt=[q,q3]

  const defs = [
    (() => { const [cx,cy]=cen(T,P2,P1); return { pts:pStr(T,P2,cen(T,P2,B,P1) as Pt,P1), tx:h, ty:q*0.65 } })(),
    (() => { const [bx,by]=cornerBias(TR,[T,P2],0.50); return { pts:pStr(T,TR,P2), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { const [bx,by]=cornerBias(TR,[P2,R],0.50);  return { pts:pStr(P2,TR,R), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { const [cx,cy]=cen(R,P3,P2); return { pts:pStr(R,P3,cen(R,P3,L,P2) as Pt,P2), tx:q3+q*0.35, ty:h } })(),
    (() => { const [bx,by]=cornerBias(BR,[R,P3],0.50); return { pts:pStr(R,BR,P3), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { const [bx,by]=cornerBias(BR,[P3,B],0.50); return { pts:pStr(P3,BR,B), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { return { pts:pStr(B,P4,cen(B,P4,T,P3) as Pt,P3), tx:h, ty:q3+q*0.35 } })(),
    (() => { const [bx,by]=cornerBias(BL,[B,P4],0.50); return { pts:pStr(B,BL,P4), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { const [bx,by]=cornerBias(BL,[P4,L],0.50); return { pts:pStr(P4,BL,L), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { return { pts:pStr(L,P1,cen(L,P1,R,P4) as Pt,P4), tx:q-q*0.35, ty:h } })(),
    (() => { const [bx,by]=cornerBias(TL,[L,P1],0.50); return { pts:pStr(L,TL,P1), tx:bx, ty:by-LH.value*0.5 } })(),
    (() => { const [bx,by]=cornerBias(TL,[P1,T],0.50); return { pts:pStr(P1,TL,T), tx:bx, ty:by-LH.value*0.5 } })(),
  ]
  return defs.map((d,i) => ({ ...d, cellIdx:i }))
})

// Rashi abbreviations
const RASHI_ABB = ['Ari','Tau','Gem','Can','Leo','Vir','Lib','Sco','Sag','Cap','Aqu','Pis']

interface PlanetEntry { name: PlanetName; symbol: string; abbr: string; color: string; retro: boolean }
interface RenderedCell extends CellDef { isLagna: boolean; rashiName: string; planets: PlanetEntry[] }

const renderedCells = computed<RenderedCell[]>(() => {
  if (!props.chart) return []
  const lagnaSign = props.chart.lagnaSign

  return cellDefs.value.map(cell => {
    const houseIdx = CELL_TO_HOUSE[cell.cellIdx] ?? 0
    // FIX: signIdx = lagna sign + house index (mod 12)
    // This is correct — house 0 = lagnaSign, house 1 = lagnaSign+1, etc.
    const signIdx  = (lagnaSign + houseIdx) % 12
    const isLagna  = houseIdx === 0

    // Planets from planetsByHouse (already correctly placed by calculateChart)
    const planets: PlanetEntry[] = (props.chart.planetsByHouse[houseIdx] ?? []).map(p => ({
      name:   p.name,
      symbol: PLANET_SYMBOLS[p.name],
      abbr:   p.name.slice(0, 2),
      color:  PLANET_COLORS[p.name],
      retro:  p.retrograde,
    }))

    return { ...cell, isLagna, rashiName: RASHI_ABB[signIdx] ?? '', planets }
  })
})

const legendPlanets = computed(() =>
  (Object.keys(PLANET_SYMBOLS) as PlanetName[]).map(name => ({
    name, symbol: PLANET_SYMBOLS[name], color: PLANET_COLORS[name],
  }))
)
</script>