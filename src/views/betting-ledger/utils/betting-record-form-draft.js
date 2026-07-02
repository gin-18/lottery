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
    dragNumbers: [],
  }
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
