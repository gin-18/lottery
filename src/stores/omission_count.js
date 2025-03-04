import { defineStore } from 'pinia'

export const useOmissionCountStore = defineStore('omission_count', {
  state: () => ({
    currentCode: {},
    groupCode: {},
    codeStep: 50,
    currentCodeIndex: 0,
    result: {},
    previousArrowDisable: false,
    nextArrowDisable: true,
    description: '这部分用于统计某一期次号码的当前遗漏值情况。',
  }),
  actions: {
    goToPreviousCode(rawDataArray) {
      if (this.currentCodeIndex >= rawDataArray.length - 1) return
      this.currentCodeIndex += 1
    },
    goToNextCode() {
      if (this.currentCodeIndex <= 0) return
      this.currentCodeIndex -= 1
    },
    initData(rawDataArray) {
      const startIndex = this.currentCodeIndex
      const endIndex = this.currentCodeIndex + this.codeStep
      this.groupCode = rawDataArray.slice(startIndex, endIndex)
      this.currentCode = this.groupCode[0]

      if (this.currentCodeIndex >= rawDataArray.length - 1) {
        this.previousArrowDisable = true
      } else {
        this.previousArrowDisable = false
      }

      if (this.currentCodeIndex <= 0) {
        this.nextArrowDisable = true
      } else {
        this.nextArrowDisable = false
      }
    },
    countNumberByOmission(numberCountArray) {
      this.result = numberCountArray.reduce((acc, item) => {
        const key = item.currentOmission
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item.num)
        return acc
      }, {})
    },
  },
})
