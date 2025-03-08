import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/utils'

export const useTimesNumberCountStore = defineStore('times_number_count', {
  state: () => ({
    startCode: {},
    startCodeIndex: 6,
    endCode: {},
    endCodeIndex: 0,
    result: {},
    startCodePreviousButtonDisable: false,
    startCodeNextButtonDisable: false,
    endCodePreviousButtionDisable: false,
    endCodeNextButtonDisable: true,
    description:
      '这部分用于统计给定区间的期次内，每个号码出现的次数。例如：给定的期次区间为7期，则统计这7期内，每个号码出现的次数，对应的表格就是7期中，出现0次的号码有哪些，总共有多少个；出现1次的号码有哪些，总共有多少个，以此类推。',
  }),
  getters: {
    codeStep: (state) => state.startCodeIndex - state.endCodeIndex + 1,
  },
  actions: {
    goToPreviousStartCode(rawDataArray) {
      if (this.startCodeIndex >= rawDataArray.length - 1) return
      this.startCodeIndex += 1
    },
    goToNextStartCode() {
      if (this.startCodeIndex - 1 <= this.endCodeIndex) return
      this.startCodeIndex -= 1
    },
    goToPreviousEndCode() {
      if (this.endCodeIndex >= this.startCodeIndex - 1) return
      this.endCodeIndex += 1
    },
    goToNextEndCode() {
      if (this.endCodeIndex <= 0) return
      this.endCodeIndex -= 1
    },
    initData(rawDataArray) {
      this.startCode = rawDataArray[this.startCodeIndex]
      this.endCode = rawDataArray[this.endCodeIndex]

      if (this.startCodeIndex >= rawDataArray.length - 1) {
        this.startCodePreviousButtonDisable = true
      } else {
        this.startCodePreviousButtonDisable = false
      }

      if (this.endCodeIndex >= this.startCodeIndex - 1) {
        this.startCodeNextButtonDisable = true
        this.endCodePreviousButtionDisable = true
      } else {
        this.startCodeNextButtonDisable = false
        this.endCodePreviousButtionDisable = false
      }

      if (this.endCodeIndex <= 0) {
        this.endCodeNextButtonDisable = true
      } else {
        this.endCodeNextButtonDisable = false
      }
    },
    countNumberByTimes(rawDataArray) {
      const rangeData = rawDataArray.slice(
        this.endCodeIndex,
        this.startCodeIndex + 1,
      )
      const numberCountData = countNumberInData(rangeData)
      this.result = this.timesByCount(numberCountData)
    },
    /**
     * 传入:
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
     *
     * 返回:
     * [
     *   {
     *     times: 0,
     *     nums: ['01', '03'],
     *     total: 2,
     *   },
     *   {
     *     times: 1,
     *     nums: ['02'],
     *     total: 1,
     *   },
     *   ...
     * ]
     **/
    timesByCount(arr) {
      const maxCount = Math.max(...arr.map((item) => item.count))
      const result = Array.from({ length: maxCount + 1 }, (_, i) => ({
        times: i,
        nums: [],
        total: 0,
      }))

      arr.forEach((item) => {
        result[item.count].nums.push(item.num)
        result[item.count].total++
      })

      return result
    },
  },
})
