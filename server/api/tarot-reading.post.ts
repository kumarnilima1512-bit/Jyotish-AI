export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt } = body

  if (!prompt) {
    throw createError({ statusCode: 400, message: 'Prompt is required' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey as string
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Gemini API key not configured' })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.9,
          },
          systemInstruction: {
            parts: [{
              text: 'You are a master Tarot reader with 30 years of experience in Rider-Waite-Smith symbolism and Jungian depth psychology. You give profound, deeply personal, and accurate readings.'
            }]
          }
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw createError({ statusCode: response.status, message: err })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return { reading: text }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to generate reading',
    })
  }
})