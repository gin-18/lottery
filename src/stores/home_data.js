import { defineStore } from 'pinia'
import { getLatestData } from '@/assets/js/request'

export const useHomeData = defineStore('home_data', {
  state: () => ({
    isLoading: false,
    cachedData: null,
    error: null,
  }),
  actions: {
    async fetchLatestData() {
      if (this.cachedData || this.isLoading) return

      try {
        const latestData = await getLatestData()
        this.isLoading = true
        this.cachedData = latestData
      } catch (error) {
        this.error = error
      } finally {
        this.isLoading = false
      }
    },
  },
})
