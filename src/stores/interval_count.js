import { defineStore } from 'pinia'
import { formatData, generateAllNumbers } from '@/assets/js/utils'

export const useIntervalCountStore = defineStore('interval_count', {
  state: () => ({
    intervals: [],
    currentData: {},
    rangeData: {},
    currentDataIndex: 0,
    rangeStep: 7,
    category: [
      {
        title: '热',
        weight: 4,
        backgroundColor: 'bg-error',
        textColor: 'text-error',
      },
      {
        title: '温',
        weight: 2,
        backgroundColor: 'bg-warning',
        textColor: 'text-warning',
      },
      {
        title: '冷',
        weight: 0,
        backgroundColor: 'bg-primary',
        textColor: 'text-primary',
      },
    ],
  }),
  actions: {
    addCurrentCode() {
      if (this.currentDataIndex <= 0) return
      this.currentDataIndex -= 1
    },
    reduceCurrentCode() {
      this.currentDataIndex += 1
    },
    addRangeStep() {
      this.rangeStep += 1
    },
    reduceRangeStep() {
      this.rangeStep -= 1
    },
    initData(rawDataArray) {
      this.intervals = this.generateNumberInterval()
      this.currentData = rawDataArray[this.currentDataIndex]
      this.rangeData = rawDataArray.slice(0, this.rangeStep)
    },
    getIntervalCountValue(index) {
      const result = this.countOneByRange(this.currentData)
      return Object.values(result.data)[index]
    },
    /**
     * 返回的数据格式：
     * {
     *    code: 'code1',
     *    data: {
     *      'interval': times,
     *      ...
     *    }
     * }
     **/
    countOneByRange(data) {
      const ranges = this.generateRanges()
      const intervals = this.generateNumberInterval()
      const dataFormat = formatData(data)
      const result = {
        code: `第${dataFormat.code}期`,
        data: Object.fromEntries(ranges.map((item) => [item, 0])),
      }

      dataFormat.balls.forEach((num) => {
        const index = intervals.findIndex((subBall) => subBall.includes(num))
        if (index !== -1) {
          result.data[ranges[index]]++
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
    setIntervalColor(index, type) {
      const countObj = this.countOneByRange(this.currentData, type)
      const intervalValue = Object.values(countObj.data)[index]
      if (intervalValue >= this.category[0].weight) {
        return this.category[0].textColor
      } else if (intervalValue >= this.category[1].weight) {
        return this.category[1].textColor
      } else {
        return this.category[2].textColor
      }
    },
    /**
     * 以10为步长，返回80个球的分区
     **/
    generateNumberInterval(step = 10) {
      const result = []
      const numbers = generateAllNumbers()
      for (let i = 0; i < numbers.length; i += step) {
        result.push(numbers.slice(i, i + step))
      }
      return result
    },
    generateRanges() {
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
