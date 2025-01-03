import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/utils'

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
      this.frequencyGroupData = this.splitDataIntoSegments(dataNeedToBeCount)
    },

    /**
     * 传入一组原始数据的数组，以及分组的step，把这组原始的数据分成step个一组
     * 返回的数据格式为:
     **/
    splitDataIntoSegments(data) {
      return Array.from(
        { length: data.length - this.countStep + 1 },
        (_, i) => {
          const dataGroup = data.slice(i, i + this.countStep)
          const dataNeedToBeCount = countNumberInData(dataGroup)
          const code = `第${data[i].code}期 - 第${data[i + this.countStep - 1].code}`
          const list = this.calculateFrequencyDistribution(dataNeedToBeCount)
          return { code, list }
        },
      )
    },

    /**
     * 用于统计step期次内，号码出现次数的分布
     * 例如： step为时，统计7期内，出现0次的号码有多少个，出现1次的号码有多少个，以此类推。
     * 传入的arr格式为:
     * [
     *   {
     *     num: '01',
     *     count: 0,
     *   },
     *   {
     *     num: '02',
     *     count: 2,
     *   },
     *   ...
     * ]
     * 返回的数据格式为:
     * {
     *   出现次数: 号码个数,
     * }
     **/
    calculateFrequencyDistribution(arr) {
      return arr.reduce(
        (acc, item) => {
          acc[item.count] = (acc[item.count] || 0) + 1
          return acc
        },
        Object.fromEntries(
          Array.from({ length: this.countStep + 1 }, (_, i) => [i, 0]),
        ),
      )
    },
  },
})
