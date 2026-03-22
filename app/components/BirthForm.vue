<template>
  <div class="bg-midnight-900 border border-gold-500/20 rounded-2xl p-6 backdrop-blur-sm">
    <h2 class="font-cinzel text-gold-400 text-xl tracking-[0.2em] uppercase mb-6 text-center">
      Birth Details
    </h2>

    <div class="space-y-5">

      <!-- Name -->
      <div>
        <label class="block font-cinzel text-gold-500/70 text-xs tracking-widest uppercase mb-2">
          Your Name
        </label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="Enter name"
          class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-4 py-3 text-gray-200 font-garamond text-base placeholder-gray-600 focus:outline-none focus:border-gold-400/60 transition-colors"
        />
      </div>

      <!-- ── Custom Date Picker ── -->
      <div>
        <label class="block font-cinzel text-gold-500/70 text-xs tracking-widest uppercase mb-2">
          Birth Date
        </label>

        <!-- Trigger field -->
        <button
          type="button"
          @click="toggleCalendar"
          class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-4 py-3 text-left flex items-center justify-between font-garamond text-sm transition-colors hover:border-gold-400/60 focus:outline-none focus:border-gold-400/60"
          :class="formData.birthDate ? 'text-gray-200' : 'text-gray-600'"
        >
          <span>{{ formData.birthDate ? formatDisplayDate(formData.birthDate) : 'Select birth date' }}</span>
          <span class="text-gold-400/60 text-base">{{ calOpen ? '▲' : '▼' }}</span>
        </button>

        <!-- Calendar panel -->
        <div
          v-if="calOpen"
          class="mt-2 bg-black/90 border border-gold-500/30 rounded-xl p-4 shadow-2xl shadow-black/60"
        >
          <!-- Month/Year navigation -->
          <div class="flex items-center justify-between mb-3">
            <button type="button" @click="prevMonth" class="text-gold-400 hover:text-gold-300 px-2 py-1 font-cinzel text-lg leading-none">‹</button>
            <div class="flex items-center gap-2">
              <!-- Month selector -->
              <select
                v-model="calMonth"
                class="bg-transparent text-gold-300 font-cinzel text-sm focus:outline-none cursor-pointer"
              >
                <option v-for="(m, i) in MONTHS" :key="i" :value="i" class="bg-gray-900">{{ m }}</option>
              </select>
              <!-- Year input -->
              <input
                v-model.number="calYear"
                type="number"
                min="1800" max="2100"
                class="bg-transparent text-gold-300 font-cinzel text-sm w-16 text-center focus:outline-none border-b border-gold-500/30"
              />
            </div>
            <button type="button" @click="nextMonth" class="text-gold-400 hover:text-gold-300 px-2 py-1 font-cinzel text-lg leading-none">›</button>
          </div>

          <!-- Day headers -->
          <div class="grid grid-cols-7 mb-1">
            <div v-for="d in ['S','M','T','W','T','F','S']" :key="d"
              class="text-center text-gold-500/50 font-cinzel text-xs py-1">{{ d }}</div>
          </div>

          <!-- Days grid -->
          <div class="grid grid-cols-7 gap-0.5">
            <!-- Leading blanks -->
            <div v-for="_ in calStartDay" :key="'b'+_" />
            <!-- Day cells -->
            <button
              v-for="day in calDaysInMonth"
              :key="day"
              type="button"
              @click="selectDay(day)"
              class="aspect-square flex items-center justify-center rounded-lg text-sm font-garamond transition-all"
              :class="dayClass(day)"
            >{{ day }}</button>
          </div>

          <!-- Quick year jump -->
          <div class="mt-3 pt-3 border-t border-gold-500/20 flex gap-2 flex-wrap">
            <button
              v-for="y in quickYears"
              :key="y"
              type="button"
              @click="calYear = y"
              class="text-xs font-cinzel text-gold-500/60 hover:text-gold-300 px-2 py-0.5 rounded border border-gold-500/20 hover:border-gold-400/40 transition-colors"
            >{{ y }}</button>
          </div>
        </div>
      </div>

      <!-- Birth Time -->
      <div>
        <label class="block font-cinzel text-gold-500/70 text-xs tracking-widest uppercase mb-2">
          Birth Time
        </label>
        <ClockPicker v-model="formData.birthTime" />
      </div>

      <!-- ── Location Search ── -->
      <div>
        <label class="block font-cinzel text-gold-500/70 text-xs tracking-widest uppercase mb-2">
          Birth Place
        </label>

        <!-- Search input -->
        <div class="relative">
          <input
            v-model="locationQuery"
            type="text"
            placeholder="Search city or place..."
            autocomplete="off"
            @input="onLocationInput"
            @keydown.escape="locationResults = []"
            class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-4 py-3 pr-10 text-gray-200 font-garamond text-sm placeholder-gray-600 focus:outline-none focus:border-gold-400/60 transition-colors"
          />
          <!-- Search icon / spinner -->
          <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/50">
            <span v-if="locSearching" class="inline-block animate-spin text-sm">⟳</span>
            <span v-else class="text-sm">⌖</span>
          </div>
        </div>

        <!-- Selected location display -->
        <div v-if="formData.locationName && !locationResults.length" class="mt-1.5 px-1 flex items-center gap-2">
          <span class="text-gold-400/60 text-xs">✓</span>
          <span class="text-gray-400 font-garamond text-xs">{{ formData.locationName }}</span>
          <span class="text-gray-600 text-xs tabular-nums">{{ formData.lat.toFixed(4) }}, {{ formData.lon.toFixed(4) }} · TZ {{ formData.tzOffset >= 0 ? '+' : '' }}{{ formData.tzOffset }}</span>
        </div>

        <!-- Dropdown results -->
        <div
          v-if="locationResults.length || locNoResults"
          class="mt-1 bg-black/95 border border-gold-500/20 rounded-xl overflow-hidden shadow-2xl shadow-black/70 z-50"
        >
          <button
            v-for="(res, i) in locationResults"
            :key="i"
            type="button"
            @click="selectLocation(res)"
            class="w-full text-left px-4 py-3 font-garamond text-sm text-gray-300 hover:bg-gold-500/10 hover:text-gold-300 border-b border-white/5 last:border-0 transition-colors"
          >
            <div>{{ res.display_name.split(',').slice(0, 3).join(', ') }}</div>
            <div class="text-gray-600 text-xs mt-0.5">{{ res.display_name.split(',').slice(3).join(',').trim() }}</div>
          </button>

          <div v-if="locNoResults" class="px-4 py-3 text-gray-600 font-garamond text-sm">
            No results found. Try a different spelling.
          </div>
        </div>

        <!-- Error -->
        <div v-if="locError" class="mt-1 text-crimson-400 font-garamond text-xs px-1">
          {{ locError }}
        </div>
      </div>

      <!-- Manual Lat/Lon/TZ (collapsible) -->
      <div>
        <button
          type="button"
          @click="showManual = !showManual"
          class="text-xs font-cinzel text-gold-500/50 hover:text-gold-400/70 tracking-widest uppercase flex items-center gap-1 transition-colors"
        >
          <span>{{ showManual ? '▲' : '▼' }}</span>
          Manual Coordinates
        </button>

        <div v-if="showManual" class="grid grid-cols-3 gap-3 mt-3">
          <div>
            <label class="block font-cinzel text-gold-500/60 text-xs tracking-widest uppercase mb-1.5">Lat</label>
            <input v-model.number="formData.lat" type="number" step="0.0001"
              class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-3 py-2.5 text-gray-200 font-garamond text-sm focus:outline-none focus:border-gold-400/60 transition-colors"/>
          </div>
          <div>
            <label class="block font-cinzel text-gold-500/60 text-xs tracking-widest uppercase mb-1.5">Lon</label>
            <input v-model.number="formData.lon" type="number" step="0.0001"
              class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-3 py-2.5 text-gray-200 font-garamond text-sm focus:outline-none focus:border-gold-400/60 transition-colors"/>
          </div>
          <div>
            <label class="block font-cinzel text-gold-500/60 text-xs tracking-widest uppercase mb-1.5">TZ</label>
            <input v-model.number="formData.tzOffset" type="number" step="0.5"
              class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-3 py-2.5 text-gray-200 font-garamond text-sm focus:outline-none focus:border-gold-400/60 transition-colors"/>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="text-crimson-400 font-garamond text-sm text-center py-1">
        {{ error }}
      </div>

      <!-- Submit -->
      <button
        type="button"
        @click="$emit('generate')"
        :disabled="loading"
        class="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-cinzel text-midnight-950 text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20 active:scale-[0.98]"
      >
        <span v-if="loading" class="inline-flex items-center gap-2">
          <span class="inline-block animate-spin">☉</span> Calculating...
        </span>
        <span v-else>Cast the Chart</span>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormData } from '~/composables/useAstrology'

const props = defineProps<{
  formData: FormData
  loading?: boolean
  error?: string | null
}>()

defineEmits<{ generate: [] }>()

// ─── Calendar state ───────────────────────────────────────────────────────────
const calOpen  = ref(false)
const today    = new Date()
const calMonth = ref(today.getMonth())
const calYear  = ref(today.getFullYear())

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

// Initialize calendar to birth date if already set
watch(() => props.formData.birthDate, (v) => {
  if (v) {
    const parts = v.split('-').map(Number)
    calYear.value  = parts[0] ?? today.getFullYear()
    calMonth.value = (parts[1] ?? 1) - 1
  }
}, { immediate: true })

function toggleCalendar() { calOpen.value = !calOpen.value }

function prevMonth() {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
function nextMonth() {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

const calDaysInMonth = computed(() => new Date(calYear.value, calMonth.value + 1, 0).getDate())

// 0=Sun,1=Mon…6=Sat — what day does the 1st fall on?
const calStartDay = computed(() => new Date(calYear.value, calMonth.value, 1).getDay())

function dayClass(day: number): string {
  const iso = `${calYear.value}-${String(calMonth.value + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const isSelected = props.formData.birthDate === iso
  const isToday = iso === today.toISOString().slice(0, 10)

  if (isSelected) return 'bg-gold-500 text-midnight-950 font-bold hover:bg-gold-400'
  if (isToday)    return 'text-gold-400 border border-gold-500/40 hover:bg-gold-500/10'
  return 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
}

function selectDay(day: number) {
  const m = String(calMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  props.formData.birthDate = `${calYear.value}-${m}-${d}`
  calOpen.value = false
}

function formatDisplayDate(iso: string): string {
  if (!iso) return ''
  const parts = iso.split('-').map(Number)
  const y = parts[0] ?? ''
  const m = parts[1] ?? 1
  const d = parts[2] ?? ''
  return `${d} ${MONTHS[m - 1] ?? ''} ${y}`
}

// Quick year jump buttons
const quickYears = computed(() => {
  const base = calYear.value
  return [base - 40, base - 20, base - 10, base - 5, base + 5, base + 10]
    .filter(y => y >= 1800 && y <= 2100)
})

// ─── Location search ──────────────────────────────────────────────────────────
interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

const locationQuery  = ref(props.formData.locationName || '')
const locationResults = ref<NominatimResult[]>([])
const locSearching   = ref(false)
const locNoResults   = ref(false)
const locError       = ref('')
const showManual     = ref(false)
let   debounceTimer: ReturnType<typeof setTimeout> | null = null

function onLocationInput() {
  locNoResults.value = false
  locError.value     = ''
  if (debounceTimer) clearTimeout(debounceTimer)
  if (locationQuery.value.trim().length < 2) {
    locationResults.value = []
    return
  }
  debounceTimer = setTimeout(searchLocation, 600)
}

async function searchLocation() {
  locSearching.value = true
  locationResults.value = []
  locNoResults.value = false

  try {
    const q = encodeURIComponent(locationQuery.value.trim())
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=6&addressdetails=1`
    const res  = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'JyotishApp/1.0' }
    })

    if (!res.ok) throw new Error('Network error')

    const data: NominatimResult[] = await res.json()

    if (data.length === 0) {
      locNoResults.value = true
      locationResults.value = []
    } else {
      locationResults.value = data
    }
  } catch (e) {
    locError.value = 'Could not reach location service. Use manual coordinates.'
  } finally {
    locSearching.value = false
  }
}

function selectLocation(res: NominatimResult) {
  const lat = parseFloat(res.lat)
  const lon = parseFloat(res.lon)

  props.formData.lat  = parseFloat(lat.toFixed(4))
  props.formData.lon  = parseFloat(lon.toFixed(4))
  props.formData.tzOffset = guessTz(lon)
  props.formData.locationName = res.display_name.split(',').slice(0, 3).join(', ')

  locationQuery.value   = props.formData.locationName
  locationResults.value = []
  locNoResults.value    = false
}

/** Rough timezone guess from longitude (in hours, ±0.5 rounding) */
function guessTz(lon: number): number {
  const raw = lon / 15
  // Round to nearest 0.5
  return Math.round(raw * 2) / 2
}
</script>