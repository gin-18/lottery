import {
  getConfirmedPrizeAmount,
  getPrizeDisplayValue,
  hasPrizeRule,
  isFloatingPrize,
} from '../../../../utils/lottery-rules.js'

export function getAwardDetails(playType, prizeCounts) {
  return prizeCounts
    .filter((prizeCount) => hasWinningPrize(playType, prizeCount))
    .map((prizeCount) => getAwardDetail(playType, prizeCount))
}

export function getAwardTotal(awardDetails) {
  return awardDetails.reduce((total, detail) => total + detail.total, 0)
}

export function formatPrice(number) {
  const amount = Number(number)
  if (!Number.isFinite(amount)) return String(number)

  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

function hasWinningPrize(playType, prizeCount) {
  return prizeCount.count > 0 && hasPrizeRule(playType, prizeCount.hitSize)
}

function getAwardDetail(playType, prizeCount) {
  const confirmedPrizeAmount = getConfirmedPrizeAmount(playType, prizeCount.hitSize)

  return {
    level: `中${prizeCount.hitSize}个`,
    prizePerBet: confirmedPrizeAmount,
    prizeDisplayValue: getPrizeDisplayValue(playType, prizeCount.hitSize),
    bets: prizeCount.count,
    total: prizeCount.count * confirmedPrizeAmount,
    isFloating: isFloatingPrize(playType, prizeCount.hitSize),
  }
}
