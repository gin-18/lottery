import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/count'

export const useCodeNumberAnalyzeStore = defineStore('code_number_analyze', {
  state: () => ({
    startData: {},
    lastData: {},
    groupData: {},
    codeStep: 7,
    resultData: {},
  }),
  actions: {
    initResultData() {
      this.resultData = new Array(80).fill(null).map((item, index) => ({
        num: (index + 1).toString().padStart(2, '0'),
        count: 0,
        codes: [],
      }))
    },
    setData(data) {
      this.groupData = data.slice(0, this.codeStep)
      this.startData = this.groupData[this.codeStep - 1]
      this.lastData = this.groupData[0]
    },
    countNumberByCode() {
      this.initResultData()

      for (const item of this.groupData) {
        for (const ball of formatData(item).balls) {
          this.resultData[ball - 1].codes.push(item.code)
          this.resultData[ball - 1].count++
        }
      }
    },
    reduceCodeStep() {
      if (this.codeStep > 1) {
        this.codeStep -= 1
      }
    },
    addCodeStep() {
      this.codeStep += 1
    },
  },
})
