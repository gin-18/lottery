import { defineStore } from 'pinia'
import { formatData, countByGroup } from '@/assets/js/count'

export const useNumberAnalyzeStore = defineStore('number_analyze', {
  state: () => ({
    startIndex: 6,
    endIndex: 0,
    startData: {},
    endData: {},
    groupResultData: null,
    startAddArrowStatus: false,
    startReduceArrowStatus: false,
    endAddArrowStatus: false,
    endReduceArrowStatus: false,
  }),
  getters: {
    codeStep: (state) => state.startIndex - state.endIndex + 1,
  },
  actions: {
    setStartData(data) {
      this.startData = data[this.startIndex]
    },
    setEndData(data) {
      this.endData = data[this.endIndex]
    },
    setGroupResultData(data) {
      const resultData = this.setResultData(data)
      this.groupResultData = countByGroup(resultData)
    },
    addStartCode(data) {
      if (this.startIndex >= data.length - 1) return
      this.startIndex += 1
    },
    reduceStartCode() {
      if (this.startIndex <= this.endIndex) return
      this.startIndex -= 1
    },
    addEndCode() {
      if (this.startIndex <= this.endIndex) return
      this.endIndex += 1
    },
    reduceEndCode() {
      if (this.endIndex <= 0) return
      this.endIndex -= 1
    },
    checkNumberCountArrowStatus(data) {
      this.startAddArrowStatus = false
      this.startReduceArrowStatus = false
      this.endAddArrowStatus = false
      this.endReduceArrowStatus = false

      if (this.startIndex >= data.length - 1) {
        this.startAddArrowStatus = true
      } else if (this.startIndex <= this.endIndex) {
        this.startReduceArrowStatus = true
        this.endAddArrowStatus = true
      } else if (this.endIndex <= 0) {
        this.endReduceArrowStatus = true
      }
    },
    setResultData(data) {
      const countData = data.slice(this.endIndex, this.startIndex + 1)
      const resultData = new Array(80).fill(null).map((item, index) => ({
        num: (index + 1).toString().padStart(2, '0'),
        count: 0,
      }))
      const ballList = countData
        .map((item) => formatData(item).balls)
        .flatMap((item) => item)

      resultData.forEach((obj) => {
        obj.count = ballList.filter((item) => item === obj.num).length
      })

      return resultData
    },
  },
})
