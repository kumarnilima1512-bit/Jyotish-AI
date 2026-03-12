<template>
  <div class="min-h-screen bg-[#07050f] text-gray-200 relative overflow-x-hidden">

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

    <!-- Ambient glow -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-900/15 blur-[120px]" />
      <div class="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-900/10 blur-[100px]" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-violet-500/15 py-5 px-6">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/"
            class="flex items-center justify-center w-9 h-9 rounded-xl border border-violet-500/20 text-violet-400/60 hover:text-violet-300 hover:border-violet-400/40 transition-all">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
            <div>
              <h1 class="font-cinzel text-xl text-yellow-400 tracking-[0.25em] uppercase group-hover:text-yellow-300 transition-colors">ज्योतिष · Jyotish</h1>
              <p class="font-garamond text-xs text-gray-600 mt-0.5 tracking-widest">Vedic Astrology</p>
            </div>
          </NuxtLink>
        </div>
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-violet-300/70">
          <span class="text-violet-400">✦</span>
          <span>Numerology</span>
          <span class="text-violet-600/30">·</span>
          <span class="text-violet-300/50">Vedic Number Science</span>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-4xl mx-auto px-4 py-10">

      <!-- INPUT FORM -->
      <div v-if="!result" class="max-w-lg mx-auto">
        <div class="text-center mb-10">
          <p class="font-cinzel text-violet-400/50 text-xs tracking-[0.35em] uppercase mb-3">The Science of Numbers</p>
          <h2 class="font-cinzel text-2xl md:text-3xl text-violet-200 tracking-wider mb-3">Your Numerology Profile</h2>
          <p class="font-garamond text-gray-500 leading-relaxed">Enter your full birth name and date of birth to reveal the numbers that govern your destiny.</p>
        </div>

        <div class="bg-black/40 border border-violet-500/20 rounded-2xl p-7 space-y-6 backdrop-blur-sm">

          <div>
            <label class="block font-cinzel text-violet-400/70 text-xs tracking-widest uppercase mb-2">Full Birth Name</label>
            <input v-model="fullName" type="text" placeholder="As it appears on birth certificate"
              class="w-full bg-black/50 border border-violet-500/20 rounded-xl px-4 py-3 text-gray-200 font-garamond text-base placeholder-gray-700 focus:outline-none focus:border-violet-400/60 transition-colors" />
            <p class="text-gray-700 font-garamond text-xs mt-1.5 px-1">Include middle name if any</p>
          </div>

          <div>
            <label class="block font-cinzel text-violet-400/70 text-xs tracking-widest uppercase mb-2">Date of Birth</label>
            <button type="button" @click="calOpen = !calOpen"
              class="w-full bg-black/50 border border-violet-500/20 rounded-xl px-4 py-3 text-left flex items-center justify-between font-garamond text-sm transition-colors hover:border-violet-400/50 focus:outline-none"
              :class="birthDate ? 'text-gray-200' : 'text-gray-700'">
              <span>{{ birthDate ? formatDate(birthDate) : 'Select your date of birth' }}</span>
              <span class="text-violet-400/50">{{ calOpen ? '▲' : '▼' }}</span>
            </button>

            <div v-if="calOpen" class="mt-2 bg-[#0e0a1a] border border-violet-500/25 rounded-2xl p-4 shadow-2xl">
              <div class="flex items-center justify-between mb-3">
                <button type="button" @click="prevMonth" class="text-violet-400 hover:text-violet-300 px-2 py-1 font-cinzel text-lg leading-none">‹</button>
                <div class="flex items-center gap-2">
                  <select v-model="calMonth" class="bg-transparent text-violet-300 font-cinzel text-sm focus:outline-none cursor-pointer">
                    <option v-for="(m,i) in MONTHS" :key="i" :value="i" class="bg-gray-900">{{ m }}</option>
                  </select>
                  <input v-model.number="calYear" type="number" min="1900" max="2025"
                    class="bg-transparent text-violet-300 font-cinzel text-sm w-16 text-center focus:outline-none border-b border-violet-500/30" />
                </div>
                <button type="button" @click="nextMonth" class="text-violet-400 hover:text-violet-300 px-2 py-1 font-cinzel text-lg leading-none">›</button>
              </div>
              <div class="grid grid-cols-7 mb-1">
                <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d"
                  class="text-center text-violet-500/40 font-cinzel text-xs py-1">{{ d }}</div>
              </div>
              <div class="grid grid-cols-7 gap-0.5">
                <div v-for="_ in calStartDay" :key="'b'+_" />
                <button v-for="day in calDaysInMonth" :key="day" type="button" @click="selectDay(day)"
                  class="aspect-square flex items-center justify-center rounded-lg text-sm font-garamond transition-all"
                  :class="dayClass(day)">{{ day }}</button>
              </div>
              <div class="mt-3 pt-3 border-t border-violet-500/10 flex gap-2 flex-wrap">
                <button v-for="y in quickYears" :key="y" type="button" @click="calYear = y"
                  class="text-xs font-cinzel text-violet-500/50 hover:text-violet-300 px-2 py-0.5 rounded border border-violet-500/15 hover:border-violet-400/30 transition-colors">{{ y }}</button>
              </div>
            </div>
          </div>

          <button type="button" @click="calculate" :disabled="!fullName.trim() || !birthDate || isLoading"
            class="w-full py-4 rounded-xl font-cinzel text-sm tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            :class="fullName.trim() && birthDate && !isLoading
              ? 'bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg shadow-violet-900/40 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-violet-900/20 text-violet-500/50 border border-violet-500/15'">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              Reading the Numbers...
            </span>
            <span v-else>Reveal My Numbers</span>
          </button>

          <p v-if="fetchError" class="text-red-400 font-garamond text-sm text-center">{{ fetchError }}</p>
        </div>
      </div>

      <!-- RESULTS -->
      <div v-else>

        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-cinzel text-violet-200 text-xl tracking-wider">{{ result.name }}</h2>
            <p class="font-garamond text-gray-500 text-sm mt-0.5">{{ formatDate(birthDate) }}</p>
          </div>
          <button @click="reset"
            class="px-4 py-2 rounded-xl border border-violet-500/20 font-cinzel text-xs text-violet-400/60 tracking-widest uppercase hover:border-violet-400/40 hover:text-violet-300 transition-all">
            ↺ New Reading
          </button>
        </div>

        <!-- Core Numbers -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          <div v-for="num in result.coreNumbers" :key="num.key"
            class="rounded-2xl border p-4 text-center transition-all hover:scale-105 cursor-default"
            :class="num.highlight ? 'border-violet-400/50 bg-violet-500/10 shadow-lg shadow-violet-900/20' : 'border-violet-500/15 bg-black/40'">
            <div class="font-cinzel text-xs text-violet-400/50 tracking-widest uppercase mb-2">{{ num.label }}</div>
            <div class="font-cinzel text-4xl font-bold mb-1" :style="{ color: num.color }">{{ num.value }}</div>
            <div class="font-garamond text-xs text-gray-600 leading-tight">{{ num.sublabel }}</div>
          </div>
        </div>

        <!-- Master Number alert -->
        <div v-if="result.masterNumbers.length" class="mb-8 px-5 py-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-3">
          <span class="text-amber-400 text-xl shrink-0 mt-0.5">✦</span>
          <div>
            <p class="font-cinzel text-amber-300 text-sm tracking-wider mb-1">Master Numbers Present</p>
            <p class="font-garamond text-gray-400 text-sm leading-relaxed">
              You carry the master number{{ result.masterNumbers.length > 1 ? 's' : '' }}
              <span class="text-amber-300 font-semibold">{{ result.masterNumbers.join(' and ') }}</span>
              — rare numbers of heightened spiritual potential.
            </p>
          </div>
        </div>

        <!-- Sections -->
        <div class="space-y-4">
          <div v-for="section in result.sections" :key="section.key"
            class="rounded-2xl border border-violet-500/12 bg-black/30 overflow-hidden">

            <button
              type="button"
              @click="toggleSection(section.key)"
              class="w-full flex items-center justify-between px-6 py-4 hover:bg-violet-500/5 transition-colors group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: section.color + '15' }">
                  <!-- Mulank: clock -->
                  <svg v-if="section.key === 'mulank'" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="section.color" stroke-width="1.5" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  <!-- Bhagyank: star -->
                  <svg v-else-if="section.key === 'bhagyank'" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="section.color" stroke-width="1.5" stroke-linecap="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  <!-- Love: heart -->
                  <svg v-else-if="section.key === 'love'" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="section.color" stroke-width="1.5" stroke-linecap="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <!-- Career: activity -->
                  <svg v-else-if="section.key === 'career'" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="section.color" stroke-width="1.5" stroke-linecap="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-cinzel text-sm text-gray-200 tracking-wider group-hover:text-violet-300 transition-colors">{{ section.title }}</div>
                  <div class="font-garamond text-xs text-gray-600 mt-0.5">{{ section.subtitle }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-cinzel text-2xl font-bold" :style="{ color: section.color }">{{ section.number }}</span>
                <svg class="w-4 h-4 text-gray-600 transition-transform duration-300" :class="openSections.has(section.key) ? 'rotate-180' : ''" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
            </button>

            <div v-if="openSections.has(section.key)" class="px-6 pb-6 border-t border-violet-500/8">
              <div v-if="!section.meaning" class="py-8 text-center">
                <p class="font-garamond text-gray-600 text-sm">No data found in Notion for number {{ section.number }}. Add it to your Number Meanings database.</p>
              </div>
              <template v-else>

                <!-- Number + Name header -->
                <div class="mt-5 mb-4 flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center font-cinzel text-2xl font-bold shrink-0"
                    :style="{ backgroundColor: section.color + '15', color: section.color }">{{ section.number }}</div>
                  <div>
                    <div class="font-cinzel text-sm tracking-wider" :style="{ color: section.color }">{{ section.meaning.name }}</div>
                    <div class="font-garamond text-xs text-gray-500 mt-0.5">{{ section.meaning.keywords }}</div>
                  </div>
                </div>

                <!-- MULANK: Personality + Traits + Lucky -->
                <template v-if="section.key === 'mulank'">
                  <div v-if="section.meaning.personality" class="mb-4">
                    <h4 class="font-cinzel text-xs tracking-widest uppercase mb-2" :style="{ color: section.color + 'aa' }">Personality</h4>
                    <p class="font-garamond text-gray-400 leading-[1.85] text-sm">{{ section.meaning.personality }}</p>
                  </div>
                  <div v-if="section.meaning.traits?.length" class="mb-4 flex flex-wrap gap-2">
                    <span v-for="trait in section.meaning.traits" :key="trait"
                      class="px-3 py-1 rounded-full font-garamond text-xs border"
                      :style="{ borderColor: section.color + '30', color: section.color + 'cc', backgroundColor: section.color + '08' }">{{ trait }}</span>
                  </div>
                  <div class="mt-2 grid grid-cols-3 gap-3">
                    <div v-if="section.meaning.luckyGem" class="text-center p-3 rounded-xl bg-black/30 border border-violet-500/10">
                      <div class="flex justify-center mb-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round">
                          <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>
                        </svg>
                      </div>
                      <div class="font-cinzel text-xs text-gray-600 uppercase tracking-widest mb-1">Gem</div>
                      <div class="font-garamond text-xs text-gray-400">{{ section.meaning.luckyGem }}</div>
                    </div>
                    <div v-if="section.meaning.luckyColor" class="text-center p-3 rounded-xl bg-black/30 border border-violet-500/10">
                      <div class="flex justify-center mb-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round">
                          <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="19" cy="13" r="2.5"/><circle cx="6" cy="14" r="2.5"/><path d="M12 22a7 7 0 0 1-7-7c0-3.87 3.13-7 7-7s7 3.13 7 7a7 7 0 0 1-7 7z"/>
                        </svg>
                      </div>
                      <div class="font-cinzel text-xs text-gray-600 uppercase tracking-widest mb-1">Color</div>
                      <div class="font-garamond text-xs text-gray-400">{{ section.meaning.luckyColor }}</div>
                    </div>
                    <div v-if="section.meaning.luckyDay" class="text-center p-3 rounded-xl bg-black/30 border border-violet-500/10">
                      <div class="flex justify-center mb-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div class="font-cinzel text-xs text-gray-600 uppercase tracking-widest mb-1">Day</div>
                      <div class="font-garamond text-xs text-gray-400">{{ section.meaning.luckyDay }}</div>
                    </div>
                  </div>
                </template>

                <!-- BHAGYANK: Life Path reading from Bhagyank field -->
                <template v-else-if="section.key === 'bhagyank'">
                  <div v-if="section.meaning.bhagyank" class="mb-4">
                    <h4 class="font-cinzel text-xs tracking-widest uppercase mb-2" :style="{ color: section.color + 'aa' }">Life Path Reading</h4>
                    <p class="font-garamond text-gray-400 leading-[1.85] text-sm">{{ section.meaning.bhagyank }}</p>
                  </div>
                  <div v-else class="py-4 text-center">
                    <p class="font-garamond text-gray-600 text-sm italic">Add Bhagyank column to your Notion Number Meanings database.</p>
                  </div>
                </template>

                <!-- LOVE: only love field -->
                <template v-else-if="section.key === 'love'">
                  <div v-if="section.meaning.love" class="mb-4">
                    <h4 class="font-cinzel text-xs tracking-widest uppercase mb-2" :style="{ color: section.color + 'aa' }">Love & Relationships</h4>
                    <p class="font-garamond text-gray-400 leading-[1.85] text-sm">{{ section.meaning.love }}</p>
                  </div>
                </template>

                <!-- CAREER: only career field -->
                <template v-else-if="section.key === 'career'">
                  <div v-if="section.meaning.career" class="mb-4">
                    <h4 class="font-cinzel text-xs tracking-widest uppercase mb-2" :style="{ color: section.color + 'aa' }">Career & Life Purpose</h4>
                    <p class="font-garamond text-gray-400 leading-[1.85] text-sm">{{ section.meaning.career }}</p>
                  </div>
                </template>

              </template>
            </div>
          </div>
        </div>

        <!-- Personal Year -->
        <div class="mt-4 rounded-2xl border border-violet-500/12 bg-black/30 p-6">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 class="font-cinzel text-sm text-violet-300 tracking-[0.2em] uppercase mb-1">Personal Year</h3>
              <p class="font-garamond text-xs text-gray-600">Enter any year to calculate your cycle</p>
            </div>
            <div class="font-cinzel text-4xl font-bold text-violet-300 shrink-0">{{ selectedPersonalYear }}</div>
          </div>
          <div class="flex items-center gap-3 mb-5">
            <input v-model.number="selectedYear" type="number" min="1900" max="2100" placeholder="e.g. 2027"
              class="w-36 bg-black/50 border border-violet-500/20 rounded-xl px-4 py-2.5 text-gray-200 font-cinzel text-sm focus:outline-none focus:border-violet-400/60 transition-colors" />
            <span class="font-garamond text-gray-600 text-sm">Enter year</span>
          </div>
          <p class="font-garamond text-gray-400 text-sm leading-relaxed">{{ PERSONAL_YEAR[selectedPersonalYear] }}</p>
        </div>

      </div>
    </main>

    <footer class="relative z-10 border-t border-violet-500/8 py-6 mt-16 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">
        Numerology is a tool for self-understanding · Not a substitute for professional guidance
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const today    = new Date()
const calOpen  = ref(false)
const calMonth = ref(today.getMonth())
const calYear  = ref(today.getFullYear())
const calDaysInMonth = computed(() => new Date(calYear.value, calMonth.value + 1, 0).getDate())
const calStartDay    = computed(() => new Date(calYear.value, calMonth.value, 1).getDay())
const quickYears     = computed(() => {
  const b = calYear.value
  return [b-40, b-30, b-20, b-10, b-5, b+5].filter(y => y >= 1900 && y <= 2025)
})
function prevMonth() { calMonth.value === 0 ? (calMonth.value = 11, calYear.value--) : calMonth.value-- }
function nextMonth() { calMonth.value === 11 ? (calMonth.value = 0, calYear.value++) : calMonth.value++ }
function dayClass(day: number) {
  const iso = `${calYear.value}-${String(calMonth.value+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return birthDate.value === iso ? 'bg-violet-500 text-white font-bold' : 'text-gray-400 hover:bg-violet-500/15 hover:text-violet-300'
}
function selectDay(day: number) {
  birthDate.value = `${calYear.value}-${String(calMonth.value+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  calOpen.value = false
}
function formatDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${d ?? ''} ${MONTHS[(m ?? 1)-1]} ${y ?? ''}`
}

const fullName     = ref('')
const birthDate    = ref('')
const isLoading    = ref(false)
const fetchError   = ref('')
const currentYear  = new Date().getFullYear()
const selectedYear = ref(currentYear)
const openSections = ref<Set<string>>(new Set())

function toggleSection(key: string) {
  const s = new Set(openSections.value)
  s.has(key) ? s.delete(key) : s.add(key)
  openSections.value = s
}

const stars = Array.from({ length: 90 }, (_, i) => ({
  id: i, x: Math.random()*100, y: Math.random()*100,
  size: Math.random()*1.8+0.4, opacity: Math.random()*0.35+0.06,
  duration: Math.random()*5+2, delay: Math.random()*6
}))

const PERSONAL_YEAR: Record<number, string> = {
  1: 'A powerful new beginning. Plant seeds now — what you initiate this year grows for nine years. Step boldly into new territory and start what you have been postponing.',
  2: 'A year of patience and partnership. Slow down, cooperate, and allow things to develop naturally. Relationships are highlighted — quiet growth now becomes great strength.',
  3: 'A year of expansion, joy, and creative expression. Say yes to invitations, share your gifts, and cultivate joy deliberately — this is one of the most expansive years in your cycle.',
  4: 'A year of building and discipline. Not glamorous, but important. What you construct with care this year will still be standing decades from now.',
  5: 'A year of change and freedom. Be flexible, embrace the unexpected, release what no longer fits. This year rewards adaptability and punishes rigidity.',
  6: 'A year of love and responsibility. Family matters come to the forefront. Deepen your connections and tend your home with genuine care.',
  7: 'A year of introspection and spiritual deepening. Study, contemplate, develop wisdom. What you discover about yourself in quiet this year will change your direction.',
  8: 'A year of achievement and karmic reward. Move boldly toward your goals — recognition, financial improvement, and advancement characterize this powerful cycle.',
  9: 'A year of completion and release. What no longer serves you is ready to go. Let go consciously — you are preparing for an extraordinary new beginning.',
}

const NUM_COLOR: Record<number, string> = {
  1:'#f59e0b', 2:'#60a5fa', 3:'#f472b6', 4:'#4ade80', 5:'#fb923c',
  6:'#34d399', 7:'#a78bfa', 8:'#ef4444', 9:'#c084fc',
  11:'#fbbf24', 22:'#38bdf8', 33:'#f9a8d4'
}

function reduceNum(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n <= 9) return n
  return reduceNum(String(n).split('').reduce((a, d) => a + parseInt(d), 0))
}
function digitSum(n: number) {
  return String(Math.abs(n)).split('').reduce((a, d) => a + parseInt(d), 0)
}
function fullReduce(n: number): number {
  if (n <= 9) return n
  return fullReduce(String(n).split('').reduce((a, d) => a + parseInt(d), 0))
}
const PYTH: Record<string,number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
}
function nameToNum(name: string) {
  return name.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a,l) => a+(PYTH[l]||0), 0)
}
function vowelSum(name: string) {
  return name.toUpperCase().replace(/[^AEIOU]/g,'').split('').reduce((a,l) => a+(PYTH[l]||0), 0)
}
function consonantSum(name: string) {
  return name.toUpperCase().replace(/[^B-DF-HJ-NP-TV-Z]/g,'').split('').reduce((a,l) => a+(PYTH[l]||0), 0)
}

const selectedPersonalYear = computed(() => {
  if (!birthDate.value) return 0
  const parts = birthDate.value.split('-').map(Number)
  const month = parts[1] ?? 0
  const day   = parts[2] ?? 0
  const bdSum   = fullReduce(month + day)
  const yDigits = String(selectedYear.value).split('').reduce((a, d) => a + parseInt(d), 0)
  return fullReduce(bdSum + yDigits)
})

interface ResultSection {
  key: string; title: string; subtitle: string
  number: number; color: string
  showCareer: boolean; showLove: boolean; showLucky: boolean
  meaning: any
}
interface NumerologyResult {
  name: string
  coreNumbers: { key:string; label:string; sublabel:string; value:number; color:string; highlight:boolean }[]
  masterNumbers: number[]
  sections: ResultSection[]
  personalYear: number
}

const result = ref<NumerologyResult | null>(null)

async function calculate() {
  if (!fullName.value.trim() || !birthDate.value) return
  isLoading.value = true
  fetchError.value = ''

  const parts = birthDate.value.split('-').map(Number)
  const year  = parts[0] ?? 0
  const month = parts[1] ?? 0
  const day   = parts[2] ?? 0
  const name  = fullName.value.trim()

  const mulank      = fullReduce(day)  // always 1-9
  const dobSum      = digitSum(day) + digitSum(month) + digitSum(year)
  const bhagyank    = reduceNum(dobSum)  // can be 11,22,33
  const destiny     = reduceNum(nameToNum(name))
  const soulUrge    = reduceNum(vowelSum(name))
  const personality = reduceNum(consonantSum(name))
  const maturity    = reduceNum(bhagyank + destiny)

  const masters: number[] = []
  for (const n of [bhagyank, destiny, soulUrge, personality]) {
    if ((n === 11 || n === 22 || n === 33) && !masters.includes(n)) masters.push(n)
  }

  const bdSum       = fullReduce(month + day)
  const yearDigits  = digitSum(currentYear)
  const personalYear = fullReduce(bdSum + yearDigits)

  const coreNumbers = [
    { key:'mulank',   label:'Mulank',    sublabel:'Birth Day · मूलांक',   value:mulank,      color:NUM_COLOR[mulank]||'#a78bfa',      highlight:true  },
    { key:'bhagyank', label:'Bhagyank',  sublabel:'Life Path · भाग्यांक', value:bhagyank,    color:NUM_COLOR[bhagyank]||'#a78bfa',    highlight:true  },
    { key:'destiny',  label:'Destiny',   sublabel:'Expression Number',     value:destiny,     color:NUM_COLOR[destiny]||'#a78bfa',     highlight:false },
    { key:'soul',     label:'Soul Urge', sublabel:"Heart's Desire",        value:soulUrge,    color:NUM_COLOR[soulUrge]||'#a78bfa',    highlight:false },
    { key:'persona',  label:'Persona',   sublabel:'Outer Personality',     value:personality, color:NUM_COLOR[personality]||'#a78bfa', highlight:false },
    { key:'maturity', label:'Maturity',  sublabel:'Later Life Number',     value:maturity,    color:NUM_COLOR[maturity]||'#a78bfa',    highlight:false },
  ]

  const sections: ResultSection[] = [
    { key:'mulank',   title:'Mulank — Birth Day',   subtitle:"The number of your soul's entry point", number:mulank,   color:NUM_COLOR[mulank]||'#a78bfa',   showCareer:false, showLove:false, showLucky:true,  meaning:null },
    { key:'bhagyank', title:'Bhagyank — Life Path', subtitle:'The master number of your destiny',     number:bhagyank, color:NUM_COLOR[bhagyank]||'#a78bfa', showCareer:false, showLove:false, showLucky:false, meaning:null },
    { key:'love',     title:'Love & Relationships',  subtitle:`Based on Mulank ${mulank}`,            number:mulank,   color:'#f472b6',                      showCareer:false, showLove:false, showLucky:false, meaning:null },
    { key:'career',   title:'Career & Life Purpose', subtitle:`Based on Mulank ${mulank}`,            number:mulank,   color:'#fb923c',                      showCareer:false, showLove:false, showLucky:false, meaning:null },
  ]

  try {
    const uniqueNums = [...new Set([mulank, bhagyank])]
    const data = await $fetch<{ meanings: Record<number, any> }>('/api/number-meanings', {
      method: 'POST',
      body: { numbers: uniqueNums }
    })
    sections[0]!.meaning = data.meanings[mulank]   || null
    sections[1]!.meaning = data.meanings[bhagyank] || null
    sections[2]!.meaning = data.meanings[mulank]   || null
    sections[3]!.meaning = data.meanings[mulank]   || null
  } catch (e: any) {
    fetchError.value = 'Could not load from Notion: ' + (e?.message || 'Unknown error')
  }

  result.value = { name, coreNumbers, masterNumbers: masters, sections, personalYear }
  openSections.value = new Set(['mulank', 'bhagyank'])
  isLoading.value = false
}

function reset() {
  result.value = null
  fullName.value = ''
  birthDate.value = ''
  fetchError.value = ''
  openSections.value = new Set()
}
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.06; }
  50%       { opacity: 0.45; }
}
</style>