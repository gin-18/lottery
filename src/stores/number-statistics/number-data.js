import { defineStore } from 'pinia'
import { getDataByNum } from '@/assets/js/request'

export const useNumberDataStore = defineStore('number_data', {
  state: () => ({
    rawDataArray: [],
    error: null,
  }),
  actions: {
    async initData() {
      try {
        const datas = await getDataByNum(150)
        this.rawDataArray.push(...datas.data.list)
      } catch (error) {
        this.error = error
      }
    },
  },
})
