// server/api/numerology-list.get.ts
import { fetchNumerologyReadings } from '~/utils/notion'

export default defineEventHandler(async () => {
  try {
    const readings = await fetchNumerologyReadings()
    return { readings }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message })
  }
})