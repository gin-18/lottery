import { defineStore } from 'pinia'
import { countNumberInData } from '@/assets/js/count'

export const useTimesNumberCountStore = defineStore('times_number_count', {
  state: () => ({
    startDataIndex: 6,
    endDataIndex: 0,
    startData: {},
    endData: {},
    timesNumberCountData: {},
    startAddArrowStatus: false,
    startReduceArrowStatus: false,
    endAddArrowStatus: false,
    endReduceArrowStatus: false,
    description:
      '这部分用于统计给定区间的期次内，每个号码出现的次数。例如：给定的期次区间为7期，则统计这7期内，每个号码出现的次数，对应的表格就是7期中，出现0次的号码有哪些，总共有多少个；出现1次的号码有哪些，总共有多少个，以此类推。',
  }),
  getters: {
    codeStep: (state) => state.startDataIndex - state.endDataIndex + 1,
  },
  actions: {
    setStartData(data) {
      this.startData = data[this.startDataIndex]
    },
    setEndData(data) {
      this.endData = data[this.endDataIndex]
    },

    addStartCode() {
      if (this.startDataIndex <= this.endDataIndex) return
      this.startDataIndex -= 1
    },
    reduceStartCode(data) {
      if (this.startDataIndex >= data.length - 1) return
      this.startDataIndex += 1
    },
    addEndCode() {
      if (this.endDataIndex <= 0) return
      this.endDataIndex -= 1
    },
    reduceEndCode() {
      if (this.endDataIndex >= this.startDataIndex) return
      this.endDataIndex += 1
    },

    checkNumberCountArrowStatus(data) {
      this.startAddArrowStatus = false
      this.startReduceArrowStatus = false
      this.endAddArrowStatus = false
      this.endReduceArrowStatus = false

      if (this.startDataIndex >= data.length - 1) {
        this.startAddArrowStatus = true
      } else if (this.startDataIndex <= this.endDataIndex) {
        this.startReduceArrowStatus = true
        this.endAddArrowStatus = true
      } else if (this.endDataIndex <= 0) {
        this.endReduceArrowStatus = true
      }
    },

    countNumberByTimes(data) {
      const dataNeedToBeCount = data.slice(
        this.endDataIndex,
        this.startDataIndex + 1,
      )
      const numberCountData = countNumberInData(dataNeedToBeCount)
      this.timesNumberCountData = this.timesByCount(numberCountData)
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
