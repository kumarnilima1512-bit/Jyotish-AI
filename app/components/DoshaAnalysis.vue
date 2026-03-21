<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6 space-y-5">
    <h3 class="font-cinzel text-gold-400 text-base tracking-[0.2em] uppercase">Dosha Analysis</h3>

    <!-- Manglik -->
    <div class="rounded-xl border p-4" :class="dosha.isManglik ? 'border-red-500/30 bg-red-950/20' : 'border-green-500/20 bg-green-950/10'">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="dosha.isManglik ? 'bg-red-500/15' : 'bg-green-500/10'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="dosha.isManglik ? '#ef4444' : '#22c55e'" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div>
          <div class="font-cinzel text-sm tracking-wider" :class="dosha.isManglik ? 'text-red-400' : 'text-green-400'">
            Manglik Dosha
            <span class="ml-2 text-xs px-2 py-0.5 rounded-full border" :class="dosha.manglikLevel === 'Full' ? 'border-red-500/40 text-red-400' : dosha.manglikLevel === 'Partial' ? 'border-amber-500/40 text-amber-400' : 'border-green-500/40 text-green-400'">
              {{ dosha.manglikLevel }}
            </span>
          </div>
        </div>
      </div>
      <p class="font-garamond text-sm text-gray-400 leading-relaxed">{{ dosha.manglikReason }}</p>
    </div>

    <!-- Sade Sati -->
    <div class="rounded-xl border p-4" :class="dosha.sadeSati.active ? 'border-amber-500/30 bg-amber-950/15' : 'border-green-500/20 bg-green-950/10'">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="dosha.sadeSati.active ? 'bg-amber-500/15' : 'bg-green-500/10'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="dosha.sadeSati.active ? '#f59e0b' : '#22c55e'" stroke-width="1.5">
            <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div>
          <div class="font-cinzel text-sm tracking-wider" :class="dosha.sadeSati.active ? 'text-amber-400' : 'text-green-400'">
            Shani Sade Sati
            <span class="ml-2 text-xs px-2 py-0.5 rounded-full border" :class="dosha.sadeSati.active ? 'border-amber-500/40 text-amber-400' : 'border-green-500/40 text-green-400'">
              {{ dosha.sadeSati.active ? 'Active' : 'Not Active' }}
            </span>
          </div>
          <div v-if="dosha.sadeSati.active" class="font-garamond text-xs text-amber-500/70 mt-0.5">{{ dosha.sadeSati.phase }}</div>
        </div>
      </div>
      <p class="font-garamond text-sm text-gray-400 leading-relaxed">{{ dosha.sadeSati.details }}</p>
    </div>

    <!-- Kaal Sarp -->
    <div class="rounded-xl border p-4" :class="dosha.kaalsarp.present ? 'border-purple-500/30 bg-purple-950/15' : 'border-green-500/20 bg-green-950/10'">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="dosha.kaalsarp.present ? 'bg-purple-500/15' : 'bg-green-500/10'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="dosha.kaalsarp.present ? '#a78bfa' : '#22c55e'" stroke-width="1.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7 12s1-4 5-4 5 4 5 4-1 4-5 4-5-4-5-4z"/>
          </svg>
        </div>
        <div>
          <div class="font-cinzel text-sm tracking-wider" :class="dosha.kaalsarp.present ? 'text-purple-400' : 'text-green-400'">
            Kaal Sarp Dosha
            <span class="ml-2 text-xs px-2 py-0.5 rounded-full border" :class="dosha.kaalsarp.present ? 'border-purple-500/40 text-purple-400' : 'border-green-500/40 text-green-400'">
              {{ dosha.kaalsarp.present ? 'Present' : 'Absent' }}
            </span>
          </div>
          <div v-if="dosha.kaalsarp.present" class="font-garamond text-xs text-purple-400/70 mt-0.5">{{ dosha.kaalsarp.type }}</div>
        </div>
      </div>
      <p class="font-garamond text-sm text-gray-400 leading-relaxed">{{ dosha.kaalsarp.details }}</p>
    </div>

    <!-- Pitru Dosha -->
    <div class="rounded-xl border p-4" :class="dosha.pitruDosha ? 'border-orange-500/30 bg-orange-950/15' : 'border-green-500/20 bg-green-950/10'">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="dosha.pitruDosha ? 'bg-orange-500/15' : 'bg-green-500/10'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="dosha.pitruDosha ? '#f97316' : '#22c55e'" stroke-width="1.5">
            <path d="M12 22V12M12 12l-4-4M12 12l4-4"/><circle cx="12" cy="5" r="3"/>
          </svg>
        </div>
        <div class="font-cinzel text-sm tracking-wider" :class="dosha.pitruDosha ? 'text-orange-400' : 'text-green-400'">
          Pitru Dosha
          <span class="ml-2 text-xs px-2 py-0.5 rounded-full border" :class="dosha.pitruDosha ? 'border-orange-500/40 text-orange-400' : 'border-green-500/40 text-green-400'">
            {{ dosha.pitruDosha ? 'Present' : 'Absent' }}
          </span>
        </div>
      </div>
      <p class="font-garamond text-sm text-gray-400 leading-relaxed">{{ dosha.pitruReason }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DoshaResult } from '~/utils/astrology'
defineProps<{ dosha: DoshaResult }>()
</script>