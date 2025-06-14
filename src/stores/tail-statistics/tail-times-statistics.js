import { defineStore } from 'pinia'
import { formatData } from '@/assets/js/utils'

export const useTailTimesStatisticsStore = defineStore(
  'tail_times_statistics',
  {
    state: () => ({
      codeStep: 7,
      startCode: null,
      endCode: null,
      result: null,
      addButtonDisable: false,
      reduceButtonDisable: false,
      description: '这部分用于统计最近n期内，每个尾数号码出现的总个数。',
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
      countInDigit(rawDataArray) {
        const rangeCodes = rawDataArray.slice(0, this.codeStep)
        const numbers = rangeCodes.map((item) => formatData(item).balls).flat()
        this.result = numbers.reduce(
          (acc, numStr) => {
            const digit = numStr[1]
            acc[digit] += 1
            return acc
          },
          Object.fromEntries(
            Array.from({ length: 10 }, (_, i) => [i.toString(), 0]),
          ),
        )
      },
    },
  },
)
