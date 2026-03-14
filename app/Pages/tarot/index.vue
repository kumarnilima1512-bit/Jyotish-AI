<template>
  <div class="min-h-screen bg-[#0a0408] text-gray-200 relative overflow-x-hidden">

    <!-- Starfield -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="star in stars" :key="star.id" class="absolute rounded-full bg-white"
        :style="{ left: star.x + '%', top: star.y + '%', width: star.size + 'px', height: star.size + 'px', opacity: star.opacity, animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s` }" />
    </div>

    <!-- Ambient glow -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rose-900/10 blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-900/8 blur-[100px]" />
      <div class="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-amber-900/8 blur-[100px]" />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-rose-500/10 py-4 px-6">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-9 h-9 rounded-xl border border-rose-500/20 bg-black/40 flex items-center justify-center text-gray-500 hover:text-rose-300 hover:border-rose-400/50 hover:bg-rose-500/8 transition-all duration-200 shrink-0">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 1L4 6.5L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/></svg>
          </NuxtLink>
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="/images/JYOTISH-logo.png" alt="Jyotish" class="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(232,180,0,0.35)]"/>
            <div>
              <p class="font-cinzel text-base text-yellow-400 tracking-[0.22em] uppercase group-hover:text-yellow-300 transition-colors leading-tight">ज्योतिष · Jyotish</p>
              <p class="font-garamond text-xs text-gray-600 tracking-widest leading-tight mt-0.5">Tarot Reading</p>
            </div>
          </NuxtLink>
        </div>
        <div v-if="step !== 'shuffle'" class="hidden md:flex items-center gap-2">
          <div v-for="(s, i) in steps" :key="s.key" class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full transition-all duration-500" :class="stepIndex >= i ? 'bg-rose-400' : 'bg-gray-700'" />
            <span class="font-cinzel text-xs tracking-wider transition-colors" :class="stepIndex >= i ? 'text-rose-400/70' : 'text-gray-700'">{{ s.label }}</span>
            <span v-if="i < steps.length - 1" class="text-gray-700 text-xs mx-1">·</span>
          </div>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-5xl mx-auto px-4 py-10">

      <!-- ══ STEP 1: SHUFFLE ══ -->
      <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 -translate-y-2" mode="out-in">
        <div v-if="step === 'shuffle'" class="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div class="mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-6">The Oracle Awaits</p>
            <h2 class="font-cinzel text-3xl md:text-4xl text-rose-200/90 tracking-[0.15em] mb-4">Your Tarot Reading</h2>
            <p class="font-garamond text-gray-400 text-lg max-w-md mx-auto leading-relaxed">Quiet your mind. Focus on your question or the energy you carry. When you feel ready, shuffle the 78-card deck.</p>
          </div>
          <div class="relative w-40 h-56 mb-10 cursor-pointer group" @click="!isShuffling && !shuffleComplete && startShuffle()">
            <div v-for="(offset, i) in [4, 3, 2, 1, 0]" :key="i"
              class="absolute inset-0 rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#1a0510] to-[#0d020a] transition-all duration-300"
              :style="{ transform: isShuffling ? `translateX(${Math.sin((animTick/200)+i)*12}px) translateY(${-offset*3}px) rotate(${Math.sin((animTick/300)+i)*8}deg)` : shuffleComplete ? `translateY(${-offset*2}px) rotate(${(i-2)*0.8}deg)` : `translateY(${-offset*3}px)`, zIndex: i, opacity: 1-(offset*0.06) }">
              <div class="absolute inset-2 rounded-xl border border-rose-900/40 overflow-hidden flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" class="opacity-30">
                  <path d="M14 2L16.5 9.5H24.5L18 14L20.5 21.5L14 17L7.5 21.5L10 14L3.5 9.5H11.5Z" fill="#f43f5e"/>
                  <circle cx="14" cy="14" r="12" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/>
                </svg>
              </div>
            </div>
            <div v-if="isShuffling" class="absolute inset-0 rounded-2xl bg-rose-400/5 animate-pulse z-10 pointer-events-none" />
            <div v-if="shuffleComplete" class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center z-20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L6 11L12 3" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
          <div v-if="isShuffling" class="mb-8"><p class="font-cinzel text-rose-400/70 text-sm tracking-widest animate-pulse">Shuffling the deck...</p></div>
          <div v-else-if="shuffleComplete" class="mb-8"><p class="font-garamond text-gray-400 text-base">The deck is ready. <span class="text-rose-300">78 cards</span> await your touch.</p></div>
          <div v-else class="mb-8"><p class="font-garamond text-gray-600 text-sm">Click the deck to begin shuffling</p></div>
          <button v-if="shuffleComplete" @click="proceedToPick" class="px-10 py-4 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-[0.2em] uppercase hover:bg-rose-500/15 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 active:scale-95">Choose Your Cards →</button>
          <button v-else-if="!isShuffling" @click="startShuffle" class="px-10 py-4 rounded-full border border-rose-500/25 bg-black/40 font-cinzel text-sm text-rose-400/60 tracking-[0.2em] uppercase hover:border-rose-400/50 hover:text-rose-300 hover:bg-rose-500/8 transition-all duration-300">Shuffle the Deck</button>
        </div>
      </Transition>

      <!-- ══ STEP 2: PICK 10 CARDS ══ -->
      <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 -translate-y-2" mode="out-in">
        <div v-if="step === 'pick10'">
          <div class="text-center mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-3">Choose Wisely</p>
            <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-3">Select Ten Cards</h2>
            <p class="font-garamond text-gray-400 max-w-lg mx-auto leading-relaxed">Let your intuition guide your hand. Do not think — simply feel drawn to 10 cards from the shuffled deck.</p>
            <div class="mt-4 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-500/8 border border-rose-500/20">
              <div class="flex gap-1">
                <div v-for="i in 10" :key="i" class="w-2 h-2 rounded-full transition-all duration-300" :class="i <= picked10.length ? 'bg-rose-400' : 'bg-gray-700'" />
              </div>
              <span class="font-cinzel text-xs text-rose-400/70 tracking-wider">{{ picked10.length }} / 10 selected</span>
            </div>
          </div>

          <!-- 78-card grid with 3D flip on select -->
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-8">
            <div v-for="(card, index) in shuffledDeck" :key="card.id"
              class="relative"
              style="aspect-ratio: 2/3; perspective: 600px;"
              @click="!isCardPicked(index) && picked10.length < 10 && selectCard(index)">
              <div class="absolute inset-0 transition-transform duration-700" style="transform-style: preserve-3d;"
                :style="{ transform: isCardPicked(index) ? 'rotateY(180deg)' : 'rotateY(0deg)' }">
                <!-- Back -->
                <div class="absolute inset-0 rounded-lg border overflow-hidden"
                  style="backface-visibility: hidden; -webkit-backface-visibility: hidden;"
                  :class="isCardPicked(index) ? 'border-rose-400/60' : picked10.length < 10 ? 'border-rose-900/40 bg-gradient-to-b from-[#1a0510] to-[#0d020a] hover:border-rose-500/60 hover:scale-105 cursor-pointer' : 'border-rose-900/40 bg-gradient-to-b from-[#1a0510] to-[#0d020a] opacity-40 cursor-not-allowed'">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="opacity-25"><path d="M6 1L7 4H10.5L7.5 6L8.5 9.5L6 7.5L3.5 9.5L4.5 6L1.5 4H5Z" fill="#f43f5e"/></svg>
                  </div>
                  <div class="absolute inset-1 rounded border border-rose-900/20" />
                </div>
                <!-- Front (SVG face) -->
                <div class="absolute inset-0 rounded-lg overflow-hidden border border-rose-400/40"
                  style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);">
                  <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center z-10">
                    <span class="font-cinzel text-white font-bold" style="font-size:7px;">{{ pickedCardNumber(index) }}</span>
                  </div>
                  <img :src="getCardImage(card.id)" :alt="card.name" class="w-full h-full object-cover" :class="picked10.find(c => c.selectedIndex === index)?.reversed ? 'rotate-180' : ''" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <!-- Picked preview -->
          <div v-if="picked10.length > 0" class="mt-6 p-5 rounded-2xl bg-black/40 border border-rose-500/10">
            <p class="font-cinzel text-xs text-rose-400/50 tracking-widest uppercase mb-3">Your Chosen Cards</p>
            <div class="flex flex-wrap gap-2">
              <div v-for="(card, i) in picked10" :key="card.id" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/8 border border-rose-500/15">
                <span class="text-rose-400/60 font-cinzel text-xs">{{ i + 1 }}</span>
                <span class="font-garamond text-sm text-gray-300">{{ card.name }}</span>
                <span v-if="card.reversed" class="text-rose-500/50 text-xs">↓</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ STEP 3: SITUATION SPREADS ══ -->
      <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 -translate-y-2" mode="out-in">
        <div v-if="step === 'situations'">
          <div class="text-center mb-8">
            <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-3">The Situational Reading</p>
            <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-3">{{ currentSituation?.icon }} {{ currentSituation?.title }}</h2>
            <p class="font-garamond text-gray-400 max-w-lg mx-auto leading-relaxed mb-4">{{ currentSituation?.description }}</p>
            <div class="flex items-center justify-center gap-2 mb-6">
              <div v-for="(s, i) in SITUATION_SPREADS" :key="s.id" class="w-2 h-2 rounded-full transition-all duration-500"
                :class="i < situationReadings.length ? 'bg-rose-400' : i === currentSituationIndex ? 'bg-rose-400/50 ring-2 ring-rose-400/30' : 'bg-gray-700'" />
            </div>
            <p class="font-garamond text-gray-500 text-sm">Spread {{ currentSituationIndex + 1 }} of {{ SITUATION_SPREADS.length }} · Choose <span class="text-rose-300">3 cards</span> from your 10</p>
          </div>

          <!-- 3 position slots -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div v-for="(pos, posIdx) in currentSituation?.positions" :key="posIdx"
              class="rounded-2xl border p-5 text-center transition-all duration-300"
              :class="currentSituationCards[posIdx] ? 'border-rose-400/40 bg-rose-500/5' : 'border-gray-800 bg-black/30 border-dashed'">
              <div class="font-cinzel text-xs text-rose-400/50 tracking-widest uppercase mb-3">Position {{ posIdx + 1 }}</div>
              <template v-if="currentSituationCards[posIdx]">
                <!-- Revealed card in slot -->
                <div class="w-20 h-28 mx-auto rounded-lg overflow-hidden border border-rose-400/50 mb-2">
                  <img :src="getCardImage(currentSituationCards[posIdx].id)" :alt="currentSituationCards[posIdx].name" class="w-full h-full object-cover" :class="currentSituationCards[posIdx].reversed ? 'rotate-180' : ''" />
                </div>
                <div class="font-cinzel text-xs text-rose-200 mb-1">{{ currentSituationCards[posIdx].name }}</div>
                <div v-if="currentSituationCards[posIdx].reversed" class="text-rose-500/60 text-xs mb-1">↓ Reversed</div>
                <div class="font-garamond text-xs text-gray-500 leading-tight">{{ pos }}</div>
              </template>
              <template v-else>
                <div class="w-20 h-28 mx-auto rounded-lg border border-dashed border-gray-700 flex items-center justify-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#374151" stroke-width="1" fill="none"/></svg>
                </div>
                <div class="font-garamond text-sm text-gray-600 leading-tight">{{ pos }}</div>
              </template>
            </div>
          </div>

          <!-- Available cards — face down, click to flip then select -->
          <div v-if="currentSituationCards.length < 3">
            <p class="font-cinzel text-xs text-gray-600 tracking-widest uppercase text-center mb-5">
              Feel which card calls to you — touch to reveal · {{ 3 - currentSituationCards.length }} remaining
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <div v-for="card in getAvailableCardsForSituation()" :key="card.id"
                class="relative shrink-0"
                style="width: 72px; height: 108px; perspective: 600px;"
                @click="handleSituationFlip(card)">
                <div class="absolute inset-0 transition-transform duration-600"
                  style="transform-style: preserve-3d;"
                  :style="{ transform: revealedSituationIds.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)' }">
                  <!-- Back face -->
                  <div class="absolute inset-0 rounded-xl border border-rose-900/40 bg-gradient-to-b from-[#1a0510] to-[#0d020a] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-rose-500/50 hover:scale-105 transition-all"
                    style="backface-visibility: hidden; -webkit-backface-visibility: hidden;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L14.5 9.5H22.5L16 14L18.5 21.5L12 17L5.5 21.5L8 14L1.5 9.5H9.5Z" fill="#f43f5e" opacity="0.3"/>
                    </svg>
                    <span class="font-cinzel text-rose-900/50 text-center" style="font-size:5px;">Touch to<br/>reveal</span>
                  </div>
                  <!-- Front face (real image) -->
                  <div class="absolute inset-0 rounded-xl overflow-hidden border cursor-pointer"
                    style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);"
                    :class="isSituationCardSelected(card) ? 'border-rose-400/80 opacity-60' : 'border-rose-400/50 hover:border-rose-300/70'">
                    <img :src="getCardImage(card.id)" :alt="card.name" class="w-full h-full object-cover" :class="card.reversed ? 'rotate-180' : ''" loading="lazy" />
                    <!-- Selected overlay -->
                    <div v-if="isSituationCardSelected(card)" class="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#f43f5e" opacity="0.8"/><path d="M6 10L9 13L14 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Continue -->
          <div v-if="currentSituationCards.length === 3" class="text-center mt-8">
            <button @click="completeSituation" class="px-10 py-4 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-[0.2em] uppercase hover:bg-rose-500/15 hover:border-rose-400/60 transition-all duration-300 hover:scale-105 active:scale-95">
              {{ currentSituationIndex < SITUATION_SPREADS.length - 1 ? 'Next Spread →' : 'Complete Reading →' }}
            </button>
          </div>

          <!-- Completed spreads -->
          <div v-if="situationReadings.length > 0" class="mt-10">
            <p class="font-cinzel text-xs text-gray-700 tracking-widest uppercase mb-4">Completed Spreads</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="sr in situationReadings" :key="sr.spread.id" class="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-rose-500/8">
                <span class="text-xl shrink-0">{{ sr.spread.icon }}</span>
                <div class="flex-1 min-w-0">
                  <div class="font-cinzel text-xs text-gray-400 truncate">{{ sr.spread.title }}</div>
                  <div class="font-garamond text-xs text-gray-600 truncate">{{ sr.cards.map((c: any) => c.name).join(' · ') }}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L6 11L12 3" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/></svg>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══ STEP 4: GENDER ══ -->
      <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 -translate-y-2" mode="out-in">
        <div v-if="step === 'gender'" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-6">One Final Question</p>
          <h2 class="font-cinzel text-2xl md:text-3xl text-rose-200/90 tracking-wider mb-4">How do you identify?</h2>
          <p class="font-garamond text-gray-400 max-w-sm mx-auto leading-relaxed mb-10">The oracle speaks in the language of the soul.</p>
          <div class="flex flex-col sm:flex-row gap-5">
            <button @click="setGender('female')" class="group px-12 py-6 rounded-2xl border border-rose-500/25 bg-black/50 hover:border-rose-400/50 hover:bg-rose-500/8 transition-all duration-300 hover:scale-105 active:scale-95">
              <div class="mb-3 flex justify-center group-hover:scale-110 transition-transform">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M28 20c0 6.627-5.373 12-12 12a12 12 0 0 1-1.5-.094C17.574 33.246 21 37 25 37c5.523 0 10-4.477 10-10 0-4.83-3.418-8.87-8-9.8A11.98 11.98 0 0 1 28 20z" stroke="#f9a8d4" stroke-width="1.2" fill="none"/>
                  <circle cx="20" cy="20" r="10" stroke="#f9a8d4" stroke-width="1.2" fill="none" stroke-dasharray="3 2" opacity="0.4"/>
                </svg>
              </div>
              <div class="font-cinzel text-sm text-gray-300 group-hover:text-rose-300 tracking-widest uppercase transition-colors">Woman</div>
              <div class="font-garamond text-xs text-gray-600 mt-1">She / Her</div>
            </button>
            <button @click="setGender('male')" class="group px-12 py-6 rounded-2xl border border-amber-500/25 bg-black/50 hover:border-amber-400/50 hover:bg-amber-500/8 transition-all duration-300 hover:scale-105 active:scale-95">
              <div class="mb-3 flex justify-center group-hover:scale-110 transition-transform">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="18" cy="22" r="10" stroke="#fbbf24" stroke-width="1.2" fill="none"/>
                  <line x1="25" y1="15" x2="34" y2="6" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round"/>
                  <polyline points="28,6 34,6 34,12" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="font-cinzel text-sm text-gray-300 group-hover:text-amber-300 tracking-widest uppercase transition-colors">Man</div>
              <div class="font-garamond text-xs text-gray-600 mt-1">He / Him</div>
            </button>
          </div>
        </div>
      </Transition>

      <!-- ══ STEP 5: READING ══ -->
      <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-3" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 -translate-y-2" mode="out-in">
        <div v-if="step === 'reading'">
          <div v-if="isGeneratingReading" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div class="relative mb-8">
              <svg width="72" height="72" viewBox="0 0 72 72" class="animate-spin" style="animation-duration:8s">
                <polygon points="36,4 43,26 66,26 48,40 55,62 36,49 17,62 24,40 6,26 29,26" stroke="#f43f5e" stroke-width="0.8" fill="none" opacity="0.2"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="11" stroke="#f87171" stroke-width="1" opacity="0.5"/>
                  <circle cx="14" cy="14" r="6" stroke="#f87171" stroke-width="0.8" fill="none" opacity="0.4"/>
                  <circle cx="14" cy="14" r="2" fill="#f87171" opacity="0.6"/>
                  <line x1="10" y1="10" x2="8" y2="8" stroke="#f87171" stroke-width="0.8" opacity="0.4"/>
                  <line x1="18" y1="10" x2="20" y2="8" stroke="#f87171" stroke-width="0.8" opacity="0.4"/>
                </svg>
              </div>
            </div>
            <p class="font-cinzel text-rose-400/70 tracking-[0.2em] uppercase text-sm mb-3">The Oracle is Speaking...</p>
            <p class="font-garamond text-gray-500 max-w-sm mx-auto leading-relaxed">Your 10 chosen cards are being woven into a complete and deeply personal reading.</p>
          </div>
          <div v-else-if="readingError" class="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="mb-6 opacity-50">
              <path d="M24 6L44 42H4L24 6Z" stroke="#f87171" stroke-width="1.5" stroke-linejoin="round"/>
              <line x1="24" y1="20" x2="24" y2="30" stroke="#f87171" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="24" cy="35" r="1.2" fill="#f87171"/>
            </svg>
            <h3 class="font-cinzel text-rose-300 text-xl mb-3">The Oracle is Silent</h3>
            <p class="font-garamond text-gray-500 max-w-sm mx-auto mb-6">{{ readingError }}</p>
            <button @click="generateReading" class="px-8 py-3 rounded-full border border-rose-400/40 bg-rose-500/8 font-cinzel text-sm text-rose-300 tracking-widest uppercase hover:bg-rose-500/15 transition-all">Try Again</button>
          </div>
          <div v-else-if="finalReading">
            <div class="text-center mb-12">
              <p class="font-cinzel text-rose-400/50 text-xs tracking-[0.35em] uppercase mb-4">Your Complete Reading</p>
              <div class="flex flex-wrap justify-center gap-2 mb-6">
                <div v-for="card in picked10" :key="card.id" class="w-8 h-12 rounded overflow-hidden border border-rose-500/20" :title="card.name">
                  <img :src="getCardImage(card.id)" :alt="card.name" class="w-full h-full object-cover" :class="card.reversed ? 'rotate-180' : ''" />
                </div>
              </div>
              <div class="w-24 h-px bg-rose-500/25 mx-auto" />
            </div>
            <div class="max-w-3xl mx-auto">
              <div class="prose-tarot space-y-8" v-html="renderedReading" />
            </div>
            <div class="mt-16 max-w-3xl mx-auto">
              <div class="border-t border-rose-500/10 pt-10">
                <p class="font-cinzel text-xs text-rose-400/40 tracking-widest uppercase mb-6 text-center">Cards Drawn in This Reading</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div v-for="sr in situationReadings" :key="sr.spread.id" class="p-4 rounded-xl bg-black/40 border border-rose-500/8">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="font-cinzel text-xs text-rose-400/60 tracking-wider uppercase">{{ sr.spread.title }}</span>
                    </div>
                    <div class="space-y-2">
                      <div v-for="(card, i) in sr.cards" :key="card.id" class="flex items-center gap-3">
                        <div class="w-8 h-12 rounded overflow-hidden border border-rose-500/15 shrink-0">
                          <img :src="getCardImage(card.id)" :alt="card.name" class="w-full h-full object-cover" :class="card.reversed ? 'rotate-180' : ''" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="font-garamond text-sm text-gray-300">{{ card.name }}<span v-if="card.reversed" class="text-rose-500/50 text-xs ml-1">↓</span></div>
                          <div class="font-garamond text-xs text-gray-600 truncate">{{ sr.spread.positions[i] }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-16">
              <button @click="resetReading" class="px-10 py-4 rounded-full border border-rose-400/25 bg-black/50 font-cinzel text-sm text-rose-400/60 tracking-[0.2em] uppercase hover:border-rose-400/50 hover:text-rose-300 hover:bg-rose-500/8 transition-all duration-300">↺ Begin a New Reading</button>
            </div>
          </div>
        </div>
      </Transition>

    </main>

    <footer class="relative z-10 border-t border-rose-500/8 py-6 mt-16 text-center">
      <p class="font-cinzel text-gray-700 text-xs tracking-widest uppercase">Tarot is a tool for reflection · Not a substitute for professional guidance</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTarot } from '~/composables/useTarot'
import { SITUATION_SPREADS, type TarotCard } from '~/utils/tarotCards'
import { getCardImage } from '~/utils/tarotCardImages'

const {
  step, isShuffling, shuffleComplete, shuffledDeck, picked10,
  situationReadings, currentSituationIndex, currentSituationCards,
  currentSituation, gender, isGeneratingReading, finalReading, readingError,
  startShuffle, proceedToPick, selectCard, isCardPicked, pickedCardNumber,
  selectSituationCard, isSituationCardSelected, completeSituation,
  setGender, generateReading, resetReading, getAvailableCardsForSituation,
} = useTarot()

const steps = [
  { key: 'shuffle', label: 'Shuffle' },
  { key: 'pick10',  label: 'Choose'  },
  { key: 'situations', label: 'Spreads' },
  { key: 'gender',  label: 'Identity' },
  { key: 'reading', label: 'Reading' },
]
const stepIndex = computed(() => steps.findIndex(s => s.key === step.value))

// Starfield
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i, x: Math.random()*100, y: Math.random()*100,
  size: Math.random()*1.8+0.4, opacity: Math.random()*0.4+0.06,
  duration: Math.random()*5+2, delay: Math.random()*6,
}))

// Shuffle animation tick
const animTick = ref(Date.now())
let rafId = 0
onMounted(() => { const tick = () => { animTick.value = Date.now(); rafId = requestAnimationFrame(tick) }; rafId = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(rafId))

// ── Situation card flip state ────────────────────────────────────────────────
const revealedSituationIds = ref<Set<number>>(new Set())

// Reset revealed cards when situation changes
watch(() => currentSituationIndex.value, () => {
  revealedSituationIds.value = new Set()
})

function handleSituationFlip(card: any) {
  if (isSituationCardSelected(card)) return
  if (!revealedSituationIds.value.has(card.id)) {
    // First click: flip to reveal
    const s = new Set(revealedSituationIds.value)
    s.add(card.id)
    revealedSituationIds.value = s
    // After flip animation completes, select
    setTimeout(() => {
      if (!isSituationCardSelected(card) && currentSituationCards.value.length < 3) {
        selectSituationCard(card)
      }
    }, 650)
  }
}

// ── Card SVG generator ───────────────────────────────────────────────────────
function getCardSvg(card: TarotCard): string {
  const id = typeof card.id === 'number' ? card.id : parseInt(String(card.id))

  const major: Record<number, string> = {
    0: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="26" r="12" stroke="#fbbf24" stroke-width="0.8" fill="none"/><circle cx="30" cy="26" r="5" fill="#fbbf24" opacity="0.8"/><line x1="30" y1="12" x2="30" y2="15" stroke="#fbbf24" stroke-width="1"/><line x1="30" y1="37" x2="30" y2="40" stroke="#fbbf24" stroke-width="1"/><line x1="16" y1="26" x2="19" y2="26" stroke="#fbbf24" stroke-width="1"/><line x1="41" y1="26" x2="44" y2="26" stroke="#fbbf24" stroke-width="1"/><circle cx="30" cy="55" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="30" y1="59" x2="30" y2="70" stroke="#e2e8f0" stroke-width="0.7"/><line x1="23" y1="63" x2="37" y2="63" stroke="#e2e8f0" stroke-width="0.7"/><line x1="30" y1="70" x2="25" y2="78" stroke="#e2e8f0" stroke-width="0.7"/><line x1="30" y1="70" x2="35" y2="78" stroke="#e2e8f0" stroke-width="0.7"/><line x1="36" y1="57" x2="46" y2="48" stroke="#fbbf24" stroke-width="0.8"/><circle cx="46" cy="47" r="2" fill="#f43f5e" opacity="0.9"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">0 · THE FOOL</text></svg>`,
    1: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M20 18 C20 14 24 12 28 15 C32 12 36 14 36 18 C36 22 32 24 28 21 C24 24 20 22 20 18Z" stroke="#fbbf24" stroke-width="0.9" fill="none"/><rect x="10" y="36" width="40" height="2" rx="1" fill="#92400e" opacity="0.7"/><circle cx="18" cy="35" r="2" fill="#fbbf24" opacity="0.8"/><rect x="25" y="33" width="5" height="4" rx="0.5" fill="#3b82f6" opacity="0.8"/><path d="M33 34 L35 31 L37 34" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="43" y1="31" x2="43" y2="36" stroke="#6b7280" stroke-width="1"/><circle cx="30" cy="26" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="30" y1="22" x2="30" y2="14" stroke="#fbbf24" stroke-width="1"/><circle cx="30" cy="13" r="1.8" fill="#fbbf24"/><path d="M26 48 Q30 54 34 48 L35 68 Q30 72 25 68Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">I · THE MAGICIAN</text></svg>`,
    2: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><rect x="9" y="28" width="7" height="42" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.5"/><rect x="44" y="28" width="7" height="42" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.5"/><text x="12" y="34" text-anchor="middle" fill="#fbbf24" font-size="5" font-family="serif">B</text><text x="48" y="34" text-anchor="middle" fill="#e2e8f0" font-size="5" font-family="serif">J</text><path d="M16 34 Q30 39 44 34 L44 70 Q30 65 16 70Z" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.4" opacity="0.7"/><circle cx="30" cy="42" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M26 46 Q30 52 34 46 L35 65 Q30 70 25 65Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M26 40 L28 36 L30 39 L32 36 L34 40" stroke="#fbbf24" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">II · HIGH PRIESTESS</text></svg>`,
    3: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="17" r="6" stroke="#f43f5e" stroke-width="1" fill="none"/><line x1="30" y1="23" x2="30" y2="29" stroke="#f43f5e" stroke-width="1"/><line x1="26" y1="26" x2="34" y2="26" stroke="#f43f5e" stroke-width="1"/><path d="M8 75 Q13 55 18 44" stroke="#22c55e" stroke-width="0.8" fill="none"/><path d="M18 44 Q16 39 20 37" stroke="#22c55e" stroke-width="0.7" fill="none"/><path d="M18 44 Q21 39 25 37" stroke="#22c55e" stroke-width="0.7" fill="none"/><path d="M52 75 Q47 55 42 44" stroke="#22c55e" stroke-width="0.8" fill="none"/><circle cx="30" cy="47" r="5" stroke="#f43f5e" stroke-width="0.8" fill="none"/><path d="M25 52 Q30 57 35 52 L36 72 Q30 76 24 72Z" stroke="#f43f5e" stroke-width="0.8" fill="none"/><path d="M24 44 L26 40 L28 43 L30 39 L32 43 L34 40 L36 44" stroke="#fbbf24" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">III · THE EMPRESS</text></svg>`,
    4: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M5 74 L18 46 L28 58 L38 38 L55 74Z" fill="#7f1d1d" opacity="0.4" stroke="#ef4444" stroke-width="0.4"/><rect x="18" y="47" width="24" height="20" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.5" opacity="0.8"/><circle cx="30" cy="42" r="5" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M25 47 L23 67 L37 67 L35 47Z" stroke="#ef4444" stroke-width="0.7" fill="none"/><line x1="37" y1="55" x2="47" y2="45" stroke="#fbbf24" stroke-width="1"/><path d="M47 45 L45 41 L49 41Z" fill="#fbbf24"/><path d="M24 40 L26 36 L28 39 L30 35 L32 39 L34 36 L36 40" stroke="#fbbf24" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">IV · THE EMPEROR</text></svg>`,
    5: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><rect x="8" y="24" width="7" height="48" rx="1" fill="#1e1b4b" stroke="#a78bfa" stroke-width="0.5"/><rect x="45" y="24" width="7" height="48" rx="1" fill="#1e1b4b" stroke="#a78bfa" stroke-width="0.5"/><path d="M22 21 L24 15 L26 19 L28 13 L30 17 L32 13 L34 19 L36 15 L38 21" stroke="#fbbf24" stroke-width="0.8" fill="none"/><circle cx="30" cy="33" r="5" stroke="#e2e8f0" stroke-width="0.8" fill="none"/><path d="M25 38 Q30 43 35 38 L36 64 Q30 69 24 64Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="19" y1="37" x2="19" y2="65" stroke="#fbbf24" stroke-width="1"/><line x1="30" y1="45" x2="30" y2="53" stroke="#fbbf24" stroke-width="0.7"/><line x1="27" y1="48" x2="33" y2="48" stroke="#fbbf24" stroke-width="0.7"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">V · THE HIEROPHANT</text></svg>`,
    6: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="16" r="6" fill="#fbbf24" opacity="0.6"/><path d="M30 16 C18 9 8 16 10 26 C16 22 22 17 30 16Z" fill="#e2e8f0" opacity="0.4"/><path d="M30 16 C42 9 52 16 50 26 C44 22 38 17 30 16Z" fill="#e2e8f0" opacity="0.4"/><circle cx="18" cy="52" r="4" stroke="#f43f5e" stroke-width="0.7" fill="none"/><line x1="18" y1="56" x2="18" y2="68" stroke="#f43f5e" stroke-width="0.7"/><line x1="14" y1="60" x2="22" y2="60" stroke="#f43f5e" stroke-width="0.7"/><circle cx="42" cy="52" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="42" y1="56" x2="42" y2="68" stroke="#e2e8f0" stroke-width="0.7"/><line x1="38" y1="60" x2="46" y2="60" stroke="#e2e8f0" stroke-width="0.7"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">VI · THE LOVERS</text></svg>`,
    7: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><rect x="12" y="26" width="36" height="20" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.7"/><circle cx="30" cy="34" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><ellipse cx="18" cy="57" rx="8" ry="5" fill="#1c1917" stroke="#fbbf24" stroke-width="0.6"/><ellipse cx="42" cy="57" rx="8" ry="5" fill="#0f172a" stroke="#e2e8f0" stroke-width="0.6"/><circle cx="18" cy="66" r="6" stroke="#6366f1" stroke-width="0.7" fill="none"/><circle cx="42" cy="66" r="6" stroke="#6366f1" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">VII · THE CHARIOT</text></svg>`,
    8: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M20 17 C20 13 24 11 28 14 C32 11 36 13 36 17 C36 21 32 23 28 20 C24 23 20 21 20 17Z" stroke="#fbbf24" stroke-width="0.9" fill="none"/><circle cx="22" cy="33" r="4" stroke="#f43f5e" stroke-width="0.7" fill="none"/><ellipse cx="40" cy="47" rx="10" ry="7" fill="#1c1917" stroke="#fbbf24" stroke-width="0.6"/><circle cx="40" cy="41" r="6" fill="#1c1917" stroke="#fbbf24" stroke-width="0.6"/><path d="M36 45 C38 47 42 47 44 45" stroke="#e2e8f0" stroke-width="0.5" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">VIII · STRENGTH</text></svg>`,
    9: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M5 70 L18 42 L26 55 L34 30 L50 65 L55 70Z" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.4" opacity="0.6"/><circle cx="30" cy="37" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M26 41 Q30 47 34 41 L35 64 Q30 69 25 64Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="24" y1="43" x2="18" y2="67" stroke="#fbbf24" stroke-width="0.9"/><rect x="38" y="23" width="8" height="9" rx="1" stroke="#fbbf24" stroke-width="0.7" fill="none"/><circle cx="42" cy="27" r="1.8" fill="#fbbf24" opacity="0.9"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">IX · THE HERMIT</text></svg>`,
    10: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="42" r="22" stroke="#fbbf24" stroke-width="0.9" fill="none"/><circle cx="30" cy="42" r="15" stroke="#fbbf24" stroke-width="0.4" stroke-dasharray="2 2" fill="none"/><circle cx="30" cy="42" r="6" stroke="#fbbf24" stroke-width="0.8" fill="none"/><line x1="30" y1="20" x2="30" y2="64" stroke="#fbbf24" stroke-width="0.4"/><line x1="8" y1="42" x2="52" y2="42" stroke="#fbbf24" stroke-width="0.4"/><line x1="14" y1="26" x2="46" y2="58" stroke="#fbbf24" stroke-width="0.4"/><line x1="14" y1="58" x2="46" y2="26" stroke="#fbbf24" stroke-width="0.4"/><text x="30" y="37" text-anchor="middle" fill="#fbbf24" font-size="4.5" font-family="serif">T</text><text x="36" y="44" text-anchor="middle" fill="#fbbf24" font-size="4.5" font-family="serif">A</text><text x="30" y="51" text-anchor="middle" fill="#fbbf24" font-size="4.5" font-family="serif">R</text><text x="24" y="44" text-anchor="middle" fill="#fbbf24" font-size="4.5" font-family="serif">O</text><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">X · WHEEL OF FORTUNE</text></svg>`,
    11: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><line x1="30" y1="18" x2="30" y2="55" stroke="#fbbf24" stroke-width="0.9"/><line x1="14" y1="28" x2="46" y2="28" stroke="#fbbf24" stroke-width="0.9"/><path d="M10 36 Q14 40 18 36" stroke="#fbbf24" stroke-width="0.7" fill="none"/><path d="M42 36 Q46 40 50 36" stroke="#fbbf24" stroke-width="0.7" fill="none"/><circle cx="30" cy="22" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M26 55 Q30 60 34 55 L35 74 Q30 79 25 74Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><line x1="44" y1="55" x2="44" y2="71" stroke="#e2e8f0" stroke-width="0.9"/><line x1="41" y1="58" x2="47" y2="58" stroke="#e2e8f0" stroke-width="0.7"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XI · JUSTICE</text></svg>`,
    12: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><line x1="12" y1="18" x2="12" y2="72" stroke="#92400e" stroke-width="1.5"/><line x1="48" y1="18" x2="48" y2="72" stroke="#92400e" stroke-width="1.5"/><line x1="12" y1="18" x2="48" y2="18" stroke="#92400e" stroke-width="1.5"/><circle cx="30" cy="30" r="5" stroke="#fbbf24" stroke-width="0.7" fill="none"/><circle cx="30" cy="30" r="7" stroke="#fbbf24" stroke-width="0.3" stroke-dasharray="1 1" fill="none"/><line x1="30" y1="18" x2="30" y2="25" stroke="#fbbf24" stroke-width="0.9"/><path d="M26 35 Q30 40 34 35 L32 56 Q30 60 28 56Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XII · THE HANGED MAN</text></svg>`,
    13: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="62" r="7" fill="#fbbf24" opacity="0.22"/><line x1="22" y1="28" x2="22" y2="72" stroke="#374151" stroke-width="1.2"/><line x1="38" y1="28" x2="38" y2="72" stroke="#374151" stroke-width="1.2"/><ellipse cx="30" cy="50" rx="11" ry="7" fill="#1c1917" stroke="#e2e8f0" stroke-width="0.5"/><circle cx="30" cy="40" r="4" stroke="#e2e8f0" stroke-width="0.7" fill="#0d0208"/><rect x="38" y="27" width="9" height="13" rx="0.5" fill="#111827" stroke="#e2e8f0" stroke-width="0.4"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XIII · DEATH</text></svg>`,
    14: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="27" r="5" stroke="#fbbf24" stroke-width="0.7" fill="none"/><path d="M30 27 C18 19 8 25 10 35 C16 31 22 27 30 27Z" fill="#e2e8f0" opacity="0.35"/><path d="M30 27 C42 19 52 25 50 35 C44 31 38 27 30 27Z" fill="#e2e8f0" opacity="0.35"/><path d="M25 32 Q30 37 35 32 L37 64 Q30 69 23 64Z" stroke="#e2e8f0" stroke-width="0.7" fill="none"/><path d="M14 42 L20 44 L18 52 L12 52Z" stroke="#3b82f6" stroke-width="0.5" fill="none"/><path d="M40 44 L46 42 L48 52 L42 52Z" stroke="#3b82f6" stroke-width="0.5" fill="none"/><path d="M18 48 C24 44 36 44 42 48" stroke="#3b82f6" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XIV · TEMPERANCE</text></svg>`,
    15: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M30 24 C16 15 8 23 10 33 C16 29 22 23 30 24Z" fill="#374151" stroke="#ef4444" stroke-width="0.4"/><path d="M30 24 C44 15 52 23 50 33 C44 29 38 23 30 24Z" fill="#374151" stroke="#ef4444" stroke-width="0.4"/><circle cx="30" cy="29" r="7" fill="#1c1917" stroke="#ef4444" stroke-width="0.7"/><circle cx="27" cy="29" r="1.8" fill="#ef4444"/><circle cx="33" cy="29" r="1.8" fill="#ef4444"/><line x1="30" y1="36" x2="30" y2="44" stroke="#fbbf24" stroke-width="0.9"/><rect x="22" y="48" width="16" height="7" rx="0.5" fill="#374151" stroke="#ef4444" stroke-width="0.4"/><circle cx="18" cy="61" r="3" stroke="#fbbf24" stroke-width="0.5" fill="none"/><circle cx="42" cy="61" r="3" stroke="#fbbf24" stroke-width="0.5" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XV · THE DEVIL</text></svg>`,
    16: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><rect x="18" y="20" width="24" height="48" rx="1" fill="#374151" stroke="#6b7280" stroke-width="0.7"/><rect x="24" y="14" width="12" height="10" rx="0.5" fill="#374151" stroke="#6b7280" stroke-width="0.7"/><path d="M20 14 L22 8 L26 12 L28 6 L30 11 L32 6 L34 12 L38 8 L40 14" stroke="#fbbf24" stroke-width="0.7" fill="none"/><path d="M45 8 L35 28 L40 28 L28 48" stroke="#fbbf24" stroke-width="1.4" fill="none"/><circle cx="16" cy="57" r="3" stroke="#e2e8f0" stroke-width="0.6" fill="none"/><line x1="16" y1="60" x2="10" y2="71" stroke="#e2e8f0" stroke-width="0.6"/><circle cx="44" cy="54" r="3" stroke="#fbbf24" stroke-width="0.6" fill="none"/><line x1="44" y1="57" x2="50" y2="68" stroke="#fbbf24" stroke-width="0.6"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XVI · THE TOWER</text></svg>`,
    17: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M30 9 L32 17 L40 17 L34 22 L36 30 L30 25 L24 30 L26 22 L20 17 L28 17Z" fill="#fbbf24" opacity="0.85"/><path d="M12 19 L13 23 L17 23 L14 25 L15 29 L12 27 L9 29 L10 25 L7 23 L11 23Z" fill="#e2e8f0" opacity="0.55"/><path d="M48 19 L49 23 L53 23 L50 25 L51 29 L48 27 L45 29 L46 25 L43 23 L47 23Z" fill="#e2e8f0" opacity="0.55"/><circle cx="24" cy="49" r="4" stroke="#f43f5e" stroke-width="0.7" fill="none"/><path d="M20 53 Q24 58 28 53 L30 69 Q24 74 18 69Z" stroke="#f43f5e" stroke-width="0.7" fill="none"/><path d="M14 51 L18 53 L16 61 L10 61Z" stroke="#3b82f6" stroke-width="0.5" fill="none"/><path d="M34 53 L38 51 L40 61 L34 61Z" stroke="#3b82f6" stroke-width="0.5" fill="none"/><path d="M16 57 C20 54 28 54 34 57" stroke="#3b82f6" stroke-width="0.7" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XVII · THE STAR</text></svg>`,
    18: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="19" r="9" stroke="#e2e8f0" stroke-width="0.7" fill="#0d0208"/><path d="M22 17 C24 11 36 11 38 17 C32 13 28 13 22 17Z" fill="#e2e8f0" opacity="0.35"/><rect x="4" y="40" width="10" height="32" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.5"/><rect x="46" y="40" width="10" height="32" rx="1" fill="#1e1b4b" stroke="#6366f1" stroke-width="0.5"/><ellipse cx="30" cy="55" rx="13" ry="7" stroke="#3b82f6" stroke-width="0.5" fill="#0c1446" opacity="0.8"/><circle cx="30" cy="57" r="2.5" stroke="#ef4444" stroke-width="0.5" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XVIII · THE MOON</text></svg>`,
    19: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="22" r="10" fill="#fbbf24" opacity="0.75"/><circle cx="30" cy="22" r="7" fill="#fbbf24" opacity="0.85"/><line x1="30" y1="7" x2="30" y2="10" stroke="#fbbf24" stroke-width="1.4"/><line x1="30" y1="34" x2="30" y2="37" stroke="#fbbf24" stroke-width="1.4"/><line x1="13" y1="22" x2="16" y2="22" stroke="#fbbf24" stroke-width="1.4"/><line x1="44" y1="22" x2="47" y2="22" stroke="#fbbf24" stroke-width="1.4"/><circle cx="28" cy="21" r="1.4" fill="#0d0208"/><circle cx="32" cy="21" r="1.4" fill="#0d0208"/><path d="M27 25 C29 27 31 27 33 25" stroke="#0d0208" stroke-width="0.7" fill="none"/><ellipse cx="30" cy="64" rx="12" ry="6.5" fill="#e2e8f0" stroke="#d1d5db" stroke-width="0.4" opacity="0.8"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XIX · THE SUN</text></svg>`,
    20: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><circle cx="30" cy="17" r="5" stroke="#fbbf24" stroke-width="0.7" fill="none"/><path d="M30 17 C18 9 8 17 10 27 C16 23 22 17 30 17Z" fill="#e2e8f0" opacity="0.4"/><path d="M30 17 C42 9 52 17 50 27 C44 23 38 17 30 17Z" fill="#e2e8f0" opacity="0.4"/><path d="M24 21 L18 27 L16 23 L26 19Z" fill="#fbbf24" opacity="0.8"/><rect x="10" y="55" width="10" height="6" rx="0.5" fill="#374151" stroke="#6b7280" stroke-width="0.4"/><rect x="25" y="59" width="10" height="6" rx="0.5" fill="#374151" stroke="#6b7280" stroke-width="0.4"/><rect x="40" y="55" width="10" height="6" rx="0.5" fill="#374151" stroke="#6b7280" stroke-width="0.4"/><circle cx="15" cy="51" r="3" stroke="#e2e8f0" stroke-width="0.5" fill="none"/><circle cx="30" cy="55" r="3" stroke="#f43f5e" stroke-width="0.5" fill="none"/><circle cx="45" cy="51" r="3" stroke="#fbbf24" stroke-width="0.5" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XX · JUDGEMENT</text></svg>`,
    21: `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="60" height="90" fill="#0d0208" rx="3"/><rect x="2" y="2" width="56" height="86" rx="2" stroke="#f43f5e" stroke-width="0.5" stroke-dasharray="2 2"/><ellipse cx="30" cy="44" rx="18" ry="24" stroke="#22c55e" stroke-width="1.1" fill="none"/><ellipse cx="30" cy="44" rx="13" ry="19" stroke="#22c55e" stroke-width="0.3" stroke-dasharray="1 1" fill="none"/><circle cx="30" cy="36" r="4" stroke="#f43f5e" stroke-width="0.7" fill="none"/><path d="M27 40 Q30 45 33 40" stroke="#f43f5e" stroke-width="0.7" fill="none"/><line x1="20" y1="34" x2="15" y2="28" stroke="#fbbf24" stroke-width="0.9"/><line x1="40" y1="34" x2="45" y2="28" stroke="#fbbf24" stroke-width="0.9"/><circle cx="8" cy="13" r="4" stroke="#fbbf24" stroke-width="0.5" fill="none"/><circle cx="52" cy="13" r="4" stroke="#e2e8f0" stroke-width="0.5" fill="none"/><circle cx="8" cy="74" r="4" stroke="#ef4444" stroke-width="0.5" fill="none"/><circle cx="52" cy="74" r="4" stroke="#22c55e" stroke-width="0.5" fill="none"/><text x="30" y="88" text-anchor="middle" fill="#f43f5e" font-size="3.5" font-family="serif">XXI · THE WORLD</text></svg>`,
  }

  if (id >= 0 && id <= 21 && major[id]) return major[id]!

  // Minor Arcana
  const suit = card.suit || ''
  const numStr = card.number
  const num = numStr === 'Ace' ? 1 : numStr === 'Page' ? 11 : numStr === 'Knight' ? 12 : numStr === 'Queen' ? 13 : numStr === 'King' ? 14 : parseInt(numStr) || 0
  const suitColors: Record<string, string> = { wands: '#f59e0b', cups: '#3b82f6', swords: '#e2e8f0', pentacles: '#22c55e' }
  const suitGlyphs: Record<string, string> = { wands: '𝌆', cups: '◯', swords: '†', pentacles: '✦' }
  const col = suitColors[suit] || '#f43f5e'
  const glyph = suitGlyphs[suit] || '·'
  const suitName = suit.toUpperCase()

  // Court cards
  if (num >= 11) {
    const rank = ['', '', '', '', '', '', '', '', '', '', '', 'PAGE', 'KNIGHT', 'QUEEN', 'KING'][num] || ''
    const crownPath = num === 14 ? `<path d="M22 28 L24 22 L30 26 L36 22 L38 28Z" stroke="${col}" stroke-width="0.7" fill="none"/>` : num === 13 ? `<path d="M23 27 C26 22 34 22 37 27" stroke="${col}" stroke-width="0.7" fill="none"/>` : ''
    return `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="60" height="90" fill="#0d0208" rx="3"/>
      <rect x="2" y="2" width="56" height="86" rx="2" stroke="${col}" stroke-width="0.5" stroke-dasharray="2 2"/>
      <rect x="5" y="5" width="50" height="80" rx="1.5" stroke="${col}" stroke-width="0.2" fill="none" opacity="0.2"/>
      ${crownPath}
      <circle cx="30" cy="33" r="7" stroke="${col}" stroke-width="0.8" fill="none"/>
      <path d="M23 40 Q30 47 37 40 L39 70 Q30 76 21 70Z" stroke="${col}" stroke-width="0.8" fill="none"/>
      <line x1="37" y1="44" x2="46" y2="38" stroke="${col}" stroke-width="0.9"/>
      <path d="M46 38 L44 34 L48 34Z" fill="${col}" opacity="0.8"/>
      <text x="8" y="14" fill="${col}" font-size="7" opacity="0.7">${glyph}</text>
      <text x="46" y="80" text-anchor="middle" fill="${col}" font-size="7" opacity="0.7" transform="rotate(180,46,76)">${glyph}</text>
      <text x="30" y="88" text-anchor="middle" fill="${col}" font-size="3.2" font-family="serif">${rank} OF ${suitName}</text>
    </svg>`
  }

  // Pip cards
  const pipPos: Record<number, [number, number][]> = {
    1:  [[30,46]],
    2:  [[30,30],[30,62]],
    3:  [[30,24],[30,46],[30,68]],
    4:  [[18,30],[42,30],[18,62],[42,62]],
    5:  [[18,24],[42,24],[30,46],[18,68],[42,68]],
    6:  [[18,24],[42,24],[18,46],[42,46],[18,68],[42,68]],
    7:  [[18,20],[42,20],[18,40],[30,30],[42,40],[18,62],[42,62]],
    8:  [[18,20],[42,20],[18,38],[42,38],[18,56],[42,56],[18,72],[42,72]],
    9:  [[18,18],[30,18],[42,18],[18,38],[30,38],[42,38],[18,58],[30,58],[42,58]],
    10: [[18,15],[42,15],[18,30],[42,30],[18,46],[42,46],[18,62],[42,62],[18,76],[42,76]],
  }
  const positions = pipPos[Math.min(num, 10)] || [[30,46]]
  const fs = num > 7 ? 8 : 10
  const pips = positions.map(([px,py]) =>
    `<text x="${px}" y="${py}" text-anchor="middle" fill="${col}" font-size="${fs}" opacity="0.85">${glyph}</text>`
  ).join('')
  const label = numStr === 'Ace' ? 'A' : numStr

  return `<svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect width="60" height="90" fill="#0d0208" rx="3"/>
    <rect x="2" y="2" width="56" height="86" rx="2" stroke="${col}" stroke-width="0.5" stroke-dasharray="2 2"/>
    <rect x="5" y="5" width="50" height="80" rx="1.5" stroke="${col}" stroke-width="0.2" fill="none" opacity="0.2"/>
    <text x="8" y="15" fill="${col}" font-size="8" font-family="serif" opacity="0.9">${label}</text>
    <text x="8" y="24" fill="${col}" font-size="7" opacity="0.6">${glyph}</text>
    ${pips}
    <text x="52" y="82" text-anchor="middle" fill="${col}" font-size="8" font-family="serif" opacity="0.9" transform="rotate(180,52,78)">${label}</text>
    <text x="30" y="88" text-anchor="middle" fill="${col}" font-size="3" font-family="serif">${card.name.toUpperCase()}</text>
  </svg>`
}

// Reading renderer
const renderedReading = computed(() => {
  if (!finalReading.value) return ''
  return finalReading.value
    .replace(/^## (.+)$/gm, '<h2 class="font-cinzel text-xl text-rose-300/90 tracking-wider mt-10 mb-5 flex items-center gap-3 border-b border-rose-500/15 pb-3">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-rose-300/70 not-italic font-garamond">$1</em>')
    .replace(/\n\n/g, '</p><p class="font-garamond text-gray-400 leading-[1.85] text-base mb-4">')
    .replace(/^/, '<p class="font-garamond text-gray-400 leading-[1.85] text-base mb-4">')
    .replace(/$/, '</p>')
    .replace(/^---$/gm, '<hr class="border-rose-500/10 my-8"/>')
})
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.08; }
  50%       { opacity: 0.5; }
}
</style>