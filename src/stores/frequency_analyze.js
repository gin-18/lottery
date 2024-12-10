import { defineStore } from 'pinia'
import { formatData, countByFrequency } from '@/assets/js/count'

export const useFrequencyAnalyzeStore = defineStore('frequency_analyze', {
  state: () => ({
    startData: {},
    lastData: {},
    resultData: {},
    codeStep: 7,
  }),
  getters: {
    codes: (state) => 13 + state.codeStep,
  },
  actions: {
    setStartData(data) {
      this.startData = data[this.codes - 1]
    },
    setLastData(data) {
      this.lastData = data[0]
    },
    setResultData(data) {
      const countData = this.getCountData(data)
      this.resultData = this.sliceArray(countData, this.codeStep)
    },
    addCodeStep() {
      this.codeStep += 1
    },
    reduceCodeStep() {
      if (this.codeStep > 1) {
        this.codeStep -= 1
      }
    },
    sliceArray(arr, step) {
      const result = []
      for (let i = 0; i < arr.length - step + 1; i++) {
        result.push({
          code: `第${arr[i + step - 1].code}期 - 第${arr[i].code}期`,
          list: countByFrequency(
            this.countBall(
              arr.slice(i, i + step).map((item) => formatData(item).balls),
            ),
            this.codeStep,
          ),
        })
      }
      return result
    },
    countBall(arr) {
      const result = new Array(80).fill(null).map((item, index) => ({
        num: (index + 1).toString().padStart(2, '0'),
        count: 0,
      }))
      const ballList = arr.flatMap((item) => item)

      result.forEach((obj) => {
        obj.count = ballList.filter((item) => item === obj.num).length
      })

      return result
    },
    getCountData(data) {
      return data.slice(0, this.codes)
    },
  },
})
