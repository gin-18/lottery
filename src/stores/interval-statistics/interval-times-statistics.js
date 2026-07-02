import { defineStore } from 'pinia'
import { formatData } from '@/utils/lottery-data'
import {
  generateIntervals,
  generateIntervalRanges,
} from '@/utils/lottery-range'

export const useIntervalTimesStatisticsStore = defineStore(
  'interval_times_statistics',
  {
    state: () => ({
      codeStep: 7,
      startCode: null,
      endCode: null,
      result: null,
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
        const rangeData = rawDataArray.slice(0, this.codeStep)
        const ranges = generateIntervalRanges()
        const intervals = generateIntervals()
        const numbers = rangeData.map((item) => formatData(item).balls).flat()

        this.result = ranges.reduce((acc, range, index) => {
          const interval = intervals[index]
          const numbersInRange = numbers.filter((num) => range.includes(num))
          acc[interval] = numbersInRange.length
          return acc
        }, {})
      },
    },
  },
)
