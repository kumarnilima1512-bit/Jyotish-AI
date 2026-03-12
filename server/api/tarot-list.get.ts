// server/api/tarot-list.get.ts
import { fetchTarotReadings } from '~/utils/notion'

export default defineEventHandler(async () => {
  try {
    const readings = await fetchTarotReadings()
    return { readings }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
})