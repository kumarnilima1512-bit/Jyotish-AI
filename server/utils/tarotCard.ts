export interface TarotCard {
  id: number
  name: string
  arcana: 'major' | 'minor'
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles'
  number: string
  symbol: string
  keywords: string[]
  uprightMeaning: string
  reversedMeaning: string
  uprightMeaningDetailed: string
  reversedMeaningDetailed: string
  element?: string
  planet?: string
  zodiac?: string
}

export const TAROT_CARDS: TarotCard[] = [
  // ── MAJOR ARCANA ──────────────────────────────────────────────────────────
  {
    id: 0, name: 'The Fool', arcana: 'major', number: '0', symbol: '🌟',
    keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
    element: 'Air', planet: 'Uranus',
    uprightMeaning: 'New beginnings, adventure, and unlimited potential await you.',
    reversedMeaning: 'Recklessness, risk-taking without caution, or naivety holds you back.',
    uprightMeaningDetailed: 'The Fool invites you to take a leap of faith. A new chapter is beginning — one filled with wonder, excitement, and infinite possibility. Trust the universe and step forward with an open heart. You are at the very start of a magnificent journey.',
    reversedMeaningDetailed: 'You may be acting impulsively without thinking through consequences, or conversely, fear of the unknown is preventing necessary change. Examine where recklessness or excessive caution is limiting your growth.'
  },
  {
    id: 1, name: 'The Magician', arcana: 'major', number: 'I', symbol: '✨',
    keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
    element: 'Air', planet: 'Mercury',
    uprightMeaning: 'You have all the tools, skills, and resources needed to manifest your desires.',
    reversedMeaning: 'Manipulation, poor planning, or untapped talents are blocking your path.',
    uprightMeaningDetailed: 'The Magician is a powerful sign that your willpower and concentrated focus can bring your vision into reality. All four elements — earth, air, fire, water — are at your command. Channel your energy with intention and precision. What you envision, you can create.',
    reversedMeaningDetailed: 'Your gifts remain dormant or are being misused. There may be deception in your environment — someone using their skills manipulatively. Reconnect with your authentic power and use it only for constructive ends.'
  },
  {
    id: 2, name: 'The High Priestess', arcana: 'major', number: 'II', symbol: '🌙',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'the subconscious'],
    element: 'Water', planet: 'Moon',
    uprightMeaning: 'Trust your intuition. Hidden knowledge and deeper truths are being revealed to you.',
    reversedMeaning: 'Secrets, disconnect from intuition, or information is being withheld.',
    uprightMeaningDetailed: 'The High Priestess urges you to look beyond the surface. Your subconscious mind holds the answers you seek. This is a time for stillness, meditation, and inner listening. Do not rush decisions — let your deeper knowing guide you through the veil of mystery.',
    reversedMeaningDetailed: 'You may be ignoring your gut feelings, or important truths are being concealed. External noise is drowning out your inner voice. Retreat, reflect, and reconnect with the wisdom that lives in the quiet spaces within you.'
  },
  {
    id: 3, name: 'The Empress', arcana: 'major', number: 'III', symbol: '🌸',
    keywords: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
    element: 'Earth', planet: 'Venus',
    uprightMeaning: 'Abundance, fertility, and creative energy surround you. Nature supports your growth.',
    reversedMeaning: 'Creative block, dependence, or neglect of self-care is present.',
    uprightMeaningDetailed: 'The Empress is the great mother — she speaks of flourishing abundance in all areas of life. You are entering a fertile period where your ideas, relationships, and projects can blossom naturally. Embrace sensuality, nurture yourself and others, and trust in nature\'s abundant provision.',
    reversedMeaningDetailed: 'Creative energies may be blocked or stifled. An imbalance between giving and receiving needs to be addressed. You may be neglecting your own needs while over-nurturing others, or feeling disconnected from nature\'s rhythms. Return to self-care as a foundation.'
  },
  {
    id: 4, name: 'The Emperor', arcana: 'major', number: 'IV', symbol: '👑',
    keywords: ['authority', 'establishment', 'structure', 'a father figure'],
    element: 'Fire', zodiac: 'Aries',
    uprightMeaning: 'Authority, structure, and stability bring success. Build solid foundations now.',
    reversedMeaning: 'Domination, excessive control, or lack of discipline creates obstacles.',
    uprightMeaningDetailed: 'The Emperor represents the power of structure and disciplined action. Now is the time to take charge, establish clear boundaries, and build lasting foundations. Your leadership qualities are called forward. Approach challenges with logic, organization, and unwavering authority.',
    reversedMeaningDetailed: 'Power is being abused — either by you or those around you. Rigid control is stifling growth. Alternatively, a lack of structure and discipline is causing chaos. Find the balance between healthy authority and compassionate flexibility.'
  },
  {
    id: 5, name: 'The Hierophant', arcana: 'major', number: 'V', symbol: '🏛️',
    keywords: ['spiritual wisdom', 'religious beliefs', 'conformity', 'tradition'],
    element: 'Earth', zodiac: 'Taurus',
    uprightMeaning: 'Tradition, spiritual wisdom, and established institutions offer guidance.',
    reversedMeaning: 'Rebellion, subversiveness, or new approaches are needed.',
    uprightMeaningDetailed: 'The Hierophant invites you to seek wisdom from established traditions, spiritual mentors, or time-honored institutions. There is profound value in the collective wisdom of those who came before. Consider working within established structures or seeking guidance from a trusted teacher or advisor.',
    reversedMeaningDetailed: 'You are being called to question conventional wisdom and forge your own spiritual path. Rules that once served you may now be restrictive. It is time to think independently, challenge dogma, and trust your own inner authority over external institutions.'
  },
  {
    id: 6, name: 'The Lovers', arcana: 'major', number: 'VI', symbol: '💞',
    keywords: ['love', 'harmony', 'relationships', 'values alignment', 'choices'],
    element: 'Air', zodiac: 'Gemini',
    uprightMeaning: 'Love, harmony, and deeply aligned partnerships are present in your life.',
    reversedMeaning: 'Disharmony, imbalance, or misalignment of values creates conflict.',
    uprightMeaningDetailed: 'The Lovers speaks of profound connection — not only romantic love, but any relationship or choice that requires you to align with your deepest values. A significant decision point has arrived. Choose with your heart and your highest truth, and harmony will follow.',
    reversedMeaningDetailed: 'A relationship or situation is out of alignment with your core values. Difficult choices are being avoided. Self-love may be lacking, making it hard to love others authentically. Examine where compromise has become self-betrayal and reconnect with what truly matters to you.'
  },
  {
    id: 7, name: 'The Chariot', arcana: 'major', number: 'VII', symbol: '⚡',
    keywords: ['control', 'willpower', 'success', 'action', 'determination'],
    element: 'Water', zodiac: 'Cancer',
    uprightMeaning: 'Victory is yours through focused willpower, determination, and controlled action.',
    reversedMeaning: 'Lack of control, aggression, or scattered energy prevents success.',
    uprightMeaningDetailed: 'The Chariot is the card of triumphant forward motion. You have what it takes to overcome obstacles and claim victory — but only through disciplined control of opposing forces within and around you. Harness your willpower, stay focused on your destination, and charge ahead with confidence.',
    reversedMeaningDetailed: 'Your energy is scattered and unfocused, pulling you in too many directions. Aggression or powerlessness may be derailing progress. Alternatively, you may be forcing situations that require a softer approach. Gather your inner forces and re-establish direction before moving forward.'
  },
  {
    id: 8, name: 'Strength', arcana: 'major', number: 'VIII', symbol: '🦁',
    keywords: ['strength', 'courage', 'patience', 'control', 'compassion'],
    element: 'Fire', zodiac: 'Leo',
    uprightMeaning: 'Inner courage, patience, and compassionate strength overcome all challenges.',
    reversedMeaning: 'Self-doubt, weakness, or raw untamed emotion needs gentle mastery.',
    uprightMeaningDetailed: 'True strength is not brute force but the quiet power of inner mastery. You are being called to tame the wild, instinctual forces within you through patience, compassion, and courage. The lion of your fears and passions can be guided by the gentle yet firm hand of inner wisdom.',
    reversedMeaningDetailed: 'Insecurity and self-doubt are undermining your power. Raw emotions — anger, fear, jealousy — may be driving your actions unconsciously. This card asks you to face your shadow with courage and reclaim the quiet inner strength that has always been yours.'
  },
  {
    id: 9, name: 'The Hermit', arcana: 'major', number: 'IX', symbol: '🕯️',
    keywords: ['soul-searching', 'introspection', 'being alone', 'inner guidance'],
    element: 'Earth', zodiac: 'Virgo',
    uprightMeaning: 'Solitude, inner guidance, and introspection illuminate the path forward.',
    reversedMeaning: 'Isolation, loneliness, or withdrawal from the world is harmful now.',
    uprightMeaningDetailed: 'The Hermit calls you inward. A period of reflection and solitude will illuminate the truth you seek. Step back from the noise of the world and listen to the quiet voice of your soul. The lantern of wisdom can only be found within — no external answer will satisfy this deep inner calling.',
    reversedMeaningDetailed: 'Prolonged isolation has become unhealthy, or you are rejecting the inner work the Hermit represents. You may be using busyness and social engagement to avoid confronting your deeper truths. Or alternatively, you are isolating yourself out of fear rather than wisdom.'
  },
  {
    id: 10, name: 'Wheel of Fortune', arcana: 'major', number: 'X', symbol: '🎡',
    keywords: ['good luck', 'karma', 'life cycles', 'destiny', 'a turning point'],
    element: 'Fire', planet: 'Jupiter',
    uprightMeaning: 'A significant turning point. Fate is shifting in your favor — embrace change.',
    reversedMeaning: 'Bad luck, resistance to change, or breaking cycles is necessary.',
    uprightMeaningDetailed: 'The wheel turns, and with it comes a significant shift in fortune. Cycles of life are completing and new ones beginning. What has been planted is now coming to fruition. Embrace the flow of change with trust — the universe is orchestrating events in ways that serve your highest destiny.',
    reversedMeaningDetailed: 'You are fighting against the natural cycles of life, or experiencing a period of unfortunate circumstances. Remember that wheels always turn — no situation is permanent. Use this time to break negative karmic patterns and prepare yourself for the inevitable upswing that is coming.'
  },
  {
    id: 11, name: 'Justice', arcana: 'major', number: 'XI', symbol: '⚖️',
    keywords: ['justice', 'fairness', 'truth', 'cause and effect', 'law'],
    element: 'Air', zodiac: 'Libra',
    uprightMeaning: 'Truth, fairness, and karmic justice prevail. Right action brings right results.',
    reversedMeaning: 'Unfairness, dishonesty, or avoiding accountability creates imbalance.',
    uprightMeaningDetailed: 'Justice demands absolute honesty — with yourself and others. The scales of cosmic law are perfectly balanced; every cause has its effect. If you have acted rightly, fair outcomes await you. If there are amends to be made, now is the time to make them. Truth is the only path forward.',
    reversedMeaningDetailed: 'Injustice or dishonesty is present in your situation. You may be avoiding accountability for past actions, or you are the victim of unfair treatment. The law of cause and effect cannot be escaped — face the truth of your situation honestly and take responsibility where needed.'
  },
  {
    id: 12, name: 'The Hanged Man', arcana: 'major', number: 'XII', symbol: '🌀',
    keywords: ['pause', 'surrender', 'letting go', 'new perspectives'],
    element: 'Water', planet: 'Neptune',
    uprightMeaning: 'Voluntary pause and surrender reveal a profoundly new perspective.',
    reversedMeaning: 'Delays, resistance, or martyrdom is no longer serving you.',
    uprightMeaningDetailed: 'The Hanged Man invites you to willingly pause and surrender control. By choosing to stop, wait, and see things from an entirely different angle, profound wisdom becomes available. What seems like a loss is actually a sacrifice that opens you to a higher understanding. Let go — and see what is revealed.',
    reversedMeaningDetailed: 'You are experiencing unnecessary delays because you refuse to surrender or see things differently. Alternatively, self-sacrifice has become martyrdom — you are giving up what matters without receiving anything in return. It is time to release what is holding you suspended between worlds.'
  },
  {
    id: 13, name: 'Death', arcana: 'major', number: 'XIII', symbol: '🦋',
    keywords: ['endings', 'change', 'transformation', 'transition'],
    element: 'Water', zodiac: 'Scorpio',
    uprightMeaning: 'A profound ending makes way for powerful transformation and rebirth.',
    reversedMeaning: 'Resistance to inevitable change, stagnation, or inability to move forward.',
    uprightMeaningDetailed: 'Death is the most transformative card in the deck — not a card of physical death, but of profound metamorphosis. Something in your life must end so that something far greater can begin. This transition, though perhaps painful, is necessary and inevitable. Trust that what is dying had served its purpose. The butterfly cannot emerge without first dissolving.',
    reversedMeaningDetailed: 'You are clinging to what must naturally end, creating stagnation and suffering. The universe is urging transformation but you are resisting. Old identities, relationships, or patterns that have expired continue to drain your life force. True liberation lies in releasing what is already gone.'
  },
  {
    id: 14, name: 'Temperance', arcana: 'major', number: 'XIV', symbol: '🌊',
    keywords: ['balance', 'moderation', 'patience', 'purpose', 'meaning'],
    element: 'Fire', zodiac: 'Sagittarius',
    uprightMeaning: 'Balance, moderation, and divine patience create perfect harmony in your life.',
    reversedMeaning: 'Imbalance, excess, or self-healing is urgently needed.',
    uprightMeaningDetailed: 'Temperance is the alchemy of the soul. By blending opposites with divine patience — fire and water, action and rest, giving and receiving — you create something more beautiful than either alone. This is a time of healing, integration, and finding the sacred middle path. Move with grace and measured purpose.',
    reversedMeaningDetailed: 'Life has swung to extremes and equilibrium has been lost. Excess in some area — overwork, overindulgence, emotional flooding — is creating disharmony. Your body, mind, or spirit urgently requires healing and rebalancing. Slow down and tend to what has been neglected.'
  },
  {
    id: 15, name: 'The Devil', arcana: 'major', number: 'XV', symbol: '🔗',
    keywords: ['shadow self', 'attachment', 'addiction', 'restriction', 'sexuality'],
    element: 'Earth', zodiac: 'Capricorn',
    uprightMeaning: 'Shadow patterns, unhealthy attachments, and limiting beliefs hold you captive.',
    reversedMeaning: 'Breaking free from bondage, releasing addiction, and reclaiming power.',
    uprightMeaningDetailed: 'The Devil shines a light on your shadow — the parts of yourself you have denied or suppressed. Addictions, obsessions, toxic relationships, or materialistic entrapments keep you chained. Yet look closely: the chains around the figures\' necks are loose. You are not as trapped as you believe. Awareness is the first step to liberation.',
    reversedMeaningDetailed: 'You are breaking free from chains that have long bound you. This is a powerful time of reclaiming your autonomy and stepping out of darkness into light. Release the addiction, end the toxic dynamic, confront the shadow, and choose freedom. Liberation is closer than it has ever been.'
  },
  {
    id: 16, name: 'The Tower', arcana: 'major', number: 'XVI', symbol: '🌩️',
    keywords: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
    element: 'Fire', planet: 'Mars',
    uprightMeaning: 'Sudden upheaval shatters false structures to reveal liberating truth.',
    reversedMeaning: 'Avoiding necessary change, fear of upheaval, or delayed disaster.',
    uprightMeaningDetailed: 'The Tower strikes with sudden, unavoidable force — shattering what was built on false foundations. Though disruptive and even traumatic, this upheaval is ultimately liberating. What is destroyed was never truly solid. Out of the rubble, a more authentic and resilient life can now be built. The lightning of truth cannot be avoided.',
    reversedMeaningDetailed: 'You are sensing the tremors of coming change and desperately trying to prevent the inevitable. Or a necessary upheaval has been brewing silently within you. Delaying the Tower\'s transformation only increases its eventual impact. Face what must change before the pressure forces it upon you.'
  },
  {
    id: 17, name: 'The Star', arcana: 'major', number: 'XVII', symbol: '💫',
    keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
    element: 'Air', zodiac: 'Aquarius',
    uprightMeaning: 'Hope, inspiration, and divine grace guide you toward healing and renewal.',
    reversedMeaning: 'Hopelessness, despair, or lack of faith in the future must be addressed.',
    uprightMeaningDetailed: 'After the storm of the Tower comes the serene light of the Star. This is a card of profound hope, healing, and spiritual renewal. The universe is pouring its blessings upon you — trust in divine guidance and the benevolent forces that watch over you. Your wounds are healing. A brighter future is not just possible; it is unfolding.',
    reversedMeaningDetailed: 'Hope has dimmed and faith in the future feels distant. You may be struggling with despair, disillusionment, or a sense that your wishes cannot be fulfilled. This is temporary — reconnect with the still-glowing ember of hope within you. Seek beauty, seek stillness, and allow the stars to remind you of the vastness of possibility.'
  },
  {
    id: 18, name: 'The Moon', arcana: 'major', number: 'XVIII', symbol: '🌕',
    keywords: ['illusion', 'fear', 'the subconscious', 'confusion', 'complexity'],
    element: 'Water', zodiac: 'Pisces',
    uprightMeaning: 'Illusions, fears, and the depths of the subconscious require honest navigation.',
    reversedMeaning: 'Releasing fears, unhealthy patterns, or confusion is beginning to lift.',
    uprightMeaningDetailed: 'The Moon illuminates the night — but its light is reflected, not its own, creating shadows and illusions. Things are not as they appear. Hidden fears, unconscious patterns, and shadowy figures emerge from the depths demanding attention. Navigate carefully, trust your instincts over appearances, and know that clarity will come when dawn breaks.',
    reversedMeaningDetailed: 'The fog of confusion and fear is beginning to lift. Illusions that have distorted your perception are being seen for what they truly are. Hidden truths are coming to light. This is a time of release — let the unhealthy fears, false beliefs, and deceptive patterns dissolve in the growing light of clarity.'
  },
  {
    id: 19, name: 'The Sun', arcana: 'major', number: 'XIX', symbol: '☀️',
    keywords: ['positivity', 'fun', 'warmth', 'success', 'vitality'],
    element: 'Fire', planet: 'Sun',
    uprightMeaning: 'Radiant success, joy, vitality, and abundance shine upon every area of your life.',
    reversedMeaning: 'Temporary setbacks, excessive optimism, or inner child wounds need attention.',
    uprightMeaningDetailed: 'The Sun is one of the most joyous cards in the entire deck — it speaks of unrestrained happiness, abundant success, and radiant vitality. Clarity replaces confusion, joy replaces sorrow, and success replaces struggle. This is a time to celebrate your achievements, enjoy your life with childlike delight, and share your warmth generously with the world.',
    reversedMeaningDetailed: 'The Sun\'s light is momentarily dimmed by clouds. A temporary setback or excessive optimism that ignores practical realities may be causing difficulties. Or perhaps you are struggling to access the inner joy that is your birthright. Reconnect with play, with nature, with the simple pleasures that remind you of life\'s goodness.'
  },
  {
    id: 20, name: 'Judgement', arcana: 'major', number: 'XX', symbol: '🔔',
    keywords: ['judgement', 'rebirth', 'inner calling', 'absolution'],
    element: 'Fire', planet: 'Pluto',
    uprightMeaning: 'A profound awakening calls you to rise, transform, and answer your higher purpose.',
    reversedMeaning: 'Self-doubt, refusing the call, or harsh self-judgement keeps you small.',
    uprightMeaningDetailed: 'Judgement heralds a moment of profound spiritual awakening — a calling to rise above your past self and answer the summons of your highest purpose. This is a time of reckoning, forgiveness, and rebirth. Release judgements of yourself and others, let the past be integrated rather than carried as burden, and answer the call of your soul with full presence.',
    reversedMeaningDetailed: 'The call to awakening is being heard but not heeded. Harsh self-criticism, inability to forgive past mistakes, or fear of what transformation requires is holding you in stagnation. The trumpet of your higher self continues to sound. Answer it — release self-judgement and allow yourself to be reborn.'
  },
  {
    id: 21, name: 'The World', arcana: 'major', number: 'XXI', symbol: '🌍',
    keywords: ['completion', 'integration', 'accomplishment', 'travel', 'wholeness'],
    element: 'Earth', planet: 'Saturn',
    uprightMeaning: 'Glorious completion, wholeness, and triumphant integration of a life chapter.',
    reversedMeaning: 'Incompletion, shortcuts, or delayed closure prevents true fulfillment.',
    uprightMeaningDetailed: 'The World is the supreme card of completion and cosmic accomplishment. A significant cycle of your life is reaching its magnificent conclusion. You have integrated all lessons, overcome all obstacles, and arrived at a place of wholeness and mastery. Celebrate this achievement fully — and know that in this completion, the seeds of a magnificent new beginning are already present.',
    reversedMeaningDetailed: 'A cycle remains incomplete — perhaps you are rushing toward the finish line without fully integrating the lessons of the journey, or conversely, lingering past the natural endpoint out of fear of what comes next. True fulfillment requires completing what was begun with full presence and integrity.'
  },

  // ── MINOR ARCANA — WANDS ──────────────────────────────────────────────────
  {
    id: 22, name: 'Ace of Wands', arcana: 'minor', suit: 'wands', number: 'Ace', symbol: '🔥',
    keywords: ['inspiration', 'new opportunities', 'growth', 'potential'],
    element: 'Fire',
    uprightMeaning: 'A spark of creative inspiration ignites powerful new beginnings.',
    reversedMeaning: 'Delays, lack of motivation, or missed opportunities in creative ventures.',
    uprightMeaningDetailed: 'The Ace of Wands is a divine spark of creative fire — pure potential waiting to be channeled into inspired action. A new opportunity, creative project, or passionate endeavor is presenting itself. Seize it with both hands and allow enthusiasm to carry you forward. This is not the time for overthinking — it is the time for bold, inspired action.',
    reversedMeaningDetailed: 'Creative energy is blocked or unfocused. Promising opportunities may be slipping away due to hesitation or lack of motivation. The spark is there, but it needs oxygen — examine what is smothering your enthusiasm and take steps to reignite your creative fire.'
  },
  {
    id: 23, name: 'Two of Wands', arcana: 'minor', suit: 'wands', number: '2', symbol: '🌐',
    keywords: ['future planning', 'progress', 'decisions', 'discovery'],
    element: 'Fire',
    uprightMeaning: 'Future planning and bold decision-making open vast horizons.',
    reversedMeaning: 'Fear of the unknown, lack of planning, or playing it too safe.',
    uprightMeaningDetailed: 'You stand at the threshold of expansion, gazing at the vast world of possibilities before you. Plans are forming and a clear vision of the future is emerging. The Two of Wands encourages you to think boldly beyond your current circumstances and begin laying the strategic foundations for your grander vision.',
    reversedMeaningDetailed: 'Fear is keeping you within familiar territory when expansion is required. Plans may be overly cautious or poorly thought through. Alternatively, too many directions are competing for your attention. Clarify your vision and take the first courageous step beyond your comfort zone.'
  },
  {
    id: 24, name: 'Three of Wands', arcana: 'minor', suit: 'wands', number: '3', symbol: '⛵',
    keywords: ['progress', 'expansion', 'foresight', 'overseas opportunities'],
    element: 'Fire',
    uprightMeaning: 'Your ships are coming in. Expansion, progress, and rewards are arriving.',
    reversedMeaning: 'Delays in plans, obstacles to expansion, or lack of foresight.',
    uprightMeaningDetailed: 'The Three of Wands shows the first fruits of your bold vision beginning to manifest. You have sent your ships out into the world and now you wait with confident expectation for their return. Expansion — possibly involving travel, international connections, or broader horizons — is very much in your favor now.',
    reversedMeaningDetailed: 'Expected results are delayed or not materializing as planned. Obstacles in the form of practical difficulties or poor foresight are impeding your expansion. Re-examine your strategy and be prepared to adapt. What adjustments are needed to get your ships moving in the right direction?'
  },
  {
    id: 25, name: 'Four of Wands', arcana: 'minor', suit: 'wands', number: '4', symbol: '🎊',
    keywords: ['celebration', 'joy', 'harmony', 'relaxation', 'homecoming'],
    element: 'Fire',
    uprightMeaning: 'Celebration, community, harmony, and joyful milestones deserve recognition.',
    reversedMeaning: 'Transition, instability at home, or postponed celebration.',
    uprightMeaningDetailed: 'The Four of Wands is a beautiful card of celebration and community joy. A significant milestone has been reached and it deserves to be honored with those you love. There is a sense of coming home — to a place, a community, or an aspect of yourself. Relax into this moment of harmony and let joy be fully expressed.',
    reversedMeaningDetailed: 'The home environment feels unstable or tense, preventing genuine celebration. A transition period may be creating temporary disharmony. Or a deserved celebration is being postponed or minimized. Seek to create harmony in your immediate environment and allow yourself moments of joy even amid change.'
  },
  {
    id: 26, name: 'Five of Wands', arcana: 'minor', suit: 'wands', number: '5', symbol: '⚔️',
    keywords: ['conflict', 'disagreements', 'competition', 'tension', 'diversity'],
    element: 'Fire',
    uprightMeaning: 'Competition, conflict, and scattered energies create productive tension.',
    reversedMeaning: 'Inner conflict, avoiding conflict, or resolving disputes.',
    uprightMeaningDetailed: 'The Five of Wands depicts a scene of competitive struggle — multiple forces competing for dominance. This conflict, though uncomfortable, can be creative and productive if channeled well. Competition is sharpening your skills and forcing clarity about what you truly stand for. Engage honestly, stand your ground, and trust that the best ideas will emerge from the productive clash.',
    reversedMeaningDetailed: 'Internal conflicts are creating paralysis, or you are avoiding necessary confrontations at great cost. Alternatively, a period of conflict is finally resolving as parties find common ground. Examine whether you are suppressing important truths to avoid discomfort, and whether that avoidance is serving you well.'
  },
  {
    id: 27, name: 'Six of Wands', arcana: 'minor', suit: 'wands', number: '6', symbol: '🏆',
    keywords: ['success', 'public recognition', 'progress', 'self-confidence'],
    element: 'Fire',
    uprightMeaning: 'Public recognition, victory, and well-deserved success are yours.',
    reversedMeaning: 'Private achievement, egotism, or delayed recognition.',
    uprightMeaningDetailed: 'The Six of Wands is the triumphant victor\'s card. Your efforts have been recognized and celebrated — you are being seen and honored for your achievements. This is a time to accept praise graciously, acknowledge your accomplishments, and let your confidence shine. You have earned this moment of public success.',
    reversedMeaningDetailed: 'Success is arriving but without the public recognition expected. Your achievements may be going unnoticed, or egotism is alienating those whose support you need. Alternatively, you are achieving great things privately that will eventually receive the recognition they deserve. Continue with integrity.'
  },
  {
    id: 28, name: 'Seven of Wands', arcana: 'minor', suit: 'wands', number: '7', symbol: '🛡️',
    keywords: ['challenge', 'competition', 'protection', 'perseverance'],
    element: 'Fire',
    uprightMeaning: 'Stand your ground with conviction. Persevere against challenges and competition.',
    reversedMeaning: 'Giving up, overwhelm, or failing to defend your position.',
    uprightMeaningDetailed: 'The Seven of Wands places you in a position of having to defend what you have worked so hard to build. From your high ground, you face challenges from multiple directions. The message is clear: hold your position. Your values, your achievements, your boundaries are worth defending. Do not back down.',
    reversedMeaningDetailed: 'You are feeling overwhelmed by challenges coming from all sides and may be considering surrender. Or perhaps you are picking unnecessary battles and wasting energy on conflicts that don\'t truly matter. Choose your battles wisely and make sure the ground you defend is worth defending.'
  },
  {
    id: 29, name: 'Eight of Wands', arcana: 'minor', suit: 'wands', number: '8', symbol: '🚀',
    keywords: ['speed', 'action', 'air travel', 'movement', 'swift change'],
    element: 'Fire',
    uprightMeaning: 'Rapid movement, swift action, and accelerating progress propel you forward.',
    reversedMeaning: 'Delays, frustration, or moving too fast without direction.',
    uprightMeaningDetailed: 'The Eight of Wands is pure kinetic energy — everything is moving at speed. Messages arrive quickly, decisions must be made rapidly, and events are unfolding faster than expected. This is an excellent time to take swift, decisive action. Communicate clearly, move boldly, and trust the momentum that is carrying you forward.',
    reversedMeaningDetailed: 'Everything seems to be moving in the wrong direction or at a frustrating crawl. Plans are stalled, communications are confused, and energy is scattered. Or conversely, you are rushing headlong without adequate preparation. Pause briefly to recalibrate your direction before resuming movement.'
  },
  {
    id: 30, name: 'Nine of Wands', arcana: 'minor', suit: 'wands', number: '9', symbol: '💪',
    keywords: ['resilience', 'grit', 'last stand', 'persistence', 'test of faith'],
    element: 'Fire',
    uprightMeaning: 'Draw on your resilience for the final push. Victory is close — do not give up.',
    reversedMeaning: 'Exhaustion, giving up, or refusing to adapt slows progress.',
    uprightMeaningDetailed: 'The Nine of Wands shows the battle-weary warrior who has faced test after test yet still stands. You are almost at the finish line, but one final challenge stands between you and success. Every wound, every obstacle overcome has made you stronger. Draw on that hard-won resilience and make your final stand with all you have.',
    reversedMeaningDetailed: 'Exhaustion and battle fatigue have become overwhelming. You may be close to giving up just before the breakthrough. Or you are being unnecessarily defensive and paranoid based on past wounds rather than present reality. Rest if you must, but do not abandon what is nearly within your grasp.'
  },
  {
    id: 31, name: 'Ten of Wands', arcana: 'minor', suit: 'wands', number: '10', symbol: '🎒',
    keywords: ['burden', 'extra responsibility', 'hard work', 'completion'],
    element: 'Fire',
    uprightMeaning: 'Heavy responsibilities and burdens are being carried toward completion.',
    reversedMeaning: 'Doing it all alone, collapse under pressure, or delegating responsibilities.',
    uprightMeaningDetailed: 'The Ten of Wands shows a figure bent under the weight of ten wands — a heavy load being carried with determination toward a destination in sight. You have taken on enormous responsibility and the weight is real. But the goal is visible. Delegate what you can, release what is not truly yours to carry, and focus your remaining energy on crossing the finish line.',
    reversedMeaningDetailed: 'The burden has become unsustainable and something must give. You are trying to do everything alone and burning out in the process. It is time to ask for help, delegate responsibilities, release obligations that are not truly yours, and choose sustainability over martyrdom.'
  },
  {
    id: 32, name: 'Page of Wands', arcana: 'minor', suit: 'wands', number: 'Page', symbol: '🌱',
    keywords: ['enthusiasm', 'exploration', 'discovery', 'free spirit'],
    element: 'Fire',
    uprightMeaning: 'Enthusiastic exploration, creative discovery, and free-spirited adventure await.',
    reversedMeaning: 'Newly formed ideas, redirecting energy, or lack of direction.',
    uprightMeaningDetailed: 'The Page of Wands brings the fresh, unrestrained energy of creative curiosity. New ideas are sparking and the world feels full of exciting possibilities to explore. Approach this time with the Page\'s infectious enthusiasm — try new things, follow your curiosity wherever it leads, and allow yourself to discover what truly lights you up.',
    reversedMeaningDetailed: 'Creative energy exists but lacks focus and direction. There may be too many ideas and not enough follow-through. Alternatively, self-doubt is dampening your natural enthusiasm before projects even begin. Channel your creative fire into one meaningful direction and trust the process of development.'
  },
  {
    id: 33, name: 'Knight of Wands', arcana: 'minor', suit: 'wands', number: 'Knight', symbol: '🏇',
    keywords: ['energy', 'passion', 'inspired action', 'adventure', 'impulsiveness'],
    element: 'Fire',
    uprightMeaning: 'Passionate, energetic action and adventurous pursuit of goals defines this time.',
    reversedMeaning: 'Anger, impulsiveness, or recklessness needs to be reined in.',
    uprightMeaningDetailed: 'The Knight of Wands charges forward with fiery passion and unstoppable energy. This is a time for bold, decisive action — follow your passion with commitment and allow your adventurous spirit to lead the way. Take calculated risks, embrace challenges as exciting opportunities, and trust that your enthusiasm will carry you far.',
    reversedMeaningDetailed: 'The Knight\'s fire has become reckless and uncontrolled. Impulsive decisions, hot-headed reactions, or scattered energy are causing damage. The passion and drive are valuable — but they must be directed with greater wisdom and restraint. Slow down just enough to aim before firing.'
  },
  {
    id: 34, name: 'Queen of Wands', arcana: 'minor', suit: 'wands', number: 'Queen', symbol: '👸',
    keywords: ['courage', 'confidence', 'independence', 'social butterfly', 'determination'],
    element: 'Fire',
    uprightMeaning: 'Courageous, confident, and charismatic — you are magnetic and powerfully creative.',
    reversedMeaning: 'Selfishness, jealousy, or demanding behavior creates friction.',
    uprightMeaningDetailed: 'The Queen of Wands embodies fiery feminine power at its most radiant. She is self-assured, magnetic, and creatively alive — drawing people to her through her warmth and authentic confidence. This is a time to own your power fully, lead with your heart, and let your natural charisma open doors that were previously closed.',
    reversedMeaningDetailed: 'The Queen\'s fire has turned inward in jealousy or outward in manipulation. Insecurity may be masquerading as confidence, or you are using your power to dominate rather than inspire. Reconnect with the authentic warmth and creative generosity that is your true nature.'
  },
  {
    id: 35, name: 'King of Wands', arcana: 'minor', suit: 'wands', number: 'King', symbol: '🤴',
    keywords: ['natural-born leader', 'vision', 'entrepreneur', 'honour'],
    element: 'Fire',
    uprightMeaning: 'Visionary leadership, entrepreneurial mastery, and inspired authority define you.',
    reversedMeaning: 'Impulsiveness, ruthlessness, or setting impossibly high expectations.',
    uprightMeaningDetailed: 'The King of Wands is the master of creative fire — a visionary leader who inspires others through his bold example and long-range thinking. He builds empires from inspired ideas. This card calls you to embody true leadership: set a bold vision, inspire those around you with your passion, and take full responsibility for the direction you chart.',
    reversedMeaningDetailed: 'The King\'s ambition has become tyrannical. Unrealistic expectations, domineering behavior, or using others as instruments rather than honoring them as people is creating toxicity. Reconnect with the collaborative, generous spirit of true leadership — inspire rather than demand.'
  },

  // ── CUPS ──────────────────────────────────────────────────────────────────
  {
    id: 36, name: 'Ace of Cups', arcana: 'minor', suit: 'cups', number: 'Ace', symbol: '💧',
    keywords: ['new feelings', 'spirituality', 'intuition', 'intimacy', 'love'],
    element: 'Water',
    uprightMeaning: 'An overflowing gift of love, emotional renewal, and spiritual connection.',
    reversedMeaning: 'Emotional loss, blocked creativity, or emptiness.',
    uprightMeaningDetailed: 'The Ace of Cups is a divine outpouring of love and emotional abundance. A new relationship, a deepening of existing love, or a profound spiritual opening is available to you now. Open your heart completely — allow yourself to receive as generously as you give. This is a sacred moment of emotional renewal and connection.',
    reversedMeaningDetailed: 'Emotional waters have run dry. A sense of emptiness, disconnection, or blocked feeling prevents the natural flow of love and creativity. Old wounds may be closing your heart. Gently tend to what has been emotionally neglected and allow healing to begin reopening the wellspring within.'
  },
  {
    id: 37, name: 'Two of Cups', arcana: 'minor', suit: 'cups', number: '2', symbol: '🤝',
    keywords: ['unified love', 'partnership', 'mutual attraction'],
    element: 'Water',
    uprightMeaning: 'Deep mutual connection, romantic partnership, and soulful union are present.',
    reversedMeaning: 'Imbalance in relationships, break-ups, or lack of compatibility.',
    uprightMeaningDetailed: 'The Two of Cups is the card of beautiful, mutual partnership — two people or forces coming together in perfect harmony and reciprocal love. A relationship of extraordinary depth and mutual respect is present or forming. There is genuine recognition of each other\'s worth and a sacred bond being formed or deepened.',
    reversedMeaningDetailed: 'A relationship that once had beautiful harmony is showing signs of imbalance. The giving and receiving has become one-sided, or a fundamental incompatibility is becoming undeniable. Honest communication about the true state of the relationship is needed before the connection can be restored or gracefully released.'
  },
  {
    id: 38, name: 'Three of Cups', arcana: 'minor', suit: 'cups', number: '3', symbol: '🎉',
    keywords: ['celebration', 'friendship', 'creativity', 'community'],
    element: 'Water',
    uprightMeaning: 'Joyful celebration, supportive friendships, and community abundance.',
    reversedMeaning: 'Overindulgence, gossip, or isolation from community.',
    uprightMeaningDetailed: 'The Three of Cups is pure joy — the card of celebration, friendship, and community. Something wonderful is being honored with the people who matter most to you. This is a time to revel in the gift of loving friendship, to express gratitude for your community, and to allow the simple pleasure of togetherness to fill your heart with delight.',
    reversedMeaningDetailed: 'Social engagements have become excessive or superficial — too much celebration without substance, or gossip and drama infiltrating your social circle. Alternatively, isolation from community is causing loneliness. Seek genuine, nourishing connections rather than surface-level social performance.'
  },
  {
    id: 39, name: 'Four of Cups', arcana: 'minor', suit: 'cups', number: '4', symbol: '🤔',
    keywords: ['meditation', 'contemplation', 'apathy', 'reevaluation'],
    element: 'Water',
    uprightMeaning: 'Meditation and contemplation reveal whether current offerings truly serve you.',
    reversedMeaning: 'Retreat, withdrawal, or new motivation emerging from stillness.',
    uprightMeaningDetailed: 'The Four of Cups finds you in a contemplative, introspective state — perhaps bored with current circumstances or turning inward to reevaluate what truly matters. A new cup is being offered by the universe, but you are so absorbed in your own thoughts that you have not noticed it yet. Look up — a gift you didn\'t expect awaits your attention.',
    reversedMeaningDetailed: 'A period of withdrawal and introspection is either beginning or ending. You may be emerging from a time of isolation with renewed motivation and clarity about what you truly want. Or you are retreating deeper into yourself in a way that is becoming unhealthy. Gently test the waters of re-engagement with life.'
  },
  {
    id: 40, name: 'Five of Cups', arcana: 'minor', suit: 'cups', number: '5', symbol: '😢',
    keywords: ['regret', 'failure', 'disappointment', 'pessimism'],
    element: 'Water',
    uprightMeaning: 'Grief and loss are real, but what remains still holds precious value.',
    reversedMeaning: 'Personal setbacks, acceptance, and moving on from grief.',
    uprightMeaningDetailed: 'The Five of Cups asks you to honor your grief without being consumed by it. Loss and disappointment are real and deserve to be felt. But notice: not all is lost. Three cups have spilled, but two remain standing behind you, full and waiting. When you are ready, turn around and acknowledge what still remains.',
    reversedMeaningDetailed: 'The period of grief is releasing its grip. Acceptance is slowly replacing despair, and you are beginning to find the courage to turn toward what remains rather than fixating on what was lost. This is a healing transition — be gentle with yourself as you begin to move forward.'
  },
  {
    id: 41, name: 'Six of Cups', arcana: 'minor', suit: 'cups', number: '6', symbol: '🌻',
    keywords: ['revisiting the past', 'childhood memories', 'innocence', 'joy'],
    element: 'Water',
    uprightMeaning: 'Nostalgia, childhood joy, and revisiting the past bring healing and warmth.',
    reversedMeaning: 'Living in the past, unrealistic nostalgia, or need to grow up.',
    uprightMeaningDetailed: 'The Six of Cups is a gentle gift from the past — a reminder of innocence, simple joy, and the warmth of childhood. An old friend, a reconnection with someone from your history, or a return to a familiar place may bring unexpected comfort and healing. Allow yourself to be nourished by fond memories without being trapped by them.',
    reversedMeaningDetailed: 'Excessive focus on the past is preventing full engagement with the present and future. Nostalgia has become a refuge from current responsibilities. While the past holds valuable lessons and warmth, it is time to bring those gifts forward into your present life rather than retreating into what was.'
  },
  {
    id: 42, name: 'Seven of Cups', arcana: 'minor', suit: 'cups', number: '7', symbol: '🌈',
    keywords: ['opportunities', 'choices', 'wishful thinking', 'illusion'],
    element: 'Water',
    uprightMeaning: 'Multiple tempting options and possibilities require careful discernment.',
    reversedMeaning: 'Alignment, clarity, and cutting through illusion to make real choices.',
    uprightMeaningDetailed: 'The Seven of Cups presents a dazzling array of possibilities — each one glittering with apparent promise. But not all that glitters is gold. This card warns of wishful thinking and the seduction of illusion. Ground yourself in reality, apply clear discernment to what each option truly requires and offers, and choose from wisdom rather than fantasy.',
    reversedMeaningDetailed: 'The fog of confusion and wishful thinking is lifting, revealing which opportunities are genuinely aligned with your authentic path. Clarity is returning after a period of scattered energy and unrealistic fantasies. You are now ready to make a real, grounded choice that reflects your true values and capabilities.'
  },
  {
    id: 43, name: 'Eight of Cups', arcana: 'minor', suit: 'cups', number: '8', symbol: '🌙',
    keywords: ['disappointment', 'abandonment', 'withdrawal', 'escapism'],
    element: 'Water',
    uprightMeaning: 'A conscious choice to walk away from what no longer fulfills you.',
    reversedMeaning: 'Trying one more time, or avoiding the necessary departure.',
    uprightMeaningDetailed: 'The Eight of Cups shows a figure turning their back on a carefully built but ultimately unfulfilling arrangement and walking quietly away in the moonlight. This is a deeply courageous act — choosing meaning over comfort, soul-growth over security. What must be left behind for you to pursue what truly fulfills you?',
    reversedMeaningDetailed: 'You are either making one last valiant attempt to find fulfillment in a situation before leaving, or you are avoiding a departure that has become necessary. Fear of the unknown is keeping you in an arrangement that no longer serves your deepest needs. The path forward requires honest assessment of what truly remains.'
  },
  {
    id: 44, name: 'Nine of Cups', arcana: 'minor', suit: 'cups', number: '9', symbol: '😊',
    keywords: ['contentment', 'satisfaction', 'gratitude', 'wish fulfillment'],
    element: 'Water',
    uprightMeaning: 'Your wish is granted. Satisfaction, contentment, and emotional fulfillment are yours.',
    reversedMeaning: 'Inner happiness, materialism, or dissatisfaction despite outward success.',
    uprightMeaningDetailed: 'The Nine of Cups is the wish card — the card that says your heart\'s deepest desire is being fulfilled or is very close to manifestation. This is a time of profound emotional satisfaction and contentment. Feel the fullness of this moment with deep gratitude. You have worked hard for this happiness — receive it with an open and grateful heart.',
    reversedMeaningDetailed: 'Outward success exists but inner fulfillment remains elusive. You may have achieved what you thought you wanted only to find it hollow. Or the wish has been granted but comes with unexpected complications. True satisfaction comes not from external achievement but from alignment between your outer life and your inner truth.'
  },
  {
    id: 45, name: 'Ten of Cups', arcana: 'minor', suit: 'cups', number: '10', symbol: '🌈',
    keywords: ['divine love', 'blissful relationships', 'harmony', 'alignment'],
    element: 'Water',
    uprightMeaning: 'Perfect harmony, joyful family life, and emotional bliss in relationships.',
    reversedMeaning: 'Misaligned values, broken home, or shattered family harmony.',
    uprightMeaningDetailed: 'The Ten of Cups is the supreme card of emotional fulfillment — the rainbow at the end of the storm, the happy family gathered in joy, the heart that has found its true home. Every relationship in your life is resonating with love and harmony. This is the deep peace and contentment that comes from living fully aligned with your heart\'s true home.',
    reversedMeaningDetailed: 'The ideal of the happy home and harmonious relationships feels distant or has been disrupted. Family tensions, value misalignments, or shattered expectations are creating discord. What adjustments are needed to bring your relationships back into loving alignment with the deeper truth of what you all truly share?'
  },
  {
    id: 46, name: 'Page of Cups', arcana: 'minor', suit: 'cups', number: 'Page', symbol: '🐟',
    keywords: ['creative opportunities', 'intuitive messages', 'curiosity', 'possibility'],
    element: 'Water',
    uprightMeaning: 'Creative and emotional messages arrive with intuitive clarity and wonder.',
    reversedMeaning: 'Emotional immaturity, insecurity, or creative blocks.',
    uprightMeaningDetailed: 'The Page of Cups brings surprising and delightful messages from the world of feeling and intuition. A creative inspiration, an unexpected emotional revelation, or a tender new relationship is presenting itself. Stay open and curious — the universe is communicating through the language of the heart and the imagination.',
    reversedMeaningDetailed: 'Emotional immaturity or creative insecurity is preventing the natural flow of feeling and inspiration. Old emotional wounds may be causing you to react with defensiveness rather than openness. Nurture the vulnerable creative self within you with patience and compassion rather than criticism.'
  },
  {
    id: 47, name: 'Knight of Cups', arcana: 'minor', suit: 'cups', number: 'Knight', symbol: '🦢',
    keywords: ['creativity', 'romance', 'charm', 'imagination', 'beauty'],
    element: 'Water',
    uprightMeaning: 'Romantic, creative, and emotionally intelligent — following the heart\'s call.',
    reversedMeaning: 'Overactive imagination, jealousy, or moodiness.',
    uprightMeaningDetailed: 'The Knight of Cups rides forth on a quest of the heart — pursuing love, beauty, and creative vision with graceful determination. This is a time to follow your heart\'s calling with romantic courage. A creative pursuit, a meaningful relationship, or an artistic endeavor is calling you forward. Respond with the Knight\'s beautiful blend of sensitivity and action.',
    reversedMeaningDetailed: 'The Knight\'s romantic nature has become ungrounded — excessive daydreaming, emotional volatility, or jealousy are creating difficulties. Creative projects may be stalling due to unrealistic expectations. Bring your imaginative gifts back down to earth with practical grounding while preserving their essential beauty.'
  },
  {
    id: 48, name: 'Queen of Cups', arcana: 'minor', suit: 'cups', number: 'Queen', symbol: '🌊',
    keywords: ['compassionate', 'caring', 'emotionally stable', 'intuitive', 'in flow'],
    element: 'Water',
    uprightMeaning: 'Profound compassion, emotional wisdom, and intuitive mastery guide you.',
    reversedMeaning: 'Inner feelings are suppressed, or emotional codependency is present.',
    uprightMeaningDetailed: 'The Queen of Cups embodies emotional mastery — she feels everything deeply yet remains centered and clear. Her compassion is vast, her intuition unerring, and her ability to hold space for others while honoring her own needs is extraordinary. This is a time to lead with the heart, trust your intuitive knowing, and offer genuine compassionate presence to yourself and others.',
    reversedMeaningDetailed: 'Emotions that have been suppressed are beginning to overflow in unhealthy ways. Or emotional boundaries have dissolved into codependency, where you are so absorbed in others\' feelings that you have lost touch with your own. Recenter in your own emotional truth before offering care to others.'
  },
  {
    id: 49, name: 'King of Cups', arcana: 'minor', suit: 'cups', number: 'King', symbol: '🌊',
    keywords: ['emotionally balanced', 'compassionate', 'diplomatic'],
    element: 'Water',
    uprightMeaning: 'Emotional mastery, compassionate leadership, and diplomatic wisdom.',
    reversedMeaning: 'Emotional manipulation, moodiness, or volatility.',
    uprightMeaningDetailed: 'The King of Cups has mastered the art of feeling deeply without being controlled by his feelings. He leads with compassion and emotional intelligence, creating safety for others to be authentic. He is the wise counselor, the compassionate authority. This is a time to lead from the heart while maintaining your inner equilibrium amid the storms of others\' emotions.',
    reversedMeaningDetailed: 'Emotional manipulation or volatility is disrupting relationships and undermining trust. The King\'s emotional depth has become a source of turbulence rather than stability. Address the source of inner emotional imbalance and recommit to the integrity and compassion that is your highest expression.'
  },

  // ── SWORDS ─────────────────────────────────────────────────────────────────
  {
    id: 50, name: 'Ace of Swords', arcana: 'minor', suit: 'swords', number: 'Ace', symbol: '⚔️',
    keywords: ['breakthroughs', 'new ideas', 'mental clarity', 'success', 'truth'],
    element: 'Air',
    uprightMeaning: 'Mental breakthroughs, piercing clarity, and the triumph of truth.',
    reversedMeaning: 'Inner clarity needed, confusion, or misuse of power.',
    uprightMeaningDetailed: 'The Ace of Swords is the double-edged blade of absolute truth and mental clarity. A breakthrough in understanding is arriving — cutting through confusion and revealing what is actually true. Seize this moment of clear thinking to make decisions, speak your truth, and cut away what is false. Clarity, once achieved, must be wielded with integrity.',
    reversedMeaningDetailed: 'Mental clarity is obscured by confusion, misinformation, or willful avoidance of uncomfortable truths. The power of the sword is being misused — perhaps through manipulative communication or destructive thinking patterns. Seek the clarity that can only come through honest self-examination.'
  },
  {
    id: 51, name: 'Two of Swords', arcana: 'minor', suit: 'swords', number: '2', symbol: '🙈',
    keywords: ['difficult decisions', 'weighing up options', 'an impasse', 'avoidance'],
    element: 'Air',
    uprightMeaning: 'A difficult decision requires honest evaluation rather than avoidance.',
    reversedMeaning: 'Indecision, confusion, or information coming to light.',
    uprightMeaningDetailed: 'The Two of Swords shows a figure blindfolded, holding two crossed swords — deliberately refusing to see. A decision must be made but you are in a stalemate, afraid to look at the full truth of your situation. Remove the blindfold. Gather the information you have been avoiding. The decision, though difficult, must be made with clear eyes.',
    reversedMeaningDetailed: 'The blindfold is beginning to slip. Hidden information is coming to light, or the stalemate is forcing a resolution. The truth you have been avoiding can no longer be ignored. Though the revelation may be uncomfortable, it will ultimately provide the clarity needed to make a genuine choice and move forward.'
  },
  {
    id: 52, name: 'Three of Swords', arcana: 'minor', suit: 'swords', number: '3', symbol: '💔',
    keywords: ['heartbreak', 'emotional pain', 'sorrow', 'grief', 'hurt'],
    element: 'Air',
    uprightMeaning: 'Heartbreak, grief, and emotional pain are present and must be felt.',
    reversedMeaning: 'Recovery from grief, forgiveness, and releasing painful patterns.',
    uprightMeaningDetailed: 'The Three of Swords is one of the most honest cards in the deck — it acknowledges that heartbreak and sorrow are real and profound parts of the human experience. Pain is present and it demands to be felt rather than suppressed. Allow the tears to fall, allow the grief to move through you. Only by feeling it fully can you begin the journey toward healing.',
    reversedMeaningDetailed: 'The acute pain of heartbreak is beginning to ease. Forgiveness — of others and of yourself — is opening a pathway through grief toward healing. The swords are slowly being removed from the heart. This is a gradual process — be patient and compassionate with yourself as you recover and integrate what this pain has taught you.'
  },
  {
    id: 53, name: 'Four of Swords', arcana: 'minor', suit: 'swords', number: '4', symbol: '🛌',
    keywords: ['rest', 'recovery', 'contemplation', 'passive', 'relaxation'],
    element: 'Air',
    uprightMeaning: 'Rest, recuperation, and peaceful contemplation are urgently needed.',
    reversedMeaning: 'Awakening, moving forward, or restlessness during recovery.',
    uprightMeaningDetailed: 'The Four of Swords commands rest. Your mind and body have been through a great deal and recuperation is not optional — it is essential. Step back from conflict and activity, enter a period of restorative silence, and allow your system to heal. The battle will resume when you are ready. For now, the most courageous thing you can do is rest.',
    reversedMeaningDetailed: 'Enforced rest is coming to an end and the call to action is returning. You are emerging from a period of recuperation with renewed energy, or restlessness is making it impossible to maintain the stillness that healing requires. Assess honestly whether you are truly recovered or simply impatient to re-engage.'
  },
  {
    id: 54, name: 'Five of Swords', arcana: 'minor', suit: 'swords', number: '5', symbol: '🗡️',
    keywords: ['unbridled ambition', 'win at all costs', 'sneakiness', 'conflict'],
    element: 'Air',
    uprightMeaning: 'Conflict with no true winners. Choose battles wisely and consider the cost.',
    reversedMeaning: 'Reconciliation, resolution, and moving past conflict.',
    uprightMeaningDetailed: 'The Five of Swords depicts a pyrrhic victory — you may win the battle but the cost to relationships and self-respect makes it a hollow triumph. Examine the conflicts in your life: are they worth the damage being done? Is winning at all costs truly winning? Consider whether a strategic retreat or honest conversation might serve you better than continued combat.',
    reversedMeaningDetailed: 'A period of conflict is reaching its conclusion. Reconciliation is possible if both parties are willing to lower their swords and address underlying grievances with honesty and humility. Or you are finally releasing a conflict that has drained you without resolution. Let it go — peace is more valuable than victory.'
  },
  {
    id: 55, name: 'Six of Swords', arcana: 'minor', suit: 'swords', number: '6', symbol: '⛵',
    keywords: ['transition', 'change', 'rite of passage', 'releasing baggage'],
    element: 'Air',
    uprightMeaning: 'A necessary transition carries you away from turbulence toward calmer waters.',
    reversedMeaning: 'Resistance to change, carrying baggage, or an unfinished transition.',
    uprightMeaningDetailed: 'The Six of Swords shows a quiet journey from stormy to calmer waters. The transition may not be easy — the baggage of past difficulties travels with you. But movement forward is happening, and the destination, though not yet visible, promises greater peace. Trust the passage and release attachment to the turbulent waters you are leaving behind.',
    reversedMeaningDetailed: 'A necessary transition is being resisted or delayed. Clinging to familiar pain rather than moving toward unknown peace is keeping you stuck. Or a transition begun is being interrupted by unresolved issues from the past that must be addressed before forward movement can truly occur. What needs to be resolved before you can fully move on?'
  },
  {
    id: 56, name: 'Seven of Swords', arcana: 'minor', suit: 'swords', number: '7', symbol: '🦊',
    keywords: ['betrayal', 'deception', 'getting away with something', 'stealth'],
    element: 'Air',
    uprightMeaning: 'Deception, strategy, or the need for a tactical approach to a difficult situation.',
    reversedMeaning: 'Conscience, coming clean, or being caught in deception.',
    uprightMeaningDetailed: 'The Seven of Swords suggests that not everything can be confronted head-on — sometimes strategic retreat, careful planning, or a more indirect approach is necessary. However, be cautious: there may be deception in your environment, or you may be engaging in behavior that compromises your integrity. Cleverness is only valuable when aligned with honesty.',
    reversedMeaningDetailed: 'A deception — by you or someone around you — is coming to light. The conscience is stirring. There is an opportunity here to come clean, correct course, and restore integrity to a situation that has been compromised. The relief of honesty far outweighs the temporary discomfort of confession.'
  },
  {
    id: 57, name: 'Eight of Swords', arcana: 'minor', suit: 'swords', number: '8', symbol: '⛓️',
    keywords: ['negative thoughts', 'self-imposed restriction', 'imprisonment', 'victim mentality'],
    element: 'Air',
    uprightMeaning: 'The prison you are in is largely of your own creating. You have more freedom than you believe.',
    reversedMeaning: 'Self-acceptance, new perspective, or freedom from limiting beliefs.',
    uprightMeaningDetailed: 'The Eight of Swords shows a bound and blindfolded figure surrounded by swords — but look carefully: the bindings are loose and could be removed. The swords are not actually blocking an exit. The imprisonment is largely mental — created by fear, negative thinking, and limiting beliefs. The truth is that you have far more freedom than you currently allow yourself to believe.',
    reversedMeaningDetailed: 'The blindfold is being removed and the bindings are loosening. Self-imposed limitations and fear-based thinking are being recognized for the illusions they are. A new perspective is arriving that shows you the exit that was always there. Freedom is not being given to you — it is being reclaimed from within.'
  },
  {
    id: 58, name: 'Nine of Swords', arcana: 'minor', suit: 'swords', number: '9', symbol: '😰',
    keywords: ['anxiety', 'worry', 'fear', 'depression', 'nightmares'],
    element: 'Air',
    uprightMeaning: 'Anxiety and worry are creating mental suffering that exceeds actual circumstances.',
    reversedMeaning: 'Inner turmoil, releasing worry, or recovering from depression.',
    uprightMeaningDetailed: 'The Nine of Swords is the card of the 3 AM mind — the racing thoughts, the catastrophic fears, the nightmares that visit in the dark. Your mental suffering is real, but examine honestly: how much of what you fear is actually happening versus what your anxious mind is projecting? Reach out for support, practice calming the mind, and know that dawn always comes.',
    reversedMeaningDetailed: 'The worst of the anxiety and mental anguish is beginning to pass. Recovery from depression or chronic worry is underway, though it requires continued conscious effort. Or the suffering has turned inward in unhealthy self-criticism and shame. Seek support and remember that the mind\'s storms, however powerful, are temporary weather patterns — not permanent states.'
  },
  {
    id: 59, name: 'Ten of Swords', arcana: 'minor', suit: 'swords', number: '10', symbol: '🌅',
    keywords: ['painful endings', 'deep wounds', 'betrayal', 'loss', 'crisis'],
    element: 'Air',
    uprightMeaning: 'A painful ending marks the absolute lowest point — and thus the beginning of dawn.',
    reversedMeaning: 'Recovery and regeneration; the worst is over.',
    uprightMeaningDetailed: 'The Ten of Swords depicts the most dramatic ending possible — yet notice that the sun rises on the horizon behind the fallen figure. This is the absolute nadir — the lowest point that must be fully experienced before the inevitable upswing begins. Though the pain is intense, the good news is that it cannot get worse from here. The only direction from rock bottom is up.',
    reversedMeaningDetailed: 'The crisis has passed and recovery is underway. The ten swords have done their devastating work, and now the slow, sacred work of regeneration begins. You are proving more resilient than even you believed possible. The sun that was barely visible on the horizon is now rising. Trust the dawn that is coming.'
  },
  {
    id: 60, name: 'Page of Swords', arcana: 'minor', suit: 'swords', number: 'Page', symbol: '💨',
    keywords: ['new ideas', 'curiosity', 'thirst for knowledge', 'new ways of communicating'],
    element: 'Air',
    uprightMeaning: 'Intellectual curiosity, quick thinking, and truth-seeking define this moment.',
    reversedMeaning: 'Tactlessness, lack of planning, or scattering mental energy.',
    uprightMeaningDetailed: 'The Page of Swords brings sharp intellectual energy — curious, quick-minded, and hungry for truth. New ideas are sparking and there is a keen desire to understand, to question, and to communicate what is being discovered. This is a time to pursue knowledge with enthusiasm, speak your truth clearly, and approach challenges with innovative thinking.',
    reversedMeaningDetailed: 'Mental energy is scattered and unfocused, resulting in half-formed ideas and poor follow-through. Hasty communication or thoughtless words are creating unnecessary conflict. Slow down the rushing mind, develop ideas more fully before acting on them, and choose your words with greater care and precision.'
  },
  {
    id: 61, name: 'Knight of Swords', arcana: 'minor', suit: 'swords', number: 'Knight', symbol: '⚡',
    keywords: ['ambitious', 'action-oriented', 'driven to succeed', 'fast-thinking'],
    element: 'Air',
    uprightMeaning: 'Determined, fast-thinking action cuts through obstacles with intellectual precision.',
    reversedMeaning: 'Restless, unfocused, or scattered approach causes problems.',
    uprightMeaningDetailed: 'The Knight of Swords charges forward with breathtaking speed and intellectual conviction. There is no hesitation here — he sees the truth and rides toward it at full gallop. This is a time for swift, decisive action backed by clear thinking. Commit fully to your course, communicate with precision and authority, and trust your sharp analytical mind.',
    reversedMeaningDetailed: 'The Knight\'s speed without direction creates chaos and damage. Rushing into situations without adequate thought, arguing aggressively without listening, or scattering mental energy in too many directions at once undermines all efforts. Develop the discipline of the Knight\'s precision without the recklessness of charging blindly forward.'
  },
  {
    id: 62, name: 'Queen of Swords', arcana: 'minor', suit: 'swords', number: 'Queen', symbol: '🗡️',
    keywords: ['independent', 'unbiased judgement', 'clear boundaries', 'direct communication'],
    element: 'Air',
    uprightMeaning: 'Sharp intellect, clear boundaries, honest communication, and independent wisdom.',
    reversedMeaning: 'Coldness, bitterness, or cruelty masked as logic.',
    uprightMeaningDetailed: 'The Queen of Swords has the wisdom born of experience — she has loved and lost, and emerged with extraordinary clarity and discernment. Her mind is sharp, her boundaries clear, and her communication honest and direct. This is a time to apply rigorous, unbiased thinking, speak difficult truths with compassion, and hold firm boundaries with graceful authority.',
    reversedMeaningDetailed: 'Pain and disappointment have hardened into bitterness, and the Queen\'s clarity has become cruelty. Harsh judgements, cold withdrawal, or using intellect as a weapon rather than a tool of truth are creating damage. Reconnect with the compassion that tempers discernment into wisdom, rather than sharpening it into a blade against yourself or others.'
  },
  {
    id: 63, name: 'King of Swords', arcana: 'minor', suit: 'swords', number: 'King', symbol: '👑',
    keywords: ['mental clarity', 'intellectual power', 'authority', 'truth', 'ethics'],
    element: 'Air',
    uprightMeaning: 'Intellectual authority, ethical leadership, and the power of clear, principled thinking.',
    reversedMeaning: 'Manipulation, cruelty, or abuse of intellectual authority.',
    uprightMeaningDetailed: 'The King of Swords represents the pinnacle of intellectual authority — a mind that thinks with absolute clarity, communicates with precision, and leads with unwavering ethical principles. He cuts through confusion with the sword of truth. This is a time to embody these qualities: think rigorously, communicate directly, and hold to your principles regardless of pressure.',
    reversedMeaningDetailed: 'Intellectual power is being abused — through manipulation, cruelty dressed as logic, or the use of superior knowledge to dominate rather than enlighten. Alternatively, you are allowing others\' intellectual authority to override your own innate wisdom. Reclaim the integrity and compassion that must always temper true intellectual leadership.'
  },

  // ── PENTACLES ──────────────────────────────────────────────────────────────
  {
    id: 64, name: 'Ace of Pentacles', arcana: 'minor', suit: 'pentacles', number: 'Ace', symbol: '💰',
    keywords: ['opportunity', 'prosperity', 'new venture', 'manifestation', 'security'],
    element: 'Earth',
    uprightMeaning: 'A golden opportunity for material manifestation, abundance, and prosperity.',
    reversedMeaning: 'Lost opportunity, lack of planning, or poor financial management.',
    uprightMeaningDetailed: 'The Ace of Pentacles is a divine gift of material opportunity — a new financial venture, business opportunity, or pathway to prosperity is being offered to you now. This is a seed of great potential that, with practical attention and consistent nurturing, can grow into lasting abundance. Plant it wisely and tend it with care.',
    reversedMeaningDetailed: 'A material opportunity has been missed or is being mishandled. Poor financial planning, lack of attention to practical matters, or being unable to recognize a good opportunity when it presents itself is creating limitation. Examine your relationship with money and material resources honestly and address what needs to change.'
  },
  {
    id: 65, name: 'Two of Pentacles', arcana: 'minor', suit: 'pentacles', number: '2', symbol: '🤹',
    keywords: ['multiple priorities', 'time management', 'prioritization', 'adaptability'],
    element: 'Earth',
    uprightMeaning: 'Skillful juggling of multiple priorities and finances with adaptable grace.',
    reversedMeaning: 'Over-committed, disorganized, or unable to maintain balance.',
    uprightMeaningDetailed: 'The Two of Pentacles shows a figure gracefully juggling two pentacles amid the waves of change — maintaining balance through adaptability and skillful management. Multiple demands are pulling on your time and resources. The key is not to drop one for the other but to develop the rhythmic flexibility to keep all important balls in the air with confident grace.',
    reversedMeaningDetailed: 'The juggling act has become too complex and balls are dropping. Over-commitment, poor time management, and financial disorganization are creating overwhelm. It is time to make clear priorities, let some things go, and create a more sustainable structure rather than continuing to spin plates that are beginning to fall.'
  },
  {
    id: 66, name: 'Three of Pentacles', arcana: 'minor', suit: 'pentacles', number: '3', symbol: '🏗️',
    keywords: ['teamwork', 'initial fulfillment', 'collaboration', 'building'],
    element: 'Earth',
    uprightMeaning: 'Collaborative teamwork and skilled craftsmanship build something of lasting value.',
    reversedMeaning: 'Lack of teamwork, disharmony, or misaligned goals in a group.',
    uprightMeaningDetailed: 'The Three of Pentacles is the card of skilled collaboration — the master craftsman working with the architects to bring a magnificent vision into physical reality. Everyone\'s unique expertise is being honored and integrated. This is a time of productive teamwork where the whole is genuinely greater than the sum of its parts. Show up with your full skill and contribute generously.',
    reversedMeaningDetailed: 'Collaboration is breaking down due to ego conflicts, poor communication, or misaligned goals. Individual talents are being squandered rather than integrated into a coherent shared effort. Address the underlying tensions directly and re-establish the shared vision that can realign the group\'s efforts productively.'
  },
  {
    id: 67, name: 'Four of Pentacles', arcana: 'minor', suit: 'pentacles', number: '4', symbol: '💎',
    keywords: ['saving money', 'security', 'conservatism', 'scarcity', 'control'],
    element: 'Earth',
    uprightMeaning: 'Financial security is maintained but attachment to possessions may limit growth.',
    reversedMeaning: 'Over-spending, generosity, or releasing financial fear.',
    uprightMeaningDetailed: 'The Four of Pentacles shows the figure clutching his coins tightly — maintaining financial security but at the cost of freedom and generosity. This card asks you to examine your relationship with financial security: is it grounded in genuine prudence or fear-based hoarding? True security comes not from grasping tightly but from trusting in your ability to create abundance.',
    reversedMeaningDetailed: 'Financial restrictions are loosening and greater generosity is becoming possible. Or the grip of financial fear and hoarding is being recognized for the limitation it creates. Examine where you are holding too tightly to money, possessions, or control, and consider what life-giving generosity might look like in practice.'
  },
  {
    id: 68, name: 'Five of Pentacles', arcana: 'minor', suit: 'pentacles', number: '5', symbol: '❄️',
    keywords: ['financial loss', 'poverty', 'lack mindset', 'isolation', 'worry'],
    element: 'Earth',
    uprightMeaning: 'Financial hardship and material insecurity test your resilience and resourcefulness.',
    reversedMeaning: 'Recovery from financial loss, spiritual poverty, or accepting help.',
    uprightMeaningDetailed: 'The Five of Pentacles depicts two impoverished figures struggling through snow past a warmly lit church window — excluded and suffering. Material hardship is real and demanding attention. But notice: help and warmth are closer than they appear. Seek support, ask for help, and know that this period of lack is temporary. Your resourcefulness will see you through.',
    reversedMeaningDetailed: 'Recovery from financial hardship is underway. Help is being accepted or sought — the pride that prevented asking for assistance is diminishing. Alternatively, material circumstances have improved but inner poverty — a lack mindset, scarcity thinking, or spiritual emptiness — remains to be addressed. True abundance begins within.'
  },
  {
    id: 69, name: 'Six of Pentacles', arcana: 'minor', suit: 'pentacles', number: '6', symbol: '🤲',
    keywords: ['giving', 'receiving', 'sharing', 'generosity', 'charity'],
    element: 'Earth',
    uprightMeaning: 'Generous giving and gracious receiving create a beautiful flow of abundance.',
    reversedMeaning: 'Self-care, unpaid debts, or one-sided giving needs to be addressed.',
    uprightMeaningDetailed: 'The Six of Pentacles portrays the beautiful flow of generosity — resources being shared with those who need them, and the giver experiencing his own prosperity. This card asks you to consider your relationship with both giving and receiving. Are you giving generously from abundance? Are you able to receive graciously when help is offered? True prosperity flows in both directions.',
    reversedMeaningDetailed: 'The flow of generosity has become imbalanced — giving without receiving, strings attached to gifts, or debts unpaid and unacknowledged. Examine where this dynamic exists in your life. Are you giving from depletion? Are you taking without gratitude or reciprocity? Restore the balance between generosity and self-care.'
  },
  {
    id: 70, name: 'Seven of Pentacles', arcana: 'minor', suit: 'pentacles', number: '7', symbol: '🌱',
    keywords: ['long-term view', 'sustainable results', 'perseverance', 'investment'],
    element: 'Earth',
    uprightMeaning: 'Patient investment and long-term effort are beginning to bear fruit.',
    reversedMeaning: 'Work without results, distractions, or lack of long-term planning.',
    uprightMeaningDetailed: 'The Seven of Pentacles shows the farmer pausing to survey his growing crop — the result of months of patient, consistent effort. Significant progress has been made. This is a moment to pause, assess where you are, determine if your efforts are truly aligned with your goals, and recommit to the long-term vision with renewed patience. The harvest is coming — stay the course.',
    reversedMeaningDetailed: 'Effort and investment are not producing the expected returns. Either the approach needs to change, the timeline needs to be extended, or you are working very hard on the wrong things. Take a clear-eyed look at your strategy and make the adjustments needed to ensure that your future effort produces genuine, lasting results.'
  },
  {
    id: 71, name: 'Eight of Pentacles', arcana: 'minor', suit: 'pentacles', number: '8', symbol: '🔨',
    keywords: ['apprenticeship', 'repetitive tasks', 'mastery', 'skill development'],
    element: 'Earth',
    uprightMeaning: 'Dedicated craftsmanship and the pursuit of mastery through focused, repetitive work.',
    reversedMeaning: 'Perfectionism, lack of focus, or no motivation to improve.',
    uprightMeaningDetailed: 'The Eight of Pentacles is the card of the dedicated artisan — heads-down, fully focused, perfecting their craft through patient repetition and improving with each piece. This is a time to commit to excellence in your work, embrace the learning curve with humility, and trust that your consistent dedication is building skills that will reward you greatly.',
    reversedMeaningDetailed: 'The commitment to craft has broken down into perfectionism, distraction, or loss of motivation. Either impossibly high standards are creating paralysis, or lack of focus is preventing the quality of work that mastery requires. Return to the fundamentals — consistent, humble, engaged practice — and release the pressure of perfection.'
  },
  {
    id: 72, name: 'Nine of Pentacles', arcana: 'minor', suit: 'pentacles', number: '9', symbol: '🦚',
    keywords: ['abundance', 'luxury', 'self-sufficiency', 'financial independence'],
    element: 'Earth',
    uprightMeaning: 'Hard-won abundance, financial independence, and elegant self-sufficiency.',
    reversedMeaning: 'Over-investment in work, financial setbacks, or living beyond means.',
    uprightMeaningDetailed: 'The Nine of Pentacles is a magnificent card of earned independence and material elegance. You have worked hard and created genuine abundance — a life of comfort, beauty, and self-reliance. This is a time to genuinely enjoy the fruits of your labor, appreciate the luxury you have created, and recognize your own extraordinary capability and achievement.',
    reversedMeaningDetailed: 'The beautiful independence of the Nine has been compromised — either through financial setbacks, over-dependence on external resources, or sacrificing too much of life\'s richness in pursuit of material success. Examine where the balance between work and enjoyment has tilted too far, and what steps would restore genuine abundance and self-sufficiency.'
  },
  {
    id: 73, name: 'Ten of Pentacles', arcana: 'minor', suit: 'pentacles', number: '10', symbol: '🏰',
    keywords: ['wealth', 'financial security', 'family', 'long-term success', 'contribution'],
    element: 'Earth',
    uprightMeaning: 'Lasting wealth, family legacy, and multi-generational security and fulfillment.',
    reversedMeaning: 'Financial failure, loneliness, or conflict over wealth and inheritance.',
    uprightMeaningDetailed: 'The Ten of Pentacles is the supreme card of material completion — a family enjoying the fruits of generations of wise effort, surrounded by the abundance their lineage created. This speaks of lasting wealth, stable family structures, and a legacy that extends beyond individual achievement. You are building something that will endure and bless those who come after you.',
    reversedMeaningDetailed: 'Family conflicts over money, inheritance disputes, or financial instability threaten the legacy being built. Perhaps the external trappings of wealth are present without the inner richness of genuine family connection and meaning. Examine what truly constitutes lasting wealth — and whether what you are building will stand the test of time.'
  },
  {
    id: 74, name: 'Page of Pentacles', arcana: 'minor', suit: 'pentacles', number: 'Page', symbol: '📚',
    keywords: ['manifestation', 'financial opportunity', 'skill development'],
    element: 'Earth',
    uprightMeaning: 'Practical learning, financial opportunity, and the beginning of material manifestation.',
    reversedMeaning: 'Lack of progress, procrastination, or learn-it-all attitude.',
    uprightMeaningDetailed: 'The Page of Pentacles holds a golden pentacle before him with wonder and focused attention — he is just beginning to learn how to work with material reality. A new financial opportunity, educational pursuit, or practical skill is presenting itself. Approach this learning with the Page\'s grounded curiosity and willingness to start at the beginning.',
    reversedMeaningDetailed: 'Progress on practical matters has stalled due to procrastination, lack of commitment, or the inability to translate learning into real-world application. Good ideas are not becoming concrete action. Examine what is preventing you from taking the practical, consistent steps needed to manifest what you envision.'
  },
  {
    id: 75, name: 'Knight of Pentacles', arcana: 'minor', suit: 'pentacles', number: 'Knight', symbol: '🐂',
    keywords: ['hard work', 'productivity', 'routine', 'conservatism'],
    element: 'Earth',
    uprightMeaning: 'Steady, methodical effort and reliable commitment produce lasting, tangible results.',
    reversedMeaning: 'Self-discipline, boredom, or feeling stuck in routine.',
    uprightMeaningDetailed: 'The Knight of Pentacles is the most reliable figure in the entire court — he moves slowly and deliberately, but he never falters and always delivers. This is a time for sustained, methodical effort, disciplined routine, and practical reliability. The get-rich-quick approach holds no appeal here — only consistent, quality work over time builds what you are seeking.',
    reversedMeaningDetailed: 'The reliable routine has become a rut. Boredom, stagnation, and being stuck in habitual patterns that no longer serve are creating frustration. Or self-discipline has become rigid perfectionism that prevents forward movement. Introduce enough variety to re-ignite motivation while maintaining the steady commitment to practical progress.'
  },
  {
    id: 76, name: 'Queen of Pentacles', arcana: 'minor', suit: 'pentacles', number: 'Queen', symbol: '🌿',
    keywords: ['nurturing', 'practical', 'providing financially', 'a working parent'],
    element: 'Earth',
    uprightMeaning: 'Abundant nurturing, practical wisdom, and providing a stable, beautiful home.',
    reversedMeaning: 'Financial independence, self-care, or work-home imbalance.',
    uprightMeaningDetailed: 'The Queen of Pentacles is the abundant earth mother — she provides generously for all within her care while maintaining her own inner wealth and practical wisdom. Her home is beautiful, her finances well-managed, and her nurturing extends to every living thing. This is a time to tend your material world with loving attention and share your abundance generously.',
    reversedMeaningDetailed: 'The balance between providing for others and nurturing yourself has tipped dangerously. Either smothering others with material provision while neglecting their deeper needs, or depleting yourself financially or energetically in service of others. Restore the balance between generosity and self-sustaining self-care.'
  },
  {
    id: 77, name: 'King of Pentacles', arcana: 'minor', suit: 'pentacles', number: 'King', symbol: '👑',
    keywords: ['abundance', 'prosperity', 'security', 'ambition', 'sensuality'],
    element: 'Earth',
    uprightMeaning: 'Material mastery, abundant prosperity, and the wisdom of grounded, practical leadership.',
    reversedMeaning: 'Financially inept, obsessed with wealth, or stubbornness around material matters.',
    uprightMeaningDetailed: 'The King of Pentacles sits on his throne of abundance — he has mastered the material world through patient effort, practical wisdom, and disciplined management of resources. He is generous with what he has built, understanding that true wealth means nothing if not shared. This is a time to lead with practical wisdom, manage resources with skill, and create lasting abundance for yourself and those in your care.',
    reversedMeaningDetailed: 'Material success has become an obsession that crowds out life\'s richer dimensions. Or financial mismanagement and stubbornness around practical matters are undermining the security that has been built. Examine your relationship with wealth, success, and material security — and whether these pursuits are serving your fullest humanity or diminishing it.'
  }
]

export const SPREAD_POSITIONS = {
  celtic: [
    { id: 0, label: 'Present', description: 'The current situation or the querent themselves' },
    { id: 1, label: 'Challenge', description: 'What crosses or challenges you right now' },
    { id: 2, label: 'Past', description: 'The recent past influencing the situation' },
    { id: 3, label: 'Future', description: 'What is coming in the near future' },
    { id: 4, label: 'Above', description: 'Your conscious goal or ideal outcome' },
    { id: 5, label: 'Below', description: 'Unconscious influences and hidden foundation' },
    { id: 6, label: 'Advice', description: 'The recommended approach to take' },
    { id: 7, label: 'External', description: 'Outside influences and how others see you' },
    { id: 8, label: 'Hopes & Fears', description: 'Your deepest hopes and fears about the outcome' },
    { id: 9, label: 'Outcome', description: 'The final outcome if current path continues' },
  ]
}

export const SITUATION_SPREADS = [
  {
    id: 'love',
    title: 'Love & Relationships',
    icon: '💞',
    description: 'What the cards reveal about your heart',
    positions: ['The current energy in your love life', 'What is challenging your heart', 'What guides you forward in love']
  },
  {
    id: 'career',
    title: 'Career & Purpose',
    icon: '🌟',
    description: 'Your path, work, and calling',
    positions: ['Where you stand in your career now', 'The obstacle or opportunity before you', 'The direction your purpose calls you toward']
  },
  {
    id: 'obstacle',
    title: 'Obstacle & Shadow',
    icon: '🌑',
    description: 'What blocks you and how to overcome it',
    positions: ['The nature of what stands in your way', 'The hidden root of this obstacle', 'The key to moving through and beyond it']
  },
  {
    id: 'spiritual',
    title: 'Spiritual Growth',
    icon: '✨',
    description: 'Your soul\'s evolution and higher path',
    positions: ['Where your spirit is right now', 'What your soul is learning', 'The spiritual gift being awakened in you']
  },
  {
    id: 'future',
    title: 'Near Future',
    icon: '🔮',
    description: 'What the coming months hold',
    positions: ['What is ending or releasing', 'What is beginning or arriving', 'The overarching energy of your near future']
  },
  {
    id: 'health',
    title: 'Wellbeing & Vitality',
    icon: '🌿',
    description: 'Mind, body, and spirit in balance',
    positions: ['The current state of your overall wellbeing', 'What your body or mind is asking for', 'The path toward greater vitality and wholeness']
  }
]