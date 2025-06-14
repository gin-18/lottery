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
    startCode: null,
    lastCode: null,
    result: null,
    numberCountData: null,
    previousButtonDisable: true,
    nextButtonDisable: false,
    description: '这部分用于展示近n期的所有号码的分布情况。',
  }),
  getters: {
    codeStep: (state) => state.codeSteps[state.codeStepIndex],
  },
  actions: {
    goToPreviousCodeStep() {
      if (this.codeStepIndex <= 0) return
      this.codeStepIndex -= 1
    },
    goToNextCodeStep() {
      if (this.codeStepIndex >= this.codeSteps.length - 1) return
      this.codeStepIndex += 1
    },
    initData(rawDataArray) {
      this.result = rawDataArray.slice(0, this.codeStep).reverse()
      this.startCode = this.result[0]
      this.lastCode = this.result[this.result.length - 1]
      this.numberCountData = countNumberInData(this.result)

      if (this.codeStepIndex <= 0) {
        this.previousButtonDisable = true
      } else {
        this.previousButtonDisable = false
      }

      if (this.codeStepIndex >= this.codeSteps.length - 1) {
        this.nextButtonDisable = true
      } else {
        this.nextButtonDisable = false
      }
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
        obj.currentOmission = this.getNumberCurrentOmission(obj.omission)
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
    getNumberCurrentOmission(omission) {
      return typeof omission[0] === 'string' ? 0 : omission[0]
    },
  },
})
