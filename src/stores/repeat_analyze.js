import { defineStore } from 'pinia'
import { formatData, findDuplicates } from '@/assets/js/count'

export const useRepeatAnalyzeStore = defineStore('repeat_analyze', {
  state: () => ({
    startData: {},
    currentData: {},
    currentDataIndex: 0,
    codeStep: 2,
    resultData: {},
  }),
  actions: {
    setStartData(data) {
      this.startData = data[this.codeStep - 1]
    },
    setCurrentData(data) {
      this.currentData = data[this.currentDataIndex]
    },
    setResultData() {
      const startDataNumbers = formatData(this.startData).balls
      const currentDataNumbers = formatData(this.currentData).balls
      const resultData = findDuplicates(startDataNumbers, currentDataNumbers)
      this.resultData = resultData
    },
    addCurrentDataIndex() {
      this.currentDataIndex += 1
    },
    reduceCurrentDataIndex() {
      this.currentDataIndex -= 1
    },
  },
})
