<template>
  <div class="min-h-screen bg-[#07070f] text-gray-200 relative overflow-x-hidden">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="star in stars" :key="star.id" class="absolute rounded-full bg-white" :style="starStyle(star)"/>
    </div>
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-rose-700 opacity-[0.07] blur-[120px]"/>
      <div class="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-amber-600 opacity-[0.05] blur-[100px]"/>
    </div>
    <header class="relative z-10 border-b border-rose-600/10 py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-rose-500/20 bg-black/40 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:border-rose-400/50 transition-all">
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
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-rose-400/60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Kundli Milan</span>
        </div>
      </div>
    </header>
    <div class="relative z-10 text-center pt-10 pb-8 px-4">
      <p class="font-cinzel text-xs tracking-[0.5em] uppercase mb-2 text-rose-400/40">कुंडली मिलान</p>
      <h2 class="font-cinzel text-4xl md:text-5xl tracking-[0.15em] uppercase mb-3 text-rose-300/90">Kundli Milan</h2>
      <p class="font-garamond text-gray-500 text-base">Enter birth details to reveal cosmic compatibility</p>
    </div>

    <!-- FORM -->
    <div v-if="view === 'form'" class="relative z-10 max-w-5xl mx-auto px-4 pb-20">
      <div v-if="formError" class="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p class="font-garamond text-sm">{{ formError }}</p>
        <button @click="formError=''" class="ml-auto text-red-400 hover:text-red-200"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Boy -->
        <div class="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div><h3 class="font-cinzel text-sm tracking-widest uppercase text-blue-300">Boy's Details</h3><p class="font-garamond text-xs text-gray-600">Groom / Partner</p></div>
          </div>
          <div class="space-y-5">
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Name <span class="text-gray-700">(optional)</span></label>
              <input v-model="p1.name" type="text" placeholder="e.g. Arjun" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-garamond text-gray-200 placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-colors"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Date of Birth</label>
              <MilanDatePicker :value="p1.dob" accent="blue" @change="v => p1.dob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Time of Birth</label>
              <MilanClockPicker :value="p1.tob" accent="blue" @change="v => p1.tob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Place of Birth</label>
              <MilanLocationSearch accent="blue" @select="loc => p1.pob = loc"/>
            </div>
          </div>
        </div>
        <!-- Girl -->
        <div class="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="12" y1="16" x2="12" y2="20"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            </div>
            <div><h3 class="font-cinzel text-sm tracking-widest uppercase text-rose-300">Girl's Details</h3><p class="font-garamond text-xs text-gray-600">Bride / Partner</p></div>
          </div>
          <div class="space-y-5">
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Name <span class="text-gray-700">(optional)</span></label>
              <input v-model="p2.name" type="text" placeholder="e.g. Priya" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-garamond text-gray-200 placeholder-gray-700 focus:outline-none focus:border-rose-500/50 transition-colors"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Date of Birth</label>
              <MilanDatePicker :value="p2.dob" accent="rose" @change="v => p2.dob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Time of Birth</label>
              <MilanClockPicker :value="p2.tob" accent="rose" @change="v => p2.tob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Place of Birth</label>
              <MilanLocationSearch accent="rose" @select="loc => p2.pob = loc"/>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center">
        <button type="button" @click="calculate" class="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/30 hover:border-rose-400/50 font-cinzel text-sm tracking-[0.3em] uppercase text-rose-300 transition-all duration-300 hover:scale-[1.02]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>Calculate Compatibility</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <p class="mt-3 font-garamond text-xs text-gray-700">Ashtakoot · Mangal Dosha · Nadi Dosha</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-else-if="view === 'loading'" class="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="relative w-48 h-48 mb-8">
        <div class="absolute inset-0 rounded-full border border-dashed border-rose-400/15 animate-spin [animation-duration:12s]"/>
        <div class="absolute inset-6 rounded-full border border-dashed border-amber-400/20 animate-spin [animation-duration:8s] [animation-direction:reverse]"/>
        <div class="absolute inset-12 rounded-full border border-rose-400/30 animate-spin [animation-duration:4s]"/>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center animate-pulse bg-rose-500/10 border border-rose-500/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
        </div>
      </div>
      <p class="font-cinzel text-sm tracking-[0.4em] uppercase mb-2 text-rose-400/60">Matching</p>
      <p class="font-garamond text-gray-500 text-base animate-pulse">Consulting the cosmic blueprint…</p>
      <div class="flex gap-1.5 mt-4">
        <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full animate-bounce bg-rose-400" :style="{ animationDelay:`${(i-1)*0.2}s` }"/>
      </div>
    </div>

    <!-- RESULT -->
    <div v-else-if="view === 'result' && result" class="relative z-10 max-w-4xl mx-auto px-4 pb-20">
      <button type="button" @click="reset" class="flex items-center gap-2 mb-8 font-cinzel text-xs tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors">
        <svg viewBox="0 0 16 16" fill="none" class="w-3.5 h-3.5"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        New Match
      </button>
      <div :class="['relative rounded-3xl overflow-hidden mb-8 p-8 md:p-10 border', result.verdict.borderClass, result.verdict.bgClass]">
        <div class="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:24px_24px]"/>
        <div class="relative flex flex-col md:flex-row items-center gap-8">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-2 mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <p class="font-cinzel text-sm tracking-wider text-blue-300">{{ result.p1Name }}</p>
            <p class="font-garamond text-xs text-gray-600 mt-0.5">{{ result.p1Nakshatra }}</p>
            <p class="font-garamond text-xs text-gray-700">{{ result.p1Rashi }}</p>
          </div>
          <div class="flex-1 text-center">
            <div :class="['font-cinzel text-6xl md:text-7xl font-bold mb-1', result.verdict.textClass]">{{ result.totalScore }}</div>
            <div class="font-cinzel text-sm tracking-widest uppercase text-gray-500 mb-2">out of 36</div>
            <div class="flex gap-1 justify-center mb-3">
              <svg v-for="i in 5" :key="i" width="12" height="12" viewBox="0 0 24 24" :fill="i <= result.verdict.stars ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" :class="i <= result.verdict.stars ? result.verdict.textClass : 'text-white/10'">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div :class="['inline-block px-4 py-1.5 rounded-full border font-cinzel text-xs tracking-[0.3em] uppercase', result.verdict.borderClass, result.verdict.badgeClass]">{{ result.verdict.label }}</div>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-2 mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><line x1="12" y1="16" x2="12" y2="20"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
            </div>
            <p class="font-cinzel text-sm tracking-wider text-rose-300">{{ result.p2Name }}</p>
            <p class="font-garamond text-xs text-gray-600 mt-0.5">{{ result.p2Nakshatra }}</p>
            <p class="font-garamond text-xs text-gray-700">{{ result.p2Rashi }}</p>
          </div>
        </div>
        <div :class="['mt-6 pt-6 border-t text-center', result.verdict.divideClass]">
          <p class="font-garamond text-lg leading-relaxed text-gray-300">{{ result.verdict.summary }}</p>
        </div>
      </div>
      <h3 class="font-cinzel text-xs tracking-[0.4em] uppercase text-gray-600 mb-4">Ashtakoot Milan — 8 Gunas</h3>
      <div class="grid sm:grid-cols-2 gap-3 mb-8">
        <div v-for="guna in result.gunas" :key="guna.name" :class="['rounded-2xl border p-5', guna.borderClass, guna.bgClass]">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div :class="['font-cinzel text-sm tracking-wider', guna.textClass]">{{ guna.name }}</div>
              <div class="font-garamond text-xs text-gray-600 mt-0.5">{{ guna.sanskrit }} · {{ guna.aspect }}</div>
            </div>
            <div :class="['font-cinzel text-xl font-bold', guna.textClass]">{{ guna.score }}<span class="text-sm font-normal text-gray-600">/{{ guna.max }}</span></div>
          </div>
          <div class="h-1.5 rounded-full overflow-hidden bg-white/5 mb-3">
            <div :class="['h-full rounded-full transition-all duration-700', guna.barClass]" :style="{ width:`${(guna.score/guna.max)*100}%` }"/>
          </div>
          <p class="font-garamond text-xs leading-relaxed text-gray-500">{{ guna.description }}</p>
        </div>
      </div>
      <h3 class="font-cinzel text-xs tracking-[0.4em] uppercase text-gray-600 mb-4">Dosha Analysis</h3>
      <div class="grid sm:grid-cols-2 gap-3 mb-8">
        <div :class="['rounded-2xl border p-5', result.mangal.borderClass, result.mangal.bgClass]">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border', result.mangal.iconBgClass, result.mangal.borderClass]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="result.mangal.status==='Present'?'#f87171':result.mangal.status==='Cancelled'?'#fbbf24':'#34d399'" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div class="flex-1">
              <div :class="['font-cinzel text-sm tracking-wider', result.mangal.textClass]">Mangal Dosha</div>
              <div class="font-garamond text-xs text-gray-600">Mars affliction check</div>
            </div>
            <div :class="['px-3 py-1 rounded-full border font-cinzel text-xs tracking-wider', result.mangal.borderClass, result.mangal.badgeClass]">{{ result.mangal.status }}</div>
          </div>
          <p class="font-garamond text-sm leading-relaxed text-gray-400">{{ result.mangal.detail }}</p>
        </div>
        <div :class="['rounded-2xl border p-5', result.nadi.borderClass, result.nadi.bgClass]">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border', result.nadi.iconBgClass, result.nadi.borderClass]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" :stroke="result.nadi.status==='Present'?'#f87171':result.nadi.status==='Cancelled'?'#fbbf24':'#34d399'" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="flex-1">
              <div :class="['font-cinzel text-sm tracking-wider', result.nadi.textClass]">Nadi Dosha</div>
              <div class="font-garamond text-xs text-gray-600">Constitution compatibility</div>
            </div>
            <div :class="['px-3 py-1 rounded-full border font-cinzel text-xs tracking-wider', result.nadi.borderClass, result.nadi.badgeClass]">{{ result.nadi.status }}</div>
          </div>
          <p class="font-garamond text-sm leading-relaxed text-gray-400">{{ result.nadi.detail }}</p>
        </div>
      </div>
      <h3 class="font-cinzel text-xs tracking-[0.4em] uppercase text-gray-600 mb-4">Life Areas</h3>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
        <div v-for="area in result.areas" :key="area.label" :class="['rounded-xl p-4 border text-center', area.borderClass, area.bgClass]">
          <div class="flex justify-center mb-2"><component :is="area.icon"/></div>
          <div :class="['font-cinzel text-xs tracking-widest uppercase mb-1', area.textClass]">{{ area.label }}</div>
          <div :class="['font-cinzel text-2xl font-bold mb-1', area.textClass]">{{ area.score }}</div>
          <div class="h-1 rounded-full overflow-hidden bg-white/5"><div :class="['h-full rounded-full', area.barClass]" :style="{ width:`${area.score*10}%` }"/></div>
        </div>
      </div>
      <div class="text-center p-6 rounded-2xl border border-rose-500/15 bg-rose-950/10">
        <p class="font-cinzel text-xs tracking-[0.4em] uppercase mb-3 text-rose-400/40">Cosmic Guidance</p>
        <p class="font-garamond text-xl italic leading-relaxed text-gray-300">{{ result.guidance }}</p>
      </div>
    </div>
    <footer class="relative z-10 border-t border-rose-600/8 py-6 mt-4 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">For guidance &amp; reflection · Based on Vedic Ashtakoot tradition</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineComponent, h } from 'vue'

interface Star { id:number; x:number; y:number; size:number; opacity:number; duration:number; delay:number }
const stars: Star[] = Array.from({length:80},(_,i)=>({ id:i, x:Math.random()*100, y:Math.random()*100, size:Math.random()*1.8+0.4, opacity:Math.random()*0.4+0.06, duration:Math.random()*5+2, delay:Math.random()*6 }))
const starStyle = (s:Star) => ({ left:s.x+'%', top:s.y+'%', width:s.size+'px', height:s.size+'px', opacity:s.opacity, animation:`twinkle ${s.duration}s ease-in-out infinite ${s.delay}s` })

const AC: Record<string,{border:string;bg:string;text:string;hover:string;selBg:string}> = {
  blue: { border:'border-blue-500/50', bg:'bg-blue-950/40', text:'text-blue-300', hover:'hover:bg-blue-500/20', selBg:'bg-blue-500' },
  rose: { border:'border-rose-500/50', bg:'bg-rose-950/40', text:'text-rose-300', hover:'hover:bg-rose-500/20', selBg:'bg-rose-500' },
}
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ─── DatePicker ───────────────────────────────────────────────────────────────
const MilanDatePicker = defineComponent({
  name:'MilanDatePicker', props:{ value:{type:String,default:''}, accent:{type:String,default:'blue'} }, emits:['change'],
  setup(props,{emit}) {
    const now=new Date(); const parsed=props.value?new Date(props.value):null
    const selDay=ref(parsed?parsed.getDate():0), selMonth=ref(parsed?parsed.getMonth():now.getMonth()), selYear=ref(parsed?parsed.getFullYear():now.getFullYear())
    const mode=ref<'day'|'month'|'year'>('day'), isOpen=ref(false)
    const ac=computed(()=>AC[props.accent]??AC['blue']!)
    const dim=computed(()=>new Date(selYear.value,selMonth.value+1,0).getDate())
    const fdo=computed(()=>new Date(selYear.value,selMonth.value,1).getDay())
    const yrs=computed(()=>{const y:number[]=[]; for(let i=now.getFullYear();i>=1920;i--) y.push(i); return y})
    const display=computed(()=>selDay.value?`${selDay.value} ${MONTHS[selMonth.value]} ${selYear.value}`:'Select date')
    function ed(d:number){emit('change',`${selYear.value}-${String(selMonth.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)}
    function sd(d:number){selDay.value=d;ed(d);isOpen.value=false}
    function sm(m:number){selMonth.value=m;mode.value='day';if(selDay.value)ed(selDay.value)}
    function sy(y:number){selYear.value=y;mode.value='month'}
    function pm(){if(selMonth.value===0){selMonth.value=11;selYear.value--}else selMonth.value--;if(selDay.value)ed(selDay.value)}
    function nm(){if(selMonth.value===11){selMonth.value=0;selYear.value++}else selMonth.value++;if(selDay.value)ed(selDay.value)}
    return ()=>{
      const a=ac.value; const cells:ReturnType<typeof h>[]=[]
      if(mode.value==='day'){
        ;['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>cells.push(h('div',{class:'font-cinzel text-xs text-gray-700 text-center py-1'},d)))
        for(let i=0;i<fdo.value;i++)cells.push(h('div',''))
        for(let d=1;d<=dim.value;d++){const sel=selDay.value===d;cells.push(h('button',{type:'button',class:`aspect-square rounded-lg font-garamond text-sm transition-all ${sel?`${a.selBg} text-white font-bold`:`text-gray-300 ${a.hover} hover:text-white`}`,onClick:()=>sd(d)},String(d)))}
      }
      return h('div',{class:'relative'},[
        h('button',{type:'button',class:`w-full flex items-center justify-between bg-white/5 border ${isOpen.value?a.border:'border-white/10'} rounded-xl px-4 py-2.5 font-garamond text-sm transition-all ${selDay.value?'text-gray-200':'text-gray-600'} focus:outline-none`,onClick:()=>{isOpen.value=!isOpen.value;if(isOpen.value)mode.value='day'}},[
          h('span',display.value), h('span',{class:`${a.text} text-xs transition-transform duration-200 inline-block ${isOpen.value?'rotate-180':''}`},'▾'),
        ]),
        isOpen.value&&h('div',{class:`mt-2 rounded-2xl border ${a.border} ${a.bg} backdrop-blur-sm p-3 z-50`},[
          h('div',{class:'flex items-center justify-between mb-3'},[
            mode.value==='day'?h('button',{type:'button',class:`font-cinzel text-xs ${a.text} p-1 rounded hover:bg-white/10`,onClick:pm},'‹'):h('div',''),
            h('div',{class:'flex gap-2'},[
              h('button',{type:'button',class:`font-cinzel text-xs tracking-wider px-2 py-1 rounded transition-all ${mode.value==='month'?`${a.selBg} text-white`:`${a.text} hover:bg-white/10`}`,onClick:()=>mode.value=mode.value==='month'?'day':'month'},MONTH_SHORT[selMonth.value]??''),
              h('button',{type:'button',class:`font-cinzel text-xs tracking-wider px-2 py-1 rounded transition-all ${mode.value==='year'?`${a.selBg} text-white`:`${a.text} hover:bg-white/10`}`,onClick:()=>mode.value=mode.value==='year'?'day':'year'},String(selYear.value)),
            ]),
            mode.value==='day'?h('button',{type:'button',class:`font-cinzel text-xs ${a.text} p-1 rounded hover:bg-white/10`,onClick:nm},'›'):h('div',''),
          ]),
          mode.value==='day'&&h('div',{class:'grid grid-cols-7 gap-0.5'},cells),
          mode.value==='month'&&h('div',{class:'grid grid-cols-3 gap-1.5'},MONTH_SHORT.map((m,i)=>h('button',{type:'button',class:`py-2 rounded-lg font-cinzel text-xs tracking-wider transition-all ${selMonth.value===i?`${a.selBg} text-white`:'text-gray-400 hover:bg-white/10 hover:text-white'}`,onClick:()=>sm(i)},m))),
          mode.value==='year'&&h('div',{class:'h-48 overflow-y-auto grid grid-cols-3 gap-1.5 pr-1'},yrs.value.map(y=>h('button',{type:'button',class:`py-2 rounded-lg font-cinzel text-xs tracking-wider transition-all ${selYear.value===y?`${a.selBg} text-white`:'text-gray-400 hover:bg-white/10 hover:text-white'}`,onClick:()=>sy(y)},String(y)))),
        ]),
      ])
    }
  }
})

// ─── ClockPicker (drag, 0-59 min) ────────────────────────────────────────────
const MilanClockPicker = defineComponent({
  name:'MilanClockPicker', props:{ value:{type:String,default:'12:00'}, accent:{type:String,default:'blue'} }, emits:['change'],
  setup(props,{emit}) {
    const ac=computed(()=>AC[props.accent]??AC['blue']!)
    const isOpen=ref(false), mode=ref<'hours'|'minutes'>('hours'), isPM=ref(false)
    const selH=ref(12), selM=ref(0), dragging=ref(false)
    const S=180, C=S/2, R=C-24, HR=C-16
    function parseAndOpen(){
      const pts=(props.value||'12:00').split(':').map(Number)
      const h=pts[0]??12, m=pts[1]??0
      selH.value=h===0?12:h>12?h-12:h; selM.value=m; isPM.value=h>=12; mode.value='hours'; isOpen.value=true
    }
    const display=computed(()=>`${String(selH.value).padStart(2,'0')}:${String(selM.value).padStart(2,'0')} ${isPM.value?'PM':'AM'}`)
    function numPos(n:number,total:number){
      const a=(n/total)*2*Math.PI-Math.PI/2
      return{left:(C+R*Math.cos(a)-13)+'px',top:(C+R*Math.sin(a)-13)+'px'}
    }
    const hAngle=computed(()=>mode.value==='hours'?(selH.value/12)*2*Math.PI-Math.PI/2:(selM.value/60)*2*Math.PI-Math.PI/2)
    const hX=computed(()=>C+(HR-4)*Math.cos(hAngle.value))
    const hY=computed(()=>C+(HR-4)*Math.sin(hAngle.value))
    function pv(el:HTMLElement,cx:number,cy:number){
      const rect=el.getBoundingClientRect(), x=cx-rect.left-C, y=cy-rect.top-C
      let a=Math.atan2(y,x)+Math.PI/2; if(a<0)a+=2*Math.PI
      if(mode.value==='hours'){let h=Math.round(a/(2*Math.PI)*12);if(h===0)h=12;selH.value=h}
      else{const m=Math.round(a/(2*Math.PI)*60);selM.value=m>=60?0:m}
    }
    function oD(e:MouseEvent){dragging.value=true;pv(e.currentTarget as HTMLElement,e.clientX,e.clientY)}
    function oM(e:MouseEvent){if(!dragging.value)return;pv(e.currentTarget as HTMLElement,e.clientX,e.clientY)}
    function oU(){if(!dragging.value)return;dragging.value=false;if(mode.value==='hours')setTimeout(()=>mode.value='minutes',150)}
    function oTD(e:TouchEvent){dragging.value=true;const t=e.touches[0];if(t)pv(e.currentTarget as HTMLElement,t.clientX,t.clientY)}
    function oTM(e:TouchEvent){if(!dragging.value)return;const t=e.touches[0];if(t)pv(e.currentTarget as HTMLElement,t.clientX,t.clientY)}
    function oTU(){if(!dragging.value)return;dragging.value=false;if(mode.value==='hours')setTimeout(()=>mode.value='minutes',150)}
    function confirm(){let h=selH.value%12;if(isPM.value)h+=12;emit('change',`${String(h).padStart(2,'0')}:${String(selM.value).padStart(2,'0')}`);isOpen.value=false}
    return ()=>{
      const a=ac.value, ml=[0,5,10,15,20,25,30,35,40,45,50,55]
      const face=h('div',{class:'relative mx-auto cursor-pointer select-none',style:{width:S+'px',height:S+'px'},
        onMousedown:oD,onMousemove:oM,onMouseup:oU,onMouseleave:oU,onTouchstart:oTD,onTouchmove:oTM,onTouchend:oTU},[
        h('svg',{width:S,height:S,class:'absolute inset-0'},[
          h('circle',{cx:C,cy:C,r:C-2,fill:'#07030f',stroke:'#ffffff10','stroke-width':'1'}),
          ...Array.from({length:60},(_,i)=>{const ang=(i/60)*2*Math.PI-Math.PI/2,r1=C-6,r2=C-2-(i%5===0?5:2);return h('line',{x1:C+r2*Math.cos(ang),y1:C+r2*Math.sin(ang),x2:C+r1*Math.cos(ang),y2:C+r1*Math.sin(ang),stroke:i%5===0?'#ffffff25':'#ffffff10','stroke-width':'1'})}),
          h('line',{x1:C,y1:C,x2:hX.value,y2:hY.value,stroke:'#e8b400','stroke-width':'2','stroke-linecap':'round'}),
          h('circle',{cx:hX.value,cy:hY.value,r:5,fill:'#e8b400','fill-opacity':'0.9'}),
          h('circle',{cx:C,cy:C,r:3,fill:'#e8b400'}),
        ]),
        ...(mode.value==='hours'?Array.from({length:12},(_,i)=>{const n=i+1,sel=selH.value===n;return h('div',{class:`absolute w-7 h-7 flex items-center justify-center rounded-full font-cinzel text-xs pointer-events-none ${sel?'text-yellow-300 font-bold':'text-gray-500'}`,style:numPos(n,12)},String(n))}):[]),
        ...(mode.value==='minutes'?ml.map((m,i)=>{const pos=numPos(i===0?12:i,12),sel=Math.round(selM.value/5)*5===m;return h('div',{class:`absolute w-7 h-7 flex items-center justify-center rounded-full font-cinzel text-xs pointer-events-none ${sel?'text-yellow-300 font-bold':'text-gray-500'}`,style:pos},String(m).padStart(2,'0'))}):[]),
      ])
      return h('div',{class:'relative'},[
        h('div',{class:'relative flex items-center'},[
          h('input',{type:'text',value:display.value,readOnly:true,class:`w-full bg-white/5 border ${isOpen.value?a.border:'border-white/10'} rounded-xl px-4 py-2.5 pr-10 font-garamond text-sm ${a.text} cursor-pointer focus:outline-none transition-colors`,onClick:()=>isOpen.value?isOpen.value=false:parseAndOpen()}),
          h('button',{type:'button',class:`absolute right-3 ${a.text} opacity-60 hover:opacity-100`,onClick:()=>isOpen.value?isOpen.value=false:parseAndOpen()},
            h('svg',{width:'15',height:'15',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.5','stroke-linecap':'round'},[h('circle',{cx:'12',cy:'12',r:'10'}),h('path',{d:'M12 6v6l4 2'})])),
        ]),
        isOpen.value&&h('div',{class:`absolute left-0 right-0 bottom-full mb-2 bg-[#0e0a1a] border ${a.border} rounded-2xl p-4 shadow-2xl z-50`},[
          h('p',{class:'font-cinzel text-xs text-center tracking-widest uppercase mb-2 text-gray-600'},mode.value==='hours'?'Select Hour':'Select Minute'),
          h('div',{class:'flex items-center justify-center gap-1 font-cinzel text-xl mb-3'},[
            h('span',{class:`px-2 py-0.5 rounded cursor-pointer ${mode.value==='hours'?'text-yellow-300 bg-yellow-500/15':'text-gray-500 hover:text-yellow-400'}`,onClick:()=>mode.value='hours'},String(selH.value).padStart(2,'0')),
            h('span',{class:'text-gray-600'},':'),
            h('span',{class:`px-2 py-0.5 rounded cursor-pointer ${mode.value==='minutes'?'text-yellow-300 bg-yellow-500/15':'text-gray-500 hover:text-yellow-400'}`,onClick:()=>mode.value='minutes'},String(selM.value).padStart(2,'0')),
          ]),
          face,
          h('div',{class:'flex gap-2 mt-3'},[
            h('button',{type:'button',class:`flex-1 py-1.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all ${!isPM.value?`${a.selBg} text-white`:'bg-white/5 text-gray-500 hover:bg-white/10'}`,onClick:()=>isPM.value=false},'AM'),
            h('button',{type:'button',class:`flex-1 py-1.5 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all ${isPM.value?`${a.selBg} text-white`:'bg-white/5 text-gray-500 hover:bg-white/10'}`,onClick:()=>isPM.value=true},'PM'),
          ]),
          h('button',{type:'button',class:'w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 font-cinzel text-black text-xs tracking-widest uppercase font-bold transition-all',onClick:confirm},'Confirm'),
        ]),
      ])
    }
  }
})

// ─── LocationSearch ───────────────────────────────────────────────────────────
interface NomResult { display_name:string; lat:string; lon:string }
const MilanLocationSearch = defineComponent({
  name:'MilanLocationSearch', props:{ accent:{type:String,default:'blue'} }, emits:['select'],
  setup(props,{emit}) {
    const query=ref(''),sugg=ref<NomResult[]>([]),loading=ref(false),sel=ref('')
    let timer:ReturnType<typeof setTimeout>|null=null
    const ac=computed(()=>AC[props.accent]??AC['blue']!)
    async function search(q:string){if(q.length<2){sugg.value=[];return}loading.value=true;try{const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6`,{headers:{'Accept-Language':'en'}});sugg.value=await r.json() as NomResult[]}catch{sugg.value=[]}finally{loading.value=false}}
    function onInput(e:Event){query.value=(e.target as HTMLInputElement).value;sel.value='';if(timer)clearTimeout(timer);timer=setTimeout(()=>search(query.value),400)}
    function pick(s:NomResult){const parts=s.display_name.split(',').map((p:string)=>p.trim());const short=parts.length>=2?`${parts[0]}, ${parts[parts.length-1]}`:s.display_name;sel.value=short;query.value=short;sugg.value=[];emit('select',short)}
    function clear(){query.value='';sel.value='';sugg.value=[];emit('select','')}
    return ()=>{
      const a=ac.value
      return h('div',{class:'relative'},[
        h('div',{class:'relative flex items-center'},[
          h('input',{type:'text',value:query.value,placeholder:'Search city, e.g. Kolkata',class:`w-full bg-white/5 border ${sel.value?a.border:'border-white/10'} rounded-xl pl-4 pr-9 py-2.5 font-garamond text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors`,onInput}),
          loading.value?h('span',{class:'absolute right-3 text-gray-600 text-xs animate-spin'},'⟳'):sel.value?h('button',{type:'button',class:'absolute right-3 text-gray-600 hover:text-gray-300',onClick:clear},h('svg',{width:'12',height:'12',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'2'},[h('line',{x1:'18',y1:'6',x2:'6',y2:'18'}),h('line',{x1:'6',y1:'6',x2:'18',y2:'18'})])):h('span',{class:`absolute right-3 ${a.text} opacity-60`},h('svg',{width:'14',height:'14',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.5'},[h('circle',{cx:'11',cy:'11',r:'8'}),h('path',{d:'M21 21l-4.35-4.35'})])),
        ]),
        sugg.value.length>0&&h('div',{class:`absolute z-50 mt-1 w-full rounded-xl border ${a.border} ${a.bg} backdrop-blur-md overflow-hidden shadow-2xl`},
          sugg.value.map((s,i)=>{const pts=s.display_name.split(',').map((p:string)=>p.trim());return h('button',{key:i,type:'button',class:`w-full text-left px-4 py-2.5 border-b border-white/5 last:border-0 ${a.hover} transition-colors`,onClick:()=>pick(s)},[h('div',{class:'font-garamond text-sm text-gray-200'},pts[0]??''),h('div',{class:'font-garamond text-xs text-gray-600 truncate'},pts.slice(1,4).join(', '))])})),
      ])
    }
  }
})

// ─── Form state ───────────────────────────────────────────────────────────────
interface Person { name:string; dob:string; tob:string; pob:string }
const p1=reactive<Person>({name:'',dob:'',tob:'12:00',pob:''})
const p2=reactive<Person>({name:'',dob:'',tob:'12:00',pob:''})
const formError=ref(''),view=ref<'form'|'loading'|'result'>('form'),result=ref<ReturnType<typeof computeMilan>|null>(null)
function reset(){view.value='form';result.value=null;formError.value=''}
function calculate(){if(!p1.dob||!p2.dob){formError.value='Please select Date of Birth for both.';return}formError.value='';view.value='loading';setTimeout(()=>{result.value=computeMilan(p1,p2);view.value='result'},2400)}

// ─── Astronomy (accurate) ─────────────────────────────────────────────────────
function toJD(date: Date): number {
  const y=date.getUTCFullYear(),mo=date.getUTCMonth()+1,d=date.getUTCDate()
  const h=date.getUTCHours()+date.getUTCMinutes()/60
  let yr=y,m=mo; if(m<=2){yr--;m+=12}
  const A=Math.floor(yr/100),B=2-A+Math.floor(A/4)
  return Math.floor(365.25*(yr+4716))+Math.floor(30.6001*(m+1))+d+h/24+B-1524.5
}
function norm(d:number){return((d%360)+360)%360}
function getMoonLon(jd:number):number {
  const T=(jd-2451545.0)/36525
  const Lp=norm(218.3164477+481267.88123421*T-0.0015786*T*T)
  const D=norm(297.8501921+445267.1114034*T),M=norm(357.5291092+35999.0502909*T)
  const Mp=norm(134.9633964+477198.8675055*T+0.0087414*T*T),F=norm(93.2720950+483202.0175233*T)
  const Dr=D*Math.PI/180,Mr=M*Math.PI/180,Mpr=Mp*Math.PI/180,E=1-0.002516*T
  const dL=6288774*Math.sin(Mpr)+1274027*Math.sin(2*Dr-Mpr)+658314*Math.sin(2*Dr)
    +213618*Math.sin(2*Mpr)-185116*E*Math.sin(Mr)-114332*Math.sin(2*F*Math.PI/180)
    +58793*Math.sin(2*Dr-2*Mpr)+57066*E*Math.sin(2*Dr-Mr-Mpr)+53322*Math.sin(2*Dr+Mpr)
    +45758*E*Math.sin(2*Dr-Mr)-40923*Math.sin(Mr-Mpr)-34720*Math.sin(Dr)-30383*Math.sin(Mr+Mpr)
    +15327*Math.sin(2*Dr-2*F*Math.PI/180)+10980*Math.sin(Mpr-2*F*Math.PI/180)+10675*Math.sin(4*Dr-Mpr)
  const omega=125.04452-1934.136261*T
  return norm(Lp+dL/1000000-17.20/3600*Math.sin(omega*Math.PI/180))
}
function getLahiri(jd:number){const T=(jd-2451545.0)/36525;return 23.85472+1.396042*T-0.000308*T*T}
function getSidMoon(jd:number){return norm(getMoonLon(jd)-getLahiri(jd))}
function getMarsLon(jd:number){
  const T=(jd-2451545.0)/36525
  const L=norm(355.433+19141.696*T),M=norm(19.387+19140.302*T)*Math.PI/180
  return norm(L+10.691*Math.sin(M)+0.623*Math.sin(2*M)-getLahiri(jd))
}

// ─── Vedic tables ─────────────────────────────────────────────────────────────
const NK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
const RS=['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const NADI=[0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2]
const NN=['Aadi (Vata)','Madhya (Pitta)','Antya (Kapha)']
const GANA=[0,2,1,0,1,2,0,1,2,0,1,0,0,2,0,1,0,2,2,2,0,0,1,2,1,0,0]
const GN=['Deva','Manushya','Rakshasa']
const YONI=[0,13,7,3,11,5,8,1,9,2,10,10,4,6,4,6,12,12,11,11,8,7,0,2,1,9,3]
const YN=['Horse','Elephant','Sheep','Snake','Dog','Cat','Rat','Cow','Buffalo','Tiger','Hare','Monkey','Mongoose','Lion']
const YE:([number,number])[]= [[0,12],[1,12],[3,8],[5,9],[6,7],[10,11]]
const VARNA=[0,3,2,1,0,3,2,1,0,3,2,1,2,0,1,0,1,2,3,3,3,0,3,1,2,0,0]
const VR=[0,0,1,3,0,1,1,4,1,0,1,3]
const SL=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']
const PF:Record<string,string[]>={Sun:['Moon','Mars','Jupiter'],Moon:['Sun','Mercury'],Mars:['Sun','Moon','Jupiter'],Mercury:['Sun','Venus'],Jupiter:['Sun','Moon','Mars'],Venus:['Mercury','Saturn'],Saturn:['Mercury','Venus']}
const PN2:Record<string,string[]>={Sun:['Mercury'],Moon:['Mars','Jupiter','Venus','Saturn'],Mars:['Venus','Saturn'],Mercury:['Mars','Jupiter','Saturn'],Jupiter:['Saturn'],Venus:['Mars','Jupiter'],Saturn:['Jupiter']}
function gr(a:string,b:string):'friend'|'neutral'|'enemy'{if(PF[a]?.includes(b))return 'friend';if(PN2[a]?.includes(b))return 'neutral';return 'enemy'}
function bh(r1:number,r2:number):number{const f=((r2-r1+12)%12)+1,b=((r1-r2+12)%12)+1;if((f===6&&b===8)||(f===8&&b===6)||(f===5&&b===9)||(f===9&&b===5))return 0;return 7}
function ta(n1:number,n2:number):number{return([1,3,5,7].includes(((n2-n1+27)%27%9)+1)?1.5:0)+([1,3,5,7].includes(((n1-n2+27)%27%9)+1)?1.5:0)}
function md(ml:number,moon:number):boolean{return[1,4,7,8,12].includes(((Math.floor((ml%360)/30)-Math.floor((moon%360)/30)+12)%12)+1)}

// SVG icons
const mkSvg=(paths:string,color:string,extra?:ReturnType<typeof h>[])=>h('svg',{width:'22',height:'22',viewBox:'0 0 24 24',fill:'none',stroke:color,'stroke-width':'1.5','stroke-linecap':'round','stroke-linejoin':'round'},[...paths.split('|').map(d=>h('path',{d})),...(extra||[])])
const ICONS:Record<string,()=>ReturnType<typeof h>>={
  Love:()=>mkSvg('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z','#f472b6'),
  Finance:()=>h('svg',{width:'22',height:'22',viewBox:'0 0 24 24',fill:'none',stroke:'#fbbf24','stroke-width':'1.5','stroke-linecap':'round'},[h('line',{x1:'12',y1:'1',x2:'12',y2:'23'}),h('path',{d:'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'})]),
  Health:()=>mkSvg('M22 12h-4l-3 9L9 3l-3 9H2','#34d399'),
  Family:()=>mkSvg('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10','#60a5fa'),
  Spiritual:()=>h('svg',{width:'22',height:'22',viewBox:'0 0 24 24',fill:'none',stroke:'#a78bfa','stroke-width':'1.5'},[h('circle',{cx:'12',cy:'12',r:'10'}),h('path',{d:'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'}),h('line',{x1:'2',y1:'12',x2:'22',y2:'12'})]),
  Progeny:()=>mkSvg('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M23 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75','#fb923c'),
}

function computeMilan(p1:Person,p2:Person){
  function pd(dob:string,tob:string){const[h,m]=(tob||'12:00').split(':').map(Number) as [number,number];return new Date(`${dob}T${String(h).padStart(2,'0')}:${String(m??0).padStart(2,'0')}:00+05:30`)}
  const d1=pd(p1.dob,p1.tob),d2=pd(p2.dob,p2.tob)
  const jd1=toJD(d1),jd2=toJD(d2)
  const m1=getSidMoon(jd1),m2=getSidMoon(jd2)
  const ma1=getMarsLon(jd1),ma2=getMarsLon(jd2)
  const n1=Math.floor(m1/(360/27))%27,n2=Math.floor(m2/(360/27))%27
  const r1=Math.floor(m1/30)%12,r2=Math.floor(m2/30)%12
  const v1=VARNA[n1]??0,v2=VARNA[n2]??0;const vS=v1<=v2?1:0
  const va1=VR[r1]??0,va2=VR[r2]??0;const vaS=va1===va2?2:Math.abs(va1-va2)===1?1:0
  const tS=Math.round(ta(n1,n2))
  const y1=YONI[n1]??0,y2=YONI[n2]??0;const ie=YE.some(([a,b])=>(y1===a&&y2===b)||(y1===b&&y2===a));const yS=y1===y2?4:ie?0:2
  const l1=SL[r1]??'Sun',l2=SL[r2]??'Sun'
  const gmap:Record<string,Record<string,number>>={friend:{friend:5,neutral:4,enemy:3},neutral:{friend:4,neutral:3,enemy:2},enemy:{friend:2,neutral:1,enemy:0}}
  const gS=gmap[gr(l1,l2)]?.[gr(l2,l1)]??0
  const g1=GANA[n1]??0,g2=GANA[n2]??0;const gnS=g1===g2?6:(g1===0&&g2===1)||(g1===1&&g2===0)?5:0
  const bhS=bh(r1,r2)
  const nd1=NADI[n1]??0,nd2=NADI[n2]??0;const nS=nd1!==nd2?8:0
  const total=vS+vaS+tS+yS+gS+gnS+bhS+nS
  const md1=md(ma1,m1),md2=md(ma2,m2)
  const mSt=!md1&&!md2?'None':md1&&md2?'Cancelled':'Present'
  const nDo=nd1===nd2;const nCan=nDo&&(r1!==r2||n1===n2);const nSt=!nDo?'None':nCan?'Cancelled':'Present'
  const pct=total/36
  const vd=pct>=0.83?{label:'Uttam — Excellent',stars:5,summary:'A rare and auspicious union. The stars align with remarkable harmony.',textClass:'text-emerald-400',bgClass:'bg-gradient-to-br from-emerald-950/40 via-black/50 to-transparent',borderClass:'border-emerald-500/25',badgeClass:'bg-emerald-500/15 text-emerald-300',divideClass:'border-emerald-500/15'}
    :pct>=0.67?{label:'Uttam-Madhyam — Very Good',stars:4,summary:'Strong compatibility with excellent foundations.',textClass:'text-yellow-400',bgClass:'bg-gradient-to-br from-yellow-950/40 via-black/50 to-transparent',borderClass:'border-yellow-500/25',badgeClass:'bg-yellow-500/15 text-yellow-300',divideClass:'border-yellow-500/15'}
    :pct>=0.5?{label:'Madhyam — Good',stars:3,summary:'Moderate compatibility. This union can flourish with understanding.',textClass:'text-amber-400',bgClass:'bg-gradient-to-br from-amber-950/40 via-black/50 to-transparent',borderClass:'border-amber-500/25',badgeClass:'bg-amber-500/15 text-amber-300',divideClass:'border-amber-500/15'}
    :pct>=0.33?{label:'Adhama — Needs Care',stars:2,summary:'Several areas of incompatibility exist. Significant effort required.',textClass:'text-orange-400',bgClass:'bg-gradient-to-br from-orange-950/40 via-black/50 to-transparent',borderClass:'border-orange-500/25',badgeClass:'bg-orange-500/15 text-orange-300',divideClass:'border-orange-500/15'}
    :{label:'Atyanta Adhama — Challenging',stars:1,summary:'Significant cosmic incompatibility. Remedial rituals strongly recommended.',textClass:'text-red-400',bgClass:'bg-gradient-to-br from-red-950/40 via-black/50 to-transparent',borderClass:'border-red-500/25',badgeClass:'bg-red-500/15 text-red-300',divideClass:'border-red-500/15'}
  const gunas=[
    {name:'Varna',sanskrit:'वर्ण',max:1,score:vS,aspect:'Spiritual compatibility',description:vS===1?'Spiritual temperaments are compatible.':'Different spiritual temperaments.',textClass:'text-violet-400',bgClass:'bg-violet-950/20',borderClass:'border-violet-500/20',barClass:'bg-gradient-to-r from-violet-500/60 to-violet-400'},
    {name:'Vashya',sanskrit:'वश्य',max:2,score:vaS,aspect:'Mutual attraction',description:vaS===2?'Strong natural attraction.':vaS===1?'Moderate attraction.':'Different energy types.',textClass:'text-blue-400',bgClass:'bg-blue-950/20',borderClass:'border-blue-500/20',barClass:'bg-gradient-to-r from-blue-500/60 to-blue-400'},
    {name:'Tara',sanskrit:'तारा',max:3,score:tS,aspect:'Birth star compatibility',description:tS===3?'Highly auspicious star positions.':tS>0?'Moderate compatibility.':'Challenging positions.',textClass:'text-cyan-400',bgClass:'bg-cyan-950/20',borderClass:'border-cyan-500/20',barClass:'bg-gradient-to-r from-cyan-500/60 to-cyan-400'},
    {name:'Yoni',sanskrit:'योनि',max:4,score:yS,aspect:'Physical compatibility',description:`${YN[y1]??'Horse'} & ${YN[y2]??'Elephant'}. `+(yS===4?'Same yoni.':yS===2?'Friendly yoni.':'Opposing yoni.'),textClass:'text-pink-400',bgClass:'bg-pink-950/20',borderClass:'border-pink-500/20',barClass:'bg-gradient-to-r from-pink-500/60 to-pink-400'},
    {name:'Graha Maitri',sanskrit:'ग्रह मैत्री',max:5,score:gS,aspect:'Mental compatibility',description:`${l1} & ${l2}. `+(gS>=4?'Lords are friends.':gS>=2?'Neutral.':'Not friendly.'),textClass:'text-amber-400',bgClass:'bg-amber-950/20',borderClass:'border-amber-500/20',barClass:'bg-gradient-to-r from-amber-500/60 to-amber-400'},
    {name:'Gana',sanskrit:'गण',max:6,score:gnS,aspect:'Nature & temperament',description:`${GN[g1]??'Deva'} & ${GN[g2]??'Deva'}. `+(gnS===6?'Same Gana.':gnS===5?'Compatible.':'Different Ganas.'),textClass:'text-emerald-400',bgClass:'bg-emerald-950/20',borderClass:'border-emerald-500/20',barClass:'bg-gradient-to-r from-emerald-500/60 to-emerald-400'},
    {name:'Bhakoot',sanskrit:'भकूट',max:7,score:bhS,aspect:'Emotional & financial',description:bhS===7?'Auspicious sign placement.':'Bhakoot Dosha present.',textClass:'text-sky-400',bgClass:'bg-sky-950/20',borderClass:'border-sky-500/20',barClass:'bg-gradient-to-r from-sky-500/60 to-sky-400'},
    {name:'Nadi',sanskrit:'नाड़ी',max:8,score:nS,aspect:'Health & progeny',description:`${NN[nd1]??'Aadi'} & ${NN[nd2]??'Madhya'}. `+(nS===8?'Excellent.':nCan?'Cancelled.':'Nadi Dosha present.'),textClass:'text-rose-400',bgClass:'bg-rose-950/20',borderClass:'border-rose-500/20',barClass:'bg-gradient-to-r from-rose-500/60 to-rose-400'},
  ]
  const dc=(s:string)=>({textClass:s==='Present'?'text-red-400':s==='Cancelled'?'text-amber-400':'text-emerald-400',bgClass:s==='Present'?'bg-red-950/20':s==='Cancelled'?'bg-amber-950/20':'bg-emerald-950/20',borderClass:s==='Present'?'border-red-500/20':s==='Cancelled'?'border-amber-500/20':'border-emerald-500/20',iconBgClass:s==='Present'?'bg-red-500/10':s==='Cancelled'?'bg-amber-500/10':'bg-emerald-500/10',badgeClass:s==='Present'?'bg-red-500/15 text-red-300':s==='Cancelled'?'bg-amber-500/15 text-amber-300':'bg-emerald-500/15 text-emerald-300'})
  const mangal={status:mSt,...dc(mSt),detail:mSt==='None'?`Neither ${p1.name||'Boy'} nor ${p2.name||'Girl'} has Mangal Dosha.`:mSt==='Cancelled'?'Both have Mangal Dosha — effectively cancelled.':`${md1?(p1.name||'Boy'):(p2.name||'Girl')} has Mangal Dosha. Remedial measures recommended.`}
  const nadi={status:nSt,...dc(nSt),detail:nSt==='None'?`${NN[nd1]??'Aadi'} and ${NN[nd2]??'Madhya'} Nadis complement each other.`:nSt==='Cancelled'?'Nadi Dosha cancelled.':`Both share ${NN[nd1]??'the same'} Nadi. Remedies recommended.`}
  const areas=[
    {label:'Love',     score:Math.min(10,Math.round((yS/4+gS/5)*5)),        borderClass:'border-pink-500/20',   bgClass:'bg-pink-950/15',   textClass:'text-pink-400',   barClass:'bg-pink-400',   icon:ICONS['Love']},
    {label:'Finance',  score:Math.min(10,Math.round((bhS/7+vS)*5)),          borderClass:'border-yellow-500/20', bgClass:'bg-yellow-950/15', textClass:'text-yellow-400', barClass:'bg-yellow-400', icon:ICONS['Finance']},
    {label:'Health',   score:Math.min(10,Math.round((nS/8+tS/3)*5)),         borderClass:'border-emerald-500/20',bgClass:'bg-emerald-950/15',textClass:'text-emerald-400',barClass:'bg-emerald-400',icon:ICONS['Health']},
    {label:'Family',   score:Math.min(10,Math.round((gnS/6+vaS/2)*5)),       borderClass:'border-blue-500/20',   bgClass:'bg-blue-950/15',   textClass:'text-blue-400',   barClass:'bg-blue-400',   icon:ICONS['Family']},
    {label:'Spiritual',score:Math.min(10,Math.round((vS+gS/5+gnS/6)*3.33)), borderClass:'border-violet-500/20', bgClass:'bg-violet-950/15', textClass:'text-violet-400', barClass:'bg-violet-400', icon:ICONS['Spiritual']},
    {label:'Progeny',  score:Math.min(10,Math.round((nS/8+yS/4)*5)),         borderClass:'border-amber-500/20',  bgClass:'bg-amber-950/15',  textClass:'text-amber-400',  barClass:'bg-amber-400',  icon:ICONS['Progeny']},
  ]
  const gp=['Two souls, shaped by different stars, find in each other what the cosmos intended.','The stars reveal tendencies, not destinies. Your love is the alchemy that transforms cosmic patterns.','Where compatibility runs deep, cherish it with gratitude.','Marriage is the creation of something greater than either alone.','The cosmos has brought you to this moment. The heart\'s wisdom runs deeper than numbers.']
  return{p1Name:p1.name||'Boy',p2Name:p2.name||'Girl',p1Nakshatra:NK[n1]??'Ashwini',p2Nakshatra:NK[n2]??'Ashwini',p1Rashi:RS[r1]??'Mesha',p2Rashi:RS[r2]??'Mesha',totalScore:total,verdict:vd,gunas,mangal,nadi,areas,guidance:gp[(n1+n2+total)%gp.length]??gp[0]!}
}
</script>

<style>
@keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
</style>