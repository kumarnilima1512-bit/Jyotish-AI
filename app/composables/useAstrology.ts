import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useChartStore } from '~/stores/chartStore'
import {
  calculateChart,
  getPlanetDignity,
  PLANET_SYMBOLS,
  PLANET_COLORS,
  type ChartResult,
  type PlanetPosition,
  type EnrichedPlanetPosition,
  type PlanetName,
  type Dasha
} from '~/utils/astrology'

export interface FormData {
  name: string
  birthDate: string
  birthTime: string
  lat: number
  lon: number
  tzOffset: number
  locationName: string
}

export interface UseAstrologyReturn {
  formData: Ref<FormData>
  chart: Ref<ChartResult | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  generateChart: () => void
  enrichedPositions: ComputedRef<Record<PlanetName, EnrichedPlanetPosition>>
  currentDasha: ComputedRef<Dasha | undefined>
}

export function useAstrology(): UseAstrologyReturn {
  const router     = useRouter()
  const chartStore = useChartStore()

  const formData = ref<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    lat: 28.6139,
    lon: 77.2090,
    tzOffset: 5.5,
    locationName: 'New Delhi, India'
  })

  const chart   = ref<ChartResult | null>(null)
  const loading = ref<boolean>(false)
  const error   = ref<string | null>(null)

  const generateChart = (): void => {
    if (!formData.value.birthDate || !formData.value.birthTime) {
      error.value = 'Please provide birth date and time.'
      return
    }
    loading.value = true
    error.value   = null

    setTimeout(() => {
      try {
        const result = calculateChart(
          formData.value.birthDate,
          formData.value.birthTime,
          formData.value.lat,
          formData.value.lon,
          formData.value.tzOffset
        )
        chart.value = result
        // Save to localStorage and store
        if (import.meta.client) {
          localStorage.setItem('jyotish_chart', JSON.stringify(result))
          localStorage.setItem('jyotish_form', JSON.stringify({ ...formData.value }))
        }
        chartStore.setChart(result, { ...formData.value })
        router.push('/birthchart')
      } catch (e) {
        error.value = 'Error calculating chart: ' + (e instanceof Error ? e.message : String(e))
      } finally {
        loading.value = false
      }
    }, 500)
  }

  const enrichedPositions = computed<Record<PlanetName, EnrichedPlanetPosition>>(() => {
    if (!chart.value) return {} as Record<PlanetName, EnrichedPlanetPosition>
    const result = {} as Record<PlanetName, EnrichedPlanetPosition>
    for (const [planet, planetData] of Object.entries(chart.value.positions) as [PlanetName, PlanetPosition][]) {
      result[planet] = {
        ...planetData,
        symbol: PLANET_SYMBOLS[planet],
        color:  PLANET_COLORS[planet],
        dignity: getPlanetDignity(planet, planetData.sign)
      }
    }
    return result
  })

  const currentDasha = computed<Dasha | undefined>(() => {
    return chart.value?.dashas.find((d) => d.isActive)
  })

  return { formData, chart, loading, error, generateChart, enrichedPositions, currentDasha }
}