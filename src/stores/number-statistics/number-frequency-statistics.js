import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/utils'

export const useNumberFrequencyStatisticsStore = defineStore(
  'number_frequency_statistics',
  {
    state: () => ({
      startCode: null,
      lastCode: null,
      codeStep: 7,
      result: null,
      addButtonDisable: false,
      reduceButtonDisable: false,
      description:
        '这部分用于统计n步长的期次的所有号码出现的次数的总个数, 例如：步长为7的情况下, 则以每7期作为一组数据，统计这一组数据中，出现0次的号码是哪些，有多少个，出现1次的号码是哪些，有多少个，以此类推，总共统计14组数据。',
    }),
    getters: {
      codes: (state) => 13 + state.codeStep,
    },
    actions: {
      addCodeStep(rawDataArray) {
        if (this.codeStep >= rawDataArray.length - this.codes) return
        this.codeStep += 1
      },
      reduceCodeStep() {
        if (this.codeStep <= 1) return
        this.codeStep -= 1
      },
      initData(rawDataArray) {
        this.startCode = rawDataArray[this.codes - 1]
        this.lastCode = rawDataArray[0]

        if (this.codeStep >= rawDataArray.length - this.codes) {
          this.addButtonDisable = true
        } else {
          this.addButtonDisable = false
        }

        if (this.codeStep <= 1) {
          this.reduceButtonDisable = true
        } else {
          this.reduceButtonDisable = false
        }
      },
      countByFrequency(rawDataArray) {
        const rangeData = rawDataArray.slice(0, this.codes)
        this.result = this.splitDataIntoSegments(rangeData)
      },
      /**
       * 传入一组原始数据的数组，以及分组的step，把这组原始的数据分成step个一组
       * 返回的数据格式为:
       * {
       *   code: '第i期 - 第i+step-1期',
       *   list: {
       *     0: 32,
       *     1: 28,
       *     ...
       *   },
       * }
       **/
      splitDataIntoSegments(data) {
        return Array.from(
          { length: data.length - this.codeStep + 1 },
          (_, i) => {
            const dataGroup = data.slice(i, i + this.codeStep)
            const dataNeedToBeCount = countNumberInData(dataGroup)
            const code = `第${data[i + this.codeStep - 1].code}期 - 第${data[i].code}期`
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
       *   0: 32,
       *   1: 28,
       *   ...
       * }
       **/
      calculateFrequencyDistribution(arr) {
        return arr.reduce(
          (acc, item) => {
            acc[item.count] = (acc[item.count] || 0) + 1
            return acc
          },
          Object.fromEntries(
            Array.from({ length: this.codeStep + 1 }, (_, i) => [i, 0]),
          ),
        )
      },
    },
  },
)
