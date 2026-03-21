<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6">
    <h3 class="font-cinzel text-gold-400 text-base tracking-[0.2em] uppercase mb-5">Avakhada Chakra</h3>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="item in items" :key="item.label"
        class="bg-black/40 border border-gold-500/10 rounded-xl p-3 hover:border-gold-500/25 transition-colors">
        <div class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase mb-1.5">{{ item.label }}</div>
        <div class="font-garamond text-sm font-medium" :style="{ color: item.color || '#e2e8f0' }">{{ item.value }}</div>
        <div v-if="item.sub" class="font-garamond text-xs text-gray-600 mt-0.5">{{ item.sub }}</div>
      </div>
    </div>

    <!-- Name alphabet highlight -->
    <div class="mt-5 p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 text-center">
      <div class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase mb-2">Suggested Name Alphabet</div>
      <div class="font-cinzel text-2xl text-gold-300 tracking-widest">{{ avakhada.nameAlphabet }}</div>
      <div class="font-garamond text-xs text-gray-600 mt-1">Based on Moon Nakshatra Pada</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AvakhadaResult } from '~/utils/astrology'

const props = defineProps<{ avakhada: AvakhadaResult }>()

const items = computed(() => [
  { label: 'Varna',             value: props.avakhada.varna,            color: '#fbbf24', sub: 'Caste quality' },
  { label: 'Vashya',            value: props.avakhada.vashya,           color: '#60a5fa', sub: 'Controllability' },
  { label: 'Yoni',              value: props.avakhada.yoni,             color: '#f472b6', sub: 'Animal symbol' },
  { label: 'Gan',               value: props.avakhada.gan,              color: '#a78bfa', sub: 'Nature' },
  { label: 'Nadi',              value: props.avakhada.nadi,             color: '#34d399', sub: 'Pulse / Flow' },
  { label: 'Sign Lord',         value: props.avakhada.signLord,         color: '#fb923c', sub: 'Rashi Swami' },
  { label: 'Nakshatra Charan',  value: `Pada ${props.avakhada.nakshatraCharan}`, color: '#e2e8f0', sub: 'Quarter' },
  { label: 'Tatva',             value: props.avakhada.tatva,            color: '#f59e0b', sub: 'Element' },
  { label: 'Paya',              value: props.avakhada.paya,             color: '#c084fc', sub: 'Metal quality' },
  { label: 'Lagna Sign',        value: props.avakhada.lagnaSign,        color: '#fbbf24', sub: 'Ascendant' },
  { label: 'Lagna Lord',        value: props.avakhada.lagnaLord,        color: '#fb923c', sub: 'Lagna Swami' },
  { label: 'Tithi',             value: props.avakhada.tithi,            color: '#60a5fa', sub: 'Lunar day' },
  { label: 'Yog',               value: props.avakhada.yog,              color: '#34d399', sub: 'Lunar yoga' },
  { label: 'Karan',             value: props.avakhada.karan,            color: '#f472b6', sub: 'Half tithi' },
  { label: 'Yunja',             value: getYunja(props.avakhada.nakshatraCharan), color: '#a78bfa', sub: 'Pada group' },
  { label: 'Name Alphabet',     value: props.avakhada.nameAlphabet,     color: '#fbbf24', sub: 'Namaakshara' },
])

function getYunja(pada: number): string {
  return pada <= 2 ? 'Purva' : 'Uttara'
}
</script>