import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/count'

export const useCodeNumberCountStore = defineStore('code_number_count', {
  state: () => ({
    startData: {},
    lastData: {},
    codeStep: 7,
    codeNumberData: {},
  }),
  actions: {
    setData(data) {
      this.startData = data[this.codeStep - 1]
      this.lastData = data[0]
    },

    reduceCodeStep() {
      if (this.codeStep > 1) {
        this.codeStep -= 1
      }
    },
    addCodeStep() {
      this.codeStep += 1
    },

    countNumberByCode(dataArray) {
      const dataNeedToBeCount = dataArray.slice(0, this.codeStep)
      this.codeNumberData = countNumberInData(dataNeedToBeCount)
    },
  },
})
