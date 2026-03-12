// app/server/api/number-meanings.post.ts

export default defineEventHandler(async (event) => {
  const body    = await readBody(event)
  const numbers: number[] = body.numbers || []

  const config = useRuntimeConfig()
  const token  = config.notionToken as string
  const dbId   = config.notionNumberMeaningsDb as string

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw createError({ statusCode: 500, message: `Notion error: ${err}` })
    }

    const data = await res.json()
    const meanings: Record<number, any> = {}

    // Joins all rich_text blocks — handles Notion's 2000 char per block limit
    const getText = (prop: any): string =>
      prop?.rich_text?.map((b: any) => b.text?.content || b.plain_text || '').join('') || ''

    for (const page of data.results) {
      const p      = page.properties
      const numStr = p['Number']?.title?.[0]?.plain_text || p['Number']?.title?.[0]?.text?.content || ''
      const num    = parseInt(numStr)

      if (!isNaN(num) && numbers.includes(num)) {
        meanings[num] = {
          number:      num,
          name:        getText(p['Name']),
          keywords:    getText(p['Keywords']),
          color:       getText(p['Color']) || '#a78bfa',
          traits:      p['Traits']?.multi_select?.map((s: any) => s.name) || [],
          personality: getText(p['Personality']),
          career:      getText(p['Career']),
          love:        getText(p['Love']),
          bhagyank:    getText(p['Bhagyank']),
          luckyGem:    getText(p['Lucky Gem']),
          luckyColor:  getText(p['Lucky Color']),
          luckyDay:    getText(p['Lucky Day']),
        }
      }
    }

    return { meanings }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
})