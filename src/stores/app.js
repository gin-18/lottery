import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(null)
  const dataList = ref([])

  return {
    isDark,
    dataList,
  }
})
