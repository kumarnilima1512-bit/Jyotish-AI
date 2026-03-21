<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6">
    <h3 class="font-cinzel text-gold-400 text-base tracking-[0.2em] uppercase mb-5">Panchang at Birth</h3>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="item in items" :key="item.label"
        class="bg-black/40 border border-gold-500/10 rounded-xl p-3 hover:border-gold-500/25 transition-colors">
        <div class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase mb-1.5">{{ item.label }}</div>
        <div class="font-garamond text-sm text-gray-200 font-medium">{{ item.value }}</div>
        <div v-if="item.sub" class="font-garamond text-xs text-gray-600 mt-0.5">{{ item.sub }}</div>
      </div>
    </div>

    <!-- Sunrise/Sunset bar -->
    <div class="mt-5 flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-gold-500/10">
      <div class="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#fbbf24" fill-opacity="0.3" stroke="#fbbf24" stroke-width="1.2"/>
          <line x1="12" y1="2" x2="12" y2="5" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="12" y1="19" x2="12" y2="22" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="2" y1="12" x2="5" y2="12" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="19" y1="12" x2="22" y2="12" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M3 18h18" stroke="#fbbf24" stroke-width="0.8" stroke-opacity="0.4"/>
          <path d="M5 15c2-4 12-4 14 0" stroke="#fbbf24" stroke-width="0.8" stroke-opacity="0.4"/>
        </svg>
        <div>
          <div class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase">Sunrise</div>
          <div class="font-garamond text-sm text-amber-300">{{ panchang.sunriseStr }}</div>
        </div>
      </div>
      <div class="flex-1 h-px bg-gradient-to-r from-amber-500/30 via-amber-400/10 to-orange-500/30" />
      <div class="flex items-center gap-2">
        <div class="text-right">
          <div class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase">Sunset</div>
          <div class="font-garamond text-sm text-orange-300">{{ panchang.sunsetStr }}</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="14" r="5" fill="#f97316" fill-opacity="0.25" stroke="#f97316" stroke-width="1.2"/>
          <path d="M3 14h18" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.5"/>
          <path d="M5 11c2-4 12-4 14 0" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.4"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PanchangResult } from '~/utils/astrology'

const props = defineProps<{ panchang: PanchangResult }>()

const items = computed(() => [
  { label: 'Tithi',      value: props.panchang.tithi,                          sub: `${props.panchang.paksha} Paksha #${props.panchang.tithiNumber}` },
  { label: 'Nakshatra',  value: props.panchang.nakshatra,                      sub: `Pada ${props.panchang.nakshatraPada}` },
  { label: 'Yog',        value: props.panchang.yog,                            sub: 'Lunar Yoga' },
  { label: 'Karan',      value: props.panchang.karan,                          sub: 'Half-Tithi' },
  { label: 'Moon Sign',  value: props.panchang.moonSign,                       sub: 'Rashi' },
  { label: 'Sun Sign',   value: props.panchang.sunSign,                        sub: 'Surya Rashi' },
  { label: 'Paksha',     value: props.panchang.paksha,                         sub: props.panchang.paksha === 'Shukla' ? 'Waxing Moon' : 'Waning Moon' },
  { label: 'Tithi No.',  value: `${props.panchang.tithiNumber} / 30`,          sub: 'Lunar Day' },
])
</script>