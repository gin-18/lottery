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
 * 返回两个数组的交集
 */
export function findDuplicates(arr1, arr2) {
  return arr1.filter((item) => arr2.includes(item))
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
