import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/count'

export const useFrequencyCountStore = defineStore('frequency_count', {
  state: () => ({
    startData: {},
    lastData: {},
    resultData: {},
    codeStep: 7,
    description:
      '这部分用于统计指定步长的期次的所有号码出现的次数的总个数, 例如：步长为7的情况下, 则以每7期作为一组数据，统计这一组数据中，出现0次的号码有多少个，出现1次的号码有多少个，以此类推，总共统计14组数据。',
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
          list: this.countByFrequency(
            this.countBall(
              arr.slice(i, i + step).map((item) => formatData(item).balls),
            ),
            this.codeStep,
          ),
        })
      }
      return result
    },

    countByFrequency(arr, step) {
      const obj = {}

      for (let i = 0; i <= step; i++) {
        obj[i] = 0
      }

      arr.forEach((item) => {
        obj[item.count] = (obj[item.count] || 0) + 1
      })

      return obj
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
