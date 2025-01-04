import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/utils'

export const useCodeNumberCountStore = defineStore('code_number_count', {
  state: () => ({
    startData: {},
    lastData: {},
    codeStep: 7,
    codeNumberData: {},
    description: '这部分用于统计最近n期内每个号码出现的次数。',
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
