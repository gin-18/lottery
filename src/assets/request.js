export async function getDataByNum(num) {
  const response = await fetch(`http://api.huiniao.top/interface/home/lotteryHistory?type=klb&page=1&limit=${num}`)
  const result = await response.json()

  return result.data
}

export async function getDataByCode(code) {
  const response = await fetch(`http://api.huiniao.top/interface/home/lotteryHistory?type=klb&code=${code}`)
  const result = await response.json()

  return result.data
}
