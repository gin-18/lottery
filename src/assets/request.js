export async function getData(num) {
  const response = await fetch(`http://api.huiniao.top/interface/home/lotteryHistory?type=klb&page=1&limit=${num}`)
  const result = await response.json()

  return result.data
}
