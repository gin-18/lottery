import { defineStore } from 'pinia'
import { getLatestData } from '@/assets/js/request'

export const useHomeData = defineStore('home_data', {
  state: () => ({
    cachedData: null,
    error: null,
  }),
  actions: {
    async fetchLatestData() {
      if (this.cachedData) return

      try {
        const latestData = await getLatestData()
        this.cachedData = latestData
      } catch (error) {
        this.error = error
      }
    },
  },
})
