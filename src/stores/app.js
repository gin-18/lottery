import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(null)

  return {
    isDark,
  }
})
