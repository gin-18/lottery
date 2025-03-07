import { defineStore } from 'pinia'
import { formatData, generateAllNumbers } from '@/assets/js/utils'

export const useIntervalCountStore = defineStore('interval_count', {
  state: () => ({
    intervals: [],
    currentCode: {},
    result: {},
    currentCodeIndex: 0,
    previousButtonDisable: false,
    nextButtonDisable: true,
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
      this.intervals = this.generateRanges()
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
    getIntervalCountValue() {
      this.result = this.countOneByRange(this.currentCode)
    },
    /**
     * 返回的数据格式：
     * {
     *    code: 'code1',
     *    data: {
     *      'interval': {
     *        'times': 0,
     *        'range': ['01', ..., '10'],
     *      },
     *      ...
     *    }
     * }
     **/
    countOneByRange(data) {
      const ranges = this.generateRanges()
      const intervals = this.generateIntervals()
      const formattedData = formatData(data)
      const result = {
        code: `第${formattedData.code}期`,
        data: intervals.reduce((acc, interval, index) => {
          acc[interval] = {
            times: 0,
            range: ranges[index],
          }
          return acc
        }, {}),
      }

      formattedData.balls.forEach((num) => {
        const index = ranges.findIndex((nums) => nums.includes(num))
        if (index !== -1) {
          result.data[intervals[index]].times++
        }
      })

      return result
    },
    /**
     * 返回: {
     *   '[01, 10]': {
     *     'code1': times,
     *     'code2': times,
     *   },
     *   '[11, 20]': {
     *     'code1': times,
     *     'code2': times,
     *   },
     *   ...
     * }
     **/
    countAllByRange(dataArray, type) {
      const dataList = dataArray.map((item) => this.countOneByRange(item, type))

      return dataList.reduce((acc, curr) => {
        Object.keys(curr.data).forEach((item) => {
          if (acc[item]) {
            acc[item][curr.code] = curr.data[item]
          } else {
            acc[item] = {}
            acc[item][curr.code] = curr.data[item]
          }
        })

        return acc
      }, {})
    },
    generateRanges(step = 10) {
      const result = []
      const numbers = generateAllNumbers()
      for (let i = 0; i < numbers.length; i += step) {
        result.push(numbers.slice(i, i + step))
      }
      return result
    },
    generateIntervals() {
      const ranges = []
      for (let start = 1; start <= 71; start += 10) {
        const end = start + 9
        const formattedStart = start.toString().padStart(2, '0')
        const formattedEnd = end.toString().padStart(2, '0')
        ranges.push(`[${formattedStart}, ${formattedEnd}]`)
      }
      return ranges
    },
  },
})
