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
  const revealedCards = ref<Set<number>>(new Set())

  const currentSituation = computed(() => SITUATION_SPREADS[currentSituationIndex.value])
  const allSituationsComplete = computed(() => situationReadings.value.length === SITUATION_SPREADS.length)
  const readingProgress = computed(() => {
    const total = SITUATION_SPREADS.length
    const done = situationReadings.value.length
    return Math.round((done / total) * 100)
  })

  function startShuffle() {
    isShuffling.value = true
    shuffleComplete.value = false
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

  function selectCard(index: number) {
    if (picked10.value.length >= 10) return
    const alreadyPicked = picked10.value.some(c => c.selectedIndex === index)
    if (alreadyPicked) return
    const card = shuffledDeck.value[index]
    if (!card) return
    const reversed = Math.random() < 0.3
    const drawn: DrawnCard = { ...card, reversed, selectedIndex: index }
    picked10.value.push(drawn)
    revealedCards.value.add(index)
    if (picked10.value.length === 10) {
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

  function selectSituationCard(cardFromPicked: DrawnCard) {
    if (currentSituationCards.value.length >= 3) return
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

  function setGender(g: 'male' | 'female') {
    gender.value = g
    step.value = 'reading'
    generateReading()
  }

  async function generateReading() {
    isGeneratingReading.value = true
    readingError.value = null
    finalReading.value = null

    const pronoun = gender.value === 'female'
      ? { sub: 'she', obj: 'her', pos: 'her', poss: 'hers', ref: 'herself' }
      : { sub: 'he', obj: 'him', pos: 'his', poss: 'his', ref: 'himself' }

    const celtic10Summary = picked10.value.map((c, i) =>
      `${i + 1}. ${c.name}${c.reversed ? ' (Reversed)' : ''}`
    ).join('\n')

    const situationSummary = situationReadings.value.map(sr => {
      const cards = sr.cards.map((c, i) =>
        `  Position "${sr.spread.positions[i]}": ${c.name}${c.reversed ? ' (Reversed)' : ''} — ${c.reversed ? c.reversedMeaning : c.uprightMeaning}`
      ).join('\n')
      return `**${sr.spread.title}**\n${cards}`
    }).join('\n\n')

    const prompt = `You are a master Tarot reader with 30 years of experience in Rider-Waite-Smith symbolism and Jungian depth psychology. Write a complete, deeply personal tarot reading.

The seeker is ${pronoun.sub === 'she' ? 'a woman' : 'a man'}. Use ${pronoun.pos} / ${pronoun.obj} pronouns throughout.

The seeker chose these 10 cards from the shuffled deck:
${celtic10Summary}

For each of the 6 life areas, the seeker chose 3 cards from those 10:

${situationSummary}

---

CRITICAL FORMATTING RULES:
- Do NOT use any emojis anywhere in the reading
- Do NOT use bullet points or numbered lists
- Each section must begin by explicitly naming the cards drawn, for example: "You drew The Moon, The Tower, and the Three of Swords for this area."
- Then explain what each individual card reveals in its own paragraph
- End each section with a clear conclusion paragraph that synthesizes all 3 cards into one unified message
- Write only in flowing literary prose
- Be specific, deep, and personal — reference the actual card names and their symbolism throughout
- Never write generically — every sentence must feel crafted for this exact combination of cards

---

Write the reading in this exact structure:

## Your Soul Signature

Name all 10 chosen cards in the opening sentence. Write 2 rich paragraphs about what these 10 cards together reveal about ${pronoun.pos} soul pattern, ${pronoun.pos} current life chapter, and the overarching story they tell.

## Love & Relationships

Open by naming the 3 cards drawn for this spread and their positions. Write one paragraph for each card explaining exactly what it reveals about ${pronoun.pos} love life and heart. End with a conclusion paragraph: what is the single clearest message these 3 cards together deliver about ${pronoun.pos} relationships right now?

## Career & Purpose

Open by naming the 3 cards drawn. Write one paragraph per card about what it reveals for ${pronoun.pos} work, calling, and professional life. End with a conclusion paragraph: what direction is ${pronoun.pos} purpose pointing toward, and what must ${pronoun.sub} understand about ${pronoun.pos} career path?

## Obstacle & Shadow

Open by naming the 3 cards drawn. Write one paragraph per card about what it reveals about ${pronoun.pos} blocks and shadow patterns. End with a conclusion paragraph: what is the root of ${pronoun.pos} obstacle, and what is the single key to moving through it?

## Spiritual Growth

Open by naming the 3 cards drawn. Write one paragraph per card about its spiritual message for ${pronoun.obj}. End with a conclusion paragraph: what soul lesson is ${pronoun.sub} mastering, and what spiritual gift is being awakened?

## Wellbeing & Vitality

Open by naming the 3 cards drawn. Write 2 paragraphs: what these cards reveal about ${pronoun.pos} body, mind and spirit, and what concrete steps would restore ${pronoun.obj} to greater wholeness.

## The Near Future

Open by naming the 3 cards drawn. Write one paragraph per card about what it says about what is ending, what is arriving, and the energy ahead. End with a conclusion paragraph: what is the single most important thing ${pronoun.sub} must know about what is coming?

## The Oracle's Final Message

One powerful, poetic paragraph. Address ${pronoun.obj} directly by name as "dear seeker." Reference 2 or 3 of the most significant cards from the entire reading by name and weave them into a final, unforgettable message that speaks directly to ${pronoun.pos} soul. This paragraph should feel like the oracle has truly seen ${pronoun.obj}.

---

Minimum 1400 words. No emojis anywhere. No bullet points. Only flowing literary prose paragraphs.`

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

  function getAvailableCardsForSituation(): DrawnCard[] {
    return picked10.value.filter(
      c => !currentSituationCards.value.some(sc => sc.id === c.id)
    )
  }

  return {
    step, isShuffling, shuffleComplete, shuffledDeck, picked10,
    situationReadings, currentSituationIndex, currentSituationCards,
    currentSituation, allSituationsComplete, readingProgress,
    gender, isGeneratingReading, finalReading, readingError, revealedCards,
    startShuffle, proceedToPick, selectCard, isCardPicked, pickedCardNumber,
    selectSituationCard, isSituationCardSelected, completeSituation,
    setGender, generateReading, resetReading, getAvailableCardsForSituation,
    SITUATION_SPREADS,
  }
}