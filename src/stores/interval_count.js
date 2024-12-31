import { defineStore } from 'pinia'
import { formatData, getAllNumbers } from '@/assets/js/count'

export const useIntervalCountStore = defineStore('interval_count', {
  state: () => ({
    numberInterval: [],
    numberTailInterval: [],
    currentData: {},
    rangeData: {},
    currentDataIndex: 0,
    rangeStep: 7,
    intervalCategory: [
      {
        title: '热',
        weight: 3,
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
    setNumberInterval() {
      this.numberInterval = this.generateNumberInterval()
    },
    setNumberTailInterval() {
      this.numberTailInterval = this.generateNumberTailInterval()
    },

    setCurrentData(data) {
      this.currentData = data[this.currentDataIndex]
    },
    setRangeData(data) {
      this.rangeData = data.slice(0, this.rangeStep)
    },

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

    setIntervalColor(index, type) {
      const countObj = this.countOneByRange(this.currentData, type)
      const intervalValue = Object.values(countObj.data)[index]
      if (intervalValue >= this.intervalCategory[0].weight) {
        return this.intervalCategory[0].textColor
      } else if (intervalValue >= this.intervalCategory[1].weight) {
        return this.intervalCategory[1].textColor
      } else {
        return this.intervalCategory[2].textColor
      }
    },

    getIntervalCountValue(index, type) {
      const result = this.countOneByRange(this.currentData, type)
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
    countOneByRange(data, type) {
      let numberRange, ranges

      if (type === 'interval') {
        numberRange = this.generateNumberInterval()
        ranges = [
          '[01, 10]',
          '[11, 20]',
          '[21, 30]',
          '[31, 40]',
          '[41, 50]',
          '[51, 60]',
          '[61, 70]',
          '[71, 80]',
        ]
      } else {
        numberRange = this.generateNumberTailInterval()
        ranges = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      }

      const dataFormat = formatData(data)
      const result = {
        code: `第${dataFormat.code}期`,
        data: Object.fromEntries(ranges.map((item) => [item, 0])),
      }

      dataFormat.balls.forEach((num) => {
        const index = numberRange.findIndex((subBall) => subBall.includes(num))
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
        if (!acc) {
          acc = {}
        }

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

    /**
     * 以10为步长，返回80个球的分区
     **/
    generateNumberInterval(step = 10) {
      const result = []
      const numbers = getAllNumbers()

      for (let i = 0; i < numbers.length; i += step) {
        result.push(numbers.slice(i, i + step))
      }

      return result
    },

    /**
     * 将尾号相同的球分为一组
     **/
    generateNumberTailInterval() {
      const numbers = getAllNumbers()

      return numbers.reduce((acc, curr) => {
        const lastDigit = curr.slice(-1)

        if (!acc[lastDigit]) {
          acc[lastDigit] = []
        }

        acc[lastDigit].push(curr)

        return acc
      }, [])
    },
  },
})
