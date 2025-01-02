export function formatDay(d) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const week = date.getDay()
  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}/${month}/${day}(${weekArr[week]})`
}

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

/**
 * 传入一个原始数据的数组
 * 返回以下格式的数据
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
 **/
export function countNumberInData(dataArray) {
  const numbers = dataArray
    .map((item) => formatData(item).balls)
    .flatMap((item) => item)

  const numberCountData = Array.from({ length: 80 }, (_, index) => ({
    num: (index + 1).toString().padStart(2, '0'),
    count: 0,
  }))

  numberCountData.forEach((obj) => {
    obj.count = numbers.filter((item) => item === obj.num).length
  })

  return numberCountData
}

/**
 * 返回80个数字
 **/
export function getAllNumbers() {
  return Array.from({ length: 80 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  )
}
