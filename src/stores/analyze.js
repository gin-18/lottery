import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAnalyzeStore = defineStore('analyze', () => {
  const showAnalyzeSetting = ref(false)

  return {
    showAnalyzeSetting
  }
})
