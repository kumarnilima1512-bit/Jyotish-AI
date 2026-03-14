// Rider-Waite-Smith Tarot — Public Domain
// Images from Wikimedia Commons (CC0 / Public Domain)
// Original 1909 deck by Pamela Colman Smith & A.E. Waite

const WM = 'https://upload.wikimedia.org/wikipedia/commons'

export const TAROT_IMAGES: Record<number, string> = {
  // ── MAJOR ARCANA ──
  0:  `${WM}/9/90/RWS_Tarot_00_Fool.jpg`,
  1:  `${WM}/d/de/RWS_Tarot_01_Magician.jpg`,
  2:  `${WM}/8/88/RWS_Tarot_02_High_Priestess.jpg`,
  3:  `${WM}/d/d2/RWS_Tarot_03_Empress.jpg`,
  4:  `${WM}/c/c3/RWS_Tarot_04_Emperor.jpg`,
  5:  `${WM}/8/8d/RWS_Tarot_05_Hierophant.jpg`,
  6:  `${WM}/d/db/RWS_Tarot_06_Lovers.jpg`,
  7:  `${WM}/9/9b/RWS_Tarot_07_Chariot.jpg`,
  8:  `${WM}/f/f5/RWS_Tarot_08_Strength.jpg`,
  9:  `${WM}/4/4d/RWS_Tarot_09_Hermit.jpg`,
  10: `${WM}/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg`,
  11: `${WM}/e/e0/RWS_Tarot_11_Justice.jpg`,
  12: `${WM}/2/2b/RWS_Tarot_12_Hanged_Man.jpg`,
  13: `${WM}/d/d7/RWS_Tarot_13_Death.jpg`,
  14: `${WM}/f/f8/RWS_Tarot_14_Temperance.jpg`,
  15: `${WM}/5/55/RWS_Tarot_15_Devil.jpg`,
  16: `${WM}/5/53/RWS_Tarot_16_Tower.jpg`,
  17: `${WM}/d/db/RWS_Tarot_17_Star.jpg`,
  18: `${WM}/7/7f/RWS_Tarot_18_Moon.jpg`,
  19: `${WM}/1/17/RWS_Tarot_19_Sun.jpg`,
  20: `${WM}/d/dd/RWS_Tarot_20_Judgement.jpg`,
  21: `${WM}/f/ff/RWS_Tarot_21_World.jpg`,

  // ── WANDS ──
  22: `${WM}/1/11/Wands01.jpg`,
  23: `${WM}/0/0f/Wands02.jpg`,
  24: `${WM}/f/ff/Wands03.jpg`,
  25: `${WM}/a/a4/Wands04.jpg`,
  26: `${WM}/9/9d/Wands05.jpg`,
  27: `${WM}/3/3b/Wands06.jpg`,
  28: `${WM}/e/e4/Wands07.jpg`,
  29: `${WM}/6/6b/Wands08.jpg`,
  30: `${WM}/4/4d/Tarot_Nine_of_Wands.jpg`,
  31: `${WM}/0/0b/Wands10.jpg`,
  32: `${WM}/4/4d/Wands11.jpg`,
  33: `${WM}/1/16/Wands12.jpg`,
  34: `${WM}/0/0d/Wands13.jpg`,
  35: `${WM}/c/ce/Wands14.jpg`,

  // ── CUPS ──
  36: `${WM}/3/36/Cups01.jpg`,
  37: `${WM}/f/f8/Cups02.jpg`,
  38: `${WM}/7/7f/Cups03.jpg`,
  39: `${WM}/3/35/Cups04.jpg`,
  40: `${WM}/d/d7/Cups05.jpg`,
  41: `${WM}/1/17/Cups06.jpg`,
  42: `${WM}/a/ae/Cups07.jpg`,
  43: `${WM}/6/60/Cups08.jpg`,
  44: `${WM}/2/24/Cups09.jpg`,
  45: `${WM}/8/84/Cups10.jpg`,
  46: `${WM}/a/ad/Cups11.jpg`,
  47: `${WM}/f/fa/Cups12.jpg`,
  48: `${WM}/6/62/Cups13.jpg`,
  49: `${WM}/0/04/Cups14.jpg`,

  // ── SWORDS ──
  50: `${WM}/1/1a/Swords01.jpg`,
  51: `${WM}/d/d5/Swords02.jpg`,
  52: `${WM}/0/02/Swords03.jpg`,
  53: `${WM}/b/bf/Swords04.jpg`,
  54: `${WM}/2/23/Swords05.jpg`,
  55: `${WM}/2/29/Swords06.jpg`,
  56: `${WM}/3/34/Swords07.jpg`,
  57: `${WM}/a/a7/Swords08.jpg`,
  58: `${WM}/2/2f/Swords09.jpg`,
  59: `${WM}/d/d4/Swords10.jpg`,
  60: `${WM}/4/4c/Swords11.jpg`,
  61: `${WM}/b/b0/Swords12.jpg`,
  62: `${WM}/d/d4/Swords13.jpg`,
  63: `${WM}/3/33/Swords14.jpg`,

  // ── PENTACLES ──
  64: `${WM}/f/fd/Pents01.jpg`,
  65: `${WM}/9/9f/Pents02.jpg`,
  66: `${WM}/4/42/Pents03.jpg`,
  67: `${WM}/9/9e/Pents04.jpg`,
  68: `${WM}/9/96/Pents05.jpg`,
  69: `${WM}/a/a6/Pents06.jpg`,
  70: `${WM}/6/6a/Pents07.jpg`,
  71: `${WM}/4/49/Pents08.jpg`,
  72: `${WM}/f/f0/Pents09.jpg`,
  73: `${WM}/4/42/Pents10.jpg`,
  74: `${WM}/e/ec/Pents11.jpg`,
  75: `${WM}/d/d5/Pents12.jpg`,
  76: `${WM}/8/88/Pents13.jpg`,
  77: `${WM}/1/1c/Pents14.jpg`,
}

export function getCardImage(cardId: number): string {
  return TAROT_IMAGES[cardId] ?? TAROT_IMAGES[0]!
}