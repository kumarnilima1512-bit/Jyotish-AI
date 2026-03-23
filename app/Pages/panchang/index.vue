<template>
  <div class="relative z-10 min-h-screen text-gray-200 overflow-x-hidden">
    <header class="relative z-10 border-b border-orange-500/15 py-5 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-orange-500/20 bg-black/40 flex items-center justify-center text-gray-500 hover:text-orange-400 hover:border-orange-400/50 transition-all">
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
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-orange-400/60">
          <span>पञ्चाङ्ग · Panchang</span>
        </div>
      </div>
    </header>

    <div class="relative z-10 text-center pt-10 pb-6 px-4">
      <p class="font-cinzel text-orange-400/50 text-xs tracking-[0.4em] uppercase mb-2">पञ्चाङ्ग</p>
      <h2 class="font-cinzel text-3xl md:text-4xl text-orange-300/90 tracking-[0.2em] uppercase mb-3">Panchang</h2>
      <p class="font-garamond text-gray-500 text-base">Tithi · Nakshatra · Yoga · Karana · Rahukaal</p>
    </div>

    <main class="relative z-10 max-w-5xl mx-auto px-4 pb-16">
      <!-- Input Card -->
      <div class="bg-black/40 border border-orange-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="font-cinzel text-xs text-orange-400/70 tracking-widest uppercase block mb-2">Date</label>
            <input v-model="selectedDate" type="date" class="w-full bg-black/40 border border-orange-500/20 rounded-xl px-4 py-3 font-garamond text-gray-200 text-base focus:outline-none focus:border-orange-500/50 transition-colors"/>
          </div>
          <div class="md:col-span-2">
            <label class="font-cinzel text-xs text-orange-400/70 tracking-widest uppercase block mb-2">Location</label>
            <div class="relative">
              <input v-model="locationInput" type="text" placeholder="Type city name and press Enter…"
                @keydown.enter="searchLocation" @input="onInputChange"
                class="w-full bg-black/40 border border-orange-500/20 rounded-xl px-4 py-3 pr-10 font-garamond text-gray-200 text-base focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-700"/>
              <div class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg v-if="!searching" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.5" stroke-opacity="0.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <svg v-else class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.8"/></svg>
              </div>
              <div v-if="suggestions.length > 0" class="absolute z-50 mt-1 w-full rounded-xl border border-orange-500/20 bg-[#0e0a1a]/95 backdrop-blur-md overflow-hidden shadow-2xl">
                <button v-for="(s, i) in suggestions" :key="i" type="button" @click="selectSuggestion(s)"
                  class="w-full text-left px-4 py-2.5 border-b border-white/5 last:border-0 hover:bg-orange-500/10 transition-colors">
                  <div class="font-garamond text-sm text-gray-200">{{ s.short }}</div>
                  <div class="font-garamond text-xs text-gray-600 truncate">{{ s.full }}</div>
                </button>
              </div>
            </div>
            <p v-if="selectedLocation" class="font-garamond text-xs text-orange-400/60 mt-1.5">✓ {{ selectedLocation.name }} · {{ selectedLocation.lat.toFixed(2) }}°N {{ selectedLocation.lng.toFixed(2) }}°E</p>
          </div>
          <div>
            <button type="button" @click="calculate" :disabled="calculating"
              class="w-full px-6 py-3 rounded-xl font-cinzel text-sm tracking-widest uppercase border border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition-all disabled:opacity-40">
              {{ calculating ? 'Calculating…' : 'Calculate' }}
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <button v-for="loc in quickLocations" :key="loc.name" type="button" @click="selectQuickLocation(loc)"
            class="px-3 py-1.5 rounded-lg border border-orange-500/10 bg-orange-500/5 hover:border-orange-500/30 hover:bg-orange-500/10 font-garamond text-xs text-gray-500 hover:text-orange-300 transition-all">
            {{ loc.name }}
          </button>
        </div>
      </div>

      <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 font-garamond text-red-300 text-sm text-center">{{ error }}</div>

      <template v-if="panchang">
        <div class="text-center mb-8">
          <p class="font-cinzel text-orange-400/60 text-xs tracking-[0.3em] uppercase">{{ panchang.weekday }}</p>
          <h3 class="font-cinzel text-2xl text-orange-300 tracking-widest mt-1">{{ panchang.displayDate }}</h3>
          <p class="font-garamond text-gray-500 text-sm mt-1">{{ panchang.locationName }} · {{ panchang.samvat }}</p>
        </div>

        <!-- Five Limbs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div class="bg-black/40 border border-orange-500/20 rounded-2xl p-5 text-center hover:border-orange-500/35 transition-colors backdrop-blur-sm">
            <div class="font-cinzel text-xs text-orange-400/50 tracking-widest uppercase mb-3">तिथि · Tithi</div>
            <div class="text-3xl mb-2">{{ panchang.tithi.symbol }}</div>
            <div class="font-cinzel text-orange-300 text-sm mb-1">{{ panchang.tithi.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.tithi.paksha }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">{{ panchang.tithi.number }}</div>
          </div>
          <div class="bg-black/40 border border-amber-500/20 rounded-2xl p-5 text-center hover:border-amber-500/35 transition-colors backdrop-blur-sm">
            <div class="font-cinzel text-xs text-amber-400/50 tracking-widest uppercase mb-3">नक्षत्र · Nakshatra</div>
            <div class="text-3xl mb-2">✦</div>
            <div class="font-cinzel text-amber-300 text-sm mb-1">{{ panchang.nakshatra.name }}</div>
            <div class="font-garamond text-xs text-gray-500">Lord: {{ panchang.nakshatra.lord }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">Pada {{ panchang.nakshatra.pada }}</div>
          </div>
          <div class="bg-black/40 border border-yellow-500/20 rounded-2xl p-5 text-center hover:border-yellow-500/35 transition-colors backdrop-blur-sm">
            <div class="font-cinzel text-xs text-yellow-400/50 tracking-widest uppercase mb-3">योग · Yoga</div>
            <div class="text-3xl mb-2">⊕</div>
            <div class="font-cinzel text-yellow-300 text-sm mb-1">{{ panchang.yoga.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.yoga.nature }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">No. {{ panchang.yoga.number }}</div>
          </div>
          <div class="bg-black/40 border border-lime-500/20 rounded-2xl p-5 text-center hover:border-lime-500/35 transition-colors backdrop-blur-sm">
            <div class="font-cinzel text-xs text-lime-400/50 tracking-widest uppercase mb-3">करण · Karana</div>
            <div class="text-3xl mb-2">◐</div>
            <div class="font-cinzel text-lime-300 text-sm mb-1">{{ panchang.karana.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.karana.type }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">Half tithi</div>
          </div>
          <div class="bg-black/40 border border-sky-500/20 rounded-2xl p-5 text-center hover:border-sky-500/35 transition-colors backdrop-blur-sm">
            <div class="font-cinzel text-xs text-sky-400/50 tracking-widest uppercase mb-3">वार · Vara</div>
            <div class="text-3xl mb-2">{{ panchang.vara.symbol }}</div>
            <div class="font-cinzel text-sky-300 text-sm mb-1">{{ panchang.vara.sanskrit }}</div>
            <div class="font-garamond text-xs text-gray-500">Lord: {{ panchang.vara.lord }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">{{ panchang.weekday }}</div>
          </div>
        </div>

        <!-- Timings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div class="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h4 class="font-cinzel text-xs text-yellow-400/60 tracking-widest uppercase mb-5">☉ Sun & Moon Timings</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Sunrise</div><div class="font-garamond text-xs text-gray-600">Pratah</div></div>
                </div>
                <div class="font-cinzel text-amber-300 text-base">{{ panchang.sunrise }}</div>
              </div>
              <div class="border-t border-white/5"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="1.5"><path d="M17 12h.01M7 12h.01M12 17v.01"/><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/></svg></div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Sunset</div><div class="font-garamond text-xs text-gray-600">Sayam</div></div>
                </div>
                <div class="font-cinzel text-orange-300 text-base">{{ panchang.sunset }}</div>
              </div>
              <div class="border-t border-white/5"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Moonrise</div><div class="font-garamond text-xs text-gray-600">Chandrodaya</div></div>
                </div>
                <div class="font-cinzel text-blue-300 text-base">{{ panchang.moonrise }}</div>
              </div>
            </div>
          </div>
          <div class="bg-black/40 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h4 class="font-cinzel text-xs text-red-400/60 tracking-widest uppercase mb-5">⚠ Inauspicious Periods</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center font-cinzel text-xs text-red-400">☋</div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Rahukaal</div><div class="font-garamond text-xs text-gray-600">Avoid new starts</div></div>
                </div>
                <div class="font-cinzel text-red-300 text-sm text-right"><div>{{ panchang.rahukaal.start }}</div><div class="text-xs text-gray-600">to {{ panchang.rahukaal.end }}</div></div>
              </div>
              <div class="border-t border-white/5"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center font-cinzel text-xs text-orange-400">☿</div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Yamaganda</div><div class="font-garamond text-xs text-gray-600">Inauspicious</div></div>
                </div>
                <div class="font-cinzel text-orange-300 text-sm text-right"><div>{{ panchang.yamaganda.start }}</div><div class="text-xs text-gray-600">to {{ panchang.yamaganda.end }}</div></div>
              </div>
              <div class="border-t border-white/5"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center font-cinzel text-xs text-green-400">☀</div>
                  <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">Abhijit Muhurta</div><div class="font-garamond text-xs text-gray-600">Most auspicious</div></div>
                </div>
                <div class="font-cinzel text-green-300 text-sm text-right"><div>{{ panchang.abhijit.start }}</div><div class="text-xs text-gray-600">to {{ panchang.abhijit.end }}</div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Muhurtas -->
        <div class="bg-black/40 border border-green-500/15 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <h4 class="font-cinzel text-xs text-green-400/60 tracking-widest uppercase mb-5">✦ Auspicious Muhurtas Today</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="m in panchang.muhurtas" :key="m.name" class="text-center">
              <div class="font-cinzel text-xs text-gray-500 tracking-wider mb-1">{{ m.name }}</div>
              <div :class="m.good ? 'text-green-400' : 'text-red-400/60'" class="font-garamond text-sm">{{ m.good ? '✓ Good' : '✗ Avoid' }}</div>
            </div>
          </div>
        </div>

        <!-- Planets -->
        <div class="bg-black/40 border border-yellow-500/15 rounded-2xl p-6 backdrop-blur-sm">
          <h4 class="font-cinzel text-xs text-yellow-400/60 tracking-widest uppercase mb-5">☿ Planetary Positions</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div v-for="planet in panchang.planets" :key="planet.name"
              class="flex items-center gap-3 py-2 px-3 rounded-xl bg-black/20 border border-white/5">
              <span class="text-xl" :style="{ color: planet.color }">{{ planet.symbol }}</span>
              <div><div class="font-cinzel text-xs text-gray-400 tracking-wider">{{ planet.name }}</div><div class="font-garamond text-xs text-gray-600">{{ planet.sign }}</div></div>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="!calculating" class="text-center py-20">
        <div class="font-cinzel text-6xl text-orange-400/15 mb-6">☽</div>
        <h3 class="font-cinzel text-orange-400/40 text-xl tracking-[0.3em] uppercase mb-4">Choose a Date & Location</h3>
        <p class="font-garamond text-gray-600 max-w-sm mx-auto">Enter the date and your location above to generate the Panchang.</p>
      </div>
    </main>

    <footer class="relative z-10 border-t border-orange-500/10 py-6 mt-4 text-center">
      <p class="font-cinzel text-gray-600 text-xs tracking-widest uppercase">Astronomical calculations are approximate · For educational purposes</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const selectedDate    = ref('')
const locationInput   = ref('')
const calculating     = ref(false)
const searching       = ref(false)
const error           = ref('')
const panchang        = ref<any>(null)
const suggestions     = ref<{ short:string; full:string; lat:number; lng:number }[]>([])
const selectedLocation = ref<{ name:string; lat:number; lng:number } | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | null = null

const quickLocations = [
  { name:'New Delhi', lat:28.6139, lng:77.2090 },
  { name:'Mumbai',    lat:19.0760, lng:72.8777 },
  { name:'Kolkata',   lat:22.5726, lng:88.3639 },
  { name:'Varanasi',  lat:25.3176, lng:82.9739 },
  { name:'Chennai',   lat:13.0827, lng:80.2707 },
  { name:'Bengaluru', lat:12.9716, lng:77.5946 },
]

function selectQuickLocation(loc: { name:string; lat:number; lng:number }) {
  locationInput.value = loc.name
  selectedLocation.value = loc
  suggestions.value = []
  calculate()
}

function onInputChange() {
  selectedLocation.value = null
  if (searchTimer) clearTimeout(searchTimer)
  if (locationInput.value.length < 2) { suggestions.value = []; return }
  searchTimer = setTimeout(fetchSuggestions, 400)
}

async function fetchSuggestions() {
  searching.value = true
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput.value)}&format=json&limit=5`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json() as { display_name:string; lat:string; lon:string }[]
    suggestions.value = data.map(d => {
      const parts = d.display_name.split(',').map((p:string) => p.trim())
      return { short: parts[0]??d.display_name, full: parts.slice(0,3).join(', '), lat: parseFloat(d.lat), lng: parseFloat(d.lon) }
    })
  } catch { suggestions.value = [] }
  searching.value = false
}

async function searchLocation() {
  if (!locationInput.value) return
  if (selectedLocation.value) { calculate(); return }
  await fetchSuggestions()
  if (suggestions.value[0]) selectSuggestion(suggestions.value[0])
}

function selectSuggestion(s: { short:string; full:string; lat:number; lng:number }) {
  locationInput.value = s.short
  selectedLocation.value = { name:s.short, lat:s.lat, lng:s.lng }
  suggestions.value = []
  calculate()
}

onMounted(() => {
  selectedDate.value = new Date().toISOString().split('T')[0] as string
  selectedLocation.value = { name:'Kolkata', lat:22.5726, lng:88.3639 }
  locationInput.value = 'Kolkata'
  calculate()
})

function calculate() {
  error.value = ''
  if (!selectedDate.value) { error.value = 'Please select a date.'; return }
  const loc = selectedLocation.value ?? { name:'Kolkata', lat:22.5726, lng:88.3639 }
  calculating.value = true; panchang.value = null
  setTimeout(() => {
    try { panchang.value = computePanchang(selectedDate.value, loc.name, loc.lat, loc.lng) }
    catch (e:any) { error.value = e.message || 'Calculation failed.' }
    calculating.value = false
  }, 300)
}

function computePanchang(dateStr:string, locationName:string, lat:number, lng:number) {
  const date = new Date(dateStr+'T12:00:00')
  const jd = dateToJD(date)
  const sunLon = getSunLon(jd), moonLon = getMoonLon(jd)
  const ayn = getLahiri(jd)
  const sunSid = (sunLon-ayn+360)%360, moonSid = (moonLon-ayn+360)%360
  const tDeg = (moonSid-sunSid+360)%360
  const tNum = Math.floor(tDeg/12)+1
  const paksha = tNum<=15?'Shukla Paksha (Waxing)':'Krishna Paksha (Waning)'
  const TN=['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima','Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya']
  const TS=['🌑','🌒','🌒','🌓','🌓','🌔','🌔','🌕','🌕','🌕','🌕','🌔','🌔','🌓','🌕','🌖','🌖','🌗','🌗','🌘','🌘','🌑','🌑','🌑','🌑','🌒','🌒','🌓','🌓','🌑']
  const NN=['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
  const NL=['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']
  const ni=Math.floor(moonSid/(360/27)), np=Math.floor((moonSid%(360/27))/(360/27/4))+1
  const YN=['Vishkumbha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarman','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
  const YT=['Inauspicious','Auspicious','Auspicious','Auspicious','Auspicious','Inauspicious','Auspicious','Auspicious','Inauspicious','Inauspicious','Auspicious','Auspicious','Inauspicious','Auspicious','Inauspicious','Auspicious','Inauspicious','Auspicious','Inauspicious','Auspicious','Auspicious','Auspicious','Auspicious','Auspicious','Auspicious','Auspicious','Inauspicious']
  const yi=Math.floor(((sunSid+moonSid)%360)/(360/27))
  const KN=['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Shakuni','Chatushpada','Naga','Kimstughna']
  const KT=['Chara','Chara','Chara','Chara','Chara','Chara','Chara (Bhadra)','Sthira','Sthira','Sthira','Sthira']
  const ki=Math.floor(tDeg/6)%11
  const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const VD=[{sanskrit:'Ravivara',lord:'Sun',symbol:'☉'},{sanskrit:'Somavara',lord:'Moon',symbol:'☽'},{sanskrit:'Mangalavara',lord:'Mars',symbol:'♂'},{sanskrit:'Budhavara',lord:'Mercury',symbol:'☿'},{sanskrit:'Guruvara',lord:'Jupiter',symbol:'♃'},{sanskrit:'Shukravara',lord:'Venus',symbol:'♀'},{sanskrit:'Shanivara',lord:'Saturn',symbol:'♄'}]
  const wi=date.getDay()
  const {sunrise,sunset}=getSunriseSunset(jd,lat,lng)
  const dd=sunset-sunrise
  const rO=[7,1,6,4,5,3,2], yO=[4,3,2,1,7,6,5]
  const rP=rO[wi]??1, yP=yO[wi]??1
  const rS=sunrise+(dd/8)*(rP-1), yS=sunrise+(dd/8)*(yP-1)
  const mid=(sunrise+sunset)/2
  const mrH=((sunrise+1.0+((tNum-1)%30)*0.8)%24+24)%24
  const SN=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  const n=jd-2451545.0
  const PD=[
    {name:'Sun',symbol:'☉',color:'#f59e0b',lon:sunSid},
    {name:'Moon',symbol:'☽',color:'#c0c8d8',lon:moonSid},
    {name:'Mars',symbol:'♂',color:'#ef4444',lon:((355.433+0.52402*n)-ayn+360)%360},
    {name:'Mercury',symbol:'☿',color:'#84cc16',lon:((252.251+4.09234*n)-ayn+360)%360},
    {name:'Jupiter',symbol:'♃',color:'#f59e0b',lon:((34.351+0.08309*n)-ayn+360)%360},
    {name:'Venus',symbol:'♀',color:'#fbbf24',lon:((181.979+1.60214*n)-ayn+360)%360},
    {name:'Saturn',symbol:'♄',color:'#94a3b8',lon:((50.077+0.03346*n)-ayn+360)%360},
    {name:'Rahu',symbol:'☊',color:'#a78bfa',lon:((125.044-0.05295*n+360)%360-ayn+360)%360},
  ]
  const MN=['Brahma','Abhijit','Vijaya','Nishita','Sarvartha Siddhi','Amrit','Siddha','Labha']
  const MG=[true,true,true,false,true,true,wi!==0,wi!==6]
  return {
    displayDate:date.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),
    weekday:WD[wi]??'', locationName, samvat:`Vikram Samvat ${date.getFullYear()+56}`,
    tithi:{name:TN[(tNum-1)%30]??'',symbol:TS[(tNum-1)%30]??'🌑',number:`#${tNum}`,paksha},
    nakshatra:{name:NN[ni%27]??'',lord:NL[ni%27]??'',pada:np},
    yoga:{name:YN[yi%27]??'',nature:YT[yi%27]??'',number:yi+1},
    karana:{name:KN[ki]??'',type:KT[ki]??''},
    vara:VD[wi]??VD[0]!,
    sunrise:fmt(sunrise),sunset:fmt(sunset),moonrise:fmt(mrH),
    rahukaal:{start:fmt(rS),end:fmt(rS+dd/8)},
    yamaganda:{start:fmt(yS),end:fmt(yS+dd/8)},
    abhijit:{start:fmt(mid-0.4),end:fmt(mid+0.4)},
    muhurtas:MN.map((n,i)=>({name:n,good:MG[i]??true})),
    planets:PD.map(p=>({name:p.name,symbol:p.symbol,color:p.color,sign:SN[Math.floor(p.lon/30)%12]??''})),
  }
}

function dateToJD(d:Date){const y=d.getUTCFullYear(),m=d.getUTCMonth()+1,dd=d.getUTCDate(),A=Math.floor((14-m)/12),Y=y+4800-A,M=m+12*A-3;return dd+Math.floor((153*M+2)/5)+365*Y+Math.floor(Y/4)-Math.floor(Y/100)+Math.floor(Y/400)-32045}
function getSunLon(jd:number){const n=jd-2451545.0,L=(280.460+0.9856474*n)%360,g=((357.528+0.9856003*n)%360)*Math.PI/180;return(L+1.915*Math.sin(g)+0.020*Math.sin(2*g)+360)%360}
function getMoonLon(jd:number){const n=jd-2451545.0,L=(218.316+13.176396*n)%360,M=((134.963+13.064993*n)%360)*Math.PI/180,F=((93.272+13.229350*n)%360)*Math.PI/180;return(L+6.289*Math.sin(M)-1.274*Math.sin(2*F-M)+0.658*Math.sin(2*F)+360)%360}
function getLahiri(jd:number){return 23.85+(50.2564/3600)*(jd-2415020.0)/365.25}
function getSunriseSunset(jd:number,lat:number,lng:number){const n=jd-2451545.0,L=(280.460+0.9856474*n)%360,g=((357.528+0.9856003*n)%360)*Math.PI/180,lon=(L+1.915*Math.sin(g)+0.020*Math.sin(2*g))*Math.PI/180,e=23.439*Math.PI/180,dec=Math.asin(Math.sin(e)*Math.sin(lon)),latR=lat*Math.PI/180,cosH=(Math.cos(90.833*Math.PI/180)-Math.sin(latR)*Math.sin(dec))/(Math.cos(latR)*Math.cos(dec)),H=Math.acos(Math.max(-1,Math.min(1,cosH)))*180/Math.PI,eqT=4*(L-lon*180/Math.PI),noon=12-(lng-82.5)/15-eqT/60;return{sunrise:noon-H/15,sunset:noon+H/15}}
function fmt(h:number){h=((h%24)+24)%24;const hh=Math.floor(h),mm=Math.round((h-hh)*60),ap=hh<12?'AM':'PM',hd=hh%12===0?12:hh%12;return`${hd}:${String(mm).padStart(2,'0')} ${ap}`}
</script>