import { ref, computed } from 'vue'
import { TAROT_CARDS, SITUATION_SPREADS, type TarotCard } from '~/utils/tarotCards'

export type ReadingStep =
  | 'shuffle'
  | 'pick10'
  | 'situations'
  | 'gender'
  | 'reading'

export interface DrawnCard extends TarotCard {
  reversed: boolean
  selectedIndex: number
}

export interface SituationReading {
  spread: typeof SITUATION_SPREADS[number]
  cards: DrawnCard[]
}

export function useTarot() {
  // ── State ──────────────────────────────────────────────────────────────────
  const step = ref<ReadingStep>('shuffle')
  const isShuffling = ref(false)
  const shuffleComplete = ref(false)
  const deck = ref<TarotCard[]>([])
  const shuffledDeck = ref<TarotCard[]>([])
  const picked10 = ref<DrawnCard[]>([])
  const situationReadings = ref<SituationReading[]>([])
  const currentSituationIndex = ref(0)
  const currentSituationCards = ref<DrawnCard[]>([])
  const gender = ref<'male' | 'female' | null>(null)
  const isGeneratingReading = ref(false)
  const finalReading = ref<string | null>(null)
  const readingError = ref<string | null>(null)

  // For pick-10: which cards are face-up (revealed during selection)
  const revealedCards = ref<Set<number>>(new Set())

  // ── Computed ───────────────────────────────────────────────────────────────
  const currentSituation = computed(() =>
    SITUATION_SPREADS[currentSituationIndex.value]
  )

  const allSituationsComplete = computed(() =>
    situationReadings.value.length === SITUATION_SPREADS.length
  )

  const readingProgress = computed(() => {
    const total = SITUATION_SPREADS.length
    const done = situationReadings.value.length
    return Math.round((done / total) * 100)
  })

  // ── Shuffle ────────────────────────────────────────────────────────────────
  function startShuffle() {
    isShuffling.value = true
    shuffleComplete.value = false

    // Fisher-Yates with multiple passes for dramatic effect
    const cards: TarotCard[] = [...TAROT_CARDS]
    setTimeout(() => {
      for (let pass = 0; pass < 7; pass++) {
        for (let i = cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const temp = cards[i]!
          cards[i] = cards[j]!
          cards[j] = temp
        }
      }
      shuffledDeck.value = cards
      isShuffling.value = false
      shuffleComplete.value = true
    }, 2800)
  }

  function proceedToPick() {
    step.value = 'pick10'
    revealedCards.value = new Set()
  }

  // ── Pick 10 ────────────────────────────────────────────────────────────────
  function selectCard(index: number) {
    if (picked10.value.length >= 10) return
    // Check not already picked
    const alreadyPicked = picked10.value.some(c => c.selectedIndex === index)
    if (alreadyPicked) return

    const card = shuffledDeck.value[index]
    if (!card) return
    const reversed = Math.random() < 0.3
    const drawn: DrawnCard = { ...card, reversed, selectedIndex: index }
    picked10.value.push(drawn)
    revealedCards.value.add(index)

    if (picked10.value.length === 10) {
      // Auto advance after short delay
      setTimeout(() => {
        step.value = 'situations'
        currentSituationIndex.value = 0
        currentSituationCards.value = []
      }, 1200)
    }
  }

  function isCardPicked(index: number) {
    return picked10.value.some(c => c.selectedIndex === index)
  }

  function pickedCardNumber(index: number): number {
    const idx = picked10.value.findIndex(c => c.selectedIndex === index)
    return idx === -1 ? 0 : idx + 1
  }

  // ── Situation 3-card draws from the picked 10 ──────────────────────────────
  // We use the 10 picked cards across all 6 situations (3 cards each = 18 slots)
  // We cycle/repeat from the 10 cards with fresh reversal randomization
  function getCardForSituation(situationIdx: number, posIdx: number): DrawnCard {
    const pool = picked10.value
    const linearIdx = situationIdx * 3 + posIdx
    const card = pool[linearIdx % pool.length]
    if (!card) throw new Error('Invalid card')
    return { ...card, reversed: Math.random() < 0.3, selectedIndex: card.selectedIndex }
  }

  function selectSituationCard(cardFromPicked: DrawnCard) {
    if (currentSituationCards.value.length >= 3) return
    // Check not already selected in this situation
    const alreadyIn = currentSituationCards.value.some(c => c.id === cardFromPicked.id)
    if (alreadyIn) return
    currentSituationCards.value.push({ ...cardFromPicked, reversed: Math.random() < 0.3, selectedIndex: cardFromPicked.selectedIndex })
  }

  function isSituationCardSelected(card: DrawnCard) {
    return currentSituationCards.value.some(c => c.id === card.id)
  }

  function completeSituation() {
    if (currentSituationCards.value.length < 3) return
    const situation = currentSituation.value
    if (!situation) return
    situationReadings.value.push({
      spread: situation,
      cards: [...currentSituationCards.value]
    })
    currentSituationIndex.value++
    currentSituationCards.value = []

    if (allSituationsComplete.value) {
      setTimeout(() => { step.value = 'gender' }, 600)
    }
  }

  // ── Gender ─────────────────────────────────────────────────────────────────
  function setGender(g: 'male' | 'female') {
    gender.value = g
    step.value = 'reading'
    generateReading()
  }

  // ── AI Reading Generation ──────────────────────────────────────────────────
  async function generateReading() {
    isGeneratingReading.value = true
    readingError.value = null
    finalReading.value = null

    const pronoun = gender.value === 'female'
      ? { sub: 'she', obj: 'her', pos: 'her', poss: 'hers', ref: 'herself' }
      : { sub: 'he', obj: 'him', pos: 'his', poss: 'his', ref: 'himself' }

    // Build the prompt
    const celtic10Summary = picked10.value.map((c, i) =>
      `${i + 1}. ${c.name}${c.reversed ? ' (Reversed)' : ''}`
    ).join('\n')

    const situationSummary = situationReadings.value.map(sr => {
      const cards = sr.cards.map((c, i) =>
        `  Position "${sr.spread.positions[i]}": ${c.name}${c.reversed ? ' (Reversed)' : ''} — ${c.reversed ? c.reversedMeaning : c.uprightMeaning}`
      ).join('\n')
      return `**${sr.spread.title}**\n${cards}`
    }).join('\n\n')

    const prompt = `You are a master Tarot reader with 30 years of experience in Rider-Waite-Smith symbolism and Jungian depth psychology. You give profound, deeply personal, and accurate readings.

The seeker is ${pronoun.sub === 'she' ? 'a woman' : 'a man'}. Use ${pronoun.pos} / ${pronoun.obj} pronouns throughout.

The seeker shuffled the full 78-card deck and chose 10 cards. These 10 cards form ${pronoun.pos} soul signature for this reading:
${celtic10Summary}

${pronoun.sub.charAt(0).toUpperCase() + pronoun.sub.slice(1)} then chose 3 cards from these for each of 6 life areas:

${situationSummary}

Write ${pronoun.pos} complete Tarot reading. Structure it exactly as follows, with rich, specific, personalized prose for each section. Do NOT use generic language — every sentence must feel crafted specifically for this unique combination of cards.

---

## ✦ The Soul Signature
Begin with a 2-paragraph synthesis of the 10 chosen cards as a whole. What do they reveal about ${pronoun.pos} core soul pattern, ${pronoun.pos} current life chapter, and ${pronoun.pos} deepest nature? What is the overarching story of these 10 cards together?

## 💞 Love & Relationships
3 rich paragraphs. What is happening in ${pronoun.pos} heart right now? What challenge is ${pronoun.sub} navigating? What does ${pronoun.pos} soul need in love? Give specific guidance rooted in the exact cards drawn.

## 🌟 Career & Purpose
3 rich paragraphs. Where does ${pronoun.sub} stand professionally and in terms of ${pronoun.pos} calling? What is the obstacle? What direction is ${pronoun.pos} purpose pointing toward? Speak to ${pronoun.pos} unique gifts as revealed by these cards.

## 🌑 Obstacle & Shadow
3 rich paragraphs. Name ${pronoun.pos} specific shadow pattern with compassion and precision. What is the hidden root? What ancient wound or limiting belief lives here? And — most importantly — give ${pronoun.obj} the exact key to moving through it.

## ✨ Spiritual Growth
3 rich paragraphs. Where is ${pronoun.pos} spirit in its evolution right now? What profound lesson is ${pronoun.pos} soul mastering in this lifetime? What gift is being awakened? Speak to ${pronoun.obj} as a soul on a journey, not just a person in a situation.

## 🌿 Wellbeing & Vitality
2 rich paragraphs. What is ${pronoun.pos} body, mind, or spirit asking for? What practical steps and inner shifts would restore ${pronoun.obj} to greater wholeness?

## 🔮 The Near Future
3 rich paragraphs. What is ending and what is beginning? What energy will define the coming months? What is the most important thing ${pronoun.sub} must know about what is coming?

## ✦ The Oracle's Final Message
End with one powerful, poetic paragraph — a final, personalized message from the cards to this seeker's soul. Make it unforgettable.

---

Write in flowing, literary prose. Be specific, deep, compassionate, and direct. This reading should feel like it was written by a wise and loving oracle who truly sees this person. Minimum 1200 words total.`

    try {
      const response = await fetch('/api/tarot-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Server error: ${response.status}`)
      }

      const data = await response.json()
      finalReading.value = data.reading
    } catch (err: any) {
      readingError.value = err.message || 'Failed to generate reading. Please try again.'
    } finally {
      isGeneratingReading.value = false
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function resetReading() {
    step.value = 'shuffle'
    isShuffling.value = false
    shuffleComplete.value = false
    deck.value = []
    shuffledDeck.value = []
    picked10.value = []
    situationReadings.value = []
    currentSituationIndex.value = 0
    currentSituationCards.value = []
    gender.value = null
    isGeneratingReading.value = false
    finalReading.value = null
    readingError.value = null
    revealedCards.value = new Set()
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getAvailableCardsForSituation(): DrawnCard[] {
    // All 10 picked cards, excluding those already chosen in this situation
    return picked10.value.filter(
      c => !currentSituationCards.value.some(sc => sc.id === c.id)
    )
  }

  return {
    // state
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
    // actions
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
    // constants
    SITUATION_SPREADS,
  }
}