import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/count'

export const useFrequencyCountStore = defineStore('frequency_count', {
  state: () => ({
    startData: {},
    lastData: {},
    frequencyGroupData: {},
    countStep: 7,
    description:
      '这部分用于统计指定步长的期次的所有号码出现的次数的总个数, 例如：步长为7的情况下, 则以每7期作为一组数据，统计这一组数据中，出现0次的号码是哪些，有多少个，出现1次的号码是哪些，有多少个，以此类推，总共统计14组数据。',
  }),
  getters: {
    codes: (state) => 13 + state.countStep,
  },
  actions: {
    setStartData(data) {
      this.startData = data[this.codes - 1]
    },
    setLastData(data) {
      this.lastData = data[0]
    },

    addCodeStep() {
      this.countStep += 1
    },
    reduceCodeStep() {
      if (this.countStep > 1) {
        this.countStep -= 1
      }
    },

    countByFrequency(data) {
      const dataNeedToBeCount = data.slice(0, this.codes)
      this.frequencyGroupData = this.splitDataIntoSegments(
        dataNeedToBeCount,
        this.countStep,
      )
    },

    splitDataIntoSegments(arr, step) {
      return Array.from({ length: arr.length - step + 1 }, (_, i) => {
        const dataNeedToBeCount = countNumberInData(arr.slice(i, i + step))
        const code = `第${arr[i].code}期 - 第${arr[i + step - 1].code}`
        const list = this.calculateFrequencyDistribution(
          dataNeedToBeCount,
          this.countStep,
        )
        return { code, list }
      })
    },

    calculateFrequencyDistribution(arr, step) {
      return arr.reduce(
        (acc, item) => {
          acc[item.count] = (acc[item.count] || 0) + 1
          return acc
        },
        Array.from({ length: step + 1 }, () => 0),
      )
    },
  },
})
