<template>
  <div class="min-h-screen bg-[#0a0408] text-gray-200 relative overflow-x-hidden">

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
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-900/10 blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-900/8 blur-[100px]" />
      <div class="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-amber-900/8 blur-[100px]" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-rose-500/10 py-5 px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-gray-600 hover:text-rose-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
          <div>
            <h1 class="font-cinzel text-xl md:text-2xl text-rose-300/90 tracking-[0.2em] uppercase">
              Tarot Reading
            </h1>
            <p class="text-gray-600 font-garamond text-xs mt-0.5 tracking-widest">
              78-Card Rider-Waite · Full Celtic Cross + Situational Spreads
            </p>
          </div>
        </div>

        <!-- Progress indicator -->
        <div v-if="step !== 'shuffle'" class="hidden md:flex items-center gap-2">
          <div
            v-for="(s, i) in steps" :key="s.key"
            class="flex items-center gap-1.5"
          >
            <div
              class="w-2 h-2 rounded-full transition-all duration-500"
              :class="stepIndex >= i ? 'bg-rose-400' : 'bg-gray-700'"
            />
            <span
              class="font-cinzel text-xs tracking-wider transition-colors"
              :class="stepIndex >= i ? 'text-rose-400/70' : 'text-gray-700'"
            >{{ s.label }}</span>
            <span v-if="i < steps.length - 1" class="text-gray-700 text-xs mx-1">·</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="relative z-10 max-w-5xl mx-auto px-4 py-10">

      <!-- ══════════════════════════════════════════
           STEP 1: SHUFFLE
      ══════════════════════════════════════════════ -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'shuffle'" class="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div class="mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-6">The Oracle Awaits</p>
            <h2 class="font-cinzel text-3xl md:text-4xl text-rose-200/90 tracking-[0.15em] mb-4">
              Your Tarot Reading
            </h2>
            <p class="font-garamond text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
              Quiet your mind. Focus on your question or the energy you carry.
              When you feel ready, shuffle the 78-card deck.
            </p>
          </div>

          <!-- Deck visual -->
          <div class="relative w-40 h-56 mb-10 cursor-pointer group" @click="!isShuffling && !shuffleComplete && startShuffle()">
            <!-- Stack effect -->
            <div
              v-for="(offset, i) in [4, 3, 2, 1, 0]" :key="i"
              class="absolute inset-0 rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#1a0510] to-[#0d020a] transition-all duration-300"
              :style="{
                transform: isShuffling
                  ? `translateX(${Math.sin((Date.now() / 200) + i) * 12}px) translateY(${-offset * 3}px) rotate(${Math.sin((Date.now() / 300) + i) * 8}deg)`
                  : shuffleComplete
                    ? `translateY(${-offset * 2}px) rotate(${(i - 2) * 0.8}deg)`
                    : `translateY(${-offset * 3}px)`,
                zIndex: i,
                opacity: 1 - (offset * 0.06)
              }"
            >
              <!-- Card back pattern -->
              <div class="absolute inset-2 rounded-xl border border-rose-900/40 overflow-hidden flex items-center justify-center">
                <div class="text-4xl opacity-40 select-none">✦</div>
              </div>
            </div>

            <!-- Shimmer during shuffle -->
            <div
              v-if="isShuffling"
              class="absolute inset-0 rounded-2xl bg-rose-400/5 animate-pulse z-10 pointer-events-none"
            />

            <!-- Checkmark when done -->
            <div
              v-if="shuffleComplete"
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center z-20"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L6 11L12 3" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Shuffle state text -->
          <div v-if="isShuffling" class="mb-8">
            <p class="font-cinzel text-rose-400/70 text-sm tracking-widest animate-pulse">
              Shuffling the deck...
            </p>
          </div>
          <div v-else-if="shuffleComplete" class="mb-8">
            <p class="font-garamond text-gray-400 text-base">
              The deck is ready. <span class="text-rose-300">78 cards</span> await your touch.
            </p>
          </div>
          <div v-else class="mb-8">
            <p class="font-garamond text-gray-600 text-sm">
              Click the deck to begin shuffling
            </p>
          </div>

          <button
            v-if="shuffleComplete"
            @click="proceedToPick"
            class="px-10 py-4 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-[0.2em] uppercase hover:bg-rose-500/15 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Choose Your Cards →
          </button>
          <button
            v-else-if="!isShuffling"
            @click="startShuffle"
            class="px-10 py-4 rounded-full border border-rose-500/25 bg-black/40 font-cinzel text-sm text-rose-400/60 tracking-[0.2em] uppercase hover:border-rose-400/50 hover:text-rose-300 hover:bg-rose-500/8 transition-all duration-300"
          >
            Shuffle the Deck
          </button>
        </div>
      </Transition>

      <!-- ══════════════════════════════════════════
           STEP 2: PICK 10 CARDS
      ══════════════════════════════════════════════ -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'pick10'">
          <div class="text-center mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-3">Choose Wisely</p>
            <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-3">
              Select Ten Cards
            </h2>
            <p class="font-garamond text-gray-400 max-w-lg mx-auto leading-relaxed">
              Let your intuition guide your hand. Do not think — simply feel drawn to 10 cards from the shuffled deck.
              These will form your soul's signature for this reading.
            </p>
            <div class="mt-4 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/8 border border-rose-500/20">
              <div class="flex gap-1">
                <div
                  v-for="i in 10" :key="i"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="i <= picked10.length ? 'bg-rose-400' : 'bg-gray-700'"
                />
              </div>
              <span class="font-cinzel text-xs text-rose-400/70 tracking-wider">
                {{ picked10.length }} / 10 selected
              </span>
            </div>
          </div>

          <!-- Card grid — showing backs of 78 shuffled cards -->
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13 gap-2 mb-8">
            <div
              v-for="(card, index) in shuffledDeck" :key="card.id"
              @click="!isCardPicked(index) && picked10.length < 10 && selectCard(index)"
              class="relative aspect-[2/3] rounded-lg cursor-pointer group transition-all duration-300"
              :class="[
                isCardPicked(index)
                  ? 'scale-95 opacity-40 cursor-not-allowed'
                  : picked10.length < 10 ? 'hover:scale-110 hover:-translate-y-1' : 'opacity-50 cursor-not-allowed'
              ]"
            >
              <!-- Card back -->
              <div
                class="absolute inset-0 rounded-lg border transition-all duration-300 overflow-hidden"
                :class="isCardPicked(index)
                  ? 'border-rose-400/60 bg-rose-900/30'
                  : 'border-rose-900/40 bg-gradient-to-b from-[#1a0510] to-[#0d020a] group-hover:border-rose-500/50 group-hover:bg-rose-900/20'"
              >
                <div class="absolute inset-0 flex items-center justify-center text-rose-900/60 text-xs">✦</div>
                <!-- Picked overlay -->
                <div v-if="isCardPicked(index)" class="absolute inset-0 flex items-center justify-center">
                  <span class="font-cinzel text-rose-300 text-sm font-bold">{{ pickedCardNumber(index) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Picked cards preview -->
          <div v-if="picked10.length > 0" class="mt-6 p-5 rounded-2xl bg-black/40 border border-rose-500/10">
            <p class="font-cinzel text-xs text-rose-400/50 tracking-widest uppercase mb-3">Your Chosen Cards</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(card, i) in picked10" :key="card.id"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/8 border border-rose-500/15"
              >
                <span class="text-rose-400/60 font-cinzel text-xs">{{ i + 1 }}</span>
                <span class="font-garamond text-sm text-gray-300">{{ card.name }}</span>
                <span v-if="card.reversed" class="text-rose-500/50 text-xs">↓</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════════════════════════════════════
           STEP 3: SITUATION SPREADS
      ══════════════════════════════════════════════ -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'situations'">

          <!-- Overall progress -->
          <div class="text-center mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-3">The Situational Reading</p>
            <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-3">
              {{ currentSituation?.icon }} {{ currentSituation?.title }}
            </h2>
            <p class="font-garamond text-gray-400 max-w-lg mx-auto leading-relaxed mb-4">
              {{ currentSituation?.description }}
            </p>

            <!-- Situation progress dots -->
            <div class="flex items-center justify-center gap-2 mb-6">
              <div
                v-for="(s, i) in SITUATION_SPREADS" :key="s.id"
                class="flex items-center gap-1"
              >
                <div
                  class="w-2 h-2 rounded-full transition-all duration-500"
                  :class="i < situationReadings.length
                    ? 'bg-rose-400'
                    : i === currentSituationIndex
                      ? 'bg-rose-400/50 ring-2 ring-rose-400/30'
                      : 'bg-gray-700'"
                />
              </div>
            </div>

            <p class="font-garamond text-gray-500 text-sm">
              Spread {{ currentSituationIndex + 1 }} of {{ SITUATION_SPREADS.length }} ·
              Choose <span class="text-rose-300">3 cards</span> from your 10 for this spread
            </p>
          </div>

          <!-- 3 position slots -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              v-for="(pos, posIdx) in currentSituation?.positions" :key="posIdx"
              class="rounded-2xl border p-5 text-center transition-all duration-300"
              :class="currentSituationCards[posIdx]
                ? 'border-rose-400/40 bg-rose-500/5'
                : 'border-gray-800 bg-black/30 border-dashed'"
            >
              <div class="font-cinzel text-xs text-rose-400/50 tracking-widest uppercase mb-3">Position {{ posIdx + 1 }}</div>

              <!-- Filled slot -->
              <template v-if="currentSituationCards[posIdx]">
                <div class="text-3xl mb-2">{{ currentSituationCards[posIdx].symbol }}</div>
                <div class="font-cinzel text-sm text-rose-200 mb-1">
                  {{ currentSituationCards[posIdx].name }}
                  <span v-if="currentSituationCards[posIdx].reversed" class="text-rose-500/60 text-xs ml-1">↓ Rev</span>
                </div>
                <div class="font-garamond text-xs text-gray-500 leading-tight">{{ pos }}</div>
              </template>

              <!-- Empty slot -->
              <template v-else>
                <div class="text-3xl mb-2 opacity-20">✦</div>
                <div class="font-garamond text-sm text-gray-600 leading-tight">{{ pos }}</div>
              </template>
            </div>
          </div>

          <!-- Available cards to choose from (the 10 picked) -->
          <div v-if="currentSituationCards.length < 3">
            <p class="font-cinzel text-xs text-gray-600 tracking-widest uppercase text-center mb-4">
              Select from your 10 cards · {{ 3 - currentSituationCards.length }} remaining
            </p>
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                v-for="card in getAvailableCardsForSituation()" :key="card.id"
                @click="selectSituationCard(card)"
                class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-200 group hover:scale-105 active:scale-95"
                :class="isSituationCardSelected(card)
                  ? 'border-rose-400/50 bg-rose-500/10 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 bg-black/40 hover:border-rose-500/40 hover:bg-rose-500/8'"
              >
                <span class="text-xl">{{ card.symbol }}</span>
                <div class="text-left">
                  <div class="font-cinzel text-xs text-gray-300 group-hover:text-rose-300 transition-colors">{{ card.name }}</div>
                  <div class="font-garamond text-xs text-gray-600">{{ card.suit || 'Major Arcana' }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Continue button -->
          <div v-if="currentSituationCards.length === 3" class="text-center mt-8">
            <button
              @click="completeSituation"
              class="px-10 py-4 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-[0.2em] uppercase hover:bg-rose-500/15 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {{ currentSituationIndex < SITUATION_SPREADS.length - 1 ? 'Next Spread →' : 'Complete Reading →' }}
            </button>
          </div>

          <!-- Completed spreads summary (collapsible) -->
          <div v-if="situationReadings.length > 0" class="mt-10">
            <p class="font-cinzel text-xs text-gray-700 tracking-widest uppercase mb-4">Completed Spreads</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="sr in situationReadings" :key="sr.spread.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-rose-500/8"
              >
                <span class="text-xl shrink-0">{{ sr.spread.icon }}</span>
                <div class="flex-1 min-w-0">
                  <div class="font-cinzel text-xs text-gray-400 truncate">{{ sr.spread.title }}</div>
                  <div class="font-garamond text-xs text-gray-600 truncate">
                    {{ sr.cards.map(c => c.name).join(' · ') }}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L6 11L12 3" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════════════════════════════════════
           STEP 4: GENDER
      ══════════════════════════════════════════════ -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'gender'" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-6">One Final Question</p>
          <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-4">
            How do you identify?
          </h2>
          <p class="font-garamond text-gray-400 max-w-sm mx-auto leading-relaxed mb-10">
            The oracle speaks in the language of the soul. Knowing how to address you
            allows the reading to be truly personal.
          </p>

          <div class="flex flex-col sm:flex-row gap-5">
            <button
              @click="setGender('female')"
              class="group px-12 py-6 rounded-2xl border border-rose-500/25 bg-black/50 hover:border-rose-400/50 hover:bg-rose-500/8 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🌙</div>
              <div class="font-cinzel text-sm text-gray-300 group-hover:text-rose-300 tracking-widest uppercase transition-colors">Woman</div>
              <div class="font-garamond text-xs text-gray-600 mt-1">She / Her</div>
            </button>

            <button
              @click="setGender('male')"
              class="group px-12 py-6 rounded-2xl border border-amber-500/25 bg-black/50 hover:border-amber-400/50 hover:bg-amber-500/8 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">☀️</div>
              <div class="font-cinzel text-sm text-gray-300 group-hover:text-amber-300 tracking-widest uppercase transition-colors">Man</div>
              <div class="font-garamond text-xs text-gray-600 mt-1">He / Him</div>
            </button>
          </div>
        </div>
      </Transition>

      <!-- ══════════════════════════════════════════
           STEP 5: THE READING
      ══════════════════════════════════════════════ -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'reading'">

          <!-- Loading state -->
          <div v-if="isGeneratingReading" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div class="relative mb-8">
              <div class="text-7xl text-rose-400/20 animate-spin" style="animation-duration: 8s">✦</div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-3xl">🔮</div>
              </div>
            </div>
            <p class="font-cinzel text-rose-400/70 tracking-[0.2em] uppercase text-sm mb-3">
              The Oracle is Speaking...
            </p>
            <p class="font-garamond text-gray-500 max-w-sm mx-auto leading-relaxed">
              Your 10 chosen cards are being woven into a complete and deeply personal reading.
              This may take a moment.
            </p>
          </div>

          <!-- Error state -->
          <div v-else-if="readingError" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div class="text-5xl mb-6">⚠️</div>
            <h3 class="font-cinzel text-rose-300 text-xl mb-3">The Oracle is Silent</h3>
            <p class="font-garamond text-gray-500 max-w-sm mx-auto mb-6">{{ readingError }}</p>
            <button
              @click="generateReading"
              class="px-8 py-3 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-widest uppercase hover:bg-rose-500/15 transition-all"
            >
              Try Again
            </button>
          </div>

          <!-- Reading display -->
          <div v-else-if="finalReading">
            <!-- Header -->
            <div class="text-center mb-12">
              <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-4">Your Complete Reading</p>
              <div class="flex flex-wrap justify-center gap-2 mb-6">
                <span
                  v-for="card in picked10.slice(0, 5)" :key="card.id"
                  class="text-2xl"
                  :title="card.name"
                >{{ card.symbol }}</span>
                <span class="text-2xl text-gray-600">···</span>
                <span
                  v-for="card in picked10.slice(5)" :key="card.id"
                  class="text-2xl"
                  :title="card.name"
                >{{ card.symbol }}</span>
              </div>
              <div class="w-24 h-px bg-rose-500/25 mx-auto" />
            </div>

            <!-- Rendered markdown-style reading -->
            <div class="max-w-3xl mx-auto">
              <div
                class="prose-tarot space-y-8"
                v-html="renderedReading"
              />
            </div>

            <!-- Card recap -->
            <div class="mt-16 max-w-3xl mx-auto">
              <div class="border-t border-rose-500/10 pt-10">
                <p class="font-cinzel text-xs text-rose-400/40 tracking-widest uppercase mb-6 text-center">Cards Drawn in This Reading</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="sr in situationReadings" :key="sr.spread.id"
                    class="p-4 rounded-xl bg-black/40 border border-rose-500/8"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <span>{{ sr.spread.icon }}</span>
                      <span class="font-cinzel text-xs text-rose-400/60 tracking-wider uppercase">{{ sr.spread.title }}</span>
                    </div>
                    <div class="space-y-1.5">
                      <div
                        v-for="(card, i) in sr.cards" :key="card.id"
                        class="flex items-center gap-2"
                      >
                        <span class="text-base shrink-0">{{ card.symbol }}</span>
                        <div class="flex-1 min-w-0">
                          <span class="font-garamond text-sm text-gray-400">{{ card.name }}</span>
                          <span v-if="card.reversed" class="text-rose-500/50 text-xs ml-1">↓</span>
                        </div>
                        <span class="font-garamond text-xs text-gray-700 truncate max-w-[120px]">{{ sr.spread.positions[i] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- New reading button -->
            <div class="text-center mt-16">
              <button
                @click="resetReading"
                class="px-10 py-4 rounded-full border border-rose-400/25 bg-black/50 font-cinzel text-sm text-rose-400/60 tracking-[0.2em] uppercase hover:border-rose-400/50 hover:text-rose-300 hover:bg-rose-500/8 transition-all duration-300"
              >
                ↺ Begin a New Reading
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-rose-500/8 py-6 mt-16 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">
        Tarot is a tool for reflection · Not a substitute for professional guidance
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTarot } from '~/composables/useTarot'
import { SITUATION_SPREADS } from '~/utils/tarotCards'

const {
  step,
  isShuffling,
  shuffleComplete,
  shuffledDeck,
  picked10,
  situationReadings,
  currentSituationIndex,
  currentSituationCards,
  currentSituation,
  allSituationsComplete,
  readingProgress,
  gender,
  isGeneratingReading,
  finalReading,
  readingError,
  revealedCards,
  startShuffle,
  proceedToPick,
  selectCard,
  isCardPicked,
  pickedCardNumber,
  selectSituationCard,
  isSituationCardSelected,
  completeSituation,
  setGender,
  generateReading,
  resetReading,
  getAvailableCardsForSituation,
} = useTarot()

// ── Steps config ────────────────────────────────────────────────────────────
const steps = [
  { key: 'shuffle', label: 'Shuffle' },
  { key: 'pick10', label: 'Choose' },
  { key: 'situations', label: 'Spreads' },
  { key: 'gender', label: 'Identity' },
  { key: 'reading', label: 'Reading' },
]

const stepIndex = computed(() => steps.findIndex(s => s.key === step.value))

// ── Starfield ────────────────────────────────────────────────────────────────
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 1.8 + 0.4,
  opacity: Math.random() * 0.4 + 0.06,
  duration: Math.random() * 5 + 2,
  delay: Math.random() * 6
}))

// ── Markdown-like rendering ──────────────────────────────────────────────────
const renderedReading = computed(() => {
  if (!finalReading.value) return ''
  return finalReading.value
    // H2 headings
    .replace(/^## (.+)$/gm, '<h2 class="font-cinzel text-xl text-rose-300/90 tracking-wider mt-10 mb-5 flex items-center gap-3 border-b border-rose-500/15 pb-3">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="text-rose-300/70 not-italic font-garamond">$1</em>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="font-garamond text-gray-400 leading-[1.85] text-base mb-4">')
    // Wrap in opening p
    .replace(/^/, '<p class="font-garamond text-gray-400 leading-[1.85] text-base mb-4">')
    .replace(/$/, '</p>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-rose-500/10 my-8"/>')
})
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.08; }
  50%       { opacity: 0.5; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>