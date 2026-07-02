export const UNIT_STAKE_AMOUNT = 2

export const PLAY_TYPES = [
  { value: 'pick1', label: '选一', size: 1 },
  { value: 'pick2', label: '选二', size: 2 },
  { value: 'pick3', label: '选三', size: 3 },
  { value: 'pick4', label: '选四', size: 4 },
  { value: 'pick5', label: '选五', size: 5 },
  { value: 'pick6', label: '选六', size: 6 },
  { value: 'pick7', label: '选七', size: 7 },
  { value: 'pick8', label: '选八', size: 8 },
  { value: 'pick9', label: '选九', size: 9 },
  { value: 'pick10', label: '选十', size: 10 },
]

export const SELECTION_MODES = [
  { value: 'single', label: '单式' },
  { value: 'compound', label: '复式' },
  { value: 'dantuo', label: '胆拖' },
]

export const PRIZE_RULES = {
  pick1: { 1: 4.5 },
  pick2: { 2: 19 },
  pick3: { 3: 52, 2: 3 },
  pick4: { 4: 93, 3: 5, 2: 3 },
  pick5: { 5: 1000, 4: 20, 3: 3 },
  pick6: { 6: 2880, 5: 30, 4: 10, 3: 3 },
  pick7: { 7: 8500, 6: 300, 5: 30, 4: 4, 0: 2 },
  pick8: { 8: 50000, 7: 800, 6: 80, 5: 10, 4: 3, 0: 2 },
  pick9: { 9: 250000, 8: 2000, 7: 225, 6: 22, 5: 5, 4: 3, 0: 2 },
  pick10: { 10: 5000000, 9: 8000, 8: 720, 7: 80, 6: 5, 5: 3, 0: 2 },
}

export const FLOATING_PRIZE_NOTICE = '浮动奖金，最终奖金以官方公布为准'

const FLOATING_PRIZE_META = {
  pick9: { 9: '浮动奖金，单注最高 25 万' },
  pick10: { 10: '浮动奖金，单注最高 500 万' },
}

const PLAY_SIZES = Object.fromEntries(
  PLAY_TYPES.map((playType) => [playType.value, playType.size]),
)

export function getPlaySize(playType) {
  return PLAY_SIZES[playType] ?? 0
}

export function getPlayLabel(playType) {
  return PLAY_TYPES.find((item) => item.value === playType)?.label ?? playType
}

export function getSelectionModeLabel(selectionMode) {
  return SELECTION_MODES.find((item) => item.value === selectionMode)?.label ?? selectionMode
}

export function isFloatingPrize(playType, hitCount) {
  return Boolean(FLOATING_PRIZE_META[playType]?.[hitCount])
}

export function hasPrizeRule(playType, hitCount) {
  return Number(PRIZE_RULES[playType]?.[hitCount] ?? 0) > 0
}

export function getConfirmedPrizeAmount(playType, hitCount) {
  if (isFloatingPrize(playType, hitCount)) return 0
  return PRIZE_RULES[playType]?.[hitCount] ?? 0
}

export function getFloatingPrizeNotice(playType, hitCount) {
  if (!isFloatingPrize(playType, hitCount)) return ''
  return FLOATING_PRIZE_NOTICE
}

export function getPrizeDisplayValue(playType, hitCount) {
  const floatingLabel = FLOATING_PRIZE_META[playType]?.[hitCount]
  if (floatingLabel) return floatingLabel

  return PRIZE_RULES[playType]?.[hitCount] ?? 0
}

export function calculateStakeAmount(stakeCount, multiplier) {
  return stakeCount * UNIT_STAKE_AMOUNT * Number(multiplier || 0)
}
