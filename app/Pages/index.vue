<template>
  <div class="min-h-screen bg-midnight-950 text-gray-200 relative overflow-x-hidden">

    <!-- Starfield -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        v-for="star in stars" :key="star.id"
        class="absolute rounded-full bg-white"
        :style="{
          left: star.x + '%', top: star.y + '%',
          width: star.size + 'px', height: star.size + 'px',
          opacity: star.opacity,
          animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`
        }"
      />
    </div>

    <!-- Header -->
    <!-- Header -->
<header class="relative z-10 border-b border-gold-500/15 py-6 px-6">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    
    <!-- Logo + Title একসাথে -->
    <div class="flex items-center gap-3">
      <img
        src="/images/JYOTISH-logo.png"
        alt="Jyotish Logo"
        class="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"
      />
      <div>
        <h1 class="font-cinzel text-2xl md:text-3xl text-gold-400 tracking-[0.25em] uppercase">
          ज्योतिष · Jyotish
        </h1>
        <p class="text-gray-500 font-garamond text-sm mt-0.5 tracking-widest">
          Vedic Astrology — Northern Indian Style
        </p>
      </div>
    </div>

    <!-- Right side tags -->
    <div class="hidden md:flex items-center gap-6 font-cinzel text-xs tracking-widest text-gray-500 uppercase">
      <span>Lahiri Ayanamsha</span>
      <span class="text-gold-500/30">|</span>
      <span>Whole Sign Houses</span>
      <span class="text-gold-500/30">|</span>
      <span>Vimshottari Dasha</span>
    </div>
  </div>
</header>

    <!-- Main -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- ─── Left column: Form + Feature buttons ─── -->
        <div class="lg:col-span-1 space-y-4">

          <BirthForm
            :form-data="formData"
            :loading="loading"
            :error="error"
            @generate="generateChart"
          />

          <!-- ══ Feature Navigation Buttons ══ -->
          <div class="space-y-2">

            <!-- 1. Kundli Milan -->
            <NuxtLink
              to="/kundlimilan"
              class="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border border-gold-500/12 bg-black/30 hover:border-orange-500/35 hover:bg-orange-500/5 transition-all duration-300 group"
                >
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-pink-500/6 group-hover:bg-pink-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="7.5" cy="11" r="5" stroke="#f472b6" stroke-width="1.3" fill="none" stroke-opacity="0.75"/>
                  <circle cx="14.5" cy="11" r="5" stroke="#e8b400" stroke-width="1.3" fill="none" stroke-opacity="0.75"/>
                  <path d="M11 7.2 C12.4 8.3 13.2 9.6 13.2 11 C13.2 12.4 12.4 13.7 11 14.8 C9.6 13.7 8.8 12.4 8.8 11 C8.8 9.6 9.6 8.3 11 7.2Z" fill="#e8b400" fill-opacity="0.18"/>
                  <path d="M11 2.5 L11.4 3.7 L12.6 3.7 L11.7 4.4 L12 5.6 L11 4.9 L10 5.6 L10.3 4.4 L9.4 3.7 L10.6 3.7Z" fill="#f472b6" fill-opacity="0.7"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider truncate text-gray-300 group-hover:text-pink-300 transition-colors">Kundli Milan</div>
                <div class="font-garamond text-xs text-gray-600 truncate">Compatibility · Gun Milan</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-pink-500/50 transition-colors" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>

            <!-- 2. Daily Horoscope -->
            <NuxtLink
              to="/horoscope"
              class="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border border-gold-500/12 bg-black/30 hover:border-orange-500/35 hover:bg-orange-500/5 transition-all duration-300 group"
                >
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/6 group-hover:bg-amber-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="3.5" fill="#f5c842" fill-opacity="0.25" stroke="#f5c842" stroke-width="1.4"/>
                  <circle cx="11" cy="11" r="1.6" fill="#f5c842" fill-opacity="0.9"/>
                  <line x1="11" y1="2.5" x2="11" y2="4.8" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="11" y1="17.2" x2="11" y2="19.5" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="2.5" y1="11" x2="4.8" y2="11" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="17.2" y1="11" x2="19.5" y2="11" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="4.72" y1="4.72" x2="6.4" y2="6.4" stroke="#f5c842" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.6"/>
                  <line x1="15.6" y1="15.6" x2="17.28" y2="17.28" stroke="#f5c842" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.6"/>
                  <line x1="17.28" y1="4.72" x2="15.6" y2="6.4" stroke="#f5c842" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.6"/>
                  <line x1="6.4" y1="15.6" x2="4.72" y2="17.28" stroke="#f5c842" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.6"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider truncate text-gray-300 group-hover:text-amber-300 transition-colors">Daily Horoscope</div>
                <div class="font-garamond text-xs text-gray-600 truncate">{{ todayStr }} · Planetary transits</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-amber-500/50 transition-colors" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>

            <!-- 3. Panchang -->
           <NuxtLink
              to="/panchang"
              class="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border border-gold-500/12 bg-black/30 hover:border-orange-500/35 hover:bg-orange-500/5 transition-all duration-300 group"
                >
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500/6 group-hover:bg-orange-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M18 11.5C18 15.64 14.64 19 10.5 19C8.38 19 6.46 18.14 5.05 16.74C5.83 16.92 6.65 17.02 7.5 17.02C12.2 17.02 16 13.22 16 8.52C16 6.68 15.44 4.98 14.5 3.57C16.62 4.99 18 7.09 18 11.5Z" stroke="#fb923c" stroke-width="1.3" fill="#fb923c" fill-opacity="0.1" stroke-linecap="round"/>
                  <circle cx="4"  cy="5.5" r="1.1" fill="#fb923c" fill-opacity="0.85"/>
                  <circle cx="8"  cy="3"   r="1.1" fill="#fb923c" fill-opacity="0.75"/>
                  <circle cx="13" cy="2.5" r="1.1" fill="#fb923c" fill-opacity="0.65"/>
                  <circle cx="18" cy="4.5" r="1.1" fill="#fb923c" fill-opacity="0.55"/>
                  <circle cx="21" cy="9"   r="1.1" fill="#fb923c" fill-opacity="0.45"/>
                  <path d="M7.5 10 L8 8.7 L8.5 10 L9.8 10 L8.8 10.8 L9.2 12.1 L8 11.2 L6.8 12.1 L7.2 10.8 L6.2 10Z" fill="#fb923c" fill-opacity="0.7"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider truncate text-gray-300 group-hover:text-orange-300 transition-colors">Panchang</div>
                <div class="font-garamond text-xs text-gray-600 truncate">Tithi · Nakshatra · Yoga · Karana</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-orange-500/50 transition-colors" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>

            <!-- 4. Numerology -->
            <NuxtLink
              to="/numerology"
              class="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border border-gold-500/12 bg-black/30 hover:border-violet-500/35 hover:bg-violet-500/5 transition-all duration-300 group"
            >
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-violet-500/6 group-hover:bg-violet-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="1.5" y="1.5" width="19" height="19" rx="2" stroke="#a78bfa" stroke-width="1.2" fill="none" stroke-opacity="0.5"/>
                  <line x1="1.5" y1="8" x2="20.5" y2="8" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.25"/>
                  <line x1="1.5" y1="14" x2="20.5" y2="14" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.25"/>
                  <line x1="8" y1="1.5" x2="8" y2="20.5" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.25"/>
                  <line x1="14" y1="1.5" x2="14" y2="20.5" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.25"/>
                  <text x="4.7"  y="6.7"  text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">2</text>
                  <text x="11"   y="6.7"  text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">7</text>
                  <text x="17.3" y="6.7"  text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">6</text>
                  <text x="4.7"  y="12.7" text-anchor="middle" font-size="4.2" fill="#c4b5fd" fill-opacity="0.85" font-family="Georgia, serif">9</text>
                  <text x="11"   y="12.7" text-anchor="middle" font-size="5.2" fill="#e8b400" fill-opacity="1"    font-family="Georgia, serif" font-weight="bold">5</text>
                  <text x="17.3" y="12.7" text-anchor="middle" font-size="4.2" fill="#c4b5fd" fill-opacity="0.85" font-family="Georgia, serif">1</text>
                  <text x="4.7"  y="18.7" text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">4</text>
                  <text x="11"   y="18.7" text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">3</text>
                  <text x="17.3" y="18.7" text-anchor="middle" font-size="4.2" fill="#a78bfa" fill-opacity="0.85" font-family="Georgia, serif">8</text>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider truncate text-gray-300 group-hover:text-violet-300 transition-colors">Numerology</div>
                <div class="font-garamond text-xs text-gray-600 truncate">Life Path · Destiny · Soul Urge</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-violet-500/50 transition-colors" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>

            <!-- 5. Tarot -->
            <NuxtLink
              to="/tarot"
              class="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border border-gold-500/12 bg-black/30 hover:border-rose-500/35 hover:bg-rose-500/5 transition-all duration-300 group"
            >
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-rose-500/6 group-hover:bg-rose-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <g transform="rotate(-16 11 15)">
                    <rect x="5" y="4" width="7" height="11" rx="1" stroke="#f43f5e" stroke-width="1.1" fill="#150610" stroke-opacity="0.55"/>
                    <path d="M8.5 7.5 L8.9 6.4 L9.3 7.5 L10.4 7.5 L9.5 8.2 L9.8 9.3 L8.5 8.6 L7.7 9.3 L8 8.2 L7.1 7.5Z" fill="#f43f5e" fill-opacity="0.45"/>
                  </g>
                  <g transform="rotate(16 11 15)">
                    <rect x="10" y="4" width="7" height="11" rx="1" stroke="#f43f5e" stroke-width="1.1" fill="#150610" stroke-opacity="0.55"/>
                    <circle cx="13.5" cy="9.5" r="1.6" stroke="#f43f5e" stroke-width="0.8" fill="none" stroke-opacity="0.45"/>
                  </g>
                  <rect x="7.5" y="2.5" width="7" height="11" rx="1.2" fill="#1e0912" stroke="#f43f5e" stroke-width="1.4"/>
                  <line x1="8.8" y1="4.3" x2="13.2" y2="4.3" stroke="#f43f5e" stroke-width="0.7" stroke-opacity="0.5"/>
                  <line x1="8.8" y1="11.7" x2="13.2" y2="11.7" stroke="#f43f5e" stroke-width="0.7" stroke-opacity="0.5"/>
                  <path d="M11 5.8 L11.45 7.1 L12.8 7.1 L11.7 7.9 L12.1 9.2 L11 8.4 L9.9 9.2 L10.3 7.9 L9.2 7.1 L10.55 7.1Z" fill="#f43f5e" fill-opacity="0.9"/>
                  <circle cx="3" cy="5" r="0.7" fill="#f43f5e" fill-opacity="0.5"/>
                  <circle cx="19" cy="5" r="0.7" fill="#f43f5e" fill-opacity="0.5"/>
                  <text x="11" y="14.8" text-anchor="middle" font-size="3.5" fill="#f43f5e" fill-opacity="0.6" font-family="serif">I</text>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider truncate text-gray-300 group-hover:text-rose-300 transition-colors">Tarot Reading</div>
                <div class="font-garamond text-xs text-gray-600 truncate">Major Arcana · Daily card draw</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-rose-500/50 transition-colors" viewBox="0 0 10 10" fill="none">
                <path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </NuxtLink>

          </div>
          <!-- end feature buttons -->
        </div>

        <!-- ─── Right column: Chart results ─── -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Loading -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-24">
            <div class="text-6xl text-gold-400 animate-spin mb-4">☉</div>
            <p class="font-cinzel text-gold-400/70 tracking-widest text-sm uppercase">Reading the Heavens...</p>
          </div>

          <!-- Chart results -->
          <template v-else-if="chart">

            <!-- Native banner -->
            <div v-if="formData.name" class="text-center py-3 px-6 bg-gold-500/5 border border-gold-500/20 rounded-xl">
              <h2 class="font-cinzel text-gold-300 text-xl tracking-[0.2em]">{{ formData.name }}</h2>
              <p class="text-gray-500 font-garamond text-sm mt-1">
                {{ formData.birthDate }} · {{ formData.birthTime }} · {{ formData.locationName || 'Custom Location' }}
              </p>
            </div>

            <!-- Chart + Dasha -->
            <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
              <div class="xl:col-span-3 bg-midnight-900 border border-gold-500/20 rounded-2xl p-6 flex flex-col items-center">
                <NorthChart :chart="chart" :enriched-positions="enrichedPositions" :size="chartSize"/>
              </div>
              <div class="xl:col-span-2">
                <DashaTimeline :dashas="chart.dashas" :moon-nakshatra="chart.moonNakshatra"/>
              </div>
            </div>

            <!-- Planet table -->
            <PlanetTable :enriched-positions="enrichedPositions" :chart="chart"/>

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

          </template>

          <!-- Welcome -->
          <div v-else class="text-center py-24">
            <div class="text-7xl text-gold-400/15 mb-6 font-cinzel">☽ ☉ ☊</div>
            <h2 class="font-cinzel text-gold-400/40 text-2xl tracking-[0.3em] uppercase mb-4">Enter Birth Details</h2>
            <p class="font-garamond text-gray-600 max-w-sm mx-auto leading-relaxed">
              Fill in the birth date, time, and location on the left to generate the Vedic birth chart in North Indian style.
            </p>
          </div>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-gold-500/10 py-6 mt-12 text-center">
      <p class="font-cinzel text-gray-600 text-xs tracking-widest uppercase">
        Astronomical calculations are approximate · For educational purposes
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAstrology } from '~/composables/useAstrology'
import { PLANET_SYMBOLS, PLANET_COLORS, type PlanetName } from '~/utils/astrology'

const { formData, chart, loading, error, generateChart, enrichedPositions, currentDasha } = useAstrology()

// ── Responsive chart size ──────────────────────────────────────────────────────
const chartSize = ref(380)
onMounted(() => {
  const upd = () => { chartSize.value = window.innerWidth < 640 ? 300 : window.innerWidth < 1280 ? 360 : 400 }
  upd(); window.addEventListener('resize', upd)
})

// ── Starfield ──────────────────────────────────────────────────────────────────
const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.45 + 0.08,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 5
}))

// ── Summary cards ──────────────────────────────────────────────────────────────
interface SummaryCard { label: string; symbol: string; color: string; value: string | undefined; sub: string | undefined }

const summaryCards = computed<SummaryCard[]>(() => {
  if (!chart.value) return []
  const p = enrichedPositions.value
  return [
    { label: 'Lagna', symbol: '↑', color: '#e8b400', value: chart.value.ascendant.signName, sub: chart.value.ascendant.degInSign.toFixed(1) + '°' },
    { label: 'Sun',   symbol: PLANET_SYMBOLS.Sun,  color: PLANET_COLORS.Sun,  value: p.Sun?.signName,  sub: p.Sun?.nakshatra.name  },
    { label: 'Moon',  symbol: PLANET_SYMBOLS.Moon, color: PLANET_COLORS.Moon, value: p.Moon?.signName, sub: p.Moon?.nakshatra.name },
    {
      label: currentDasha.value ? 'Current Dasha' : 'Rahu',
      symbol: currentDasha.value ? PLANET_SYMBOLS[currentDasha.value.planet] : PLANET_SYMBOLS.Rahu,
      color:  currentDasha.value ? PLANET_COLORS[currentDasha.value.planet]  : PLANET_COLORS.Rahu,
      value:  currentDasha.value ? currentDasha.value.planet : p.Rahu?.signName,
      sub:    currentDasha.value ? `until ${currentDasha.value.end}` : p.Rahu?.nakshatra.name
    }
  ]
})

// Today
const todayStr = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<style>
@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 0.75; }
}
</style>