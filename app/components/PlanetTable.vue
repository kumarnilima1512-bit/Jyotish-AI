<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6">
    <h3 class="font-cinzel text-gold-400 text-base tracking-[0.2em] uppercase mb-4">
      Planetary Positions
      <span class="text-gray-600 text-xs font-garamond normal-case tracking-normal ml-1">
        Sidereal · Lahiri · Ayanamsha {{ chart.ayanamsha }}°
      </span>
    </h3>

    <div class="overflow-x-auto">
      <table class="w-full text-sm font-garamond border-collapse">
        <thead>
          <tr class="border-b border-gold-500/20">
            <th class="text-left text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3 pr-3 whitespace-nowrap">Graha</th>
            <th class="text-center text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3 pr-3">Bhava</th>
            <th class="text-left text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3 pr-3">Rashi</th>
            <th class="text-left text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3 pr-3">Deg</th>
            <th class="text-left text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3 pr-3">Nakshatra</th>
            <th class="text-left text-gold-500/60 font-cinzel text-xs tracking-widest uppercase pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in planetRows"
            :key="row.name"
            class="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
          >
            <!-- Planet name + symbol -->
            <td class="py-2.5 pr-3 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span :style="{ color: row.color }" class="text-lg leading-none">{{ row.symbol }}</span>
                <span class="text-gray-200 font-medium">{{ row.name }}</span>
                <span v-if="row.retrograde" class="text-crimson-400 text-xs font-cinzel">(R)</span>
              </div>
            </td>

            <!-- House number -->
            <td class="py-2.5 pr-3 text-center">
              <span class="text-gold-400/80 font-cinzel font-semibold text-sm">{{ row.house }}</span>
            </td>

            <!-- Rashi (sign) -->
            <td class="py-2.5 pr-3 whitespace-nowrap">
              <div>
                <span class="text-gray-300">{{ row.signName }}</span>
                <span class="text-gray-600 text-xs ml-1">{{ row.rashiHindi }}</span>
              </div>
            </td>

            <!-- Degree in sign -->
            <td class="py-2.5 pr-3 tabular-nums text-gray-400 whitespace-nowrap">
              {{ row.degInSign.toFixed(2) }}°
            </td>

            <!-- Nakshatra + Pada -->
            <td class="py-2.5 pr-3 whitespace-nowrap">
              <span class="text-gray-400">{{ row.nakshatra }}</span>
              <span class="text-gray-600 text-xs ml-1">P{{ row.pada }}</span>
            </td>

            <!-- Dignity badge -->
            <td class="py-2.5">
              <span
                v-if="row.dignity"
                :class="dignityClass(row.dignity)"
                class="text-xs px-2 py-0.5 rounded-full border whitespace-nowrap"
              >{{ row.dignity }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Lagna + footer -->
    <div class="mt-4 pt-4 border-t border-gold-500/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Lagna -->
      <div class="flex items-start gap-3">
        <span class="text-gold-400/70 font-cinzel text-xs tracking-widest uppercase mt-0.5">Lagna</span>
        <div class="font-garamond text-sm">
          <span class="text-gold-300 font-medium">{{ chart.ascendant.signName }}</span>
          <span class="text-gray-500 ml-2">{{ chart.ascendant.degInSign.toFixed(2) }}°</span>
          <span class="text-gray-600 text-xs ml-2">{{ chart.ascendant.nakshatra.name }} P{{ chart.ascendant.nakshatra.pada }}</span>
        </div>
      </div>

      <!-- Moon nakshatra highlight -->
      <div class="flex items-start gap-3">
        <span class="text-gold-400/70 font-cinzel text-xs tracking-widest uppercase mt-0.5">Janma Nak</span>
        <div class="font-garamond text-sm">
          <span class="text-gray-300">{{ chart.moonNakshatra.name }}</span>
          <span class="text-gray-500 ml-2">Pada {{ chart.moonNakshatra.pada }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SIGNS_HINDI,
  type ChartResult,
  type EnrichedPlanetPosition,
  type PlanetName,
} from '~/utils/astrology'

const props = defineProps<{
  enrichedPositions: Record<PlanetName, EnrichedPlanetPosition>
  chart: ChartResult
}>()

// PLANET_ORDER for consistent display
const PLANET_ORDER: PlanetName[] = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']

interface PlanetRow {
  name: PlanetName
  symbol: string
  color: string
  retrograde: boolean
  house: number
  signName: string
  rashiHindi: string
  degInSign: number
  nakshatra: string
  pada: number
  dignity: string
}

const planetRows = computed<PlanetRow[]>(() => {
  return PLANET_ORDER.map(name => {
    const d = props.enrichedPositions[name]
    if (!d) return null
    // House = which bhava (1-based) the planet sits in
    const houseIdx = (d.sign - props.chart.lagnaSign + 12) % 12
    return {
      name,
      symbol:     d.symbol,
      color:      d.color,
      retrograde: d.retrograde,
      house:      houseIdx + 1,
      signName:   d.signName,
      rashiHindi: SIGNS_HINDI[d.sign],
      degInSign:  d.degInSign,
      nakshatra:  d.nakshatra.name,
      pada:       d.nakshatra.pada,
      dignity:    d.dignity,
    }
  }).filter(Boolean) as PlanetRow[]
})

function dignityClass(dignity: string): string {
  if (dignity === 'Exalted')     return 'text-gold-400 border-gold-500/40 bg-gold-500/10'
  if (dignity === 'Debilitated') return 'text-crimson-400 border-crimson-500/40 bg-crimson-500/10'
  if (dignity === 'Own Sign')    return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
  return 'text-gray-500 border-gray-600/40'
}
</script>