import { defineStore } from 'pinia'
import type { ChartResult } from '~/utils/astrology'
import type { FormData } from '~/composables/useAstrology'

export const useChartStore = defineStore('chart', {
  state: () => ({
    chart: null as ChartResult | null,
    formData: null as FormData | null,
    astrologer: null as 'male' | 'female' | null,
  }),
  actions: {
    setChart(chart: ChartResult, formData: FormData) {
      this.chart = chart
      this.formData = formData
    },
    setAstrologer(type: 'male' | 'female') {
      this.astrologer = type
    },
    clear() {
      this.chart = null
      this.formData = null
      this.astrologer = null
    }
  }
})