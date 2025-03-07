import { defineStore } from 'pinia'
import { countRangeInOneCode, generateRanges } from '@/assets/js/interval'

export const useIntervalCountStore = defineStore('interval_count', {
  state: () => ({
    intervals: [],
    currentCode: {},
    result: {},
    currentCodeIndex: 0,
    previousButtonDisable: false,
    nextButtonDisable: true,
  }),
  actions: {
    goToPreviousCode(rawDataArray) {
      if (this.currentCodeIndex >= rawDataArray.length - 1) return
      this.currentCodeIndex += 1
    },
    goToNextCode() {
      if (this.currentCodeIndex <= 0) return
      this.currentCodeIndex -= 1
    },
    initData(rawDataArray) {
      this.intervals = generateRanges()
      this.currentCode = rawDataArray[this.currentCodeIndex]

      if (this.currentCodeIndex >= rawDataArray.length - 1) {
        this.previousButtonDisable = true
      } else {
        this.previousButtonDisable = false
      }

      if (this.currentCodeIndex <= 0) {
        this.nextButtonDisable = true
      } else {
        this.nextButtonDisable = false
      }
    },
    countRangeInOneCode() {
      this.result = countRangeInOneCode(this.currentCode)
    },
  },
})
