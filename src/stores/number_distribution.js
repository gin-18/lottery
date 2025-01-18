import { defineStore } from 'pinia'
import { getAllNumbers, countNumberInData } from '@/assets/js/utils'

export const useNumberDistributionStore = defineStore('number_distribution', {
  state: () => ({
    allNumbers: getAllNumbers(),
    codeSteps: [30, 50, 100],
    codeStepIndex: 0,
    startData: {},
    lastData: {},
    renderData: [],
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
  },
})
