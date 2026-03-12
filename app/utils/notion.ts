// server/utils/notion.ts

const NOTION_VERSION = '2022-06-28'

function notionHeaders() {
  const token = useRuntimeConfig().notionToken
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  }
}

// ── Number Meanings ───────────────────────────────────────────────────────────

export async function fetchNumberMeaning(number: number) {
  const dbId = useRuntimeConfig().notionNumberMeaningsDb

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        property: 'Number',
        title: { equals: String(number) }
      },
      page_size: 1,
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch number meaning')
  const data = await res.json()
  if (!data.results.length) return null

  const p = data.results[0].properties
  return {
    number,
    name:        p['Name']?.rich_text?.[0]?.text?.content || '',
    keywords:    p['Keywords']?.rich_text?.[0]?.text?.content || '',
    color:       p['Color']?.rich_text?.[0]?.text?.content || '#a78bfa',
    traits:      p['Traits']?.multi_select?.map((s: any) => s.name) || [],
    personality: p['Personality']?.rich_text?.[0]?.text?.content || '',
    career:      p['Career']?.rich_text?.[0]?.text?.content || '',
    love:        p['Love']?.rich_text?.[0]?.text?.content || '',
    luckyGem:    p['Lucky Gem']?.rich_text?.[0]?.text?.content || '',
    luckyColor:  p['Lucky Color']?.rich_text?.[0]?.text?.content || '',
    luckyDay:    p['Lucky Day']?.rich_text?.[0]?.text?.content || '',
  }
}

export async function fetchMultipleNumberMeanings(numbers: number[]) {
  const unique: number[] = [...new Set(numbers)]
  const results = await Promise.all(unique.map((n: number) => fetchNumberMeaning(n)))
  const map: Record<number, any> = {}
  for (let i = 0; i < results.length; i++) {
    const m = results[i]
    const key = unique[i] as number
    if (m) map[key] = m
  }
  return map
}

// ── Numerology Save ───────────────────────────────────────────────────────────

export async function saveNumerologyReading(data: {
  name: string
  fullBirthName: string
  dateOfBirth: string
  mulank: number
  bhagyank: number
  destiny: number
  soulUrge: number
  personality: number
  maturity: number
  masterNumbers: number[]
  personalYear: number
  luckyGem: string
  luckyColor: string
}) {
  const dbId = useRuntimeConfig().notionNumerologyDb

  const body = {
    parent: { database_id: dbId },
    properties: {
      'Name':            { title: [{ text: { content: data.name } }] },
      'Full Birth Name': { rich_text: [{ text: { content: data.fullBirthName } }] },
      'Date of Birth':   { date: { start: data.dateOfBirth } },
      'Mulank':          { number: data.mulank },
      'Bhagyank':        { number: data.bhagyank },
      'Destiny':         { number: data.destiny },
      'Soul Urge':       { number: data.soulUrge },
      'Personality':     { number: data.maturity },
      'Maturity':        { number: data.maturity },
      'Master Numbers':  { multi_select: data.masterNumbers.map(n => ({ name: String(n) })) },
      'Personal Year':   { number: data.personalYear },
      'Lucky Gem':       { rich_text: [{ text: { content: data.luckyGem } }] },
      'Lucky Color':     { rich_text: [{ text: { content: data.luckyColor } }] },
      'Reading Date':    { date: { start: new Date().toISOString().slice(0, 10) } },
    }
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion save failed: ${err}`)
  }
  return res.json()
}

export async function fetchNumerologyReadings(limit = 20) {
  const dbId = useRuntimeConfig().notionNumerologyDb

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      sorts: [{ property: 'Reading Date', direction: 'descending' }],
      page_size: limit,
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch numerology readings')
  const data = await res.json()

  return data.results.map((page: any) => {
    const p = page.properties
    return {
      id:            page.id,
      name:          p['Name']?.title?.[0]?.text?.content || '',
      fullBirthName: p['Full Birth Name']?.rich_text?.[0]?.text?.content || '',
      dateOfBirth:   p['Date of Birth']?.date?.start || '',
      mulank:        p['Mulank']?.number,
      bhagyank:      p['Bhagyank']?.number,
      destiny:       p['Destiny']?.number,
      soulUrge:      p['Soul Urge']?.number,
      personality:   p['Personality']?.number,
      maturity:      p['Maturity']?.number,
      masterNumbers: p['Master Numbers']?.multi_select?.map((s: any) => Number(s.name)) || [],
      personalYear:  p['Personal Year']?.number,
      luckyGem:      p['Lucky Gem']?.rich_text?.[0]?.text?.content || '',
      luckyColor:    p['Lucky Color']?.rich_text?.[0]?.text?.content || '',
      readingDate:   p['Reading Date']?.date?.start || '',
    }
  })
}

// ── Tarot ─────────────────────────────────────────────────────────────────────

export async function saveTarotReading(data: {
  seekerName: string
  gender: string
  chosenCards: string
  loveSpread: string
  careerSpread: string
  obstacleSpread: string
  spiritualSpread: string
  futureSpread: string
  wellbeingSpread: string
  fullReading: string
}) {
  const dbId = useRuntimeConfig().notionTarotDb

  const body = {
    parent: { database_id: dbId },
    properties: {
      'Reading Title':    { title: [{ text: { content: `${data.seekerName} · ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}` } }] },
      'Seeker Name':      { rich_text: [{ text: { content: data.seekerName } }] },
      'Gender':           { select: { name: data.gender } },
      'Reading Date':     { date: { start: new Date().toISOString().slice(0, 10) } },
      '10 Chosen Cards':  { rich_text: [{ text: { content: data.chosenCards } }] },
      'Love Spread':      { rich_text: [{ text: { content: data.loveSpread } }] },
      'Career Spread':    { rich_text: [{ text: { content: data.careerSpread } }] },
      'Obstacle Spread':  { rich_text: [{ text: { content: data.obstacleSpread } }] },
      'Spiritual Spread': { rich_text: [{ text: { content: data.spiritualSpread } }] },
      'Future Spread':    { rich_text: [{ text: { content: data.futureSpread } }] },
      'Wellbeing Spread': { rich_text: [{ text: { content: data.wellbeingSpread } }] },
      'Full Reading':     { rich_text: [{ text: { content: data.fullReading.slice(0, 2000) } }] },
      'Status':           { select: { name: 'Complete' } },
    }
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion save failed: ${err}`)
  }
  return res.json()
}

export async function fetchTarotReadings(limit = 20) {
  const dbId = useRuntimeConfig().notionTarotDb

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      sorts: [{ property: 'Reading Date', direction: 'descending' }],
      page_size: limit,
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch tarot readings')
  const data = await res.json()

  return data.results.map((page: any) => {
    const p = page.properties
    return {
      id:           page.id,
      title:        p['Reading Title']?.title?.[0]?.text?.content || '',
      seekerName:   p['Seeker Name']?.rich_text?.[0]?.text?.content || '',
      gender:       p['Gender']?.select?.name || '',
      readingDate:  p['Reading Date']?.date?.start || '',
      chosenCards:  p['10 Chosen Cards']?.rich_text?.[0]?.text?.content || '',
      fullReading:  p['Full Reading']?.rich_text?.[0]?.text?.content || '',
      status:       p['Status']?.select?.name || '',
    }
  })
}