export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt } = body

  if (!prompt) {
    throw createError({ statusCode: 400, message: 'Prompt is required' })
  }

  const apiKey = useRuntimeConfig().openaiApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'API key not configured' })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: 'You are a master Tarot reader with 30 years of experience in Rider-Waite-Smith symbolism and Jungian depth psychology. You give profound, deeply personal, and accurate readings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw createError({ statusCode: response.status, message: err })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    return { reading: text }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to generate reading',
    })
  }
})