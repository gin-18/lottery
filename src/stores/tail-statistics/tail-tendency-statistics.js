import { defineStore } from 'pinia'
import {
  countRangeInGroupCode,
  generateTails,
  generateTailRanges,
} from '@/assets/js/range_analyze'

export const useTailTendencyStatisticsStore = defineStore(
  'tail_tendency_statistics',
  {
    state: () => ({
      result: null,
      codeStep: 7,
      addButtonDisable: false,
      reduceButtonDisable: false,
      description: '这部分用于统计各个区间号码出现的次数，以及出现的次数趋势。',
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
        if (this.codeStep >= rawDataArray.length - 1) {
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
      countRangeInGroupCode(rawDataArray) {
        const intervals = generateTails()
        const ranges = generateTailRanges()
        const rangeData = rawDataArray.slice(0, this.codeStep)
        this.result = countRangeInGroupCode(rangeData, ranges, intervals)
      },
    },
  },
)
