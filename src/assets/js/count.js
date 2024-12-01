// 获取一份数据中的中奖号码
export function getBallNum(obj) {
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
  const ballList = []

  Object.keys(obj).forEach((item) => {
    if (numberKey.includes(item)) {
      ballList.push(obj[item])
    }
  })

  return ballList
}

/*
 * 统计一个数组中的元素落在一个二维数组中的次数
 * 返回一个以元素为key，次数为value的对象
 *
 * 例：统计['01', '02']这个数组的元素落在[['01', '02', '03'], ['04', '05', '06']]这个二维数组上的子数组的次数
 * 返回以二维数组的子数组下标为key，统计次数为value的对象
 */
export function countSubarrays(array2D, targetArray) {
  const countObj = {}

  targetArray.forEach((num) => {
    array2D.forEach((subArray, index) => {
      if (subArray.includes(num)) {
        countObj[index] = (countObj[index] || 0) + 1
      }
    })
  })

  return countObj
}

/*
 * 有下面这样一个结构的二维数组：
 * [{
 *    code: '001',
 *    list: ['01', '02', '03']
 *  },
 *  {
 *    code: '002',
 *    list: ['01', '03', '06']
 * }]
 * 统计这个二维数组中每个对象的list数组中的元素出现的次数
 * 返回以下结构的对象：
 * ps：重复的号码为key，value为一个对象，这个对象的属性有重复的次数和出现的code
 * {
 *   '01': {
 *     count: 2,
 *     codes: ['001', '002']
 *   },
 *   '03': {
 *     count: 1,
 *     codes: ['001', '002']
 *   }
 * }
 */
export function countDuplicates(array, weight) {
  const countObj = {}
  const duplicates = {}

  array.forEach((obj) => {
    obj.list.forEach((item) => {
      if (countObj[item]) {
        countObj[item].count++
        countObj[item].codes.add(obj.code)
      } else {
        countObj[item] = { count: 1, codes: new Set([obj.code]) }
      }
    })
  })

  Object.keys(countObj).forEach((key) => {
    if (countObj[key].count >= weight) {
      const codesArray = Array.from(countObj[key].codes)
      if (codesArray.length > 1) {
        duplicates[key] = { count: countObj[key].count, codes: codesArray }
      }
    }
  })

  return duplicates
}

/*
 * 传入一个[{num: '01', count: 1}, {num: '02', count: 2}, {num: '03', count: 1}]这样的数组
 * 返回一个{1: {nums: ['01', '03'], total: 2}, 2: {nums: ['02'], total: 1}}这样的对象
 */
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

export function countByFrequency(arr) {
  return Object.entries(
    arr.reduce((acc, { num, count }) => {
      acc[count] = (acc[count] || 0) + 1
      return acc
    }, {}),
  ).map(([count, sum]) => ({ [count]: sum }))
}
