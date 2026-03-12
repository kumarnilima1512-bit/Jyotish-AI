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
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
          <div>
            <h1 class="font-cinzel text-xl text-yellow-400 tracking-[0.25em] uppercase group-hover:text-yellow-300 transition-colors">ज्योतिष · Jyotish</h1>
            <p class="font-garamond text-xs text-gray-600 mt-0.5 tracking-widest">Vedic Astrology</p>
          </div>
        </NuxtLink>
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-rose-400/60">
          <span>♡</span><span>Kundli Milan</span><span class="text-rose-600/20">·</span><span>Compatibility</span>
        </div>
      </div>
    </header>

    <div class="relative z-10 text-center pt-10 pb-8 px-4">
      <p class="font-cinzel text-xs tracking-[0.5em] uppercase mb-2 text-rose-400/40">कुंडली मिलान</p>
      <h2 class="font-cinzel text-4xl md:text-5xl tracking-[0.15em] uppercase mb-3 text-rose-300/90 drop-shadow-[0_0_40px_rgba(251,113,133,0.2)]">Kundli Milan</h2>
      <p class="font-garamond text-gray-500 text-base">Enter birth details to reveal cosmic compatibility</p>
    </div>

    <!-- FORM -->
    <div v-if="view === 'form'" class="relative z-10 max-w-5xl mx-auto px-4 pb-20">
      <div v-if="formError" class="mb-6 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300">
        <span class="shrink-0">⚠️</span>
        <p class="font-garamond text-sm">{{ formError }}</p>
        <button @click="formError=''" class="ml-auto text-red-400 hover:text-red-200">✕</button>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-blue-500/20 bg-blue-950/10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-lg">♂</div>
            <div>
              <h3 class="font-cinzel text-sm tracking-widest uppercase text-blue-300">Boy's Details</h3>
              <p class="font-garamond text-xs text-gray-600">Groom / Partner</p>
            </div>
          </div>
          <div class="space-y-5">
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Name <span class="text-gray-700">(optional)</span></label>
              <input v-model="p1.name" type="text" placeholder="e.g. Arjun" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-garamond text-gray-200 placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-colors"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Date of Birth</label>
              <DatePicker :value="p1.dob" accent="blue" @change="v => p1.dob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Time of Birth</label>
              <TimePicker :value="p1.tob" accent="blue" @change="v => p1.tob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Place of Birth</label>
              <LocationSearch accent="blue" @select="loc => p1.pob = loc"/>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg">♀</div>
            <div>
              <h3 class="font-cinzel text-sm tracking-widest uppercase text-rose-300">Girl's Details</h3>
              <p class="font-garamond text-xs text-gray-600">Bride / Partner</p>
            </div>
          </div>
          <div class="space-y-5">
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Name <span class="text-gray-700">(optional)</span></label>
              <input v-model="p2.name" type="text" placeholder="e.g. Priya" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-garamond text-gray-200 placeholder-gray-700 focus:outline-none focus:border-rose-500/50 transition-colors"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Date of Birth</label>
              <DatePicker :value="p2.dob" accent="rose" @change="v => p2.dob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Time of Birth</label>
              <TimePicker :value="p2.tob" accent="rose" @change="v => p2.tob = v"/>
            </div>
            <div>
              <label class="font-cinzel text-xs tracking-widest uppercase text-gray-500 block mb-1.5">Place of Birth</label>
              <LocationSearch accent="rose" @select="loc => p2.pob = loc"/>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center">
        <button type="button" @click="calculate" class="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/30 hover:border-rose-400/50 font-cinzel text-sm tracking-[0.3em] uppercase text-rose-300 transition-all duration-300 hover:scale-[1.02]">
          <span>♡</span><span>Calculate Compatibility</span><span>♡</span>
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
            <span class="text-3xl">♡</span>
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
            <div class="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl text-blue-400 mb-2 mx-auto">♂</div>
            <p class="font-cinzel text-sm tracking-wider text-blue-300">{{ result.p1Name }}</p>
            <p class="font-garamond text-xs text-gray-600 mt-0.5">{{ result.p1Nakshatra }}</p>
            <p class="font-garamond text-xs text-gray-700">{{ result.p1Rashi }}</p>
          </div>
          <div class="flex-1 text-center">
            <div :class="['font-cinzel text-6xl md:text-7xl font-bold mb-1', result.verdict.textClass]">{{ result.totalScore }}</div>
            <div class="font-cinzel text-sm tracking-widest uppercase text-gray-500 mb-2">out of 36</div>
            <div class="flex gap-1 justify-center mb-3">
              <div v-for="i in 5" :key="i" :class="['w-3 h-3 rounded-full', i <= result.verdict.stars ? result.verdict.dotClass : 'bg-white/10']"/>
            </div>
            <div :class="['inline-block px-4 py-1.5 rounded-full border font-cinzel text-xs tracking-[0.3em] uppercase', result.verdict.borderClass, result.verdict.badgeClass]">{{ result.verdict.label }}</div>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-2xl text-rose-400 mb-2 mx-auto">♀</div>
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
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg border', result.mangal.iconBgClass, result.mangal.borderClass]">♂</div>
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
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg border', result.nadi.iconBgClass, result.nadi.borderClass]">🜄</div>
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
          <div class="text-2xl mb-2">{{ area.emoji }}</div>
          <div :class="['font-cinzel text-xs tracking-widest uppercase mb-1', area.textClass]">{{ area.label }}</div>
          <div :class="['font-cinzel text-2xl font-bold mb-1', area.textClass]">{{ area.score }}</div>
          <div class="h-1 rounded-full overflow-hidden bg-white/5">
            <div :class="['h-full rounded-full', area.barClass]" :style="{ width:`${area.score*10}%` }"/>
          </div>
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
const stars: Star[] = Array.from({length:80},(_,i)=>({
  id:i, x:Math.random()*100, y:Math.random()*100,
  size:Math.random()*1.8+0.4, opacity:Math.random()*0.4+0.06,
  duration:Math.random()*5+2, delay:Math.random()*6,
}))
const starStyle = (s:Star) => ({ left:s.x+'%', top:s.y+'%', width:s.size+'px', height:s.size+'px', opacity:s.opacity, animation:`twinkle ${s.duration}s ease-in-out infinite ${s.delay}s` })

const AC: Record<string,{border:string;bg:string;text:string;hover:string;selBg:string}> = {
  blue: { border:'border-blue-500/50', bg:'bg-blue-950/40', text:'text-blue-300', hover:'hover:bg-blue-500/20', selBg:'bg-blue-500' },
  rose: { border:'border-rose-500/50', bg:'bg-rose-950/40', text:'text-rose-300', hover:'hover:bg-rose-500/20', selBg:'bg-rose-500' },
}
const MONTHS      = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── DatePicker: collapsed by default, arrow opens it ──────────────────────────
const DatePicker = defineComponent({
  name:'DatePicker',
  props:{ value:{type:String,default:''}, accent:{type:String,default:'blue'} },
  emits:['change'],
  setup(props,{emit}) {
    const now=new Date(); const parsed=props.value?new Date(props.value):null
    const selDay=ref(parsed?parsed.getDate():0)
    const selMonth=ref(parsed?parsed.getMonth():now.getMonth())
    const selYear=ref(parsed?parsed.getFullYear():now.getFullYear())
    const mode=ref<'day'|'month'|'year'>('day')
    const isOpen=ref(false)
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
        for(let d=1;d<=dim.value;d++){const sel=selDay.value===d; cells.push(h('button',{type:'button',class:`aspect-square rounded-lg font-garamond text-sm transition-all ${sel?`${a.selBg} text-white font-bold`:`text-gray-300 ${a.hover} hover:text-white`}`,onClick:()=>sd(d)},String(d)))}
      }
      return h('div',{class:'relative'},[
        h('button',{type:'button',class:`w-full flex items-center justify-between bg-white/5 border ${isOpen.value?a.border:'border-white/10'} rounded-xl px-4 py-2.5 font-garamond text-sm transition-all ${selDay.value?'text-gray-200':'text-gray-600'} focus:outline-none`,onClick:()=>{isOpen.value=!isOpen.value;if(isOpen.value)mode.value='day'}},[
          h('span',display.value),
          h('span',{class:`${a.text} text-xs transition-transform duration-200 inline-block ${isOpen.value?'rotate-180':''}`},'▾'),
        ]),
        isOpen.value&&h('div',{class:`mt-2 rounded-2xl border ${a.border} ${a.bg} backdrop-blur-sm p-3`},[
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

// ── TimePicker: collapsed by default ─────────────────────────────────────────
const TimePicker = defineComponent({
  name:'TimePicker',
  props:{ value:{type:String,default:''}, accent:{type:String,default:'blue'} },
  emits:['change'],
  setup(props,{emit}) {
    const p=props.value?props.value.split(':').map(Number):[12,0]
    const r=p[0]??12
    const hour=ref(r===0?12:r>12?r-12:r)
    const minute=ref(p[1]??0)
    const ampm=ref<'AM'|'PM'>(r<12?'AM':'PM')
    const isOpen=ref(false)
    const ac=computed(()=>AC[props.accent]??AC['blue']!)
    const display=computed(()=>`${String(hour.value).padStart(2,'0')}:${String(minute.value).padStart(2,'0')} ${ampm.value}`)
    function e24(){let h=hour.value%12;if(ampm.value==='PM')h+=12;emit('change',`${String(h).padStart(2,'0')}:${String(minute.value).padStart(2,'0')}`)}
    return ()=>{
      const a=ac.value
      const hrs=Array.from({length:12},(_,i)=>i+1)
      const mins=Array.from({length:12},(_,i)=>i*5)
      return h('div',{class:'relative'},[
        h('button',{type:'button',class:`w-full flex items-center justify-between bg-white/5 border ${isOpen.value?a.border:'border-white/10'} rounded-xl px-4 py-2.5 font-garamond text-sm transition-all ${a.text} focus:outline-none`,onClick:()=>isOpen.value=!isOpen.value},[
          h('span',display.value),
          h('span',{class:`${a.text} text-xs transition-transform duration-200 inline-block ${isOpen.value?'rotate-180':''}`},'▾'),
        ]),
        isOpen.value&&h('div',{class:`mt-2 rounded-2xl border ${a.border} ${a.bg} p-3 space-y-3`},[
          h('div',{class:'flex gap-2'},[
            h('button',{type:'button',class:`flex-1 py-2 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all ${ampm.value==='AM'?`${a.selBg} text-white`:'bg-white/5 text-gray-500 hover:bg-white/10'}`,onClick:()=>{ampm.value='AM';e24()}},'AM'),
            h('button',{type:'button',class:`flex-1 py-2 rounded-xl font-cinzel text-xs tracking-widest uppercase transition-all ${ampm.value==='PM'?`${a.selBg} text-white`:'bg-white/5 text-gray-500 hover:bg-white/10'}`,onClick:()=>{ampm.value='PM';e24()}},'PM'),
          ]),
          h('div',{},[
            h('p',{class:'font-cinzel text-xs text-gray-700 tracking-widest uppercase mb-1.5'},'Hour'),
            h('div',{class:'grid grid-cols-6 gap-1'},hrs.map(hh=>h('button',{type:'button',class:`py-1.5 rounded-lg font-garamond text-sm transition-all ${hour.value===hh?`${a.selBg} text-white font-bold`:'text-gray-400 hover:bg-white/10 hover:text-white'}`,onClick:()=>{hour.value=hh;e24()}},String(hh)))),
          ]),
          h('div',{},[
            h('p',{class:'font-cinzel text-xs text-gray-700 tracking-widest uppercase mb-1.5'},'Minute'),
            h('div',{class:'grid grid-cols-6 gap-1'},mins.map(mm=>h('button',{type:'button',class:`py-1.5 rounded-lg font-garamond text-sm transition-all ${minute.value===mm?`${a.selBg} text-white font-bold`:'text-gray-400 hover:bg-white/10 hover:text-white'}`,onClick:()=>{minute.value=mm;e24()}},String(mm).padStart(2,'0')))),
          ]),
        ]),
      ])
    }
  }
})

// ── LocationSearch ────────────────────────────────────────────────────────────
interface NomResult { display_name:string; lat:string; lon:string }
const LocationSearch = defineComponent({
  name:'LocationSearch',
  props:{ accent:{type:String,default:'blue'} },
  emits:['select'],
  setup(props,{emit}) {
    const query=ref(''); const sugg=ref<NomResult[]>([]); const loading=ref(false); const sel=ref('')
    let timer:ReturnType<typeof setTimeout>|null=null
    const ac=computed(()=>AC[props.accent]??AC['blue']!)
    async function search(q:string){
      if(q.length<2){sugg.value=[];return}
      loading.value=true
      try{
        const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6`,{headers:{'Accept-Language':'en'}})
        sugg.value=await r.json() as NomResult[]
      }catch{sugg.value=[]}
      finally{loading.value=false}
    }
    function onInput(e:Event){
      query.value=(e.target as HTMLInputElement).value; sel.value=''
      if(timer)clearTimeout(timer); timer=setTimeout(()=>search(query.value),400)
    }
    function pick(s:NomResult){
      const parts=s.display_name.split(',').map((p:string)=>p.trim())
      const short=parts.length>=2?`${parts[0]}, ${parts[parts.length-1]}`:s.display_name
      sel.value=short; query.value=short; sugg.value=[]; emit('select',short)
    }
    function clear(){query.value='';sel.value='';sugg.value=[];emit('select','')}
    return ()=>{
      const a=ac.value
      return h('div',{class:'relative'},[
        h('div',{class:'relative flex items-center'},[
          h('input',{type:'text',value:query.value,placeholder:'Search city, e.g. Kolkata',class:`w-full bg-white/5 border ${sel.value?a.border:'border-white/10'} rounded-xl pl-4 pr-9 py-2.5 font-garamond text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors`,onInput}),
          loading.value?h('span',{class:'absolute right-3 text-gray-600 text-xs animate-spin'},'⟳')
            :sel.value?h('button',{type:'button',class:'absolute right-3 text-gray-600 hover:text-gray-300 text-xs',onClick:clear},'✕')
            :h('span',{class:`absolute right-3 ${a.text} text-xs`},'⌖'),
        ]),
        sugg.value.length>0&&h('div',{class:`absolute z-50 mt-1 w-full rounded-xl border ${a.border} ${a.bg} backdrop-blur-md overflow-hidden shadow-2xl`},
          sugg.value.map((s,i)=>{
            const pts=s.display_name.split(',').map((p:string)=>p.trim())
            return h('button',{key:i,type:'button',class:`w-full text-left px-4 py-2.5 border-b border-white/5 last:border-0 ${a.hover} transition-colors`,onClick:()=>pick(s)},[
              h('div',{class:'font-garamond text-sm text-gray-200'},pts[0]??''),
              h('div',{class:'font-garamond text-xs text-gray-600 truncate'},pts.slice(1,4).join(', ')),
            ])
          })
        ),
      ])
    }
  }
})

// ── Form state ────────────────────────────────────────────────────────────────
interface Person { name:string; dob:string; tob:string; pob:string }
const p1=reactive<Person>({name:'',dob:'',tob:'12:00',pob:''})
const p2=reactive<Person>({name:'',dob:'',tob:'12:00',pob:''})
const formError=ref(''); const view=ref<'form'|'loading'|'result'>('form')
const result=ref<ReturnType<typeof computeMilan>|null>(null)
function reset(){view.value='form';result.value=null;formError.value=''}
function calculate(){
  if(!p1.dob||!p2.dob){formError.value='Please select Date of Birth for both.';return}
  formError.value=''; view.value='loading'
  setTimeout(()=>{result.value=computeMilan(p1,p2);view.value='result'},2400)
}

// ── Astronomy ─────────────────────────────────────────────────────────────────
function dateToJD(d:Date):number{const y=d.getUTCFullYear(),mo=d.getUTCMonth()+1,day=d.getUTCDate(),A=Math.floor((14-mo)/12),Y=y+4800-A,M=mo+12*A-3;return day+Math.floor((153*M+2)/5)+365*Y+Math.floor(Y/4)-Math.floor(Y/100)+Math.floor(Y/400)-32045}
function getMoonLon(jd:number):number{const n=jd-2451545.0,L=(218.316+13.176396*n)%360,M2=((134.963+13.064993*n)%360)*Math.PI/180,F=((93.272+13.229350*n)%360)*Math.PI/180;return ((L+6.289*Math.sin(M2)-1.274*Math.sin(2*F-M2)+0.658*Math.sin(2*F))%360+360)%360}
function getMarsLon(jd:number):number{const n=jd-2451545.0,a=23.85+(50.2564/3600)*(jd-2415020.0)/365.25;return (((355.433+0.52402*n)-a)%360+360)%360}
function sidMoon(jd:number):number{return((getMoonLon(jd)-(23.85+(50.2564/3600)*(jd-2415020.0)/365.25))%360+360)%360}

// ── Vedic tables ──────────────────────────────────────────────────────────────
const NK=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
const RS=['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const NADI=[0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2]
const NN=['Aadi (Vata)','Madhya (Pitta)','Antya (Kapha)']
const GANA=[0,2,1,0,1,2,0,1,2,0,1,0,0,2,0,1,0,2,2,2,0,0,1,2,1,0,0]
const GN=['Deva','Manushya','Rakshasa']
const YONI=[0,13,7,3,11,5,8,1,9,2,10,10,4,6,4,6,12,12,11,11,8,7,0,2,1,9,3]
const YN=['Horse','Elephant','Sheep','Snake','Dog','Cat','Rat','Cow','Buffalo','Tiger','Hare','Monkey','Mongoose','Lion']
const YE:([number,number])[] = [[0,12],[1,12],[3,8],[5,9],[6,7],[10,11]]
const VARNA=[0,3,2,1,0,3,2,1,0,3,2,1,2,0,1,0,1,2,3,3,3,0,3,1,2,0,0]
const VR=[0,0,1,3,0,1,1,4,1,0,1,3]
const SL=['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']
const PF:Record<string,string[]>={Sun:['Moon','Mars','Jupiter'],Moon:['Sun','Mercury'],Mars:['Sun','Moon','Jupiter'],Mercury:['Sun','Venus'],Jupiter:['Sun','Moon','Mars'],Venus:['Mercury','Saturn'],Saturn:['Mercury','Venus']}
const PN2:Record<string,string[]>={Sun:['Mercury'],Moon:['Mars','Jupiter','Venus','Saturn'],Mars:['Venus','Saturn'],Mercury:['Mars','Jupiter','Saturn'],Jupiter:['Saturn'],Venus:['Mars','Jupiter'],Saturn:['Jupiter']}
function gr(a:string,b:string):'friend'|'neutral'|'enemy'{if(PF[a]?.includes(b))return 'friend';if(PN2[a]?.includes(b))return 'neutral';return 'enemy'}
function bh(r1:number,r2:number):number{const f=((r2-r1+12)%12)+1,b=((r1-r2+12)%12)+1;if((f===6&&b===8)||(f===8&&b===6)||(f===5&&b===9)||(f===9&&b===5))return 0;return 7}
function ta(n1:number,n2:number):number{return([1,3,5,7].includes(((n2-n1+27)%27%9)+1)?1.5:0)+([1,3,5,7].includes(((n1-n2+27)%27%9)+1)?1.5:0)}
function md(ml:number,moon:number):boolean{return[1,4,7,8,12].includes(((Math.floor((ml%360)/30)-Math.floor((moon%360)/30)+12)%12)+1)}

function computeMilan(p1:Person,p2:Person){
  const parse=(dob:string,tob:string)=>{const [h,m]=(tob||'12:00').split(':').map(Number) as [number,number];return new Date(`${dob}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00+05:30`)}
  const d1=parse(p1.dob,p1.tob),d2=parse(p2.dob,p2.tob)
  const jd1=dateToJD(d1)+((d1.getUTCHours()+d1.getUTCMinutes()/60)/24)
  const jd2=dateToJD(d2)+((d2.getUTCHours()+d2.getUTCMinutes()/60)/24)
  const m1=sidMoon(jd1),m2=sidMoon(jd2),ma1=getMarsLon(jd1),ma2=getMarsLon(jd2)
  const n1=Math.floor(m1/(360/27)),n2=Math.floor(m2/(360/27))
  const r1=Math.floor(m1/30),r2=Math.floor(m2/30)
  const v1=VARNA[n1]??0,v2=VARNA[n2]??0; const vS=v1<=v2?1:0
  const va1=VR[r1]??0,va2=VR[r2]??0; const vaS=va1===va2?2:Math.abs(va1-va2)===1?1:0
  const tS=Math.round(ta(n1,n2))
  const y1=YONI[n1]??0,y2=YONI[n2]??0; const ie=YE.some(([a,b])=>(y1===a&&y2===b)||(y1===b&&y2===a)); const yS=y1===y2?4:ie?0:2
  const l1=SL[r1]??'Sun',l2=SL[r2]??'Sun'
  const gmap:Record<string,Record<string,number>>={friend:{friend:5,neutral:4,enemy:3},neutral:{friend:4,neutral:3,enemy:2},enemy:{friend:2,neutral:1,enemy:0}}
  const gS=gmap[gr(l1,l2)]?.[gr(l2,l1)]??0
  const g1=GANA[n1]??0,g2=GANA[n2]??0; const gnS=g1===g2?6:(g1===0&&g2===1)||(g1===1&&g2===0)?5:0
  const bhS=bh(r1,r2)
  const nd1=NADI[n1]??0,nd2=NADI[n2]??0; const nS=nd1!==nd2?8:0
  const total=vS+vaS+tS+yS+gS+gnS+bhS+nS
  const md1=md(ma1,m1),md2=md(ma2,m2)
  const mSt=!md1&&!md2?'None':md1&&md2?'Cancelled':'Present'
  const nDo=nd1===nd2; const nCan=nDo&&(r1!==r2||n1===n2); const nSt=!nDo?'None':nCan?'Cancelled':'Present'
  const pct=total/36
  const vd=pct>=0.83?{label:'Uttam — Excellent',stars:5,summary:'A rare and auspicious union. The stars align with remarkable harmony across all eight dimensions of compatibility.',textClass:'text-emerald-400',bgClass:'bg-gradient-to-br from-emerald-950/40 via-black/50 to-transparent',borderClass:'border-emerald-500/25',dotClass:'bg-emerald-400 shadow-[0_0_6px_#34d399]',badgeClass:'bg-emerald-500/15 text-emerald-300',divideClass:'border-emerald-500/15'}
    :pct>=0.67?{label:'Uttam-Madhyam — Very Good',stars:4,summary:'Strong compatibility with excellent foundations. Minor differences are easily bridged by mutual respect and love.',textClass:'text-yellow-400',bgClass:'bg-gradient-to-br from-yellow-950/40 via-black/50 to-transparent',borderClass:'border-yellow-500/25',dotClass:'bg-yellow-400 shadow-[0_0_6px_#facc15]',badgeClass:'bg-yellow-500/15 text-yellow-300',divideClass:'border-yellow-500/15'}
    :pct>=0.5?{label:'Madhyam — Good',stars:3,summary:'Moderate compatibility with a good foundation. This union can flourish with understanding, patience, and shared commitment.',textClass:'text-amber-400',bgClass:'bg-gradient-to-br from-amber-950/40 via-black/50 to-transparent',borderClass:'border-amber-500/25',dotClass:'bg-amber-400 shadow-[0_0_6px_#f59e0b]',badgeClass:'bg-amber-500/15 text-amber-300',divideClass:'border-amber-500/15'}
    :pct>=0.33?{label:'Adhama — Needs Care',stars:2,summary:'Several areas of incompatibility exist. This relationship can work with significant effort and mutual compromise.',textClass:'text-orange-400',bgClass:'bg-gradient-to-br from-orange-950/40 via-black/50 to-transparent',borderClass:'border-orange-500/25',dotClass:'bg-orange-400 shadow-[0_0_6px_#fb923c]',badgeClass:'bg-orange-500/15 text-orange-300',divideClass:'border-orange-500/15'}
    :{label:'Atyanta Adhama — Challenging',stars:1,summary:'Significant cosmic incompatibility is indicated. Strong commitment and remedial rituals are strongly recommended.',textClass:'text-red-400',bgClass:'bg-gradient-to-br from-red-950/40 via-black/50 to-transparent',borderClass:'border-red-500/25',dotClass:'bg-red-400 shadow-[0_0_6px_#f87171]',badgeClass:'bg-red-500/15 text-red-300',divideClass:'border-red-500/15'}

  const gunas=[
    {name:'Varna',sanskrit:'वर्ण',max:1,score:vS,aspect:'Spiritual compatibility',description:vS===1?'Spiritual temperaments are compatible.':'Different spiritual temperaments. Mutual respect is essential.',textClass:'text-violet-400',bgClass:'bg-violet-950/20',borderClass:'border-violet-500/20',barClass:'bg-gradient-to-r from-violet-500/60 to-violet-400'},
    {name:'Vashya',sanskrit:'वश्य',max:2,score:vaS,aspect:'Mutual attraction',description:vaS===2?'Strong natural attraction.':vaS===1?'Moderate attraction. A comfortable bond develops with effort.':'Different energy types. Independence will be important.',textClass:'text-blue-400',bgClass:'bg-blue-950/20',borderClass:'border-blue-500/20',barClass:'bg-gradient-to-r from-blue-500/60 to-blue-400'},
    {name:'Tara',sanskrit:'तारा',max:3,score:tS,aspect:'Birth star compatibility',description:tS===3?'Nakshatra positions are highly auspicious.':tS>0?'Moderate star compatibility.':'Challenging star positions. Health may need extra attention.',textClass:'text-cyan-400',bgClass:'bg-cyan-950/20',borderClass:'border-cyan-500/20',barClass:'bg-gradient-to-r from-cyan-500/60 to-cyan-400'},
    {name:'Yoni',sanskrit:'योनि',max:4,score:yS,aspect:'Physical compatibility',description:`${YN[y1]??'Horse'} & ${YN[y2]??'Elephant'}. `+(yS===4?'Same yoni — deeply harmonious.':yS===2?'Friendly yoni. Comfortable compatibility.':'Opposing yoni. Physical areas need extra sensitivity.'),textClass:'text-pink-400',bgClass:'bg-pink-950/20',borderClass:'border-pink-500/20',barClass:'bg-gradient-to-r from-pink-500/60 to-pink-400'},
    {name:'Graha Maitri',sanskrit:'ग्रह मैत्री',max:5,score:gS,aspect:'Mental compatibility',description:`${l1} & ${l2}. `+(gS>=4?'Planetary lords are friends — strong mental harmony.':gS>=2?'Neutral. Mental compatibility grows with communication.':'Lords are not friendly. Patience is essential.'),textClass:'text-amber-400',bgClass:'bg-amber-950/20',borderClass:'border-amber-500/20',barClass:'bg-gradient-to-r from-amber-500/60 to-amber-400'},
    {name:'Gana',sanskrit:'गण',max:6,score:gnS,aspect:'Nature & temperament',description:`${GN[g1]??'Deva'} & ${GN[g2]??'Deva'}. `+(gnS===6?'Same Gana — deeply aligned natures.':gnS===5?'Compatible Ganas.':'Different Ganas. Patience and acceptance required.'),textClass:'text-emerald-400',bgClass:'bg-emerald-950/20',borderClass:'border-emerald-500/20',barClass:'bg-gradient-to-r from-emerald-500/60 to-emerald-400'},
    {name:'Bhakoot',sanskrit:'भकूट',max:7,score:bhS,aspect:'Emotional & financial',description:bhS===7?'Auspicious sign placement. Emotional bond and prosperity well-indicated.':'Bhakoot Dosha present. Financial and emotional areas need nurturing.',textClass:'text-sky-400',bgClass:'bg-sky-950/20',borderClass:'border-sky-500/20',barClass:'bg-gradient-to-r from-sky-500/60 to-sky-400'},
    {name:'Nadi',sanskrit:'नाड़ी',max:8,score:nS,aspect:'Health & progeny',description:`${NN[nd1]??'Aadi'} & ${NN[nd2]??'Madhya'}. `+(nS===8?'Different Nadis — excellent health compatibility.':nCan?'Nadi Dosha cancelled by mitigating factors.':'Nadi Dosha present. Health and progeny need care.'),textClass:'text-rose-400',bgClass:'bg-rose-950/20',borderClass:'border-rose-500/20',barClass:'bg-gradient-to-r from-rose-500/60 to-rose-400'},
  ]
  const dc=(s:string)=>({textClass:s==='Present'?'text-red-400':s==='Cancelled'?'text-amber-400':'text-emerald-400',bgClass:s==='Present'?'bg-red-950/20':s==='Cancelled'?'bg-amber-950/20':'bg-emerald-950/20',borderClass:s==='Present'?'border-red-500/20':s==='Cancelled'?'border-amber-500/20':'border-emerald-500/20',iconBgClass:s==='Present'?'bg-red-500/10':s==='Cancelled'?'bg-amber-500/10':'bg-emerald-500/10',badgeClass:s==='Present'?'bg-red-500/15 text-red-300':s==='Cancelled'?'bg-amber-500/15 text-amber-300':'bg-emerald-500/15 text-emerald-300'})
  const mangal={status:mSt,...dc(mSt),detail:mSt==='None'?`Neither ${p1.name||'Boy'} nor ${p2.name||'Girl'} has Mangal Dosha.`:mSt==='Cancelled'?'Both have Mangal Dosha — effectively cancelled when both share this placement.':` ${md1?(p1.name||'Boy'):(p2.name||'Girl')} has Mangal Dosha. Remedial measures recommended.`}
  const nadi={status:nSt,...dc(nSt),detail:nSt==='None'?`${NN[nd1]??'Aadi'} and ${NN[nd2]??'Madhya'} Nadis complement each other.`:nSt==='Cancelled'?'Nadi Dosha cancelled due to different signs or identical nakshatras.':`Both share ${NN[nd1]??'the same'} Nadi. Health and progeny may be affected. Remedies strongly recommended.`}
  const areas=[
    {emoji:'💑',label:'Love',     score:Math.min(10,Math.round((yS/4+gS/5)*5)),        borderClass:'border-pink-500/20',   bgClass:'bg-pink-950/15',   textClass:'text-pink-400',   barClass:'bg-pink-400'},
    {emoji:'💰',label:'Finance',  score:Math.min(10,Math.round((bhS/7+vS)*5)),          borderClass:'border-yellow-500/20', bgClass:'bg-yellow-950/15', textClass:'text-yellow-400', barClass:'bg-yellow-400'},
    {emoji:'🧘',label:'Health',   score:Math.min(10,Math.round((nS/8+tS/3)*5)),         borderClass:'border-emerald-500/20',bgClass:'bg-emerald-950/15',textClass:'text-emerald-400',barClass:'bg-emerald-400'},
    {emoji:'🏠',label:'Family',   score:Math.min(10,Math.round((gnS/6+vaS/2)*5)),       borderClass:'border-blue-500/20',   bgClass:'bg-blue-950/15',   textClass:'text-blue-400',   barClass:'bg-blue-400'},
    {emoji:'🌟',label:'Spiritual',score:Math.min(10,Math.round((vS+gS/5+gnS/6)*3.33)), borderClass:'border-violet-500/20', bgClass:'bg-violet-950/15', textClass:'text-violet-400', barClass:'bg-violet-400'},
    {emoji:'👶',label:'Progeny',  score:Math.min(10,Math.round((nS/8+yS/4)*5)),         borderClass:'border-amber-500/20',  bgClass:'bg-amber-950/15',  textClass:'text-amber-400',  barClass:'bg-amber-400'},
  ]
  const gp=['Two souls, shaped by different stars, find in each other what the cosmos intended. Walk this path with patience, honesty, and reverence.','The stars reveal tendencies, not destinies. Your love is the alchemy that transforms cosmic patterns into something uniquely yours.','Where compatibility runs deep, cherish it with gratitude. Where differences arise, see them as invitations for growth.','Marriage is not the union of two perfect people, but the creation of something greater than either alone.','The cosmos has brought you to this moment of inquiry. Whatever the numbers reveal, the heart\'s wisdom runs deeper.']
  return {p1Name:p1.name||'Boy',p2Name:p2.name||'Girl',p1Nakshatra:NK[n1]??'Ashwini',p2Nakshatra:NK[n2]??'Ashwini',p1Rashi:RS[r1]??'Mesha',p2Rashi:RS[r2]??'Mesha',totalScore:total,verdict:vd,gunas,mangal,nadi,areas,guidance:gp[(n1+n2+total)%gp.length]??gp[0]!}
}
</script>

<style>
@keyframes twinkle { 0%,100%{opacity:0.1} 50%{opacity:0.7} }
</style>``