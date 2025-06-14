import { defineStore } from 'pinia'
import { getDataByNum } from '@/assets/js/request'

export const useTailDataStore = defineStore('tail_data', {
  state: () => ({
    rawDataArray: [],
    error: null,
  }),
  actions: {
    async initData() {
      try {
        const datas = await getDataByNum(100)
        this.rawDataArray.push(...datas.data.list)
      } catch (error) {
        this.error = error
      }
    },
  },
})
