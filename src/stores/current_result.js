import { defineStore } from 'pinia'

export const useCurrentResultStore = defineStore('current_result', {
  state: () => ({
    currentData: {},
    currentDataIndex: 0,
    description: '这部分用于显示当前期次的开奖结果。',
  }),
  actions: {
    setCurrentData(data) {
      this.currentData = data[this.currentDataIndex]
    },
    addCurrentCode() {
      if (this.currentDataIndex <= 0) return
      this.currentDataIndex -= 1
    },
    reduceCurrentCode() {
      this.currentDataIndex += 1
    },
  },
})
