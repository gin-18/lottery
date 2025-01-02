import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/utils'

export const useRepeatCountStore = defineStore('repeat_count', {
  state: () => ({
    startData: {},
    currentData: {},
    currentDataIndex: 0,
    repeatData: {},
    description:
      '这部分只统计当前期次到前一期次，重复出现的号码个数，以及重复出现的号码。',
  }),
  actions: {
    setStartData(data) {
      this.startData = data[this.currentDataIndex + 1]
    },
    setCurrentData(data) {
      this.currentData = data[this.currentDataIndex]
    },
    countRepeatNumber() {
      const startDataNumbers = formatData(this.startData).balls
      const currentDataNumbers = formatData(this.currentData).balls
      const repeatData = this.findDuplicates(
        startDataNumbers,
        currentDataNumbers,
      )
      this.repeatData = repeatData
    },
    reduceCurrentCode() {
      this.currentDataIndex += 1
    },
    addCurrentCode() {
      if (this.currentDataIndex <= 0) return
      this.currentDataIndex -= 1
    },
    // 返回两个数组的交集
    findDuplicates(arr1, arr2) {
      return arr1.filter((item) => arr2.includes(item))
    },
  },
})
