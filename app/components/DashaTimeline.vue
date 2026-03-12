<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6">
    <h3 class="font-cinzel text-gold-400 text-base tracking-[0.2em] uppercase mb-4">
      Vimshottari Dasha
    </h3>
    <p class="text-gray-500 font-garamond text-sm mb-4">
      Moon Nakshatra: <span class="text-gray-300">{{ moonNakshatra.name }}</span> Pada {{ moonNakshatra.pada }}
    </p>

    <div class="space-y-2">
      <div
        v-for="dasha in dashas"
        :key="dasha.planet"
        :class="[
          'rounded-xl border px-4 py-3 transition-all duration-300',
          dasha.isActive
            ? 'border-gold-500/60 bg-gold-500/10'
            : 'border-white/8 bg-white/2 hover:bg-white/4'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span
              :style="{ color: planetColors[dasha.planet] }"
              class="text-xl"
            >{{ planetSymbols[dasha.planet] }}</span>
            <div>
              <div :class="['font-cinzel text-sm', dasha.isActive ? 'text-gold-300' : 'text-gray-300']">
                {{ dasha.planet }} Dasha
                <span v-if="dasha.isActive" class="ml-2 text-xs text-gold-500 animate-pulse-slow">● Active</span>
              </div>
              <div class="text-gray-500 font-garamond text-xs mt-0.5">
                {{ dasha.start }} — {{ dasha.end }}
              </div>
            </div>
          </div>
          <span class="text-gray-500 font-garamond text-sm">{{ dasha.years }}y</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PLANET_SYMBOLS, PLANET_COLORS, type Dasha, type NakshatraInfo } from '~/utils/astrology'

defineProps<{
  dashas: Dasha[]
  moonNakshatra: NakshatraInfo
}>()

const planetSymbols = PLANET_SYMBOLS
const planetColors = PLANET_COLORS
</script>