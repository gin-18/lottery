import { defineStore } from 'pinia'
import {
  countRangeInOneCode,
  generateIntervals,
  generateIntervalRanges,
} from '@/assets/js/range_analyze'

export const useIntervalCountStore = defineStore('interval_count', {
  state: () => ({
    ranges: [],
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
      this.ranges = generateIntervalRanges()
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
      const intervals = generateIntervals()
      this.result = countRangeInOneCode(
        this.currentCode,
        this.ranges,
        intervals,
      )
    },
  },
})
