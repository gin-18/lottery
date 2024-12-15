import { defineStore } from 'pinia'
import { formatData, findDuplicates } from '@/assets/js/count'

export const useRepeatAnalyzeStore = defineStore('repeat_analyze', {
  state: () => ({
    startData: {},
    currentData: {},
    currentDataIndex: 0,
    resultData: {},
  }),
  actions: {
    setStartData(data) {
      this.startData = data[this.currentDataIndex + 1]
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
    reduceCurrentCode() {
      this.currentDataIndex += 1
    },
    addCurrentCode() {
      if (this.currentDataIndex <= 0) return
      this.currentDataIndex -= 1
    },
  },
})
