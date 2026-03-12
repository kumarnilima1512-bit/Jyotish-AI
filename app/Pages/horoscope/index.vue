<template>
  <div class="min-h-screen bg-[#07070f] text-gray-200 relative overflow-x-hidden">

    <!-- Starfield -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="star in stars" :key="star.id" class="absolute rounded-full bg-white" :style="starStyle(star)"/>
    </div>

    <!-- Nebula blobs -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-24 -left-36 w-[600px] h-[600px] rounded-full bg-violet-600 opacity-10 blur-[120px]"/>
      <div class="absolute -bottom-12 -right-24 w-[500px] h-[500px] rounded-full bg-pink-700 opacity-[0.08] blur-[100px]"/>
      <div class="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-sky-500 opacity-[0.06] blur-[80px]"/>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-yellow-600/10 py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
          <div>
            <h1 class="font-cinzel text-xl text-yellow-400 tracking-[0.25em] uppercase group-hover:text-yellow-300 transition-colors">ज्योतिष · Jyotish</h1>
            <p class="font-garamond text-xs text-gray-600 mt-0.5 tracking-widest">Vedic Astrology</p>
          </div>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-yellow-400/60">
          <span>☉</span><span>Daily Rashifal</span>
          <span class="text-yellow-600/20">·</span>
          <span>{{ todayStr }}</span>
        </div>
      </div>
    </header>

    <!-- Page title -->
    <div class="relative z-10 text-center pt-10 pb-8 px-4">
      <p class="font-cinzel text-xs tracking-[0.5em] uppercase mb-2 text-yellow-400/40">राशिफल</p>
      <h2 class="font-cinzel text-4xl md:text-5xl tracking-[0.15em] uppercase mb-3 text-yellow-400/90 drop-shadow-[0_0_40px_rgba(251,191,36,0.2)]">Daily Horoscope</h2>
      <p class="font-garamond text-gray-500 text-base">Choose your Rashi to reveal today's cosmic guidance</p>
    </div>

    <!-- ═══ ZODIAC GRID ═══ -->
    <main v-if="view === 'grid'" class="relative z-10 max-w-6xl mx-auto px-4 pb-20">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        <button
          v-for="sign in zodiacSigns" :key="sign.id"
          type="button"
          @click="selectSign(sign)"
          :class="['group relative flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer', sign.borderClass, sign.bgClass]"
        >
          <div :class="['relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110', sign.iconBgClass]">
            <svg viewBox="0 0 48 48" :class="['w-7 h-7 md:w-8 md:h-8', sign.svgClass]" v-html="sign.svg"/>
          </div>
          <div class="text-center">
            <div :class="['font-cinzel text-xs tracking-widest uppercase', sign.textClass]">{{ sign.name }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-0.5">{{ sign.sanskrit }}</div>
            <div class="font-garamond text-xs text-gray-700 mt-0.5">{{ sign.dates }}</div>
          </div>
          <div :class="['px-2 py-0.5 rounded-full font-cinzel text-xs tracking-wider opacity-60 group-hover:opacity-90 transition-opacity border', sign.badgeClass]">
            {{ sign.element }}
          </div>
        </button>
      </div>
    </main>

    <!-- ═══ ERROR BANNER ═══ -->
    <div v-if="apiError" class="relative z-10 max-w-2xl mx-auto px-4 mb-4">
      <div class="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300">
        <span class="text-lg shrink-0">⚠️</span>
        <div>
          <p class="font-cinzel text-xs tracking-widest uppercase mb-1">Could not load prediction</p>
          <p class="font-garamond text-sm opacity-80">{{ apiError }}</p>
        </div>
        <button @click="apiError = ''" class="ml-auto shrink-0 text-red-400 hover:text-red-200 transition-colors text-lg leading-none">✕</button>
      </div>
    </div>

    <!-- ═══ LOADING ═══ -->
    <div v-else-if="view === 'loading'" class="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="relative w-48 h-48 mb-8">
        <div class="absolute inset-0 rounded-full border border-dashed border-yellow-400/15 animate-spin [animation-duration:12s]"/>
        <div class="absolute inset-6 rounded-full border border-dashed border-yellow-400/20 animate-spin [animation-duration:8s] [animation-direction:reverse]"/>
        <div class="absolute inset-12 rounded-full border border-yellow-400/30 animate-spin [animation-duration:4s]"/>
        <div class="absolute inset-0 animate-spin [animation-duration:6s]">
          <div :class="['absolute w-2.5 h-2.5 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/2', selectedSign?.dotClass]"/>
        </div>
        <div class="absolute inset-0 animate-spin [animation-duration:10s] [animation-direction:reverse]">
          <div class="absolute w-2 h-2 rounded-full bottom-2 right-4 bg-blue-400 shadow-[0_0_6px_#60a5fa]"/>
        </div>
        <div class="absolute inset-0 animate-spin [animation-duration:15s]">
          <div class="absolute w-1.5 h-1.5 rounded-full top-4 left-2 bg-pink-400 shadow-[0_0_5px_#f472b6]"/>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div :class="['w-16 h-16 rounded-full flex items-center justify-center animate-pulse', selectedSign?.iconBgClass]">
            <svg viewBox="0 0 48 48" :class="['w-9 h-9', selectedSign?.svgClass]" v-html="selectedSign?.svg"/>
          </div>
        </div>
      </div>
      <div class="text-center">
        <p :class="['font-cinzel text-sm tracking-[0.4em] uppercase mb-2', selectedSign?.textClass]">{{ selectedSign?.name }}</p>
        <p class="font-garamond text-gray-500 text-base animate-pulse">Consulting the stars with AI…</p>
        <div class="flex items-center justify-center gap-1.5 mt-4">
          <div v-for="i in 3" :key="i" :class="['w-1.5 h-1.5 rounded-full animate-bounce', selectedSign?.dotClass]" :style="{ animationDelay: `${(i-1)*0.2}s` }"/>
        </div>
      </div>
    </div>

    <!-- ═══ PREDICTION ═══ -->
    <div v-else-if="view === 'prediction' && prediction && selectedSign" class="relative z-10 max-w-4xl mx-auto px-4 pb-20">

      <!-- Back -->
      <button type="button" @click="goBack" class="flex items-center gap-2 mb-8 font-cinzel text-xs tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors">
        <svg viewBox="0 0 16 16" fill="none" class="w-3.5 h-3.5"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        All Signs
      </button>

      <!-- Hero -->
      <div :class="['relative rounded-3xl overflow-hidden mb-8 p-8 md:p-10 border', selectedSign.borderClass, selectedSign.heroBgClass]">
        <div class="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:24px_24px]"/>
        <div class="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div :class="['shrink-0 w-24 h-24 rounded-2xl flex items-center justify-center border', selectedSign.iconBgClass, selectedSign.borderClass]">
            <svg viewBox="0 0 48 48" :class="['w-14 h-14', selectedSign.svgClass]" v-html="selectedSign.svg"/>
          </div>
          <div class="text-center md:text-left flex-1">
            <p :class="['font-cinzel text-xs tracking-[0.5em] uppercase mb-1 opacity-60', selectedSign.textClass]">{{ selectedSign.element }} · {{ selectedSign.ruling }}</p>
            <h3 :class="['font-cinzel text-4xl md:text-5xl tracking-wider mb-1', selectedSign.textClass]">{{ selectedSign.name }}</h3>
            <p class="font-garamond text-xl text-gray-400 mb-1">{{ selectedSign.sanskrit }} · {{ selectedSign.symbol }}</p>
            <p class="font-garamond text-sm text-gray-600">{{ selectedSign.dates }} · Ruled by {{ selectedSign.ruling }}</p>
          </div>
          <div class="shrink-0 text-center">
            <div :class="['font-cinzel text-5xl font-bold mb-1', selectedSign.textClass]">{{ prediction.overallRating }}</div>
            <div class="font-cinzel text-xs tracking-widest uppercase text-gray-600">Today's Score</div>
            <div class="flex gap-1 justify-center mt-2">
              <div v-for="i in 5" :key="i" :class="['w-2.5 h-2.5 rounded-full transition-all', i <= prediction.stars ? selectedSign.dotClass : selectedSign.dotFadeClass]"/>
            </div>
          </div>
        </div>
        <div :class="['mt-6 pt-6 border-t', selectedSign.divideClass]">
          <p class="font-garamond text-lg leading-relaxed text-center md:text-left text-gray-300">{{ prediction.summary }}</p>
        </div>
      </div>

      <!-- Lucky strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div v-for="lucky in prediction.luckies" :key="lucky.label" :class="['rounded-xl p-4 text-center border', selectedSign.borderClass, selectedSign.cardBgClass]">
          <div class="text-2xl mb-1">{{ lucky.emoji }}</div>
          <div class="font-cinzel text-xs tracking-widest uppercase text-gray-600 mb-1">{{ lucky.label }}</div>
          <div :class="['font-garamond text-sm font-medium', selectedSign.textClass]">
            <span v-if="lucky.hex" :style="{ color: lucky.hex }">● </span>{{ lucky.value }}
          </div>
        </div>
      </div>

      <!-- Category cards -->
      <div class="space-y-4">
        <div v-for="cat in prediction.categories" :key="cat.title" :class="['rounded-2xl border overflow-hidden transition-all duration-300', cat.borderClass, cat.bgClass]">
          <div class="flex items-center gap-4 px-6 py-4 cursor-pointer select-none" @click="cat.open = !cat.open">
            <div :class="['shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl border', cat.iconBgClass, cat.borderClass]">{{ cat.emoji }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1.5">
                <span :class="['font-cinzel text-sm tracking-wider', cat.textClass]">{{ cat.title }}</span>
                <span :class="['font-cinzel text-xs opacity-70', cat.textClass]">{{ cat.score }}/10</span>
              </div>
              <div class="h-1.5 rounded-full overflow-hidden bg-white/5">
                <div :class="['h-full rounded-full transition-all duration-700', cat.barClass]" :style="{ width: `${cat.score * 10}%` }"/>
              </div>
            </div>
            <svg viewBox="0 0 12 12" fill="none" :class="['shrink-0 w-3.5 h-3.5 transition-transform duration-300 text-gray-600', cat.open ? 'rotate-180' : '']">
              <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div v-show="cat.open" class="px-6 pb-5">
            <div :class="['pt-3 border-t', cat.divideClass]">
              <p class="font-garamond text-base leading-relaxed text-gray-300">{{ cat.text }}</p>
              <div v-if="cat.tip" :class="['mt-3 flex items-start gap-2 px-3 py-2.5 rounded-lg border', cat.tipBgClass, cat.borderClass]">
                <span class="text-sm shrink-0">💡</span>
                <p :class="['font-garamond text-sm italic opacity-80', cat.textClass]">{{ cat.tip }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Affirmation -->
      <div :class="['mt-8 text-center p-6 rounded-2xl border', selectedSign.borderClass, selectedSign.cardBgClass]">
        <p :class="['font-cinzel text-xs tracking-[0.4em] uppercase mb-3 opacity-50', selectedSign.textClass]">Today's Affirmation</p>
        <p class="font-garamond text-xl italic leading-relaxed text-gray-200">"{{ prediction.affirmation }}"</p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-yellow-600/8 py-6 mt-4 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">For entertainment &amp; reflection · Calculations based on Vedic tradition</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Today ─────────────────────────────────────────────────────────────────────
const todayStr = computed(() =>
  new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
)
const todayDOY = (() => {
  const n = new Date()
  return Math.floor((n.getTime() - new Date(n.getFullYear(), 0, 0).getTime()) / 86400000)
})()

// ── Starfield ─────────────────────────────────────────────────────────────────
interface Star { id: number; x: number; y: number; size: number; opacity: number; duration: number; delay: number }
const stars: Star[] = Array.from({ length: 100 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4, opacity: Math.random() * 0.4 + 0.06,
  duration: Math.random() * 5 + 2, delay: Math.random() * 6,
}))
const starStyle = (s: Star) => ({
  left: s.x + '%', top: s.y + '%',
  width: s.size + 'px', height: s.size + 'px',
  opacity: s.opacity,
  animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
})

// ── Sign type ─────────────────────────────────────────────────────────────────
interface ZodiacSign {
  id: string; name: string; sanskrit: string; symbol: string
  dates: string; element: string; ruling: string; svg: string
  textClass: string; bgClass: string; borderClass: string; iconBgClass: string
  svgClass: string; badgeClass: string; dotClass: string; dotFadeClass: string
  heroBgClass: string; cardBgClass: string; divideClass: string
}

// ── Signs ─────────────────────────────────────────────────────────────────────
const zodiacSigns: ZodiacSign[] = [
  {
    id:'aries', name:'Aries', sanskrit:'मेष', symbol:'♈', dates:'Mar 21 – Apr 19', element:'Fire', ruling:'Mars',
    textClass:'text-red-400', bgClass:'bg-red-950/30 hover:bg-red-900/25', borderClass:'border-red-500/20 hover:border-red-400/40',
    iconBgClass:'bg-red-500/10', svgClass:'text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]',
    badgeClass:'text-red-400 border-red-500/25 bg-red-500/10', dotClass:'bg-red-400 shadow-[0_0_6px_#f87171]',
    dotFadeClass:'bg-red-500/20', heroBgClass:'bg-gradient-to-br from-red-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-red-950/20', divideClass:'border-red-500/15',
    svg:`<g stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round"><path d="M24 36 C24 36 12 28 12 18 C12 12 17 8 24 14"/><path d="M24 36 C24 36 36 28 36 18 C36 12 31 8 24 14"/><circle cx="24" cy="14" r="3" fill="#f87171" fill-opacity="0.3"/></g>`,
  },
  {
    id:'taurus', name:'Taurus', sanskrit:'वृषभ', symbol:'♉', dates:'Apr 20 – May 20', element:'Earth', ruling:'Venus',
    textClass:'text-green-300', bgClass:'bg-green-950/30 hover:bg-green-900/25', borderClass:'border-green-500/20 hover:border-green-400/40',
    iconBgClass:'bg-green-500/10', svgClass:'text-green-300 drop-shadow-[0_0_6px_rgba(134,239,172,0.6)]',
    badgeClass:'text-green-300 border-green-500/25 bg-green-500/10', dotClass:'bg-green-300 shadow-[0_0_6px_#86efac]',
    dotFadeClass:'bg-green-500/20', heroBgClass:'bg-gradient-to-br from-green-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-green-950/20', divideClass:'border-green-500/15',
    svg:`<g stroke="#86efac" stroke-width="2" fill="none" stroke-linecap="round"><circle cx="24" cy="26" r="10" stroke-opacity="0.8"/><path d="M14 26 C14 20 16 14 24 13 C32 14 34 20 34 26"/><path d="M14 18 C11 15 10 12 13 10"/><path d="M34 18 C37 15 38 12 35 10"/></g>`,
  },
  {
    id:'gemini', name:'Gemini', sanskrit:'मिथुन', symbol:'♊', dates:'May 21 – Jun 20', element:'Air', ruling:'Mercury',
    textClass:'text-yellow-300', bgClass:'bg-yellow-950/30 hover:bg-yellow-900/25', borderClass:'border-yellow-500/20 hover:border-yellow-400/40',
    iconBgClass:'bg-yellow-500/10', svgClass:'text-yellow-300 drop-shadow-[0_0_6px_rgba(253,230,138,0.6)]',
    badgeClass:'text-yellow-300 border-yellow-500/25 bg-yellow-500/10', dotClass:'bg-yellow-300 shadow-[0_0_6px_#fde68a]',
    dotFadeClass:'bg-yellow-500/20', heroBgClass:'bg-gradient-to-br from-yellow-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-yellow-950/20', divideClass:'border-yellow-500/15',
    svg:`<g stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round"><line x1="16" y1="10" x2="16" y2="38"/><line x1="32" y1="10" x2="32" y2="38"/><path d="M12 10 C16 8 32 8 36 10"/><path d="M12 38 C16 40 32 40 36 38"/><path d="M12 24 C16 22 32 22 36 24"/></g>`,
  },
  {
    id:'cancer', name:'Cancer', sanskrit:'कर्क', symbol:'♋', dates:'Jun 21 – Jul 22', element:'Water', ruling:'Moon',
    textClass:'text-blue-300', bgClass:'bg-blue-950/30 hover:bg-blue-900/25', borderClass:'border-blue-400/20 hover:border-blue-300/40',
    iconBgClass:'bg-blue-500/10', svgClass:'text-blue-300 drop-shadow-[0_0_6px_rgba(147,197,253,0.6)]',
    badgeClass:'text-blue-300 border-blue-400/25 bg-blue-500/10', dotClass:'bg-blue-300 shadow-[0_0_6px_#93c5fd]',
    dotFadeClass:'bg-blue-500/20', heroBgClass:'bg-gradient-to-br from-blue-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-blue-950/20', divideClass:'border-blue-500/15',
    svg:`<g stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"><path d="M10 22 C10 16 15 12 24 18 C33 24 38 20 38 26 C38 32 33 36 24 30 C15 24 10 28 10 22Z"/><circle cx="14" cy="20" r="2.5" fill="#93c5fd" fill-opacity="0.4"/><circle cx="34" cy="28" r="2.5" fill="#93c5fd" fill-opacity="0.4"/></g>`,
  },
  {
    id:'leo', name:'Leo', sanskrit:'सिंह', symbol:'♌', dates:'Jul 23 – Aug 22', element:'Fire', ruling:'Sun',
    textClass:'text-amber-400', bgClass:'bg-amber-950/30 hover:bg-amber-900/25', borderClass:'border-amber-500/20 hover:border-amber-400/40',
    iconBgClass:'bg-amber-500/10', svgClass:'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]',
    badgeClass:'text-amber-400 border-amber-500/25 bg-amber-500/10', dotClass:'bg-amber-400 shadow-[0_0_6px_#fbbf24]',
    dotFadeClass:'bg-amber-500/20', heroBgClass:'bg-gradient-to-br from-amber-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-amber-950/20', divideClass:'border-amber-500/15',
    svg:`<g stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"><circle cx="20" cy="18" r="6"/><path d="M26 18 C30 18 36 22 36 30 C36 35 32 38 28 38 C22 38 20 34 20 30"/><path d="M28 38 C28 38 26 42 30 43"/><path d="M14 12 C12 8 10 8 9 10"/><path d="M16 10 C16 6 14 5 13 7"/></g>`,
  },
  {
    id:'virgo', name:'Virgo', sanskrit:'कन्या', symbol:'♍', dates:'Aug 23 – Sep 22', element:'Earth', ruling:'Mercury',
    textClass:'text-emerald-400', bgClass:'bg-emerald-950/30 hover:bg-emerald-900/25', borderClass:'border-emerald-500/20 hover:border-emerald-400/40',
    iconBgClass:'bg-emerald-500/10', svgClass:'text-emerald-400 drop-shadow-[0_0_6px_rgba(110,231,183,0.6)]',
    badgeClass:'text-emerald-400 border-emerald-500/25 bg-emerald-500/10', dotClass:'bg-emerald-400 shadow-[0_0_6px_#6ee7b7]',
    dotFadeClass:'bg-emerald-500/20', heroBgClass:'bg-gradient-to-br from-emerald-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-emerald-950/20', divideClass:'border-emerald-500/15',
    svg:`<g stroke="#6ee7b7" stroke-width="2" fill="none" stroke-linecap="round"><line x1="14" y1="10" x2="14" y2="36"/><line x1="24" y1="10" x2="24" y2="36"/><path d="M14 22 C16 26 22 28 24 24"/><path d="M24 22 C27 30 32 34 36 32 C40 30 40 26 36 24 C32 22 28 28 24 36"/></g>`,
  },
  {
    id:'libra', name:'Libra', sanskrit:'तुला', symbol:'♎', dates:'Sep 23 – Oct 22', element:'Air', ruling:'Venus',
    textClass:'text-violet-300', bgClass:'bg-violet-950/30 hover:bg-violet-900/25', borderClass:'border-violet-400/20 hover:border-violet-300/40',
    iconBgClass:'bg-violet-500/10', svgClass:'text-violet-300 drop-shadow-[0_0_6px_rgba(196,181,253,0.6)]',
    badgeClass:'text-violet-300 border-violet-400/25 bg-violet-500/10', dotClass:'bg-violet-300 shadow-[0_0_6px_#c4b5fd]',
    dotFadeClass:'bg-violet-500/20', heroBgClass:'bg-gradient-to-br from-violet-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-violet-950/20', divideClass:'border-violet-500/15',
    svg:`<g stroke="#c4b5fd" stroke-width="2" fill="none" stroke-linecap="round"><line x1="10" y1="32" x2="38" y2="32"/><line x1="24" y1="32" x2="24" y2="38"/><line x1="16" y1="38" x2="32" y2="38"/><path d="M14 26 L24 16 L34 26"/><line x1="14" y1="24" x2="14" y2="32"/><line x1="34" y1="24" x2="34" y2="32"/></g>`,
  },
  {
    id:'scorpio', name:'Scorpio', sanskrit:'वृश्चिक', symbol:'♏', dates:'Oct 23 – Nov 21', element:'Water', ruling:'Mars',
    textClass:'text-orange-400', bgClass:'bg-orange-950/30 hover:bg-orange-900/25', borderClass:'border-orange-500/20 hover:border-orange-400/40',
    iconBgClass:'bg-orange-500/10', svgClass:'text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]',
    badgeClass:'text-orange-400 border-orange-500/25 bg-orange-500/10', dotClass:'bg-orange-400 shadow-[0_0_6px_#f97316]',
    dotFadeClass:'bg-orange-500/20', heroBgClass:'bg-gradient-to-br from-orange-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-orange-950/20', divideClass:'border-orange-500/15',
    svg:`<g stroke="#f97316" stroke-width="2" fill="none" stroke-linecap="round"><line x1="12" y1="12" x2="12" y2="30"/><line x1="22" y1="12" x2="22" y2="30"/><path d="M12 30 C12 34 16 36 22 36"/><path d="M22 36 C26 36 30 32 30 28 C30 22 26 18 32 14"/><path d="M32 14 L36 10"/><path d="M36 10 L38 14"/><path d="M36 10 L32 12"/></g>`,
  },
  {
    id:'sagittarius', name:'Sagittarius', sanskrit:'धनु', symbol:'♐', dates:'Nov 22 – Dec 21', element:'Fire', ruling:'Jupiter',
    textClass:'text-orange-300', bgClass:'bg-orange-950/25 hover:bg-orange-900/20', borderClass:'border-orange-400/20 hover:border-orange-300/40',
    iconBgClass:'bg-orange-400/10', svgClass:'text-orange-300 drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]',
    badgeClass:'text-orange-300 border-orange-400/25 bg-orange-400/10', dotClass:'bg-orange-300 shadow-[0_0_6px_#fb923c]',
    dotFadeClass:'bg-orange-400/20', heroBgClass:'bg-gradient-to-br from-orange-950/35 via-black/50 to-transparent',
    cardBgClass:'bg-orange-950/15', divideClass:'border-orange-400/15',
    svg:`<g stroke="#fb923c" stroke-width="2" fill="none" stroke-linecap="round"><line x1="14" y1="34" x2="36" y2="12"/><path d="M36 12 L28 12"/><path d="M36 12 L36 20"/><circle cx="15" cy="34" r="2" fill="#fb923c" fill-opacity="0.5"/></g>`,
  },
  {
    id:'capricorn', name:'Capricorn', sanskrit:'मकर', symbol:'♑', dates:'Dec 22 – Jan 19', element:'Earth', ruling:'Saturn',
    textClass:'text-slate-300', bgClass:'bg-slate-900/40 hover:bg-slate-800/35', borderClass:'border-slate-500/20 hover:border-slate-400/40',
    iconBgClass:'bg-slate-500/10', svgClass:'text-slate-300 drop-shadow-[0_0_6px_rgba(148,163,184,0.5)]',
    badgeClass:'text-slate-300 border-slate-500/25 bg-slate-500/10', dotClass:'bg-slate-300 shadow-[0_0_6px_#94a3b8]',
    dotFadeClass:'bg-slate-500/20', heroBgClass:'bg-gradient-to-br from-slate-900/50 via-black/50 to-transparent',
    cardBgClass:'bg-slate-900/30', divideClass:'border-slate-500/15',
    svg:`<g stroke="#94a3b8" stroke-width="2" fill="none" stroke-linecap="round"><path d="M10 12 L10 30 C10 34 13 36 18 36 C23 36 26 32 26 28 C26 24 23 22 18 22"/><path d="M18 22 C24 22 26 18 22 14 C18 10 14 12 10 12"/><path d="M26 28 C26 32 28 36 32 36 C36 36 38 32 36 28 L32 22"/><path d="M32 22 L36 18"/></g>`,
  },
  {
    id:'aquarius', name:'Aquarius', sanskrit:'कुम्भ', symbol:'♒', dates:'Jan 20 – Feb 18', element:'Air', ruling:'Saturn',
    textClass:'text-sky-300', bgClass:'bg-sky-950/30 hover:bg-sky-900/25', borderClass:'border-sky-400/20 hover:border-sky-300/40',
    iconBgClass:'bg-sky-500/10', svgClass:'text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]',
    badgeClass:'text-sky-300 border-sky-400/25 bg-sky-500/10', dotClass:'bg-sky-300 shadow-[0_0_6px_#38bdf8]',
    dotFadeClass:'bg-sky-500/20', heroBgClass:'bg-gradient-to-br from-sky-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-sky-950/20', divideClass:'border-sky-500/15',
    svg:`<g stroke="#38bdf8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20 C12 17 16 23 20 20 C24 17 28 23 32 20 C36 17 40 23 40 20"/><path d="M8 28 C12 25 16 31 20 28 C24 25 28 31 32 28 C36 25 40 31 40 28"/></g>`,
  },
  {
    id:'pisces', name:'Pisces', sanskrit:'मीन', symbol:'♓', dates:'Feb 19 – Mar 20', element:'Water', ruling:'Jupiter',
    textClass:'text-purple-300', bgClass:'bg-purple-950/30 hover:bg-purple-900/25', borderClass:'border-purple-400/20 hover:border-purple-300/40',
    iconBgClass:'bg-purple-500/10', svgClass:'text-purple-300 drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]',
    badgeClass:'text-purple-300 border-purple-400/25 bg-purple-500/10', dotClass:'bg-purple-300 shadow-[0_0_6px_#a78bfa]',
    dotFadeClass:'bg-purple-500/20', heroBgClass:'bg-gradient-to-br from-purple-950/40 via-black/50 to-transparent',
    cardBgClass:'bg-purple-950/20', divideClass:'border-purple-500/15',
    svg:`<g stroke="#a78bfa" stroke-width="2" fill="none" stroke-linecap="round"><path d="M18 10 C12 16 12 32 18 38"/><path d="M30 10 C36 16 36 32 30 38"/><line x1="14" y1="24" x2="34" y2="24"/><path d="M14 22 L10 24 L14 26"/><path d="M34 22 L38 24 L34 26"/></g>`,
  },
]

// ── Category styling ──────────────────────────────────────────────────────────
const catColors = {
  love:      { textClass:'text-pink-400',    borderClass:'border-pink-500/20',    bgClass:'bg-pink-950/20',    iconBgClass:'bg-pink-500/10',    barClass:'bg-gradient-to-r from-pink-500/60 to-pink-400',    tipBgClass:'bg-pink-500/10',    divideClass:'border-pink-500/15' },
  career:    { textClass:'text-yellow-400',  borderClass:'border-yellow-500/20',  bgClass:'bg-yellow-950/20',  iconBgClass:'bg-yellow-500/10',  barClass:'bg-gradient-to-r from-yellow-500/60 to-yellow-400',  tipBgClass:'bg-yellow-500/10',  divideClass:'border-yellow-500/15' },
  health:    { textClass:'text-emerald-400', borderClass:'border-emerald-500/20', bgClass:'bg-emerald-950/20', iconBgClass:'bg-emerald-500/10', barClass:'bg-gradient-to-r from-emerald-500/60 to-emerald-400', tipBgClass:'bg-emerald-500/10', divideClass:'border-emerald-500/15' },
  travel:    { textClass:'text-sky-400',     borderClass:'border-sky-500/20',     bgClass:'bg-sky-950/20',     iconBgClass:'bg-sky-500/10',     barClass:'bg-gradient-to-r from-sky-500/60 to-sky-400',     tipBgClass:'bg-sky-500/10',     divideClass:'border-sky-500/15' },
  education: { textClass:'text-purple-400',  borderClass:'border-purple-500/20',  bgClass:'bg-purple-950/20',  iconBgClass:'bg-purple-500/10',  barClass:'bg-gradient-to-r from-purple-500/60 to-purple-400',  tipBgClass:'bg-purple-500/10',  divideClass:'border-purple-500/15' },
}

// ── Prediction shape (mirrors server/api/horoscope.get.ts) ────────────────────
interface CategoryPrediction { score: number; text: string; tip: string }
interface SignPrediction {
  summary: string
  love: CategoryPrediction; career: CategoryPrediction
  health: CategoryPrediction; travel: CategoryPrediction; education: CategoryPrediction
  overallScore: number; affirmation: string
  luckyColor: string; luckyNumber: number; luckyDay: string; luckyGem: string
}

// Built prediction shape used by the template
interface BuiltPrediction {
  summary: string; affirmation: string; overallRating: string; stars: number
  luckies: { emoji: string; label: string; value: string; hex: string }[]
  categories: (CategoryPrediction & {
    title: string; emoji: string; open: boolean
    textClass: string; borderClass: string; bgClass: string
    iconBgClass: string; barClass: string; tipBgClass: string; divideClass: string
  })[]
}

// ── View state ─────────────────────────────────────────────────────────────────
type View = 'grid' | 'loading' | 'prediction'
const view         = ref<View>('grid')
const selectedSign = ref<ZodiacSign | null>(null)
const prediction   = ref<BuiltPrediction | null>(null)
const apiError     = ref<string>('')

function goBack() { view.value = 'grid'; selectedSign.value = null; prediction.value = null; apiError.value = '' }

async function selectSign(sign: ZodiacSign) {
  selectedSign.value = sign
  view.value         = 'loading'
  prediction.value   = null
  apiError.value     = ''

  try {
    const res  = await fetch(`/api/horoscope?sign=${sign.id}`)
    if (!res.ok) throw new Error(`Server error ${res.status}`)
    const data = await res.json() as { predictions: Record<string, SignPrediction> }
    const raw  = data.predictions[sign.id]
    if (!raw) throw new Error('No prediction data received')
    prediction.value = buildFromApi(sign, raw)
    view.value       = 'prediction'
  } catch (err) {
    apiError.value = err instanceof Error ? err.message : 'Unknown error'
    view.value     = 'grid'
  }
}

function buildFromApi(sign: ZodiacSign, raw: SignPrediction): BuiltPrediction {
  const catDefs = [
    { key: 'love',      title: 'Love & Relationships', emoji: '💗', data: raw.love      },
    { key: 'career',    title: 'Career & Finance',     emoji: '💼', data: raw.career    },
    { key: 'health',    title: 'Health & Wellness',    emoji: '🌿', data: raw.health    },
    { key: 'travel',    title: 'Travel & Movement',    emoji: '✈️', data: raw.travel    },
    { key: 'education', title: 'Education & Growth',   emoji: '📚', data: raw.education },
  ]
  const categories = catDefs.map((c, i) => ({
    ...c.data,
    title: c.title, emoji: c.emoji, open: i === 0,
    ...catColors[c.key as keyof typeof catColors],
  }))
  const stars = Math.round(raw.overallScore / 2)
  return {
    summary:       raw.summary,
    affirmation:   raw.affirmation,
    overallRating: raw.overallScore.toFixed(1),
    stars,
    luckies: [
      { emoji: '🎨', label: 'Lucky Color',  value: raw.luckyColor,           hex: '' },
      { emoji: '🔢', label: 'Lucky Number', value: String(raw.luckyNumber),  hex: '' },
      { emoji: '📅', label: 'Lucky Day',    value: raw.luckyDay,             hex: '' },
      { emoji: '💎', label: 'Lucky Gem',    value: raw.luckyGem,             hex: '' },
    ],
    categories,
  }
}

</script>

<style>
@keyframes twinkle {
  0%, 100% { opacity: 0.1; }
  50%       { opacity: 0.7; }
}
</style>