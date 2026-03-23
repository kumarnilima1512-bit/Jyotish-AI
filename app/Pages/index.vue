<template>
  <div class="relative z-10 min-h-screen text-gray-200">

    <header class="relative z-10 border-b border-gold-500/15 py-6 px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/images/JYOTISH-logo.png" alt="Jyotish Logo" class="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.4)]"/>
          <div>
            <h1 class="font-cinzel text-2xl md:text-3xl text-gold-400 tracking-[0.25em] uppercase">ज्योतिष · Jyotish</h1>
            <p class="text-gray-500 font-garamond text-sm mt-0.5 tracking-widest">Vedic Astrology — Northern Indian Style</p>
          </div>
        </div>
        <div class="hidden md:flex items-center gap-6 font-cinzel text-xs tracking-widest text-gray-500 uppercase">
          <span>Lahiri Ayanamsha</span>
          <span class="text-gold-500/30">|</span>
          <span>Whole Sign Houses</span>
          <span class="text-gold-500/30">|</span>
          <span>Vimshottari Dasha</span>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left: Form -->
        <div class="lg:col-span-1">
          <BirthForm :form-data="formData" :loading="loading" :error="error" @generate="generateChart"/>
        </div>

        <!-- Right: Welcome + Feature buttons -->
        <div class="lg:col-span-2 space-y-4">

          <!-- Welcome -->
          <div class="text-center py-10 px-6 bg-gold-500/3 border border-gold-500/10 rounded-2xl">
            <div class="font-cinzel text-5xl text-gold-400/15 mb-5">☽ ☉ ☊</div>
            <h2 class="font-cinzel text-gold-400/50 text-2xl tracking-[0.3em] uppercase mb-3">Vedic Birth Chart</h2>
            <p class="font-garamond text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
              Enter your birth details on the left and click <span class="text-gold-500/70">Cast the Chart</span> to generate your complete Vedic horoscope in North Indian style.
            </p>
            <!-- AI Astrologer CTA -->
            <NuxtLink to="/astrologer"
              class="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-gold-500/25 bg-gold-500/8 hover:border-gold-500/50 hover:bg-gold-500/15 transition-all duration-300 group">
              <div class="flex -space-x-2">
                <!-- Male avatar mini -->
                <div class="w-7 h-7 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="14" fill="#fbbf24" fill-opacity="0.9"/><path d="M26 27 C26 19 33 13 40 13 C47 13 54 19 54 27" fill="#b45309" fill-opacity="0.9"/><ellipse cx="40" cy="25" rx="1.8" ry="2.5" fill="#ef4444" fill-opacity="0.9"/></svg>
                </div>
                <!-- Female avatar mini -->
                <div class="w-7 h-7 rounded-full border border-rose-400/40 bg-rose-500/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="14" fill="#fde68a" fill-opacity="0.9"/><ellipse cx="40" cy="12" rx="5" ry="4" fill="#1c1917" fill-opacity="0.9"/><circle cx="40" cy="24" r="2.2" fill="#ef4444" fill-opacity="0.95"/></svg>
                </div>
              </div>
              <span class="font-cinzel text-xs text-gold-400/70 tracking-wider group-hover:text-gold-300 transition-colors">Consult AI Astrologer</span>
              <svg class="w-3 h-3 text-gold-500/40 group-hover:text-gold-400/70 transition-colors" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>
          </div>

          <!-- Feature Navigation -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <!-- Kundli Milan -->
            <NuxtLink to="/kundlimilan"
              class="flex items-center gap-4 px-5 py-4 rounded-xl border border-gold-500/12 bg-black/30 hover:border-pink-500/35 hover:bg-pink-500/5 transition-all duration-300 group">
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-pink-500/6 group-hover:bg-pink-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="7.5" cy="11" r="5" stroke="#f472b6" stroke-width="1.3" fill="none" stroke-opacity="0.75"/>
                  <circle cx="14.5" cy="11" r="5" stroke="#e8b400" stroke-width="1.3" fill="none" stroke-opacity="0.75"/>
                  <path d="M11 7.2 C12.4 8.3 13.2 9.6 13.2 11 C13.2 12.4 12.4 13.7 11 14.8 C9.6 13.7 8.8 12.4 8.8 11 C8.8 9.6 9.6 8.3 11 7.2Z" fill="#e8b400" fill-opacity="0.18"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider text-gray-300 group-hover:text-pink-300 transition-colors">Kundli Milan</div>
                <div class="font-garamond text-xs text-gray-600">Compatibility · Gun Milan</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-pink-500/50" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>

            <!-- Daily Horoscope -->
            <NuxtLink to="/horoscope"
              class="flex items-center gap-4 px-5 py-4 rounded-xl border border-gold-500/12 bg-black/30 hover:border-amber-500/35 hover:bg-amber-500/5 transition-all duration-300 group">
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/6 group-hover:bg-amber-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="3.5" fill="#f5c842" fill-opacity="0.25" stroke="#f5c842" stroke-width="1.4"/>
                  <circle cx="11" cy="11" r="1.6" fill="#f5c842" fill-opacity="0.9"/>
                  <line x1="11" y1="2.5" x2="11" y2="4.8" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="11" y1="17.2" x2="11" y2="19.5" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="2.5" y1="11" x2="4.8" y2="11" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                  <line x1="17.2" y1="11" x2="19.5" y2="11" stroke="#f5c842" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.8"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider text-gray-300 group-hover:text-amber-300 transition-colors">Daily Horoscope</div>
                <div class="font-garamond text-xs text-gray-600">{{ todayStr }} · Planetary transits</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-amber-500/50" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>

            <!-- Panchang -->
            <NuxtLink to="/panchang"
              class="flex items-center gap-4 px-5 py-4 rounded-xl border border-gold-500/12 bg-black/30 hover:border-orange-500/35 hover:bg-orange-500/5 transition-all duration-300 group">
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500/6 group-hover:bg-orange-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M18 11.5C18 15.64 14.64 19 10.5 19C8.38 19 6.46 18.14 5.05 16.74C5.83 16.92 6.65 17.02 7.5 17.02C12.2 17.02 16 13.22 16 8.52C16 6.68 15.44 4.98 14.5 3.57C16.62 4.99 18 7.09 18 11.5Z" stroke="#fb923c" stroke-width="1.3" fill="#fb923c" fill-opacity="0.1" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider text-gray-300 group-hover:text-orange-300 transition-colors">Panchang</div>
                <div class="font-garamond text-xs text-gray-600">Tithi · Nakshatra · Yoga · Karana</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-orange-500/50" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>

            <!-- Numerology -->
            <NuxtLink to="/numerology"
              class="flex items-center gap-4 px-5 py-4 rounded-xl border border-gold-500/12 bg-black/30 hover:border-violet-500/35 hover:bg-violet-500/5 transition-all duration-300 group">
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-violet-500/6 group-hover:bg-violet-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="1.5" y="1.5" width="19" height="19" rx="2" stroke="#a78bfa" stroke-width="1.2" fill="none" stroke-opacity="0.5"/>
                  <text x="11" y="12.7" text-anchor="middle" font-size="5.2" fill="#e8b400" fill-opacity="1" font-family="Georgia, serif" font-weight="bold">5</text>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider text-gray-300 group-hover:text-violet-300 transition-colors">Numerology</div>
                <div class="font-garamond text-xs text-gray-600">Life Path · Destiny · Soul Urge</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-violet-500/50" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>

            <!-- Tarot -->
            <NuxtLink to="/tarot"
              class="flex items-center gap-4 px-5 py-4 rounded-xl border border-gold-500/12 bg-black/30 hover:border-rose-500/35 hover:bg-rose-500/5 transition-all duration-300 group sm:col-span-2">
              <div class="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-rose-500/6 group-hover:bg-rose-500/12 transition-colors">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="7.5" y="2.5" width="7" height="11" rx="1.2" fill="#1e0912" stroke="#f43f5e" stroke-width="1.4"/>
                  <path d="M11 5.8 L11.45 7.1 L12.8 7.1 L11.7 7.9 L12.1 9.2 L11 8.4 L9.9 9.2 L10.3 7.9 L9.2 7.1 L10.55 7.1Z" fill="#f43f5e" fill-opacity="0.9"/>
                </svg>
              </div>
              <div class="text-left flex-1 min-w-0">
                <div class="font-cinzel text-xs tracking-wider text-gray-300 group-hover:text-rose-300 transition-colors">Tarot Reading</div>
                <div class="font-garamond text-xs text-gray-600">78-Card Rider-Waite · Full Celtic Cross</div>
              </div>
              <svg class="shrink-0 w-3.5 h-3.5 text-gray-600 group-hover:text-rose-500/50" viewBox="0 0 10 10" fill="none"><path d="M3 1L7 5L3 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </NuxtLink>

          </div>
        </div>
      </div>
    </main>

    <footer class="relative z-10 border-t border-gold-500/10 py-6 mt-12 text-center">
      <p class="font-cinzel text-gray-600 text-xs tracking-widest uppercase">Astronomical calculations are approximate · For educational purposes</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAstrology } from '~/composables/useAstrology'

const { formData, loading, error, generateChart } = useAstrology()

const todayStr = computed(() =>
  new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
)
</script>