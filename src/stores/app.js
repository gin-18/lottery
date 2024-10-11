import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDataByNum } from '@/assets/js/request.js'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(null)
  const dataList = ref([])

  async function getData() {
    const res = await getDataByNum(100)
    dataList.value = res.data.list
  }

  getData()

  return {
    isDark,
    dataList,
  }
})
