import { formatData, generateAllNumbers } from './utils'

export function countRangeInGroupCode(groupDataArray, ranges, categories) {
  const datas = groupDataArray.map((item) =>
    countRangeInOneCode(item, ranges, categories),
  )

  return datas.reduce((acc, curr) => {
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
}

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
export function countRangeInOneCode(data, ranges, categories) {
  const formattedData = formatData(data)
  const result = {
    code: `第${formattedData.code}期`,
    data: categories.reduce((acc, category, index) => {
      acc[category] = {
        times: 0,
        range: ranges[index],
      }
      return acc
    }, {}),
  }

  formattedData.balls.forEach((num) => {
    const index = ranges.findIndex((nums) => nums.includes(num))
    if (index !== -1) {
      result.data[categories[index]].times++
    }
  })

  return result
}

export function generateIntervals() {
  const intervals = []
  for (let start = 1; start <= 71; start += 10) {
    const end = start + 9
    const formattedStart = start.toString().padStart(2, '0')
    const formattedEnd = end.toString().padStart(2, '0')
    intervals.push(`[${formattedStart}, ${formattedEnd}]`)
  }
  return intervals
}

export function generateIntervalRanges(step = 10) {
  const ranges = []
  const numbers = generateAllNumbers()
  for (let i = 0; i < numbers.length; i += step) {
    ranges.push(numbers.slice(i, i + step))
  }
  return ranges
}

export function generateTails() {
  return Array.from({ length: 10 }, (_, i) => i.toString())
}

export function generateTailRanges() {
  const numbers = generateAllNumbers()
  const grouped = numbers.reduce((acc, num) => {
    const tail = num.slice(-1)
    if (!acc[tail]) acc[tail] = []
    acc[tail].push(num)
    return acc
  }, {})
  return Object.keys(grouped)
    .sort((a, b) => a - b)
    .map((tail) => grouped[tail])
}
