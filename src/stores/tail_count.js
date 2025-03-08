import { defineStore } from 'pinia'
import {
  countRangeInOneCode,
  generateTailRanges,
  generateTails,
} from '@/assets/js/range_analyze'

export const useTailCountStore = defineStore('tail_count', {
  state: () => ({
    ranges: [],
    currentCode: {},
    result: {},
    currentCodeIndex: 0,
    previousButtonDisable: false,
    nextButtonDisable: true,
    description: '这部分用于统计某一期次各个尾数号码出现的次数。',
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
      this.ranges = generateTailRanges()
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
      const tails = generateTails()
      this.result = countRangeInOneCode(this.currentCode, this.ranges, tails)
    },
  },
})
