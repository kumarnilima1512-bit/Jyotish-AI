<template>
  <div class="min-h-screen bg-midnight-950 text-gray-200 relative overflow-x-hidden">

    <!-- Starfield -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="star in stars" :key="star.id" class="absolute rounded-full bg-white"
        :style="{ left: star.x+'%', top: star.y+'%', width: star.size+'px', height: star.size+'px', opacity: star.opacity, animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s` }" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-gold-500/15 py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-gold-500/20 bg-black/40 flex items-center justify-center text-gray-500 hover:text-gold-400 hover:border-gold-400/50 transition-all">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 1L4 6.5L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
            <div>
              <h1 class="font-cinzel text-lg text-gold-400 tracking-[0.22em] uppercase group-hover:text-gold-300 transition-colors">ज्योतिष · Jyotish</h1>
              <p class="font-garamond text-xs text-gray-600 tracking-widest">Vedic Birth Chart</p>
            </div>
          </NuxtLink>
        </div>
        <div class="hidden md:flex items-center gap-4 font-cinzel text-xs tracking-widest text-gray-600 uppercase">
          <span>Lahiri Ayanamsha</span>
          <span class="text-gold-500/20">|</span>
          <span>Whole Sign Houses</span>
          <span class="text-gold-500/20">|</span>
          <span>Vimshottari Dasha</span>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-4 py-8">

      <!-- No chart yet — redirect back -->
      <div v-if="!chart" class="text-center py-24">
        <p class="font-cinzel text-gold-400/40 text-xl tracking-widest mb-6">No chart data found</p>
        <NuxtLink to="/" class="px-8 py-3 rounded-xl border border-gold-500/30 font-cinzel text-sm text-gold-400 tracking-widest hover:bg-gold-500/10 transition-all">
          ← Enter Birth Details
        </NuxtLink>
      </div>

      <template v-else>

        <!-- Native banner -->
        <div class="text-center py-4 px-6 bg-gold-500/5 border border-gold-500/20 rounded-2xl mb-8">
          <h2 class="font-cinzel text-gold-300 text-2xl tracking-[0.2em]">{{ chartStore.formData?.name || 'Vedic Birth Chart' }}</h2>
          <p class="text-gray-500 font-garamond text-sm mt-1">
            {{ chartStore.formData?.birthDate }} · {{ chartStore.formData?.birthTime }} · {{ chartStore.formData?.locationName || 'Custom Location' }}
          </p>
          <p class="text-gray-700 font-garamond text-xs mt-1">Ayanamsha {{ chart.ayanamsha }}° · Lagna {{ chart.ascendant.signName }} {{ chart.ascendant.degInSign.toFixed(2) }}°</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Chart + Summary -->
          <div class="lg:col-span-2 space-y-6">

            <!-- North Chart -->
            <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6 flex flex-col items-center">
              <NorthChart :chart="chart" :enriched-positions="enrichedPositions" :size="chartSize" />
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div v-for="card in summaryCards" :key="card.label"
                class="bg-midnight-900 border border-gold-500/15 rounded-xl p-4 text-center hover:border-gold-500/30 transition-colors">
                <div class="font-cinzel text-xs text-gold-500/60 tracking-widest uppercase mb-2">{{ card.label }}</div>
                <div :style="{ color: card.color }" class="text-2xl mb-1">{{ card.symbol }}</div>
                <div class="font-garamond text-sm text-gray-300">{{ card.value }}</div>
                <div v-if="card.sub" class="font-garamond text-xs text-gray-600 mt-0.5">{{ card.sub }}</div>
              </div>
            </div>

            <!-- Planet Table -->
            <PlanetTable :enriched-positions="enrichedPositions" :chart="chart" />

          </div>

          <!-- Dasha -->
          <div class="lg:col-span-1">
            <DashaTimeline :dashas="chart.dashas" :moon-nakshatra="chart.moonNakshatra" />
          </div>

        </div>

        <!-- New Reading button -->
        <div class="text-center mt-10">
          <NuxtLink to="/" class="px-8 py-3 rounded-xl border border-gold-500/25 font-cinzel text-sm text-gold-400/60 tracking-widest uppercase hover:border-gold-400/40 hover:text-gold-300 hover:bg-gold-500/5 transition-all">
            ↺ New Chart
          </NuxtLink>
        </div>

      </template>
    </main>

    <footer class="relative z-10 border-t border-gold-500/10 py-6 mt-12 text-center">
      <p class="font-cinzel text-gray-600 text-xs tracking-widest uppercase">Astronomical calculations are approximate · For educational purposes</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChartStore } from '~/stores/chartStore'
import { PLANET_SYMBOLS, PLANET_COLORS, getPlanetDignity, type PlanetName, type EnrichedPlanetPosition } from '~/utils/astrology'

const chartStore = useChartStore()
const chart = computed(() => chartStore.chart)

const enrichedPositions = computed<Record<PlanetName, EnrichedPlanetPosition>>(() => {
  if (!chart.value) return {} as Record<PlanetName, EnrichedPlanetPosition>
  const result = {} as Record<PlanetName, EnrichedPlanetPosition>
  for (const [planet, data] of Object.entries(chart.value.positions) as [PlanetName, any][]) {
    result[planet] = {
      ...data,
      symbol: PLANET_SYMBOLS[planet],
      color: PLANET_COLORS[planet],
      dignity: getPlanetDignity(planet, data.sign)
    }
  }
  return result
})

const currentDasha = computed(() => chart.value?.dashas.find(d => d.isActive))

const summaryCards = computed(() => {
  if (!chart.value) return []
  const p = enrichedPositions.value
  return [
    { label: 'Lagna',  symbol: '↑',                    color: '#e8b400',          value: chart.value.ascendant.signName, sub: chart.value.ascendant.degInSign.toFixed(1)+'°' },
    { label: 'Sun',    symbol: PLANET_SYMBOLS.Sun,      color: PLANET_COLORS.Sun,  value: p.Sun?.signName,  sub: p.Sun?.nakshatra.name  },
    { label: 'Moon',   symbol: PLANET_SYMBOLS.Moon,     color: PLANET_COLORS.Moon, value: p.Moon?.signName, sub: p.Moon?.nakshatra.name },
    {
      label:  currentDasha.value ? 'Dasha' : 'Rahu',
      symbol: currentDasha.value ? PLANET_SYMBOLS[currentDasha.value.planet] : PLANET_SYMBOLS.Rahu,
      color:  currentDasha.value ? PLANET_COLORS[currentDasha.value.planet]  : PLANET_COLORS.Rahu,
      value:  currentDasha.value ? currentDasha.value.planet : p.Rahu?.signName,
      sub:    currentDasha.value ? `until ${currentDasha.value.end}` : p.Rahu?.nakshatra.name,
    }
  ]
})

const chartSize = ref(420)
onMounted(() => {
  const upd = () => { chartSize.value = window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 360 : 420 }
  upd(); window.addEventListener('resize', upd)
})

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random()*100, y: Math.random()*100,
  size: Math.random()*2+0.5, opacity: Math.random()*0.45+0.08,
  duration: Math.random()*4+2, delay: Math.random()*5,
}))
</script>

<style>
@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 0.75; }
}
</style>