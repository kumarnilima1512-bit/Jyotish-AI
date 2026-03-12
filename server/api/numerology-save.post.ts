// server/api/numerology-save.post.ts
import { saveNumerologyReading } from '~/utils/notion'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const page = await saveNumerologyReading(body)
    return { success: true, id: page.id }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
})