<template>
  <div class="relative">
    <!-- Input + clock icon -->
    <div class="relative">
      <input
        :value="modelValue"
        @change="onManualInput"
        type="text"
        placeholder="HH:MM"
        maxlength="5"
        class="w-full bg-black/40 border border-gold-500/20 rounded-lg px-4 py-3 pr-10 text-gray-200 font-garamond text-sm focus:outline-none focus:border-gold-400/60 transition-colors"
      />
      <button type="button" @click="toggleOpen"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400/50 hover:text-gold-300 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </button>
    </div>

    <!-- Clock panel — opens upward -->
    <div v-if="isOpen" class="absolute left-0 right-0 bottom-full mb-2 bg-[#0e0a1a] border border-gold-500/30 rounded-2xl p-5 shadow-2xl z-50">

      <!-- Mode label + time display -->
      <div class="text-center mb-3">
        <p class="font-cinzel text-xs text-gold-500/50 tracking-widest uppercase mb-2">
          {{ mode === 'hours' ? 'Select Hour' : 'Select Minute' }}
        </p>
        <div class="flex items-center justify-center gap-1 font-cinzel text-2xl">
          <span class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
            :class="mode === 'hours' ? 'text-gold-300 bg-gold-500/15' : 'text-gray-500 hover:text-gold-400'"
            @click="mode = 'hours'">{{ String(selectedHour).padStart(2,'0') }}</span>
          <span class="text-gray-600">:</span>
          <span class="px-2 py-1 rounded-lg cursor-pointer transition-colors"
            :class="mode === 'minutes' ? 'text-gold-300 bg-gold-500/15' : 'text-gray-500 hover:text-gold-400'"
            @click="mode = 'minutes'">{{ String(selectedMinute).padStart(2,'0') }}</span>
        </div>
      </div>

      <!-- Clock face -->
      <div class="relative mx-auto select-none" :style="{ width: S+'px', height: S+'px' }"
        @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag"
        @touchstart.prevent="startDragTouch" @touchmove.prevent="onDragTouch" @touchend="endDragTouch"
      >
        <svg :width="S" :height="S" class="absolute inset-0 cursor-pointer">
          <!-- Background -->
          <circle :cx="C" :cy="C" :r="C-3" fill="#07030f" stroke="#e8b40015" stroke-width="1"/>
          <!-- Tick marks for minutes -->
          <line v-for="i in 60" :key="'t'+i"
            :x1="C + (R+2)*Math.cos((i/60)*2*Math.PI - Math.PI/2)"
            :y1="C + (R+2)*Math.sin((i/60)*2*Math.PI - Math.PI/2)"
            :x2="C + (R + (i%5===0 ? 8 : 5))*Math.cos((i/60)*2*Math.PI - Math.PI/2)"
            :y2="C + (R + (i%5===0 ? 8 : 5))*Math.sin((i/60)*2*Math.PI - Math.PI/2)"
            :stroke="i%5===0 ? '#e8b40040' : '#e8b40018'" stroke-width="1"/>
          <!-- Hand -->
          <line :x1="C" :y1="C" :x2="handX" :y2="handY"
            stroke="#e8b400" stroke-width="2" stroke-linecap="round"/>
          <!-- Hand tip circle -->
          <circle :cx="handX" :cy="handY" r="5" fill="#e8b400" fill-opacity="0.9"/>
          <!-- Center dot -->
          <circle :cx="C" :cy="C" r="3" fill="#e8b400"/>
        </svg>

        <!-- Hour numbers -->
        <template v-if="mode === 'hours'">
          <div v-for="h in 12" :key="h"
            class="absolute w-7 h-7 flex items-center justify-center rounded-full font-cinzel text-xs pointer-events-none"
            :class="selectedHour === h ? 'text-gold-300 font-bold' : 'text-gray-500'"
            :style="numPos(h, 12)">{{ h }}</div>
        </template>

        <!-- Minute numbers (every 5) -->
        <template v-else>
          <div v-for="(m, i) in [0,5,10,15,20,25,30,35,40,45,50,55]" :key="m"
            class="absolute w-7 h-7 flex items-center justify-center rounded-full font-cinzel text-xs pointer-events-none"
            :class="selectedMinute === m ? 'text-gold-300 font-bold' : 'text-gray-500'"
            :style="numPos(i===0?12:i, 12)">{{ String(m).padStart(2,'0') }}</div>
        </template>
      </div>

      <!-- AM/PM -->
      <div class="flex items-center justify-center gap-3 mt-3">
        <button type="button" @click="isPM = false"
          class="px-4 py-1 rounded-lg font-cinzel text-xs tracking-widest transition-all"
          :class="!isPM ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-gray-600 hover:text-gray-400'">AM</button>
        <button type="button" @click="isPM = true"
          class="px-4 py-1 rounded-lg font-cinzel text-xs tracking-widest transition-all"
          :class="isPM ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-gray-600 hover:text-gray-400'">PM</button>
      </div>

      <!-- Confirm -->
      <button type="button" @click="confirm"
        class="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 font-cinzel text-midnight-950 text-xs tracking-[0.2em] uppercase font-bold transition-all">
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit  = defineEmits<{ 'update:modelValue': [string] }>()

const S = 160
const C = S / 2
const R = C - 22   // number ring radius
const HR = C - 14  // hand radius

const isOpen         = ref(false)
const mode           = ref<'hours' | 'minutes'>('hours')
const isPM           = ref(false)
const selectedHour   = ref(12)
const selectedMinute = ref(0)
const isDragging     = ref(false)

function toggleOpen() {
  if (!isOpen.value) {
    const parts = props.modelValue.split(':').map(Number)
    const h = parts[0] ?? 0
    const m = parts[1] ?? 0
    selectedHour.value   = h === 0 ? 12 : h > 12 ? h - 12 : h
    selectedMinute.value = m
    isPM.value           = h >= 12
    mode.value           = 'hours'
  }
  isOpen.value = !isOpen.value
}

function numPos(n: number, total: number) {
  const angle = (n / total) * 2 * Math.PI - Math.PI / 2
  const x = C + R * Math.cos(angle) - 14
  const y = C + R * Math.sin(angle) - 14
  return { left: x + 'px', top: y + 'px' }
}

// Hand angle based on current selection
const handAngle = computed(() => {
  if (mode.value === 'hours') {
    return (selectedHour.value / 12) * 2 * Math.PI - Math.PI / 2
  } else {
    return (selectedMinute.value / 60) * 2 * Math.PI - Math.PI / 2
  }
})
const handX = computed(() => C + HR * Math.cos(handAngle.value))
const handY = computed(() => C + HR * Math.sin(handAngle.value))

// Convert click/drag position to angle → value
function posToValue(el: HTMLElement, clientX: number, clientY: number) {
  const rect  = el.getBoundingClientRect()
  const x     = clientX - rect.left - C
  const y     = clientY - rect.top  - C
  let angle   = Math.atan2(y, x) + Math.PI / 2
  if (angle < 0) angle += 2 * Math.PI

  if (mode.value === 'hours') {
    let h = Math.round(angle / (2 * Math.PI) * 12)
    if (h === 0) h = 12
    selectedHour.value = h
  } else {
    const m = Math.round(angle / (2 * Math.PI) * 60)
    selectedMinute.value = m >= 60 ? 0 : m
  }
}

function startDrag(e: MouseEvent) {
  isDragging.value = true
  posToValue(e.currentTarget as HTMLElement, e.clientX, e.clientY)
}
function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  posToValue(e.currentTarget as HTMLElement, e.clientX, e.clientY)
}
function endDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  if (mode.value === 'hours') setTimeout(() => { mode.value = 'minutes' }, 150)
}

function startDragTouch(e: TouchEvent) {
  isDragging.value = true
  const t = e.touches[0]
  if (t) posToValue(e.currentTarget as HTMLElement, t.clientX, t.clientY)
}
function onDragTouch(e: TouchEvent) {
  if (!isDragging.value) return
  const t = e.touches[0]
  if (t) posToValue(e.currentTarget as HTMLElement, t.clientX, t.clientY)
}
function endDragTouch() {
  if (!isDragging.value) return
  isDragging.value = false
  if (mode.value === 'hours') setTimeout(() => { mode.value = 'minutes' }, 150)
}

function confirm() {
  let h = selectedHour.value % 12
  if (isPM.value) h += 12
  const str = `${String(h).padStart(2,'0')}:${String(selectedMinute.value).padStart(2,'0')}`
  emit('update:modelValue', str)
  isOpen.value = false
}

function onManualInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>