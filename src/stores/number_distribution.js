import { defineStore } from 'pinia'
import {
  formatData,
  countNumberInData,
  generateAllNumbers,
} from '@/assets/js/utils'

export const useNumberDistributionStore = defineStore('number_distribution', {
  state: () => ({
    allNumbers: generateAllNumbers(),
    codeSteps: [14, 30, 50, 100],
    codeStepIndex: 0,
    renderData: [],
    startData: {},
    lastData: {},
    numberCountData: [],
    description: '这部分用于展示近n期的所有号码的分布情况。',
  }),
  getters: {
    codeStep: (state) => state.codeSteps[state.codeStepIndex],
  },
  actions: {
    setData(data) {
      this.renderData = data.slice(0, this.codeStep).reverse()
      this.startData = this.renderData[0]
      this.lastData = this.renderData[this.renderData.length - 1]
      this.numberCountData = countNumberInData(this.renderData)
    },
    goToNextCodeStep() {
      this.codeStepIndex += 1
    },
    goToPreviousCodeStep() {
      this.codeStepIndex -= 1
    },
    countNumberOmission(data) {
      const numbers = data.map((item) => formatData(item).balls)

      this.numberCountData.forEach((obj) => {
        let numberOmission = 0

        const omission = numbers.map((nums) => {
          if (nums.includes(obj.num)) {
            numberOmission = 0
            return obj.num
          }
          return (numberOmission += 1)
        })

        obj.omission = this.reverseNumbersBetweenString(omission)
      })
    },
    reverseNumbersBetweenString(arr) {
      let result = []
      let temp = []

      arr.forEach((item) => {
        if (typeof item === 'string') {
          if (temp.length > 0) {
            result = result.concat(temp.reverse())
            temp = []
          }
          result.push(item)
        } else {
          temp.push(item)
        }
      })

      if (temp.length > 0) {
        result = result.concat(temp.reverse())
      }

      return result
    },
  },
})
