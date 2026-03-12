// server/api/tarot-save.post.ts
import { saveTarotReading } from '~/utils/notion'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const page = await saveTarotReading(body)
    return { success: true, id: page.id }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
})