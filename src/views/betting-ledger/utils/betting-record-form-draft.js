import { LOTTERY_NUMBER_COUNT, getPlaySize } from '../../../utils/lottery-rules.js'

export const SINGLE_MODE = 'single'
export const DANTUO_MODE = 'dantuo'

export function createEmptyForm(createId) {
  return {
    issueOption: '',
    issue: '',
    betDate: '',
    items: [createEmptyItem(createId)],
  }
}

export function createEmptyItem(createId) {
  return {
    id: createId(),
    playType: 'pick1',
    selectionMode: SINGLE_MODE,
    multiplier: 1,
    numberGroups: [createEmptyGroup(createId)],
  }
}

export function createEmptyGroup(createId) {
  return {
    id: createId(),
    numbers: [],
    bankerNumbers: [],
    bankerNumberOrder: [],
    dragNumbers: [],
  }
}

export function getAllBettingNumbers() {
  return Array.from({ length: LOTTERY_NUMBER_COUNT }, (_, index) => index + 1)
}

export function getAvailableDragNumbers(group) {
  const bankerNumbers = new Set(group.bankerNumbers)

  return getAllBettingNumbers().filter((number) => !bankerNumbers.has(number))
}

export function hasSelectedAllDragNumbers(group) {
  const selectedDragNumbers = new Set(group.dragNumbers)
  const availableDragNumbers = getAvailableDragNumbers(group)

  return (
    group.dragNumbers.length === availableDragNumbers.length &&
    availableDragNumbers.every((number) => selectedDragNumbers.has(number))
  )
}

export function getNextDragNumbers(group) {
  if (hasSelectedAllDragNumbers(group)) return []

  return getAvailableDragNumbers(group)
}

export function getBankerNumberLimit(playType) {
  return Math.max(getPlaySize(playType) - 1, 0)
}

export function getNextBankerSelection(options) {
  if (options.group.bankerNumbers.includes(options.number)) {
    return removeBankerNumber(options.group, options.number)
  }

  const limit = getBankerNumberLimit(options.playType)
  if (limit <= 0) return getBankerSelection(options.group)

  return addBankerNumber(options.group, options.number, limit)
}

export function trimBankerSelection(group, playType) {
  const limit = getBankerNumberLimit(playType)
  const bankerNumberOrder = getBankerNumberOrder(group).slice(0, limit)

  return {
    bankerNumbers: sortNumbers(bankerNumberOrder),
    bankerNumberOrder,
    dragNumbers: removeNumbers(group.dragNumbers, bankerNumberOrder),
  }
}

function addBankerNumber(group, number, limit) {
  const bankerNumberOrder = getBankerNumberOrder(group)
  const nextOrder = bankerNumberOrder.length >= limit
    ? [...bankerNumberOrder.slice(0, -1), number]
    : [...bankerNumberOrder, number]

  return {
    bankerNumbers: sortNumbers(nextOrder),
    bankerNumberOrder: nextOrder,
    dragNumbers: group.dragNumbers.filter((dragNumber) => dragNumber !== number),
  }
}

function removeBankerNumber(group, number) {
  const bankerNumberOrder = getBankerNumberOrder(group).filter(
    (bankerNumber) => bankerNumber !== number,
  )

  return {
    bankerNumbers: group.bankerNumbers.filter((bankerNumber) => bankerNumber !== number),
    bankerNumberOrder,
    dragNumbers: [...group.dragNumbers],
  }
}

function getBankerSelection(group) {
  return {
    bankerNumbers: [...group.bankerNumbers],
    bankerNumberOrder: getBankerNumberOrder(group),
    dragNumbers: [...group.dragNumbers],
  }
}

function getBankerNumberOrder(group) {
  const selectedBankerNumbers = new Set(group.bankerNumbers)
  const bankerNumberOrder = Array.isArray(group.bankerNumberOrder)
    ? group.bankerNumberOrder
    : []
  const orderedNumbers = bankerNumberOrder.filter((number) => selectedBankerNumbers.has(number))
  const orderedNumberSet = new Set(orderedNumbers)
  const missingNumbers = group.bankerNumbers.filter((number) => !orderedNumberSet.has(number))

  return [...orderedNumbers, ...missingNumbers]
}

function removeNumbers(numbers, excludedNumbers) {
  const excludedNumberSet = new Set(excludedNumbers)

  return numbers.filter((number) => !excludedNumberSet.has(number))
}

function sortNumbers(numbers) {
  return [...numbers].sort((first, second) => first - second)
}

export function buildIssueOptions(recentDraws, currentIssueOption = '') {
  const optionsByValue = new Map()
  addIssueOption(optionsByValue, createNextIssueOption(recentDraws[0]))
  recentDraws.forEach((draw) => addIssueOption(optionsByValue, createDrawIssueOption(draw)))
  addIssueOption(optionsByValue, createCurrentIssueOption(currentIssueOption))
  return [...optionsByValue.values()]
}

function createNextIssueOption(draw) {
  const betDate = draw?.next_open_time?.slice(0, 10)
  return createIssueOption(draw?.next_code, betDate)
}

function createDrawIssueOption(draw) {
  return createIssueOption(draw.code, draw.day)
}

function createCurrentIssueOption(currentIssueOption) {
  if (!currentIssueOption) return null
  return { value: currentIssueOption, label: currentIssueOption }
}

function createIssueOption(issue, betDate) {
  const value = getIssueOptionValue(issue, betDate)
  if (!value) return null
  return { value, label: value }
}

function addIssueOption(optionsByValue, option) {
  if (!option) return
  if (optionsByValue.has(option.value)) return
  optionsByValue.set(option.value, option)
}

export function getIssueOptionValue(issue, betDate) {
  if (!issue || !betDate) return ''
  return `${issue}(${betDate})`
}

export function parseIssueOption(value) {
  const match = value.match(/^(.+)\((.+)\)$/)
  if (!match) return { issue: '', betDate: '' }

  return {
    issue: match[1],
    betDate: match[2],
  }
}
