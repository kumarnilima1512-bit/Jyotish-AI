import { defineStore } from 'pinia'
import type { ChartResult } from '~/utils/astrology'
import type { FormData } from '~/composables/useAstrology'

export const useChartStore = defineStore('chart', {
  state: () => ({
    chart: null as ChartResult | null,
    formData: null as FormData | null,
  }),
  actions: {
    setChart(chart: ChartResult, formData: FormData) {
      this.chart = chart
      this.formData = formData
    },
    clear() {
      this.chart = null
      this.formData = null
    }
  }
})