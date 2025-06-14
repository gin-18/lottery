import { defineStore } from 'pinia'

export const useCurrentOmissionStatisticsStore = defineStore('current_omission_statistics', {
  state: () => ({
    currentCode: null,
    rangeCode: null,
    codeStep: 50,
    currentCodeIndex: 0,
    result: null,
    previousButtonDisable: false,
    nextButtonDisable: true,
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
      this.rangeCode = rawDataArray.slice(startIndex, endIndex)
      this.currentCode = this.rangeCode[0]

      if (this.currentCodeIndex >= rawDataArray.length - 1) {
        this.previousButtonDisable = true
      } else {
        this.previousButtonDisable = false
      }

      if (this.currentCodeIndex <= 0) {
        this.nextButtonDisable = true
      } else {
        this.nextButtonDisable = false
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
