import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/utils'

export const useRepeatCountStore = defineStore('repeat_count', {
  state: () => ({
    startCode: {},
    currentCode: {},
    currentCodeIndex: 0,
    result: {},
    previousButtonDisable: false,
    nextButtonDisable: true,
    description:
      '这部分只统计当前期次到前一期次，重复出现的号码个数，以及重复出现的号码。',
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
      this.startCode = rawDataArray[this.currentCodeIndex + 1]
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
    countRepeatNumber() {
      const startCodeNumbers = formatData(this.startCode).balls
      const currentCodeNumbers = formatData(this.currentCode).balls
      this.result = this.findDuplicates(startCodeNumbers, currentCodeNumbers)
    },
    findDuplicates(arr1, arr2) {
      return arr1.filter((item) => arr2.includes(item))
    },
  },
})
