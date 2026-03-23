import { defineEventHandler, readBody, createError } from 'h3'

interface Message { role: 'user' | 'assistant'; content: string }

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {
    astrologer: 'male' | 'female'
    userInfo: Record<string, string>
    history: Message[]
    latestMessage: string
  }

  const apiKey = process.env.GEMINI_API_KEY ?? ''
  if (!apiKey) throw createError({ statusCode: 500, statusMessage: 'API key not configured' })

  const isMale = body.astrologer === 'male'
  const info = body.userInfo
  const hasAllInfo = info.name && info.gender && info.dob && info.time && info.place

  const persona = isMale
    ? `You are Pandit Arjun, a deeply knowledgeable traditional Vedic astrologer. You speak with warmth and authority. You use occasional Sanskrit terms (always briefly explained). You give grounded, specific, practical Vedic readings — referencing Lagna, planetary positions, Nakshatras, and Dasha periods. When asked for remedies, suggest specific Vedic remedies: mantras, gemstones, fasting days, charity, colors, directions.`
    : `You are Devi Saraswati, an intuitive and spiritually gifted female Vedic astrologer. You speak with nurturing warmth and poetic depth. You focus on Nakshatra energy, soul purpose, relationships, karma, and spiritual path. When asked for remedies, suggest goddess worship, meditation practices, sacred colors, and healing rituals.`

  const collectedInfo = Object.keys(info).length > 0
    ? `Collected birth details:\n${Object.entries(info).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`
    : 'No birth details collected yet.'

  const conversationHistory = body.history.slice(-10)
    .map(m => `${m.role === 'user' ? 'User' : 'Astrologer'}: ${m.content}`)
    .join('\n\n')

  let instructions = ''

  if (!hasAllInfo) {
    instructions = `The user has just replied. Parse their message carefully and extract any birth details they provided (name, gender, date of birth, time of birth, place of birth).

If they have provided ALL 5 details in this message, immediately:
1. Acknowledge their details warmly
2. Begin their Vedic reading right away — give a COMPLETE and DETAILED reading covering: Lagna sign & its meaning, Moon sign & Nakshatra deep analysis, current Dasha period & what it means for them, key personality traits, strengths & challenges, and important predictions for this period
3. Do NOT cut your response short — complete every section fully
4. Then invite them to ask anything specific

If some details are missing, acknowledge what they gave and politely ask only for what is still missing — all in one message.

At the END of your reply, always output on a new line:
UPDATED_INFO:{"name":"...","gender":"...","dob":"...","time":"...","place":"..."}
Only include fields that you now know. Leave unknown fields as empty string "".`
  } else {
    instructions = `You have all the birth details. The native's info: ${JSON.stringify(info)}

Now answer the user's latest question as a Vedic astrologer. Be specific, insightful, and reference their actual birth data. Keep responses 3-6 sentences unless detailed analysis is requested.

Topics you can cover: Lagna & rising sign, Moon sign & Nakshatra, planetary strengths/weaknesses, current Dasha period & its effects, career/finances, love & relationships, health, foreign travel, spiritual path, Vedic remedies.`
  }

  const prompt = `${persona}

${collectedInfo}

${instructions}

Conversation so far:
${conversationHistory}

User: ${body.latestMessage}

Astrologer:`

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 4000 },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw createError({ statusCode: 500, statusMessage: `Gemini error: ${err.slice(0, 150)}` })
  }

  const data = await res.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>
  }

  let fullText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''

  // Extract UPDATED_INFO if present
  let updatedInfo: Record<string, string> = {}
  const match = fullText.match(/UPDATED_INFO:(\{[^}]+\})/)
  if (match?.[1]) {
    try {
      updatedInfo = JSON.parse(match[1])
      fullText = fullText.replace(/\nUPDATED_INFO:\{[^}]+\}/, '').trim()
    } catch { /* ignore */ }
  }

  // Merge with existing info, ignore empty strings
  const merged: Record<string, string> = {}
  for (const [k, v] of Object.entries(updatedInfo)) {
    if (v && v.trim()) merged[k] = v.trim()
  }

  return { reply: fullText, updatedInfo: merged }
})