import { defineStore } from 'pinia'

export const useOmissionCountStore = defineStore('omission_count', {
  state: () => ({
    currentCode: {},
    groupCode: {},
    codeStep: 50,
    currentCodeIndex: 0,
    result: {},
    description: '这部分用于统计某一期次号码的当前遗漏值情况。',
  }),
  actions: {
    goToPreviousCode() {
      this.currentCodeIndex += 1
    },
    // FIXME: limit index to get -1
    goToNextCode() {
      this.currentCodeIndex -= 1
    },
    initData(dataArray) {
      const startIndex = this.currentCodeIndex
      const endIndex = this.currentCodeIndex + this.codeStep
      this.groupCode = dataArray.slice(startIndex, endIndex)
      this.currentCode = this.groupCode[0]
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
