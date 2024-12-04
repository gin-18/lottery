/**
 * 传入一期数据：{
 *  code: "2024324"
 *  day: "2024-12-03"
 *  open_time: "2024-12-03 21:30:00"
 *  next_code: "2024325"
 *  next_open_time: "2024-12-04 21:30:00"
 *  one: "02"
 *  two: "06"
 *  three: "08"
 *  four: "16"
 *  five: "20"
 *  six: "22"
 *  seven: "26"
 *  eight: "28"
 *  nine: "31"
 *  ten: "33"
 *  eleven: "39"
 *  twelve: "42"
 *  thirteen: "45"
 *  fourteen: "53"
 *  fifteen: "57"
 *  sixteen: "62"
 *  seventeen: "65"
 *  eighteen: "69"
 *  nineteen: "72"
 *  twenty: "80"
 * }
 * 返回：{
 *   code: "2024324"
 *   day: "2024-12-03"
 *   open_time: "2024-12-03 21:30:00"
 *   next_code: "2024325"
 *   next_open_time: "2024-12-04 21:30:00"
 *   balls: [02, 06, 08, 16, 20, 22, 26, 28, 31, 33, 39, 42, 45, 53, 57, 62, 65, 69, 72, 80]
 * }
 **/
export function formatData(data) {
  const numberKey = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
  ]
  const balls = []

  Object.keys(data).forEach((item) => {
    if (numberKey.includes(item)) {
      balls.push(data[item])
    }
  })

  return {
    code: data.code,
    day: data.day,
    open_time: data.open_time,
    next_code: data.next_code,
    next_open_time: data.next_open_time,
    balls,
  }
}

/*
 * 返回两个数组的交集
 */
export function findDuplicates(arr1, arr2) {
  return arr1.filter((item) => arr2.includes(item))
}

/*
 * 以10为步长，返回80个球的分区
 */
export function generateBallInterval(step = 10) {
  const result = []
  const balls = new Array(80)
    .fill(null)
    .map((item, index) => (index + 1).toString().padStart(2, '0'))

  for (let i = 0; i < balls.length; i += step) {
    result.push(balls.slice(i, i + step))
  }

  return result
}

export function countOneCodeByRange(data) {
  const dataFormat = formatData(data)
  const ballInterval = generateBallInterval()
  const result = {}

  dataFormat.balls.forEach((item) => {
    ballInterval.forEach((subBall, index) => {
      if (subBall.includes(item)) {
        result[index] = (result[index] || 0) + 1
      }
    })
  })

  return result
}

/**
 * 返回的数据格式：
 * {
 *    code: "2024324",
 *    data: {
 *      '[01, 10]': 1,
 *      '[11, 20]': 0,
 *      '[21, 30]': 3,
 *      '[31, 40]': 4,
 *      '[41, 50]': 2,
 *      '[51, 60]': 0,
 *      '[61, 70]': 8,
 *      '[71, 80]': 0
 *    }
 * }
 **/
export function countOneForAllRange(data) {
  const ranges = [
    '[01, 10]',
    '[11, 20]',
    '[21, 30]',
    '[31, 40]',
    '[41, 50]',
    '[51, 60]',
    '[61, 70]',
    '[71, 80]',
  ]
  const dataFormat = formatData(data)
  const ballInterval = generateBallInterval()
  const result = {
    code: `第${dataFormat.code}期`,
    data: Object.fromEntries(ranges.map((item) => [item, 0])),
  }

  dataFormat.balls.forEach((num) => {
    const index = ballInterval.findIndex((subBall) => subBall.includes(num))
    if (index !== -1) {
      result.data[ranges[index]]++
    }
  })

  return result
}

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
export function countAllBallRange(dataArray) {
  const dataList = dataArray.map((item) => countOneForAllRange(item))

  return dataList.reduce((acc, curr, index) => {
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
}

/**
 * 传入一个[{num: '01', count: 1}, {num: '02', count: 2}, {num: '03', count: 1}]这样的数组
 * 返回一个{1: {nums: ['01', '03'], total: 2}, 2: {nums: ['02'], total: 1}}这样的对象
 * */
export function countByGroup(arr) {
  return arr.reduce((acc, curr) => {
    if (!acc[curr.count]) {
      acc[curr.count] = { nums: [], total: 0 }
    }
    acc[curr.count].nums.push(curr.num)
    acc[curr.count].total++
    return acc
  }, {})
}

/**
 * 统计一个step内，每个元素出现的次数
 * */
export function countByFrequency(arr, step) {
  const obj = {}

  for (let i = 0; i <= step; i++) {
    obj[i] = 0
  }

  arr.forEach((item) => {
    obj[item.count] = (obj[item.count] || 0) + 1
  })

  return obj
}
