<template>
  <div class="relative z-10 min-h-screen text-gray-200 flex flex-col">

    <!-- Header -->
    <header class="relative z-10 border-b border-gold-500/15 py-4 px-6 shrink-0">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:border-yellow-400/50 transition-all">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 1L4 6.5L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>
          </NuxtLink>
          <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
          <div>
            <h1 class="font-cinzel text-base text-yellow-400 tracking-[0.2em] uppercase">ज्योतिष · Jyotish</h1>
            <p class="font-garamond text-xs text-gray-600 tracking-widest">AI Vedic Consultation</p>
          </div>
        </div>
        <!-- Active astrologer indicator -->
        <div v-if="activeAstrologer" class="flex items-center gap-2">
          <div :class="['w-2 h-2 rounded-full', isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400']"/>
          <span :class="['font-cinzel text-xs tracking-wider', activeAstrologer === 'male' ? 'text-amber-400' : 'text-rose-400']">
            {{ activeAstrologer === 'male' ? 'Pandit Arjun' : 'Devi Saraswati' }}
          </span>
          <button type="button" @click="resetChat"
            class="ml-2 px-3 py-1 rounded-lg border border-white/10 font-cinzel text-xs text-gray-600 hover:text-gray-300 hover:border-white/20 transition-all">
            Change
          </button>
        </div>
      </div>
    </header>

    <!-- Astrologer Selection Screen -->
    <div v-if="!activeAstrologer" class="flex-1 flex items-center justify-center px-6">
      <div class="max-w-2xl w-full">
        <div class="text-center mb-10">
          <div class="font-cinzel text-4xl text-gold-400/20 mb-4">ॐ</div>
          <h2 class="font-cinzel text-2xl text-gold-400/70 tracking-[0.2em] uppercase mb-3">AI Vedic Consultation</h2>
          <p class="font-garamond text-gray-500 max-w-md mx-auto">Choose your astrologer for a personalized Vedic reading. They will guide you through the stars using your birth chart.</p>
        </div>
        <div class="grid grid-cols-2 gap-5">

          <!-- Pandit Arjun -->
          <button type="button" @click="startChat('male')"
            class="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-300">
            <div class="w-24 h-24 rounded-full border-2 border-amber-400/30 group-hover:border-amber-400/70 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden transition-all duration-300">
              <img src="/images/astrologers/pandit-arjun.png" alt="Pandit Arjun" class="w-full h-full object-cover"/>
            </div>
            <div class="text-center">
              <div class="font-cinzel text-lg text-amber-300 tracking-wider mb-1">Pandit Arjun</div>
              <div class="font-garamond text-sm text-gray-400 mb-3">Vedic · Jyotish · Shastra</div>
              <div class="space-y-1">
                <div class="font-garamond text-xs text-gray-300">✦ Chart Analysis & Predictions</div>
                <div class="font-garamond text-xs text-gray-300">✦ Dasha Period Readings</div>
                <div class="font-garamond text-xs text-gray-300">✦ Vedic Remedies & Mantras</div>
              </div>
            </div>
            <div class="mt-2 px-5 py-2 rounded-full border border-amber-500/30 font-cinzel text-xs text-amber-400 tracking-wider group-hover:bg-amber-500/10 transition-colors">
              Consult Now
            </div>
          </button>

          <!-- Devi Saraswati -->
          <button type="button" @click="startChat('female')"
            class="group flex flex-col items-center gap-4 p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300">
            <div class="w-24 h-24 rounded-full border-2 border-rose-400/30 group-hover:border-rose-400/70 group-hover:shadow-[0_0_30px_rgba(251,113,133,0.2)] overflow-hidden transition-all duration-300">
              <img src="/images/astrologers/devi-saraswati.png" alt="Devi Saraswati" class="w-full h-full object-cover"/>
            </div>
            <div class="text-center">
              <div class="font-cinzel text-lg text-rose-300 tracking-wider mb-1">Devi Saraswati</div>
              <div class="font-garamond text-sm text-gray-400 mb-3">Nakshatra · Tantra · Intuitive</div>
              <div class="space-y-1">
                <div class="font-garamond text-xs text-gray-300">✦ Nakshatra & Soul Readings</div>
                <div class="font-garamond text-xs text-gray-300">✦ Relationships & Destiny</div>
                <div class="font-garamond text-xs text-gray-300">✦ Spiritual Guidance</div>
              </div>
            </div>
            <div class="mt-2 px-5 py-2 rounded-full border border-rose-500/30 font-cinzel text-xs text-rose-400 tracking-wider group-hover:bg-rose-500/10 transition-colors">
              Consult Now
            </div>
          </button>

        </div>
      </div>
    </div>

    <!-- Chat Screen -->
    <div v-else class="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-4 overflow-hidden">

      <!-- Messages -->
      <div ref="messagesEl" class="flex-1 overflow-y-auto space-y-5 pb-4">
        <div v-for="(msg, i) in messages" :key="i" :class="['flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '']">

          <!-- Astrologer avatar -->
          <div v-if="msg.role === 'assistant'"
            :class="['w-9 h-9 rounded-full shrink-0 overflow-hidden border', activeAstrologer === 'male' ? 'border-amber-500/25' : 'border-rose-500/25']">
            <img
              :src="activeAstrologer === 'male' ? '/images/astrologers/pandit-arjun.png' : '/images/astrologers/devi-saraswati.png'"
              :alt="activeAstrologer === 'male' ? 'Pandit Arjun' : 'Devi Saraswati'"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- User avatar -->
          <div v-else class="w-9 h-9 rounded-full shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </div>

          <!-- Message bubble -->
          <div :class="['max-w-[78%] rounded-2xl px-4 py-3 font-garamond text-sm leading-relaxed whitespace-pre-wrap',
            msg.role === 'user'
              ? 'bg-white/8 border border-white/10 text-gray-200 rounded-tr-sm'
              : activeAstrologer === 'male'
                ? 'bg-amber-500/8 border border-amber-500/15 text-gray-100 rounded-tl-sm'
                : 'bg-rose-500/8 border border-rose-500/15 text-gray-100 rounded-tl-sm']">
            {{ msg.content }}
          </div>
        </div>

        <!-- Loading dots -->
        <div v-if="isLoading" class="flex gap-3">
          <div :class="['w-9 h-9 rounded-full shrink-0 overflow-hidden border', activeAstrologer === 'male' ? 'border-amber-500/25' : 'border-rose-500/25']">
            <img :src="activeAstrologer === 'male' ? '/images/astrologers/pandit-arjun.png' : '/images/astrologers/devi-saraswati.png'" class="w-full h-full object-cover"/>
          </div>
          <div :class="['rounded-2xl rounded-tl-sm px-5 py-3 border', activeAstrologer === 'male' ? 'bg-amber-500/8 border-amber-500/15' : 'bg-rose-500/8 border-rose-500/15']">
            <div class="flex gap-1.5 items-center h-5">
              <div v-for="i in 3" :key="i" :class="['w-1.5 h-1.5 rounded-full animate-bounce', activeAstrologer === 'male' ? 'bg-amber-400' : 'bg-rose-400']"
                :style="{ animationDelay: `${(i-1)*0.15}s` }"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Input bar -->
      <div :class="['shrink-0 pt-3 border-t', activeAstrologer === 'male' ? 'border-amber-500/10' : 'border-rose-500/10']">
        <div class="flex gap-2">
          <input v-model="inputText" type="text"
            :placeholder="isLoading ? 'Please wait…' : 'Ask anything about your chart…'"
            :disabled="isLoading"
            @keydown.enter="sendMessage"
            :class="['flex-1 bg-black/40 rounded-xl px-4 py-3 font-garamond text-sm text-gray-200 placeholder-gray-700 focus:outline-none border transition-colors disabled:opacity-50',
              activeAstrologer === 'male' ? 'border-amber-500/15 focus:border-amber-500/40' : 'border-rose-500/15 focus:border-rose-500/40']"/>
          <button type="button" @click="sendMessage" :disabled="isLoading || !inputText.trim()"
            :class="['w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shrink-0',
              activeAstrologer === 'male' ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300' : 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-300']">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeAstrologer = ref<'male' | 'female' | null>(null)
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const inputText = ref('')
const isLoading = ref(false)
const messagesEl = ref<HTMLElement>()
const userInfo = ref<Record<string, string>>({})

function startChat(type: 'male' | 'female') {
  activeAstrologer.value = type
  messages.value = []
  userInfo.value = {}
  const greeting = type === 'male'
    ? `Namaste 🙏\n\nI am Pandit Arjun, your Vedic Jyotish guide.\n\nTo cast your birth chart and reveal what the stars hold for you, please share the following details:\n\n• Full Name\n• Gender\n• Date of Birth (DD/MM/YYYY)\n• Time of Birth (as accurate as possible)\n• Place of Birth (city & country)\n\nOnce I have these, I shall begin your reading.`
    : `Namaste 🙏\n\nI am Devi Saraswati. The cosmos has brought you here for a reason.\n\nTo read the celestial map written at the moment of your birth, I will need:\n\n• Your Name\n• Gender\n• Date of Birth (DD/MM/YYYY)\n• Time of Birth\n• Place of Birth\n\nShare these with me and I shall unveil what the stars have written for you.`
  messages.value.push({ role: 'assistant', content: greeting })
  nextTick(() => scrollBottom())
}

function resetChat() {
  activeAstrologer.value = null
  messages.value = []
  userInfo.value = {}
  inputText.value = ''
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  inputText.value = ''
  messages.value.push({ role: 'user', content: text })
  await scrollBottom()
  isLoading.value = true

  try {
    const res = await fetch('/api/astrologer-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        astrologer: activeAstrologer.value,
        userInfo: userInfo.value,
        history: messages.value.slice(-12).map(m => ({ role: m.role, content: m.content })),
        latestMessage: text,
      }),
    })
    const data = await res.json() as { reply: string; updatedInfo?: Record<string, string> }
    if (data.updatedInfo) userInfo.value = { ...userInfo.value, ...data.updatedInfo }
    messages.value.push({ role: 'assistant', content: data.reply })
  } catch {
    messages.value.push({ role: 'assistant', content: 'The cosmic connection was interrupted. Please try again.' })
  }

  isLoading.value = false
  await scrollBottom()
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}
</script>