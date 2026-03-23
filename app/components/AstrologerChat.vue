<template>
  <div class="bg-black/40 border rounded-2xl overflow-hidden backdrop-blur-sm" :class="isMale ? 'border-amber-500/25' : 'border-rose-500/25'">

    <!-- Header -->
    <div :class="['flex items-center gap-4 px-6 py-4 border-b', isMale ? 'border-amber-500/15 bg-amber-500/5' : 'border-rose-500/15 bg-rose-500/5']">
      <!-- Avatar -->
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0', isMale ? 'border-amber-400/50' : 'border-rose-400/50']">
        <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
          <template v-if="isMale">
            <ellipse cx="40" cy="65" rx="22" ry="14" fill="#92400e" fill-opacity="0.8"/>
            <circle cx="40" cy="30" r="16" fill="#fbbf24" fill-opacity="0.9"/>
            <path d="M24 28 C24 20 32 14 40 14 C48 14 56 20 56 28" fill="#b45309" fill-opacity="0.9"/>
            <ellipse cx="40" cy="26" rx="2" ry="3" fill="#ef4444" fill-opacity="0.9"/>
            <circle cx="35" cy="30" r="2" fill="#1c1917"/>
            <circle cx="45" cy="30" r="2" fill="#1c1917"/>
            <path d="M32 38 C34 44 46 44 48 38" fill="#78716c" fill-opacity="0.8"/>
          </template>
          <template v-else>
            <ellipse cx="40" cy="65" rx="22" ry="14" fill="#9d174d" fill-opacity="0.8"/>
            <circle cx="40" cy="30" r="16" fill="#fde68a" fill-opacity="0.9"/>
            <path d="M28 22 C30 12 50 12 52 22" fill="#1c1917" fill-opacity="0.9"/>
            <circle cx="40" cy="14" r="5" fill="#1c1917" fill-opacity="0.9"/>
            <circle cx="40" cy="25" r="2.5" fill="#ef4444" fill-opacity="0.95"/>
            <ellipse cx="35" cy="31" rx="2.5" ry="2" fill="#1c1917"/>
            <ellipse cx="45" cy="31" rx="2.5" ry="2" fill="#1c1917"/>
            <path d="M36 37 C38 39 42 39 44 37" stroke="#92400e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          </template>
        </svg>
      </div>
      <div class="flex-1">
        <div :class="['font-cinzel text-sm tracking-wider', isMale ? 'text-amber-300' : 'text-rose-300']">
          {{ isMale ? 'Pandit Arjun' : 'Devi Saraswati' }}
        </div>
        <div class="font-garamond text-xs text-gray-500">{{ isMale ? 'Vedic · Jyotish · Remedies' : 'Nakshatra · Tantra · Intuitive' }}</div>
      </div>
      <div :class="['w-2 h-2 rounded-full', isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400']"/>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="h-80 overflow-y-auto p-5 space-y-4 scroll-smooth">

      <!-- Welcome message -->
      <div v-if="messages.length === 0" class="flex gap-3">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs border', isMale ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20']">
          <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
            <template v-if="isMale"><circle cx="40" cy="30" r="14" fill="#fbbf24" fill-opacity="0.8"/><ellipse cx="40" cy="26" rx="2" ry="2.5" fill="#ef4444" fill-opacity="0.8"/></template>
            <template v-else><circle cx="40" cy="30" r="14" fill="#fde68a" fill-opacity="0.8"/><circle cx="40" cy="24" r="2" fill="#ef4444" fill-opacity="0.9"/></template>
          </svg>
        </div>
        <div :class="['rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]', isMale ? 'bg-amber-500/10 border border-amber-500/15' : 'bg-rose-500/10 border border-rose-500/15']">
          <p class="font-garamond text-sm text-gray-300 leading-relaxed">
            {{ isMale
              ? `Namaste! I am Pandit Arjun. I have studied your birth chart carefully. Ask me anything about your Lagna, planetary positions, Dasha periods, or what remedies may help you.`
              : `Namaste! I am Devi Saraswati. Your stars speak to me clearly. Ask me about your Nakshatra, relationships, life purpose, or what the planets reveal about your destiny.`
            }}
          </p>
        </div>
      </div>

      <!-- Chat messages -->
      <div v-for="(msg, i) in messages" :key="i" :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '']">
        <!-- Avatar -->
        <div v-if="msg.role === 'assistant'" :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 border', isMale ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20']">
          <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
            <template v-if="isMale"><circle cx="40" cy="30" r="14" fill="#fbbf24" fill-opacity="0.8"/></template>
            <template v-else><circle cx="40" cy="30" r="14" fill="#fde68a" fill-opacity="0.8"/><circle cx="40" cy="24" r="2" fill="#ef4444" fill-opacity="0.9"/></template>
          </svg>
        </div>
        <div v-else class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
        <!-- Bubble -->
        <div :class="['rounded-2xl px-4 py-3 max-w-[85%] font-garamond text-sm leading-relaxed', msg.role === 'user' ? 'bg-white/8 text-gray-300 rounded-tr-sm' : isMale ? 'bg-amber-500/10 border border-amber-500/15 text-gray-300 rounded-tl-sm' : 'bg-rose-500/10 border border-rose-500/15 text-gray-300 rounded-tl-sm']">
          {{ msg.content }}
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex gap-3">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 border', isMale ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20']"/>
        <div :class="['rounded-2xl rounded-tl-sm px-4 py-3 border', isMale ? 'bg-amber-500/10 border-amber-500/15' : 'bg-rose-500/10 border-rose-500/15']">
          <div class="flex gap-1 items-center h-4">
            <div v-for="i in 3" :key="i" :class="['w-1.5 h-1.5 rounded-full animate-bounce', isMale ? 'bg-amber-400' : 'bg-rose-400']" :style="{ animationDelay: `${(i-1)*0.15}s` }"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick questions -->
    <div v-if="messages.length === 0" class="px-5 pb-3 flex flex-wrap gap-2">
      <button v-for="q in quickQuestions" :key="q" type="button" @click="sendMessage(q)"
        :class="['px-3 py-1.5 rounded-full font-garamond text-xs border transition-all', isMale ? 'border-amber-500/20 text-amber-400/70 hover:border-amber-500/40 hover:text-amber-300 hover:bg-amber-500/5' : 'border-rose-500/20 text-rose-400/70 hover:border-rose-500/40 hover:text-rose-300 hover:bg-rose-500/5']">
        {{ q }}
      </button>
    </div>

    <!-- Input -->
    <div :class="['px-4 pb-4 pt-2 border-t', isMale ? 'border-amber-500/10' : 'border-rose-500/10']">
      <div class="flex gap-2">
        <input v-model="inputText" type="text" placeholder="Ask about your chart…"
          @keydown.enter="sendMessage()"
          :class="['flex-1 bg-black/40 rounded-xl px-4 py-2.5 font-garamond text-sm text-gray-200 placeholder-gray-700 focus:outline-none border transition-colors', isMale ? 'border-amber-500/15 focus:border-amber-500/40' : 'border-rose-500/15 focus:border-rose-500/40']"/>
        <button type="button" @click="sendMessage()" :disabled="isLoading || !inputText.trim()"
          :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40', isMale ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300' : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300']">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { ChartResult } from '~/utils/astrology'

const props = defineProps<{
  astrologer: 'male' | 'female'
  chart: ChartResult
  formData: { name?: string; birthDate?: string; birthTime?: string; locationName?: string } | null
}>()

const isMale = computed(() => props.astrologer === 'male')
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const inputText = ref('')
const isLoading = ref(false)
const messagesEl = ref<HTMLElement>()

const quickQuestions = computed(() => isMale.value
  ? ['What does my Lagna say?', 'Which Dasha am I in?', 'What are my strengths?', 'Suggest remedies for me']
  : ['What is my Nakshatra energy?', 'Tell me about my relationships', 'What is my life purpose?', 'What do my planets say?']
)

function buildChartContext(): string {
  const c = props.chart
  const fd = props.formData
  const name = fd?.name || 'the native'
  const planets = Object.entries(c.positions).map(([p, d]) =>
    `${p}: ${d.signName} ${d.degInSign.toFixed(1)}° (House ${((d.sign - c.lagnaSign + 12) % 12) + 1})`
  ).join(', ')
  const activeDasha = c.dashas.find(d => d.isActive)
  return `Native: ${name}, DOB: ${fd?.birthDate} ${fd?.birthTime}, Location: ${fd?.locationName}
Lagna: ${c.ascendant.signName} ${c.ascendant.degInSign.toFixed(1)}°
Planets: ${planets}
Moon Nakshatra: ${c.moonNakshatra.name} Pada ${c.moonNakshatra.pada}
Current Dasha: ${activeDasha ? `${activeDasha.planet} until ${activeDasha.end}` : 'Unknown'}`
}

async function sendMessage(text?: string) {
  const msg = text || inputText.value.trim()
  if (!msg || isLoading.value) return
  inputText.value = ''
  messages.value.push({ role: 'user', content: msg })
  await scrollBottom()
  isLoading.value = true

  const persona = isMale.value
    ? 'You are Pandit Arjun, a wise traditional Vedic astrologer. Speak in a warm, learned tone. Reference specific planetary positions and Vedic principles. Give practical remedies when asked. Be authoritative but compassionate. Use occasional Sanskrit terms with translations.'
    : 'You are Devi Saraswati, an intuitive female Vedic astrologer. Speak in a nurturing, insightful tone. Focus on the spiritual and emotional dimensions of the chart. Reference Nakshatra qualities and divine guidance. Be empathetic and encouraging.'

  const chartCtx = buildChartContext()
  const history = messages.value.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Astrologer'}: ${m.content}`).join('\n')

  const prompt = `${persona}

Birth Chart Data:
${chartCtx}

Conversation so far:
${history}

Respond in 3-5 sentences. Be specific to the chart data. Do not repeat yourself.`

  try {
    const apiKey = useRuntimeConfig().public.openaiApiKey
      || (typeof window !== 'undefined' ? (window as any).__GEMINI_KEY__ : '')

    // Call via server route
    const res = await fetch('/api/astrologer-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, astrologer: props.astrologer }),
    })
    const data = await res.json() as { reply: string }
    messages.value.push({ role: 'assistant', content: data.reply || 'The stars are quiet for now. Please try again.' })
  } catch {
    messages.value.push({ role: 'assistant', content: 'The cosmic connection was interrupted. Please ask again.' })
  }

  isLoading.value = false
  await scrollBottom()
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}
</script>