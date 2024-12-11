import { defineStore } from 'pinia'
import { formatData, countByGroup } from '@/assets/js/count'

export const useNumberAnalyzeStore = defineStore('number_analyze', {
  state: () => ({
    startDataIndex: 6,
    endDataIndex: 0,
    startData: {},
    endData: {},
    groupResultData: {},
    startAddArrowStatus: false,
    startReduceArrowStatus: false,
    endAddArrowStatus: false,
    endReduceArrowStatus: false,
  }),
  getters: {
    codeStep: (state) => state.startDataIndex - state.endDataIndex + 1,
  },
  actions: {
    setStartData(data) {
      this.startData = data[this.startDataIndex]
    },
    setEndData(data) {
      this.endData = data[this.endDataIndex]
    },
    setGroupResultData(data) {
      const resultData = this.setResultData(data)
      this.groupResultData = countByGroup(resultData)
    },
    addStartCode() {
      if (this.startDataIndex <= this.endDataIndex) return
      this.startDataIndex -= 1
    },
    reduceStartCode(data) {
      if (this.startDataIndex >= data.length - 1) return
      this.startDataIndex += 1
    },
    addEndCode() {
      if (this.endDataIndex <= 0) return
      this.endDataIndex -= 1
    },
    reduceEndCode() {
      if (this.endDataIndex >= this.startDataIndex) return
      this.endDataIndex += 1
    },
    checkNumberCountArrowStatus(data) {
      this.startAddArrowStatus = false
      this.startReduceArrowStatus = false
      this.endAddArrowStatus = false
      this.endReduceArrowStatus = false

      if (this.startDataIndex >= data.length - 1) {
        this.startAddArrowStatus = true
      } else if (this.startDataIndex <= this.endDataIndex) {
        this.startReduceArrowStatus = true
        this.endAddArrowStatus = true
      } else if (this.endDataIndex <= 0) {
        this.endReduceArrowStatus = true
      }
    },
    setResultData(data) {
      const countData = data.slice(this.endDataIndex, this.startDataIndex + 1)
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
