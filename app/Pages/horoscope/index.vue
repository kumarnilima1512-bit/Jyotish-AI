<template>
  <div class="min-h-screen bg-[#07070f] text-gray-200 relative overflow-x-hidden">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="star in stars" :key="star.id" class="absolute rounded-full bg-white" :style="starStyle(star)"/>
    </div>
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-24 -left-36 w-[600px] h-[600px] rounded-full bg-violet-600 opacity-10 blur-[120px]"/>
      <div class="absolute -bottom-12 -right-24 w-[500px] h-[500px] rounded-full bg-pink-700 opacity-[0.08] blur-[100px]"/>
    </div>

    <header class="relative z-10 border-b border-yellow-600/10 py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-yellow-500/20 bg-black/40 flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:border-yellow-400/50 transition-all">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 1L4 6.5L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
            <div>
              <h1 class="font-cinzel text-xl text-yellow-400 tracking-[0.25em] uppercase group-hover:text-yellow-300 transition-colors">ज्योतिष · Jyotish</h1>
              <p class="font-garamond text-xs text-gray-600 mt-0.5 tracking-widest">Vedic Astrology</p>
            </div>
          </NuxtLink>
        </div>
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-yellow-400/60">
          <span>☉</span><span>Daily Rashifal</span><span class="text-yellow-600/20">·</span><span>{{ todayStr }}</span>
        </div>
      </div>
    </header>

    <div class="relative z-10 text-center pt-10 pb-8 px-4">
      <p class="font-cinzel text-xs tracking-[0.5em] uppercase mb-2 text-yellow-400/40">राशिफल</p>
      <h2 class="font-cinzel text-4xl md:text-5xl tracking-[0.15em] uppercase mb-3 text-yellow-400/90">Daily Horoscope</h2>
      <p class="font-garamond text-gray-500 text-base">Choose your Rashi to reveal today's cosmic guidance</p>
    </div>

    <!-- GRID -->
    <main v-if="view === 'grid'" class="relative z-10 max-w-6xl mx-auto px-4 pb-20">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        <button v-for="sign in zodiacSigns" :key="sign.id" type="button" @click="selectSign(sign)"
          :class="['group flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]', sign.borderClass, sign.bgClass]">
          <!-- Zodiac Icon -->
          <div :class="['relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 border', sign.iconBgClass, sign.borderClass]">
            <img :src="`/images/zodiac/${sign.id}.png`" :alt="sign.name" class="w-9 h-9 object-contain" :style="{ filter: `drop-shadow(0 0 6px ${sign.glowColor})` }"/>
          </div>
          <div class="text-center">
            <div :class="['font-cinzel text-xs tracking-widest uppercase', sign.textClass]">{{ sign.name }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-0.5">{{ sign.sanskrit }}</div>
            <div class="font-garamond text-xs text-gray-700">{{ sign.dates }}</div>
          </div>
          <div :class="['px-2 py-0.5 rounded-full font-cinzel text-xs tracking-wider border opacity-60 group-hover:opacity-90', sign.badgeClass]">{{ sign.element }}</div>
        </button>
      </div>
    </main>

    <!-- ERROR -->
    <div v-if="apiError" class="relative z-10 max-w-2xl mx-auto px-4 mb-4">
      <div class="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p class="font-garamond text-sm flex-1">{{ apiError }}</p>
        <button @click="apiError=''" class="ml-auto text-red-400 hover:text-red-200"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-else-if="view === 'loading'" class="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="relative w-48 h-48 mb-8">
        <div class="absolute inset-0 rounded-full border border-dashed border-yellow-400/15 animate-spin [animation-duration:12s]"/>
        <div class="absolute inset-6 rounded-full border border-dashed border-yellow-400/20 animate-spin [animation-duration:8s] [animation-direction:reverse]"/>
        <div class="absolute inset-12 rounded-full border border-yellow-400/30 animate-spin [animation-duration:4s]"/>
        <div class="absolute inset-0 flex items-center justify-center">
          <div :class="['w-20 h-20 rounded-full flex items-center justify-center animate-pulse border', selectedSign?.iconBgClass, selectedSign?.borderClass]">
            <img v-if="selectedSign" :src="`/images/zodiac/${selectedSign.id}.png`" :alt="selectedSign.name" class="w-12 h-12 object-contain" :style="{ filter: `drop-shadow(0 0 10px ${selectedSign.glowColor})` }"/>
          </div>
        </div>
      </div>
      <p :class="['font-cinzel text-sm tracking-[0.4em] uppercase mb-2', selectedSign?.textClass]">{{ selectedSign?.name }}</p>
      <p class="font-garamond text-gray-500 text-base animate-pulse">Consulting the stars with AI…</p>
      <div class="flex gap-1.5 mt-4">
        <div v-for="i in 3" :key="i" :class="['w-1.5 h-1.5 rounded-full animate-bounce', selectedSign?.dotClass]" :style="{ animationDelay: `${(i-1)*0.2}s` }"/>
      </div>
    </div>

    <!-- PREDICTION -->
    <div v-else-if="view === 'prediction' && prediction && selectedSign" class="relative z-10 max-w-4xl mx-auto px-4 pb-20">
      <button type="button" @click="goBack" class="flex items-center gap-2 mb-8 font-cinzel text-xs tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors">
        <svg viewBox="0 0 16 16" fill="none" class="w-3.5 h-3.5"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        All Signs
      </button>

      <div :class="['relative rounded-3xl overflow-hidden mb-8 p-8 md:p-10 border', selectedSign.borderClass, selectedSign.heroBgClass]">
        <div class="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:24px_24px]"/>
        <div class="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <div :class="['shrink-0 w-28 h-28 rounded-2xl flex items-center justify-center border', selectedSign.iconBgClass, selectedSign.borderClass]">
            <img :src="`/images/zodiac/${selectedSign.id}.png`" :alt="selectedSign.name" class="w-20 h-20 object-contain" :style="{ filter: `drop-shadow(0 0 14px ${selectedSign.glowColor})` }"/>
          </div>
          <div class="text-center md:text-left flex-1">
            <p :class="['font-cinzel text-xs tracking-[0.5em] uppercase mb-1 opacity-60', selectedSign.textClass]">{{ selectedSign.element }} · {{ selectedSign.ruling }}</p>
            <h3 :class="['font-cinzel text-4xl md:text-5xl tracking-wider mb-1', selectedSign.textClass]">{{ selectedSign.name }}</h3>
            <p class="font-garamond text-xl text-gray-400 mb-1">{{ selectedSign.sanskrit }}</p>
            <p class="font-garamond text-sm text-gray-600">{{ selectedSign.dates }} · Ruled by {{ selectedSign.ruling }}</p>
          </div>
          <div class="shrink-0 text-center">
            <div :class="['font-cinzel text-5xl font-bold mb-1', selectedSign.textClass]">{{ prediction.overallRating }}</div>
            <div class="font-cinzel text-xs tracking-widest uppercase text-gray-600">Today's Score</div>
            <div class="flex gap-1 justify-center mt-2">
              <div v-for="i in 5" :key="i" :class="['w-2.5 h-2.5 rounded-full', i <= prediction.stars ? selectedSign.dotClass : selectedSign.dotFadeClass]"/>
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
          <div :class="['font-garamond text-sm font-medium', selectedSign.textClass]">{{ lucky.value }}</div>
        </div>
      </div>

      <!-- Categories -->
      <div class="space-y-4">
        <div v-for="cat in prediction.categories" :key="cat.title" :class="['rounded-2xl border overflow-hidden', cat.borderClass, cat.bgClass]">
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

      <div :class="['mt-8 text-center p-6 rounded-2xl border', selectedSign.borderClass, selectedSign.cardBgClass]">
        <p :class="['font-cinzel text-xs tracking-[0.4em] uppercase mb-3 opacity-50', selectedSign.textClass]">Today's Affirmation</p>
        <p class="font-garamond text-xl italic leading-relaxed text-gray-200">"{{ prediction.affirmation }}"</p>
      </div>
    </div>

    <footer class="relative z-10 border-t border-yellow-600/8 py-6 mt-4 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">For entertainment &amp; reflection · Calculations based on Vedic tradition</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const todayStr = computed(() => new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }))

interface Star { id:number; x:number; y:number; size:number; opacity:number; duration:number; delay:number }
const stars: Star[] = Array.from({length:100},(_,i)=>({ id:i, x:Math.random()*100, y:Math.random()*100, size:Math.random()*1.8+0.4, opacity:Math.random()*0.4+0.06, duration:Math.random()*5+2, delay:Math.random()*6 }))
const starStyle = (s:Star) => ({ left:s.x+'%', top:s.y+'%', width:s.size+'px', height:s.size+'px', opacity:s.opacity, animation:`twinkle ${s.duration}s ease-in-out infinite ${s.delay}s` })

interface ZodiacSign {
  id:string; name:string; sanskrit:string; symbol:string; dates:string; element:string; ruling:string
  glowColor:string; textClass:string; bgClass:string; borderClass:string; iconBgClass:string
  badgeClass:string; dotClass:string; dotFadeClass:string; heroBgClass:string; cardBgClass:string; divideClass:string
}

const zodiacSigns: ZodiacSign[] = [
  { id:'aries',       name:'Aries',       sanskrit:'मेष',     symbol:'♈', dates:'Mar 21–Apr 19', element:'Fire',  ruling:'Mars',    glowColor:'#f87171', textClass:'text-red-400',    bgClass:'bg-red-950/30 hover:bg-red-900/25',       borderClass:'border-red-500/20 hover:border-red-400/40',       iconBgClass:'bg-red-500/10',    badgeClass:'text-red-400 border-red-500/25 bg-red-500/10',       dotClass:'bg-red-400',    dotFadeClass:'bg-red-500/20',    heroBgClass:'bg-gradient-to-br from-red-950/40 via-black/50 to-transparent',       cardBgClass:'bg-red-950/20',    divideClass:'border-red-500/15' },
  { id:'taurus',      name:'Taurus',      sanskrit:'वृषभ',    symbol:'♉', dates:'Apr 20–May 20', element:'Earth', ruling:'Venus',   glowColor:'#86efac', textClass:'text-green-300',  bgClass:'bg-green-950/30 hover:bg-green-900/25',   borderClass:'border-green-500/20 hover:border-green-400/40',   iconBgClass:'bg-green-500/10',  badgeClass:'text-green-300 border-green-500/25 bg-green-500/10',  dotClass:'bg-green-300',  dotFadeClass:'bg-green-500/20',  heroBgClass:'bg-gradient-to-br from-green-950/40 via-black/50 to-transparent',   cardBgClass:'bg-green-950/20',  divideClass:'border-green-500/15' },
  { id:'gemini',      name:'Gemini',      sanskrit:'मिथुन',   symbol:'♊', dates:'May 21–Jun 20', element:'Air',   ruling:'Mercury', glowColor:'#fde68a', textClass:'text-yellow-300', bgClass:'bg-yellow-950/30 hover:bg-yellow-900/25', borderClass:'border-yellow-500/20 hover:border-yellow-400/40', iconBgClass:'bg-yellow-500/10', badgeClass:'text-yellow-300 border-yellow-500/25 bg-yellow-500/10', dotClass:'bg-yellow-300', dotFadeClass:'bg-yellow-500/20', heroBgClass:'bg-gradient-to-br from-yellow-950/40 via-black/50 to-transparent', cardBgClass:'bg-yellow-950/20', divideClass:'border-yellow-500/15' },
  { id:'cancer',      name:'Cancer',      sanskrit:'कर्क',    symbol:'♋', dates:'Jun 21–Jul 22', element:'Water', ruling:'Moon',    glowColor:'#93c5fd', textClass:'text-blue-300',   bgClass:'bg-blue-950/30 hover:bg-blue-900/25',     borderClass:'border-blue-400/20 hover:border-blue-300/40',     iconBgClass:'bg-blue-500/10',   badgeClass:'text-blue-300 border-blue-400/25 bg-blue-500/10',     dotClass:'bg-blue-300',   dotFadeClass:'bg-blue-500/20',   heroBgClass:'bg-gradient-to-br from-blue-950/40 via-black/50 to-transparent',     cardBgClass:'bg-blue-950/20',   divideClass:'border-blue-500/15' },
  { id:'leo',         name:'Leo',         sanskrit:'सिंह',    symbol:'♌', dates:'Jul 23–Aug 22', element:'Fire',  ruling:'Sun',     glowColor:'#fbbf24', textClass:'text-amber-400',  bgClass:'bg-amber-950/30 hover:bg-amber-900/25',   borderClass:'border-amber-500/20 hover:border-amber-400/40',   iconBgClass:'bg-amber-500/10',  badgeClass:'text-amber-400 border-amber-500/25 bg-amber-500/10',  dotClass:'bg-amber-400',  dotFadeClass:'bg-amber-500/20',  heroBgClass:'bg-gradient-to-br from-amber-950/40 via-black/50 to-transparent',   cardBgClass:'bg-amber-950/20',  divideClass:'border-amber-500/15' },
  { id:'virgo',       name:'Virgo',       sanskrit:'कन्या',   symbol:'♍', dates:'Aug 23–Sep 22', element:'Earth', ruling:'Mercury', glowColor:'#6ee7b7', textClass:'text-emerald-400',bgClass:'bg-emerald-950/30 hover:bg-emerald-900/25',borderClass:'border-emerald-500/20 hover:border-emerald-400/40',iconBgClass:'bg-emerald-500/10',badgeClass:'text-emerald-400 border-emerald-500/25 bg-emerald-500/10',dotClass:'bg-emerald-400',dotFadeClass:'bg-emerald-500/20',heroBgClass:'bg-gradient-to-br from-emerald-950/40 via-black/50 to-transparent',cardBgClass:'bg-emerald-950/20',divideClass:'border-emerald-500/15' },
  { id:'libra',       name:'Libra',       sanskrit:'तुला',    symbol:'♎', dates:'Sep 23–Oct 22', element:'Air',   ruling:'Venus',   glowColor:'#c4b5fd', textClass:'text-violet-300', bgClass:'bg-violet-950/30 hover:bg-violet-900/25', borderClass:'border-violet-400/20 hover:border-violet-300/40', iconBgClass:'bg-violet-500/10', badgeClass:'text-violet-300 border-violet-400/25 bg-violet-500/10', dotClass:'bg-violet-300', dotFadeClass:'bg-violet-500/20', heroBgClass:'bg-gradient-to-br from-violet-950/40 via-black/50 to-transparent', cardBgClass:'bg-violet-950/20', divideClass:'border-violet-500/15' },
  { id:'scorpio',     name:'Scorpio',     sanskrit:'वृश्चिक', symbol:'♏', dates:'Oct 23–Nov 21', element:'Water', ruling:'Mars',    glowColor:'#f97316', textClass:'text-orange-400', bgClass:'bg-orange-950/30 hover:bg-orange-900/25', borderClass:'border-orange-500/20 hover:border-orange-400/40', iconBgClass:'bg-orange-500/10', badgeClass:'text-orange-400 border-orange-500/25 bg-orange-500/10', dotClass:'bg-orange-400', dotFadeClass:'bg-orange-500/20', heroBgClass:'bg-gradient-to-br from-orange-950/40 via-black/50 to-transparent', cardBgClass:'bg-orange-950/20', divideClass:'border-orange-500/15' },
  { id:'sagittarius', name:'Sagittarius', sanskrit:'धनु',     symbol:'♐', dates:'Nov 22–Dec 21', element:'Fire',  ruling:'Jupiter', glowColor:'#fb923c', textClass:'text-orange-300', bgClass:'bg-orange-950/25 hover:bg-orange-900/20', borderClass:'border-orange-400/20 hover:border-orange-300/40', iconBgClass:'bg-orange-400/10', badgeClass:'text-orange-300 border-orange-400/25 bg-orange-400/10', dotClass:'bg-orange-300', dotFadeClass:'bg-orange-400/20', heroBgClass:'bg-gradient-to-br from-orange-950/35 via-black/50 to-transparent', cardBgClass:'bg-orange-950/15', divideClass:'border-orange-400/15' },
  { id:'capricorn',   name:'Capricorn',   sanskrit:'मकर',     symbol:'♑', dates:'Dec 22–Jan 19', element:'Earth', ruling:'Saturn',  glowColor:'#94a3b8', textClass:'text-slate-300',  bgClass:'bg-slate-900/40 hover:bg-slate-800/35',   borderClass:'border-slate-500/20 hover:border-slate-400/40',   iconBgClass:'bg-slate-500/10',  badgeClass:'text-slate-300 border-slate-500/25 bg-slate-500/10',  dotClass:'bg-slate-300',  dotFadeClass:'bg-slate-500/20',  heroBgClass:'bg-gradient-to-br from-slate-900/50 via-black/50 to-transparent',   cardBgClass:'bg-slate-900/30',  divideClass:'border-slate-500/15' },
  { id:'aquarius',    name:'Aquarius',    sanskrit:'कुम्भ',   symbol:'♒', dates:'Jan 20–Feb 18', element:'Air',   ruling:'Saturn',  glowColor:'#38bdf8', textClass:'text-sky-300',    bgClass:'bg-sky-950/30 hover:bg-sky-900/25',       borderClass:'border-sky-400/20 hover:border-sky-300/40',       iconBgClass:'bg-sky-500/10',    badgeClass:'text-sky-300 border-sky-400/25 bg-sky-500/10',        dotClass:'bg-sky-300',    dotFadeClass:'bg-sky-500/20',    heroBgClass:'bg-gradient-to-br from-sky-950/40 via-black/50 to-transparent',       cardBgClass:'bg-sky-950/20',    divideClass:'border-sky-500/15' },
  { id:'pisces',      name:'Pisces',      sanskrit:'मीन',     symbol:'♓', dates:'Feb 19–Mar 20', element:'Water', ruling:'Jupiter', glowColor:'#a78bfa', textClass:'text-purple-300', bgClass:'bg-purple-950/30 hover:bg-purple-900/25', borderClass:'border-purple-400/20 hover:border-purple-300/40', iconBgClass:'bg-purple-500/10', badgeClass:'text-purple-300 border-purple-400/25 bg-purple-500/10', dotClass:'bg-purple-300', dotFadeClass:'bg-purple-500/20', heroBgClass:'bg-gradient-to-br from-purple-950/40 via-black/50 to-transparent', cardBgClass:'bg-purple-950/20', divideClass:'border-purple-500/15' },
]

const catColors = {
  love:      { textClass:'text-pink-400',    borderClass:'border-pink-500/20',    bgClass:'bg-pink-950/20',    iconBgClass:'bg-pink-500/10',    barClass:'bg-gradient-to-r from-pink-500/60 to-pink-400',    tipBgClass:'bg-pink-500/10',    divideClass:'border-pink-500/15',  emoji:'💗' },
  career:    { textClass:'text-yellow-400',  borderClass:'border-yellow-500/20',  bgClass:'bg-yellow-950/20',  iconBgClass:'bg-yellow-500/10',  barClass:'bg-gradient-to-r from-yellow-500/60 to-yellow-400',  tipBgClass:'bg-yellow-500/10',  divideClass:'border-yellow-500/15', emoji:'💼' },
  health:    { textClass:'text-emerald-400', borderClass:'border-emerald-500/20', bgClass:'bg-emerald-950/20', iconBgClass:'bg-emerald-500/10', barClass:'bg-gradient-to-r from-emerald-500/60 to-emerald-400', tipBgClass:'bg-emerald-500/10', divideClass:'border-emerald-500/15',emoji:'🌿' },
  travel:    { textClass:'text-sky-400',     borderClass:'border-sky-500/20',     bgClass:'bg-sky-950/20',     iconBgClass:'bg-sky-500/10',     barClass:'bg-gradient-to-r from-sky-500/60 to-sky-400',     tipBgClass:'bg-sky-500/10',     divideClass:'border-sky-500/15',    emoji:'✈️' },
  education: { textClass:'text-purple-400',  borderClass:'border-purple-500/20',  bgClass:'bg-purple-950/20',  iconBgClass:'bg-purple-500/10',  barClass:'bg-gradient-to-r from-purple-500/60 to-purple-400',  tipBgClass:'bg-purple-500/10',  divideClass:'border-purple-500/15', emoji:'📚' },
}

interface CategoryPrediction { score:number; text:string; tip:string }
interface SignPrediction {
  summary:string; love:CategoryPrediction; career:CategoryPrediction; health:CategoryPrediction
  travel:CategoryPrediction; education:CategoryPrediction; overallScore:number; affirmation:string
  luckyColor:string; luckyNumber:number; luckyDay:string; luckyGem:string
}

type View = 'grid'|'loading'|'prediction'
const view=ref<View>('grid'), selectedSign=ref<ZodiacSign|null>(null), prediction=ref<any>(null), apiError=ref('')

function goBack(){view.value='grid';selectedSign.value=null;prediction.value=null;apiError.value=''}

async function selectSign(sign:ZodiacSign){
  selectedSign.value=sign; view.value='loading'; prediction.value=null; apiError.value=''
  try {
    const res=await fetch(`/api/horoscope?sign=${sign.id}`)
    if(!res.ok) throw new Error(`Server error ${res.status}`)
    const data=await res.json() as {predictions:Record<string,SignPrediction>}
    const raw=data.predictions[sign.id]
    if(!raw) throw new Error('No prediction data received')
    prediction.value=buildFromApi(raw); view.value='prediction'
  } catch(err) {
    apiError.value=err instanceof Error?err.message:'Unknown error'; view.value='grid'
  }
}

function buildFromApi(raw:SignPrediction){
  const catDefs=[
    {key:'love',title:'Love & Relationships',data:raw.love},
    {key:'career',title:'Career & Finance',data:raw.career},
    {key:'health',title:'Health & Wellness',data:raw.health},
    {key:'travel',title:'Travel & Movement',data:raw.travel},
    {key:'education',title:'Education & Growth',data:raw.education},
  ]
  return {
    summary:raw.summary, affirmation:raw.affirmation,
    overallRating:raw.overallScore.toFixed(1), stars:Math.round(raw.overallScore/2),
    luckies:[
      {emoji:'🎨',label:'Lucky Color',value:raw.luckyColor},
      {emoji:'🔢',label:'Lucky Number',value:String(raw.luckyNumber)},
      {emoji:'📅',label:'Lucky Day',value:raw.luckyDay},
      {emoji:'💎',label:'Lucky Gem',value:raw.luckyGem},
    ],
    categories:catDefs.map((c,i)=>({...c.data,title:c.title,open:i===0,...catColors[c.key as keyof typeof catColors]})),
  }
}
</script>

<style>
@keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
</style>