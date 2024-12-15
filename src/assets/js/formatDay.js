export function formatDay(d) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const week = date.getDay()
  const weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${year}/${month}/${day}(${weekArr[week]})`
}
