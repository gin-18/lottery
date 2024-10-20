const url = 'https://api.huiniao.top/interface/home/lotteryHistory'

export async function getDataByNum(num) {
  const response = await fetch(`${url}?type=klb&page=1&limit=${num}`)
  const result = await response.json()

  return result.data
}

export async function getDataByCode(code) {
  const response = await fetch(`${url}?type=klb&code=${code}`)
  const result = await response.json()

  return result.data
}
