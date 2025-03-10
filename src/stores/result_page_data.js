import { defineStore } from 'pinia'
import { getDataByNum } from '@/assets/js/request'

export const useResultDataStore = defineStore('result_data', {
  state: () => ({
    rawDataArray: [],
    resultList: [],
    codeSteps: [15, 30, 50, 100],
    currentCodeStep: 15,
    error: null,
  }),
  actions: {
    async initData() {
      try {
        const datas = await getDataByNum(100)
        this.rawDataArray.push(...datas.data.list)
        this.setResultList()
      } catch (error) {
        this.error = error
      }
    },
    setResultList() {
      if (this.resultList.length) {
        this.resultList.length = 0
      }
      const codeStepDatas = this.rawDataArray.slice(0, this.currentCodeStep)
      this.resultList.push(...codeStepDatas)
    },
    changeCodeStep(codeStep) {
      this.currentCodeStep = codeStep
      this.setResultList()
    },
  },
})
