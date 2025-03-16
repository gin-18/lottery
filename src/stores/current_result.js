import { defineStore } from 'pinia'

export const useCurrentResultStore = defineStore('current_result', {
  state: () => ({
    currentCode: null,
    currentCodeIndex: 0,
    previousButtonDisable: false,
    nextButtonDisable: true,
    description: '这部分用于显示当前期次的开奖结果。',
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
      this.currentCode = rawDataArray[this.currentCodeIndex]

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
  },
})
