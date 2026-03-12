<template>
  <div class="min-h-screen bg-midnight-950 text-gray-200 relative overflow-x-hidden">

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

    <!-- Header -->
    <header class="relative z-10 border-b border-gold-500/15 py-6 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img
              src="/images/JYOTISH-logo.png"
              alt="Jyotish Logo"
              class="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"
            />
            <div>
              <h1 class="font-cinzel text-2xl md:text-3xl text-gold-400 tracking-[0.25em] uppercase group-hover:text-gold-300 transition-colors">
                ज्योतिष · Jyotish
              </h1>
              <p class="text-gray-500 font-garamond text-sm mt-0.5 tracking-widest">
                Vedic Astrology — Northern Indian Style
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="hidden md:flex items-center gap-2 font-cinzel text-xs tracking-widest text-orange-400/70 uppercase">
          <svg width="16" height="16" viewBox="0 0 22 22" fill="none" class="opacity-70">
            <path d="M18 11.5C18 15.64 14.64 19 10.5 19C8.38 19 6.46 18.14 5.05 16.74C5.83 16.92 6.65 17.02 7.5 17.02C12.2 17.02 16 13.22 16 8.52C16 6.68 15.44 4.98 14.5 3.57C16.62 4.99 18 7.09 18 11.5Z" stroke="#fb923c" stroke-width="1.3" fill="#fb923c" fill-opacity="0.1"/>
          </svg>
          <span>Panchang</span>
        </div>
      </div>
    </header>

    <!-- Page Title -->
    <div class="relative z-10 text-center pt-10 pb-6 px-4">
      <p class="font-cinzel text-orange-400/50 text-xs tracking-[0.4em] uppercase mb-2">पञ्चाङ्ग</p>
      <h2 class="font-cinzel text-3xl md:text-4xl text-orange-300/90 tracking-[0.2em] uppercase mb-3">Panchang</h2>
      <p class="font-garamond text-gray-500 text-base max-w-md mx-auto">
        Tithi · Nakshatra · Yoga · Karana · Rahukaal
      </p>
    </div>

    <!-- Main content -->
    <main class="relative z-10 max-w-5xl mx-auto px-4 pb-16">

      <!-- Input Card -->
      <div class="bg-midnight-900 border border-orange-500/20 rounded-2xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

          <!-- Date -->
          <div>
            <label class="font-cinzel text-xs text-orange-400/70 tracking-widest uppercase block mb-2">Date</label>
            <input
              v-model="selectedDate"
              type="date"
              class="w-full bg-black/40 border border-orange-500/20 rounded-xl px-4 py-3 font-garamond text-gray-200 text-base focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          <!-- Location -->
          <div class="md:col-span-2">
            <label class="font-cinzel text-xs text-orange-400/70 tracking-widest uppercase block mb-2">Location</label>
            <LocationMapPicker
              v-model="locationInput"
              v-model:lat="locationLat"
              v-model:lng="locationLng"
              @change="onLocationChange"
            />
          </div>

          <!-- Button -->
          <div>
            <button
              type="button"
              @click="calculate"
              :disabled="calculating"
              class="w-full px-6 py-3 rounded-xl font-cinzel text-sm tracking-widest uppercase border border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:border-orange-500/60 transition-all duration-300 disabled:opacity-40"
            >
              <span v-if="calculating">Calculating…</span>
              <span v-else">Calculate</span>
            </button>
          </div>
        </div>

        <!-- Quick location buttons -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button
            v-for="loc in quickLocations" :key="loc.name"
            type="button"
            @click="selectQuickLocation(loc)"
            class="px-3 py-1.5 rounded-lg border border-orange-500/10 bg-orange-500/5 hover:border-orange-500/30 hover:bg-orange-500/10 font-garamond text-xs text-gray-500 hover:text-orange-300 transition-all"
          >
            {{ loc.name }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 font-garamond text-red-300 text-sm text-center">
        {{ error }}
      </div>

      <!-- Results -->
      <template v-if="panchang">

        <!-- Date banner -->
        <div class="text-center mb-8">
          <p class="font-cinzel text-orange-400/60 text-xs tracking-[0.3em] uppercase">{{ panchang.weekday }}</p>
          <h3 class="font-cinzel text-2xl text-orange-300 tracking-widest mt-1">{{ panchang.displayDate }}</h3>
          <p class="font-garamond text-gray-500 text-sm mt-1">{{ panchang.locationName }} · {{ panchang.samvat }}</p>
        </div>

        <!-- Five Limbs Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <!-- Tithi -->
          <div class="bg-midnight-900 border border-orange-500/20 rounded-2xl p-5 text-center hover:border-orange-500/35 transition-colors">
            <div class="font-cinzel text-xs text-orange-400/50 tracking-widest uppercase mb-3">तिथि · Tithi</div>
            <div class="text-3xl mb-2">{{ panchang.tithi.symbol }}</div>
            <div class="font-cinzel text-orange-300 text-sm mb-1">{{ panchang.tithi.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.tithi.paksha }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">{{ panchang.tithi.number }}</div>
          </div>

          <!-- Nakshatra -->
          <div class="bg-midnight-900 border border-amber-500/20 rounded-2xl p-5 text-center hover:border-amber-500/35 transition-colors">
            <div class="font-cinzel text-xs text-amber-400/50 tracking-widest uppercase mb-3">नक्षत्र · Nakshatra</div>
            <div class="text-3xl mb-2">✦</div>
            <div class="font-cinzel text-amber-300 text-sm mb-1">{{ panchang.nakshatra.name }}</div>
            <div class="font-garamond text-xs text-gray-500">Lord: {{ panchang.nakshatra.lord }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">Pada {{ panchang.nakshatra.pada }}</div>
          </div>

          <!-- Yoga -->
          <div class="bg-midnight-900 border border-yellow-500/20 rounded-2xl p-5 text-center hover:border-yellow-500/35 transition-colors">
            <div class="font-cinzel text-xs text-yellow-400/50 tracking-widest uppercase mb-3">योग · Yoga</div>
            <div class="text-3xl mb-2">⊕</div>
            <div class="font-cinzel text-yellow-300 text-sm mb-1">{{ panchang.yoga.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.yoga.nature }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">No. {{ panchang.yoga.number }}</div>
          </div>

          <!-- Karana -->
          <div class="bg-midnight-900 border border-lime-500/20 rounded-2xl p-5 text-center hover:border-lime-500/35 transition-colors">
            <div class="font-cinzel text-xs text-lime-400/50 tracking-widest uppercase mb-3">करण · Karana</div>
            <div class="text-3xl mb-2">◐</div>
            <div class="font-cinzel text-lime-300 text-sm mb-1">{{ panchang.karana.name }}</div>
            <div class="font-garamond text-xs text-gray-500">{{ panchang.karana.type }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">Half tithi</div>
          </div>

          <!-- Vara / Weekday -->
          <div class="bg-midnight-900 border border-sky-500/20 rounded-2xl p-5 text-center hover:border-sky-500/35 transition-colors">
            <div class="font-cinzel text-xs text-sky-400/50 tracking-widest uppercase mb-3">वार · Vara</div>
            <div class="text-3xl mb-2">{{ panchang.vara.symbol }}</div>
            <div class="font-cinzel text-sky-300 text-sm mb-1">{{ panchang.vara.sanskrit }}</div>
            <div class="font-garamond text-xs text-gray-500">Lord: {{ panchang.vara.lord }}</div>
            <div class="font-garamond text-xs text-gray-600 mt-2">{{ panchang.weekday }}</div>
          </div>
        </div>

        <!-- Sun timings + Rahukaal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <!-- Sun timings -->
          <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6">
            <h4 class="font-cinzel text-xs text-gold-400/60 tracking-widest uppercase mb-5">☉ Sun Timings</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-lg">🌅</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Sunrise</div>
                    <div class="font-garamond text-xs text-gray-600">Pratah</div>
                  </div>
                </div>
                <div class="font-cinzel text-amber-300 text-base">{{ panchang.sunrise }}</div>
              </div>
              <div class="border-t border-gold-500/10"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-lg">🌇</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Sunset</div>
                    <div class="font-garamond text-xs text-gray-600">Sayam</div>
                  </div>
                </div>
                <div class="font-cinzel text-orange-300 text-base">{{ panchang.sunset }}</div>
              </div>
              <div class="border-t border-gold-500/10"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-lg">🌙</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Moonrise</div>
                    <div class="font-garamond text-xs text-gray-600">Chandrodaya</div>
                  </div>
                </div>
                <div class="font-cinzel text-blue-300 text-base">{{ panchang.moonrise }}</div>
              </div>
            </div>
          </div>

          <!-- Rahukaal + Abhijit -->
          <div class="bg-midnight-900 border border-red-500/20 rounded-2xl p-6">
            <h4 class="font-cinzel text-xs text-red-400/60 tracking-widest uppercase mb-5">⚠ Inauspicious Periods</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center font-cinzel text-xs text-red-400">☋</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Rahukaal</div>
                    <div class="font-garamond text-xs text-gray-600">Avoid new starts</div>
                  </div>
                </div>
                <div class="font-cinzel text-red-300 text-sm text-right">
                  <div>{{ panchang.rahukaal.start }}</div>
                  <div class="text-xs text-gray-600">to {{ panchang.rahukaal.end }}</div>
                </div>
              </div>
              <div class="border-t border-red-500/10"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center font-cinzel text-xs text-orange-400">☿</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Yamaganda</div>
                    <div class="font-garamond text-xs text-gray-600">Inauspicious</div>
                  </div>
                </div>
                <div class="font-cinzel text-orange-300 text-sm text-right">
                  <div>{{ panchang.yamaganda.start }}</div>
                  <div class="text-xs text-gray-600">to {{ panchang.yamaganda.end }}</div>
                </div>
              </div>
              <div class="border-t border-red-500/10"/>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center font-cinzel text-xs text-green-400">☀</div>
                  <div>
                    <div class="font-cinzel text-xs text-gray-400 tracking-wider">Abhijit Muhurta</div>
                    <div class="font-garamond text-xs text-gray-600">Most auspicious</div>
                  </div>
                </div>
                <div class="font-cinzel text-green-300 text-sm text-right">
                  <div>{{ panchang.abhijit.start }}</div>
                  <div class="text-xs text-gray-600">to {{ panchang.abhijit.end }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auspicious periods -->
        <div class="bg-midnight-900 border border-green-500/15 rounded-2xl p-6 mb-8">
          <h4 class="font-cinzel text-xs text-green-400/60 tracking-widest uppercase mb-5">✦ Auspicious Muhurtas Today</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="m in panchang.muhurtas" :key="m.name" class="text-center">
              <div class="font-cinzel text-xs text-gray-500 tracking-wider mb-1">{{ m.name }}</div>
              <div :class="m.good ? 'text-green-400' : 'text-red-400/60'" class="font-garamond text-sm">
                {{ m.good ? '✓ Good' : '✗ Avoid' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Planetary positions today -->
        <div class="bg-midnight-900 border border-gold-500/15 rounded-2xl p-6">
          <h4 class="font-cinzel text-xs text-gold-400/60 tracking-widest uppercase mb-5">☿ Planetary Positions</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="planet in panchang.planets" :key="planet.name"
              class="flex items-center gap-3 py-2 px-3 rounded-xl bg-black/20 border border-gold-500/8"
            >
              <span class="text-xl" :style="{ color: planet.color }">{{ planet.symbol }}</span>
              <div>
                <div class="font-cinzel text-xs text-gray-400 tracking-wider">{{ planet.name }}</div>
                <div class="font-garamond text-xs text-gray-600">{{ planet.sign }}</div>
              </div>
            </div>
          </div>
        </div>

      </template>

      <!-- Welcome state -->
      <div v-else-if="!calculating" class="text-center py-20">
        <div class="text-6xl text-orange-400/15 mb-6">🌙</div>
        <h3 class="font-cinzel text-orange-400/40 text-xl tracking-[0.3em] uppercase mb-4">Choose a Date & Location</h3>
        <p class="font-garamond text-gray-600 max-w-sm mx-auto">
          Enter the date and your location above to generate today's Panchang with all five limbs and auspicious timings.
        </p>
      </div>

    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-gold-500/10 py-6 mt-4 text-center">
      <p class="font-cinzel text-gray-600 text-xs tracking-widest uppercase">
        Astronomical calculations are approximate · For educational purposes
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LocationMapPicker from '~/components/LocationMapPicker.vue'

// ── Starfield ─────────────────────────────────────────────────────────────────
const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.45 + 0.08,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 5
}))

// ── State ─────────────────────────────────────────────────────────────────────
const selectedDate  = ref('')
const locationInput = ref('')
const locationLat   = ref(22.5726)
const locationLng   = ref(88.3639)
const calculating   = ref(false)
const error         = ref('')
const panchang      = ref<any>(null)

const quickLocations = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
]

function selectQuickLocation(loc: { name: string; lat: number; lng: number }) {
  locationInput.value = loc.name
  locationLat.value   = loc.lat
  locationLng.value   = loc.lng
  if (selectedDate.value) calculate()
}

function onLocationChange(payload: { name: string; lat: number; lng: number }) {
  locationInput.value = payload.name
  locationLat.value   = payload.lat
  locationLng.value   = payload.lng
  if (selectedDate.value) calculate()
}

onMounted(() => {
  const today = new Date()
  selectedDate.value = today.toISOString().split('T')[0] as string
  locationInput.value = 'Kolkata'
  calculate()
})

// ── Core calculation ─────────────────────────────────────────────────────────
function calculate() {
  error.value = ''
  if (!selectedDate.value) { error.value = 'Please select a date.'; return }

  calculating.value = true
  panchang.value = null

  setTimeout(() => {
    try {
      const result = computePanchang(selectedDate.value, locationInput.value || 'Unknown', locationLat.value, locationLng.value)
      panchang.value = result
    } catch (e: any) {
      error.value = e.message || 'Calculation failed.'
    }
    calculating.value = false
  }, 400)
}

// ── Panchang computation ──────────────────────────────────────────────────────
function computePanchang(dateStr: string, locationName: string, lat: number, lng: number) {
  const date = new Date(dateStr + 'T12:00:00')
  const jd = dateToJD(date)

  // Sun & Moon positions (simplified VSOP87 approximation)
  const sunLon  = getSunLongitude(jd)
  const moonLon = getMoonLongitude(jd)

  // Ayanamsha (Lahiri)
  const ayanamsha = getLahiriAyanamsha(jd)

  // Sidereal positions
  const sunSid  = (sunLon  - ayanamsha + 360) % 360
  const moonSid = (moonLon - ayanamsha + 360) % 360

  // Tithi: every 12° difference between Moon and Sun
  const tithiDeg = (moonSid - sunSid + 360) % 360
  const tithiNum = Math.floor(tithiDeg / 12) + 1
  const paksha   = tithiNum <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)'
  const tithiNames = [
    'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
    'Shashthi','Saptami','Ashtami','Navami','Dashami',
    'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima / Amavasya',
    'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
    'Shashthi','Saptami','Ashtami','Navami','Dashami',
    'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya'
  ]
  const tithiSymbols = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌑',
    '🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔',
    '🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌕','🌖']

  // Nakshatra: every 13°20' (27 nakshatras)
  const nakshatraNames = [
    'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu',
    'Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta',
    'Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha',
    'Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada',
    'Uttara Bhadrapada','Revati'
  ]
  const nakshatraLords = [
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
    'Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'
  ]
  const nakIdx  = Math.floor(moonSid / (360/27))
  const nakPada = Math.floor((moonSid % (360/27)) / (360/27/4)) + 1

  // Yoga: (Sun + Moon) / 13.3333
  const yogaNames = [
    'Vishkumbha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda',
    'Sukarman','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata',
    'Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva',
    'Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'
  ]
  const yogaNature = [
    'Inauspicious','Auspicious','Auspicious','Auspicious','Auspicious','Inauspicious',
    'Auspicious','Auspicious','Inauspicious','Inauspicious','Auspicious','Auspicious',
    'Inauspicious','Auspicious','Inauspicious','Auspicious','Inauspicious','Auspicious',
    'Inauspicious','Auspicious','Auspicious','Auspicious','Auspicious','Auspicious',
    'Auspicious','Auspicious','Inauspicious'
  ]
  const yogaDeg = (sunSid + moonSid) % 360
  const yogaIdx = Math.floor(yogaDeg / (360/27))

  // Karana: half-tithi
  const karanaNames = [
    'Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti',
    'Shakuni','Chatushpada','Naga','Kimstughna'
  ]
  const karanaTypes = [
    'Chara','Chara','Chara','Chara','Chara','Chara','Chara (Bhadra)',
    'Sthira','Sthira','Sthira','Sthira'
  ]
  const karanaNum = Math.floor(tithiDeg / 6) % 11

  // Vara (weekday)
  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const varaData = [
    { sanskrit: 'Ravivara',   lord: 'Sun',     symbol: '☉' },
    { sanskrit: 'Somavara',   lord: 'Moon',    symbol: '☽' },
    { sanskrit: 'Mangalavara',lord: 'Mars',    symbol: '♂' },
    { sanskrit: 'Budhavara',  lord: 'Mercury', symbol: '☿' },
    { sanskrit: 'Guruvara',   lord: 'Jupiter', symbol: '♃' },
    { sanskrit: 'Shukravara', lord: 'Venus',   symbol: '♀' },
    { sanskrit: 'Shanivara',  lord: 'Saturn',  symbol: '♄' },
  ]
  const weekdayIdx = date.getDay()

  // Sunrise/Sunset (approximate)
  const { sunrise, sunset } = getSunriseSunset(jd, lat, lng)
  const dayDuration = sunset - sunrise  // in hours

  // Rahukaal (1/8 of day from sunrise, weekday-dependent)
  const rahuOrder: number[] = [7, 1, 6, 4, 5, 3, 2]  // index into 8 parts; 1-based
  const rahuPart  = rahuOrder[weekdayIdx] ?? 1
  const rahuStart = sunrise + (dayDuration / 8) * (rahuPart - 1)
  const rahuEnd   = rahuStart + dayDuration / 8

  // Yamaganda
  const yamOrder: number[] = [4, 3, 2, 1, 7, 6, 5]
  const yamPart  = yamOrder[weekdayIdx] ?? 1
  const yamStart = sunrise + (dayDuration / 8) * (yamPart - 1)
  const yamEnd   = yamStart + dayDuration / 8

  // Abhijit (midday ± 24 minutes)
  const midday   = (sunrise + sunset) / 2
  const abhijitS = midday - 0.4
  const abhijitE = midday + 0.4

  // Moonrise — each tithi the moon rises ~48 minutes later than the previous day
  // Tithi 1 (Pratipada, Shukla): ~sunrise + 48min (just after sun)
  // Tithi 15 (Purnima): ~sunset time
  // Tithi 16-30 (Krishna): progressively later into the night / early morning
  const tithiIndex = (tithiNum - 1) % 30  // 0=Pratipada, 14=Purnima, 29=Amavasya
  // Base: each tithi adds 0.8hr (48 min) from sunrise
  // At Pratipada (0): rises ~1hr after sunrise
  // At Purnima (14): rises ~sunset
  // At Amavasya (29): rises just before sunrise next day
  const moonriseH = ((sunrise + 1.0 + tithiIndex * 0.8) % 24 + 24) % 24

  // Planetary signs
  const signNames = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                     'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  const planetData = [
    { name: 'Sun',    symbol: '☉', color: '#f59e0b', lon: sunSid },
    { name: 'Moon',   symbol: '☽', color: '#c0c8d8', lon: moonSid },
    { name: 'Mars',   symbol: '♂', color: '#ef4444', lon: (sunSid + 52 + jd*0.001) % 360 },
    { name: 'Mercury',symbol: '☿', color: '#84cc16', lon: (sunSid + 18 + jd*0.003) % 360 },
    { name: 'Jupiter',symbol: '♃', color: '#f59e0b', lon: (sunSid + 120 + jd*0.00009) % 360 },
    { name: 'Venus',  symbol: '♀', color: '#fbbf24', lon: (sunSid + 35 + jd*0.002) % 360 },
    { name: 'Saturn', symbol: '♄', color: '#7c6f5b', lon: (sunSid + 200 + jd*0.00003) % 360 },
    { name: 'Rahu',   symbol: '☊', color: '#a855f7', lon: (360 - sunSid * 0.053 + 180) % 360 },
  ]

  // Muhurtas (8 based on weekday)
  const muhurtaNames = ['Brahma','Abhijit','Vijaya','Nishita','Sarvartha Siddhi','Amrit','Siddha','Labha']
  const goodMuhurtas: boolean[] = [true, true, true, false, true, true, weekdayIdx !== 0, weekdayIdx !== 6]

  // Vikram Samvat (approx)
  const samvatYear = date.getFullYear() + 56
  const samvat = `Vikram Samvat ${samvatYear}`

  const displayDate = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return {
    displayDate,
    weekday: weekdays[weekdayIdx],
    locationName: locationInput.value || 'India',
    samvat,
    tithi: {
      name: tithiNames[(tithiNum - 1) % 30],
      symbol: tithiSymbols[(tithiNum - 1) % 30],
      number: `#${tithiNum}`,
      paksha
    },
    nakshatra: {
      name: nakshatraNames[nakIdx],
      lord: nakshatraLords[nakIdx],
      pada: nakPada
    },
    yoga: {
      name: yogaNames[yogaIdx],
      nature: yogaNature[yogaIdx],
      number: yogaIdx + 1
    },
    karana: {
      name: karanaNames[karanaNum],
      type: karanaTypes[karanaNum]
    },
    vara: varaData[weekdayIdx],
    sunrise: fmtHour(sunrise),
    sunset: fmtHour(sunset),
    moonrise: fmtHour(moonriseH),
    rahukaal:  { start: fmtHour(rahuStart),   end: fmtHour(rahuEnd) },
    yamaganda: { start: fmtHour(yamStart),    end: fmtHour(yamEnd) },
    abhijit:   { start: fmtHour(abhijitS),    end: fmtHour(abhijitE) },
    muhurtas: muhurtaNames.map((n, i) => ({ name: n, good: goodMuhurtas[i] })),
    planets: planetData.map(p => ({
      name: p.name, symbol: p.symbol, color: p.color,
      sign: signNames[Math.floor(p.lon / 30)]
    }))
  }
}

// ── Astronomical helpers ──────────────────────────────────────────────────────
function dateToJD(date: Date): number {
  const y = date.getUTCFullYear(), m = date.getUTCMonth() + 1, d = date.getUTCDate()
  const A = Math.floor((14 - m) / 12)
  const Y = y + 4800 - A, M = m + 12 * A - 3
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y/4) - Math.floor(Y/100) + Math.floor(Y/400) - 32045
}

function getSunLongitude(jd: number): number {
  const n = jd - 2451545.0
  const L = (280.460 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180
  return (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g) + 360) % 360
}

function getMoonLongitude(jd: number): number {
  const n = jd - 2451545.0
  const L = (218.316 + 13.176396 * n) % 360
  const M = ((134.963 + 13.064993 * n) % 360) * Math.PI / 180
  const F = ((93.272  + 13.229350 * n) % 360) * Math.PI / 180
  return (L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2*F - M) + 0.658 * Math.sin(2*F) + 360) % 360
}

function getLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  return 23.85 + 50.2564 / 3600 * (jd - 2415020.0) / 365.25
}

function getSunriseSunset(jd: number, lat: number, lng: number): { sunrise: number; sunset: number } {
  // Simplified civil sunrise/sunset
  const n = jd - 2451545.0
  const L = (280.460 + 0.9856474 * n) % 360
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180
  const lon = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180
  const e  = 23.439 * Math.PI / 180
  const dec = Math.asin(Math.sin(e) * Math.sin(lon))
  const latR = lat * Math.PI / 180
  const cosH = (Math.cos(90.833 * Math.PI / 180) - Math.sin(latR) * Math.sin(dec)) / (Math.cos(latR) * Math.cos(dec))
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI
  const eqT = 4 * (L - (lon * 180 / Math.PI)) // minutes (rough)
  const noon = 12 - (lng - 82.5) / 15 - eqT / 60  // IST base 82.5°E
  return {
    sunrise: noon - H / 15,
    sunset:  noon + H / 15
  }
}

function fmtHour(h: number): string {
  h = ((h % 24) + 24) % 24
  const hh  = Math.floor(h)
  const mm  = Math.round((h - hh) * 60)
  const ampm = hh < 12 ? 'AM' : 'PM'
  const hDisp = hh % 12 === 0 ? 12 : hh % 12
  return `${hDisp}:${String(mm).padStart(2, '0')} ${ampm}`
}
</script>

<style>
@keyframes twinkle {
  0%, 100% { opacity: 0.15; }
  50%       { opacity: 0.75; }
}
</style>