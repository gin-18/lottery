export function formatDay(d) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}/${month}/${day}(${weekArr[week]})`
}
