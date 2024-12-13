import { defineStore } from 'pinia'
import {
  generateBallInterval,
  generateBallTailInterval,
  countOneByRange,
} from '@/assets/js/count'

export const useIntervalAnalyzeStore = defineStore('interval_analyze', {
  state: () => ({
    ballInterval: [],
    ballTailInterval: [],
    currentData: {},
    rangeData: {},
    currentDataIndex: 0,
    rangeStep: 14,
    intervalCategory: [
      {
        title: '热',
        weight: 3,
        backgroundColor: 'bg-error',
        textColor: 'text-error',
      },
      {
        title: '温',
        weight: 2,
        backgroundColor: 'bg-warning',
        textColor: 'text-warning',
      },
      {
        title: '冷',
        weight: 0,
        backgroundColor: 'bg-primary',
        textColor: 'text-primary',
      },
    ],
  }),
  actions: {
    setBallInterval() {
      this.ballInterval = generateBallInterval()
    },
    setBallTailInterval() {
      this.ballTailInterval = generateBallTailInterval()
    },
    setCurrentData(data) {
      this.currentData = data[this.currentDataIndex]
    },
    setRangeData(data) {
      this.rangeData = data.slice(0, this.rangeStep)
    },
    setIntervalColor(index, type) {
      const countObj = countOneByRange(this.currentData, type)
      const intervalValue = Object.values(countObj.data)[index]

      if (intervalValue >= this.intervalCategory[0].weight) {
        return this.intervalCategory[0].textColor
      } else if (intervalValue >= this.intervalCategory[1].weight) {
        return this.intervalCategory[1].textColor
      } else {
        return this.intervalCategory[2].textColor
      }
    },
    getIntervalCountValue(index, type) {
      return Object.values(countOneByRange(this.currentData, type).data)[index]
    },
  },
})
