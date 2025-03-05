import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/utils'

export const useIntervalTimesCountStore = defineStore('interval_times_count', {
  state: () => ({
    codeStep: 7,
    startCode: {},
    endCode: {},
    result: {},
    addButtonDisable: false,
    reduceButtonDisable: false,
    description: '这部分用于统计最近n期内，每个区间号码出现的总个数。',
  }),
  actions: {
    addCodeStep(rawDataArray) {
      if (this.codeStep >= rawDataArray.length) return
      this.codeStep += 1
    },
    reduceCodeStep() {
      if (this.codeStep <= 2) return
      this.codeStep -= 1
    },
    initData(rawDataArray) {
      this.startCode = rawDataArray[this.codeStep - 1]
      this.endCode = rawDataArray[0]

      if (this.codeStep >= rawDataArray.length) {
        this.addButtonDisable = true
      } else {
        this.addButtonDisable = false
      }

      if (this.codeStep <= 2) {
        this.reduceButtonDisable = true
      } else {
        this.reduceButtonDisable = false
      }
    },
    countInRange(rawDataArray) {
      const rangeCodes = rawDataArray.slice(0, this.codeStep)
      const numbers = rangeCodes.map((item) => formatData(item).balls).flat()
      this.result = numbers.reduce((acc, numStr) => {
        const num = parseInt(numStr, 10)
        const index = Math.floor((num - 1) / 10)
        const start = index * 10 + 1
        const end = (index + 1) * 10
        const formattedStart = start.toString().padStart(2, '0')
        const formattedEnd = end.toString().padStart(2, '0')
        const key = `[${formattedStart}, ${formattedEnd}]`

        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
    },
  },
})
