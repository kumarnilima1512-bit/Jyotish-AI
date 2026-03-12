<template>
  <div class="relative">

    <!-- Trigger button -->
    <button
      type="button"
      @click="openModal"
      class="w-full flex items-center gap-3 bg-black/40 border border-orange-500/20 rounded-xl px-4 py-3 font-garamond text-base focus:outline-none hover:border-orange-500/40 transition-colors group"
    >
      <svg class="shrink-0 w-4 h-4 text-orange-400/60 group-hover:text-orange-400 transition-colors" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>
      <span :class="selectedName ? 'text-gray-200' : 'text-gray-600'" class="flex-1 text-left truncate">
        {{ selectedName || 'Click to pick location on map' }}
      </span>
      <span v-if="selectedLat" class="font-cinzel text-xs text-orange-400/40 shrink-0">
        {{ selectedLat.toFixed(3) }}, {{ selectedLng.toFixed(3) }}
      </span>
    </button>

    <!-- Teleport only after client mount (SSR safe) -->
    <template v-if="isMounted">
      <Teleport to="body">
        <Transition name="modal-fade">
          <div
            v-if="isOpen"
            class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"/>

            <!-- Modal -->
            <div
              class="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style="background:#0d0d1a; border:1px solid rgba(251,146,60,0.25); max-height:90vh"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-5 py-4 shrink-0" style="border-bottom:1px solid rgba(251,146,60,0.15)">
                <div>
                  <h3 class="font-cinzel text-sm text-orange-300 tracking-widest uppercase">Pick Location</h3>
                  <p class="font-garamond text-xs text-gray-600 mt-0.5">Search a city or click anywhere on the map</p>
                </div>
                <button
                  @click="closeModal"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="none" class="w-4 h-4">
                    <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>

              <!-- Search -->
              <div class="px-5 py-3 shrink-0 relative" style="border-bottom:1px solid rgba(251,146,60,0.1)">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/40 pointer-events-none" viewBox="0 0 20 20" fill="none">
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <input
                    ref="searchInputEl"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search city, place…"
                    autocomplete="off"
                    class="w-full bg-black/40 border border-orange-500/15 rounded-xl pl-10 pr-10 py-2.5 font-garamond text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-orange-500/40 transition-colors"
                    @input="onSearchInput"
                    @keydown.escape="closeModal"
                    @keydown.enter="onSearchEnter"
                  />
                  <div v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <div class="w-3.5 h-3.5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"/>
                  </div>
                </div>

                <!-- Search results dropdown -->
                <div
                  v-if="searchResults.length"
                  class="absolute left-5 right-5 top-full mt-1 rounded-xl overflow-hidden z-20 shadow-2xl"
                  style="background:#0d0d1a; border:1px solid rgba(251,146,60,0.2)"
                >
                  <button
                    v-for="(r, i) in searchResults"
                    :key="i"
                    type="button"
                    class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-orange-500/8 transition-colors"
                    style="border-bottom:1px solid rgba(251,146,60,0.08)"
                    @click="selectResult(r)"
                  >
                    <svg class="shrink-0 w-3.5 h-3.5 mt-0.5 text-orange-400/40" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    </svg>
                    <div class="min-w-0">
                      <div class="font-cinzel text-xs text-gray-300 truncate">{{ r.shortName }}</div>
                      <div class="font-garamond text-xs text-gray-600 truncate mt-0.5">{{ r.displayName }}</div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Map -->
              <div class="relative flex-1" style="min-height:340px">
                <div ref="mapEl" class="absolute inset-0" style="background:#0a0a14"/>

                <!-- Pin info + confirm bar -->
                <Transition name="bar-fade">
                  <div
                    v-if="pinLat !== null"
                    class="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2.5 rounded-xl z-10"
                    style="background:rgba(0,0,0,0.85);border:1px solid rgba(251,146,60,0.22);backdrop-filter:blur(8px)"
                  >
                    <div class="min-w-0 mr-3">
                      <div class="font-cinzel text-xs text-orange-300 tracking-wider truncate">
                        {{ pinName || 'Selected Location' }}
                      </div>
                      <div class="font-garamond text-xs text-gray-500 mt-0.5">
                        {{ (pinLat as number).toFixed(5) }}°N &nbsp;{{ (pinLng as number).toFixed(5) }}°E
                      </div>
                    </div>
                    <button
                      @click="confirmSelection"
                      class="shrink-0 px-4 py-1.5 rounded-lg font-cinzel text-xs text-orange-300 tracking-wider transition-all hover:bg-orange-500/30"
                      style="background:rgba(251,146,60,0.18);border:1px solid rgba(251,146,60,0.4)"
                    >
                      Confirm ✓
                    </button>
                  </div>
                </Transition>

                <!-- Hint when no pin yet -->
                <div v-if="pinLat === null" class="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-10">
                  <div class="px-4 py-2 rounded-xl" style="background:rgba(0,0,0,0.65)">
                    <p class="font-cinzel text-xs text-gray-600 tracking-widest">Click on map to place pin</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Transition>
      </Teleport>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

// ── Props / Emits ─────────────────────────────────────────────────────────────
interface Props { modelValue?: string; lat?: number; lng?: number }
const props = withDefaults(defineProps<Props>(), { modelValue: '', lat: 0, lng: 0 })
const emit  = defineEmits<{
  'update:modelValue': [v: string]
  'update:lat':        [v: number]
  'update:lng':        [v: number]
  'change':            [p: { name: string; lat: number; lng: number }]
}>()

// ── SSR guard — Teleport & Leaflet need the DOM ───────────────────────────────
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

// ── UI state ──────────────────────────────────────────────────────────────────
const isOpen        = ref(false)
const mapEl         = ref<HTMLElement | null>(null)
const searchInputEl = ref<HTMLInputElement | null>(null)

const searchQuery   = ref('')
const searching     = ref(false)
const searchResults = ref<{ shortName: string; displayName: string; lat: number; lng: number }[]>([])
let   searchTimer: ReturnType<typeof setTimeout> | null = null

const pinLat  = ref<number | null>(null)
const pinLng  = ref<number | null>(null)
const pinName = ref('')

const selectedName = ref(props.modelValue || '')
const selectedLat  = ref(props.lat  || 0)
const selectedLng  = ref(props.lng  || 0)

// Leaflet runtime vars (never touched on server)
let mapInst:    any = null
let markerInst: any = null
let Leaflet:    any = null

// ── Open / close ──────────────────────────────────────────────────────────────
async function openModal() {
  isOpen.value = true
  await nextTick()
  await nextTick()           // wait for Teleport + v-if to render
  await initLeaflet()
  await nextTick()
  searchInputEl.value?.focus()
}

function closeModal() {
  isOpen.value        = false
  searchResults.value = []
  searchQuery.value   = ''
}

// ── Leaflet init (lazy, client-only) ─────────────────────────────────────────
async function initLeaflet() {
  if (!mapEl.value) return

  // Already initialised — just fix tile rendering after CSS animation
  if (mapInst) {
    setTimeout(() => mapInst?.invalidateSize(), 80)
    return
  }

  // 1. Inject CSS once
  if (!document.getElementById('leaflet-css')) {
    const link  = document.createElement('link')
    link.id     = 'leaflet-css'
    link.rel    = 'stylesheet'
    link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
  }

  // 2. Inject JS once (avoids SSR window error)
  const win = window as any
  if (!win.L) {
    await new Promise<void>((resolve, reject) => {
      const s  = document.createElement('script')
      s.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Leaflet CDN load failed'))
      document.head.appendChild(s)
    })
  }
  Leaflet = win.L

  // 3. Build map
  const startLat = selectedLat.value || 22.5726
  const startLng = selectedLng.value || 88.3639
  const zoom     = selectedLat.value ? 8 : 5

  mapInst = Leaflet.map(mapEl.value, {
    zoomControl: true,
    attributionControl: true
  }).setView([startLat, startLng], zoom)

  // Dark CartoDB tiles
  Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © CartoDB',
    maxZoom: 19
  }).addTo(mapInst)

  // Restore existing pin
  if (selectedLat.value && selectedLng.value) {
    markerInst = Leaflet.marker([selectedLat.value, selectedLng.value], { icon: makeIcon() }).addTo(mapInst)
    pinLat.value  = selectedLat.value
    pinLng.value  = selectedLng.value
    pinName.value = selectedName.value
  }

  // Click → drop pin + reverse geocode
  mapInst.on('click', async (e: any) => {
    const { lat, lng } = e.latlng
    dropPin(lat, lng)
    pinName.value = '…'
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const d    = await res.json()
      pinName.value =
        d.address?.city       ||
        d.address?.town       ||
        d.address?.village    ||
        d.address?.county     ||
        d.display_name?.split(',')[0] ||
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    } catch {
      pinName.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  })

  setTimeout(() => mapInst?.invalidateSize(), 150)
}

// Orange teardrop icon
function makeIcon() {
  return Leaflet.divIcon({
    className: '',
    html: `<div style="position:relative;width:26px;height:36px">
      <div style="
        width:22px;height:22px;
        background:rgba(251,146,60,0.95);
        border:2.5px solid rgba(255,255,255,0.5);
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 3px 14px rgba(251,146,60,0.6);
        position:absolute;top:0;left:0
      "></div>
      <div style="
        width:6px;height:6px;
        background:#fff;
        border-radius:50%;
        position:absolute;top:7px;left:7px;
        opacity:0.85
      "></div>
    </div>`,
    iconSize:   [26, 36],
    iconAnchor: [13, 36]
  })
}

function dropPin(lat: number, lng: number) {
  if (!Leaflet || !mapInst) return
  pinLat.value = lat
  pinLng.value = lng
  if (markerInst) {
    markerInst.setLatLng([lat, lng])
  } else {
    markerInst = Leaflet.marker([lat, lng], { icon: makeIcon() }).addTo(mapInst)
  }
}

// ── Nominatim search ──────────────────────────────────────────────────────────
function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  if (!searchQuery.value.trim() || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  searchTimer = setTimeout(doSearch, 480)
}

async function onSearchEnter() {
  const first = searchResults.value[0]
  if (first) {
    selectResult(first)
    return
  }
  if (searchQuery.value.trim().length < 2) return
  if (searchTimer) clearTimeout(searchTimer)
  await doSearch()
  const firstAfter = searchResults.value[0]
  if (firstAfter) selectResult(firstAfter)
}

async function doSearch() {
  searching.value = true
  try {
    const q   = encodeURIComponent(searchQuery.value.trim())
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=6&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data: any[] = await res.json()
    searchResults.value = data.map(d => ({
      shortName:   d.display_name.split(',')[0].trim(),
      displayName: d.display_name,
      lat:         parseFloat(d.lat),
      lng:         parseFloat(d.lon)
    }))
  } catch {
    searchResults.value = []
  }
  searching.value = false
}

function selectResult(r: { shortName: string; displayName: string; lat: number; lng: number }) {
  searchResults.value = []
  searchQuery.value   = ''
  pinName.value       = r.shortName
  dropPin(r.lat, r.lng)
  mapInst?.setView([r.lat, r.lng], 10, { animate: true })
}

// ── Confirm ───────────────────────────────────────────────────────────────────
function confirmSelection() {
  if (pinLat.value === null || pinLng.value === null) return
  selectedName.value = pinName.value
  selectedLat.value  = pinLat.value
  selectedLng.value  = pinLng.value
  emit('update:modelValue', pinName.value)
  emit('update:lat',        pinLat.value)
  emit('update:lng',        pinLng.value)
  emit('change', { name: pinName.value, lat: pinLat.value, lng: pinLng.value })
  closeModal()
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (mapInst) { mapInst.remove(); mapInst = null; markerInst = null }
})
</script>

<style scoped>
.modal-fade-enter-active { transition: opacity 0.18s ease; }
.modal-fade-leave-active { transition: opacity 0.14s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }

.bar-fade-enter-active { transition: all 0.2s ease; }
.bar-fade-leave-active { transition: all 0.15s ease; }
.bar-fade-enter-from,
.bar-fade-leave-to     { opacity: 0; transform: translateY(6px); }
</style>