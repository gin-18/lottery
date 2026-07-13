import {
  calculateDantuoPrizeCounts,
  calculateRegularPrizeCounts,
  calculateStakeAmount,
  combine,
  getConfirmedPrizeAmount,
  getFloatingPrizeNotice,
  getPlaySize,
  hasPrizeRule,
  isFloatingPrize,
} from '../../utils/lottery-rules.js'

export const SCHEMA_VERSION = 2

export function normalizeNumbers(numbers) {
  return numbers
    .map((number) => Number(number))
    .filter((number) => Number.isInteger(number))
    .sort((first, second) => first - second)
}

export function validateBetDraft(draft) {
  const errors = []

  if (!getIssueCode(draft.issue || draft.issueOption).trim()) {
    errors.push('请选择投注期次')
  }

  const betDate = draft.betDate || getIssueDate(draft.issueOption)
  if (!betDate) errors.push('请选择投注期次')

  const items = Array.isArray(draft.items) ? draft.items : []
  if (!items.length) {
    errors.push('至少需要一个投注项')
    return errors
  }

  items.forEach((item, itemIndex) => addItemErrors(errors, item, itemIndex + 1))
  return errors
}

export function calculateNumberGroupStakeCount(item, group) {
  const playSize = getPlaySize(item.playType)
  if (!playSize) return 0

  if (item.selectionMode === 'single') return 1
  if (item.selectionMode === 'compound') return combine(group.numbers.length, playSize)

  const dragPickSize = playSize - group.bankerNumbers.length
  return combine(group.dragNumbers.length, dragPickSize)
}

export function calculateItemDraftTotals(item) {
  const normalizedItem = normalizeDraftItem(item)
  return getItemTotals(normalizedItem)
}

export function calculateDraftTotals(draft) {
  const normalizedItems = normalizeDraftItems(draft.items ?? [])
  return getRecordTotals(normalizedItems)
}

export function createBetRecord(draft) {
  const now = new Date().toISOString()
  const normalizedRecord = normalizeDraftRecord(draft)

  return {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    ...normalizedRecord,
    status: 'pending',
    settlement: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function parseImportedBettingLedgerFile(fileText) {
  const parsed = JSON.parse(fileText)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('导入文件格式不正确')
  }

  return {
    schemaVersion: Number(parsed.schemaVersion ?? 0),
    records: normalizeImportedRecords(extractImportedRecords(parsed)),
  }
}

export function normalizeImportedRecord(record) {
  return migrateLegacyRecord({
    ...record,
    schemaVersion: Number(record.schemaVersion ?? 0),
  })
}

export function normalizeImportedRecords(records) {
  return records.map(normalizeImportedRecord)
}

export function mergeImportedRecords(existingRecords, importedRecords) {
  const mergedRecords = new Map(existingRecords.map((record) => [record.id, record]))
  const existingIds = new Set(existingRecords.map((record) => record.id))

  importedRecords.forEach((record) => {
    mergedRecords.set(record.id, record)
  })

  return {
    records: [...mergedRecords.values()],
    importedCount: importedRecords.length,
    replacedCount: importedRecords.filter((record) => existingIds.has(record.id)).length,
    addedCount: importedRecords.filter((record) => !existingIds.has(record.id)).length,
  }
}

function extractImportedRecords(parsed) {
  if (Array.isArray(parsed.records)) return parsed.records
  return [parsed]
}

export function updateBetRecord(record, draft) {
  return {
    ...record,
    ...normalizeDraftRecord(draft),
    schemaVersion: SCHEMA_VERSION,
    status: 'pending',
    settlement: null,
    updatedAt: new Date().toISOString(),
  }
}

export function settleBetRecord(record, options) {
  const normalizedDrawNumbers = normalizeNumbers(options.drawNumbers)
  const settlementContext = { drawNumbers: normalizedDrawNumbers }
  const settledItems = record.items.map((item) => settleItem(item, settlementContext))
  const totals = getRecordTotals(settledItems)

  return {
    ...record,
    items: settledItems,
    totalStakeCount: totals.totalStakeCount,
    totalStakeAmount: totals.totalStakeAmount,
    status: 'settled',
    settlement: createRecordSettlement(settledItems, totals.totalStakeAmount, normalizedDrawNumbers),
    updatedAt: new Date().toISOString(),
  }
}

export function migrateLegacyRecord(record) {
  if (record.schemaVersion >= SCHEMA_VERSION && Array.isArray(record.items)) {
    return normalizeStoredRecord(record)
  }

  return createRecordFromLegacyShape(record)
}

export function normalizeStoredRecord(record) {
  const items = (record.items ?? []).map(normalizeStoredItem)
  const totals = getRecordTotals(items)

  return {
    ...record,
    schemaVersion: SCHEMA_VERSION,
    issueOption: record.issueOption || getIssueOptionValue(record.issue, record.betDate),
    issue: getIssueCode(record.issue || record.issueOption),
    betDate: record.betDate || getIssueDate(record.issueOption),
    items,
    totalStakeCount: totals.totalStakeCount,
    totalStakeAmount: totals.totalStakeAmount,
    status: record.settlement ? 'settled' : 'pending',
  }
}

export function getRecordNumberGroupSignatures(record) {
  return record.items.flatMap((item) =>
    item.numberGroups.map((group) => getNumberGroupSignature(record.issue, item, group)),
  )
}

function addItemErrors(errors, item, itemNumber) {
  const prefix = `投注项${itemNumber}`
  const playSize = getPlaySize(item.playType)

  if (!playSize) errors.push(`${prefix}：请选择玩法`)
  if (!item.selectionMode) errors.push(`${prefix}：请选择选号结构`)
  if (!Number.isInteger(Number(item.multiplier)) || Number(item.multiplier) <= 0) {
    errors.push(`${prefix}：倍数必须为正整数`)
  }

  const numberGroups = Array.isArray(item.numberGroups) ? item.numberGroups : []
  if (!numberGroups.length) {
    errors.push(`${prefix}：至少需要一个号码组`)
    return
  }

  if (item.selectionMode !== 'single' && numberGroups.length > 1) {
    errors.push(`${prefix}：当前选号结构只支持一个号码组`)
  }

  numberGroups.forEach((group, index) =>
    addGroupErrors(errors, item, group, playSize, `${prefix}第${index + 1}组`),
  )
}

function addGroupErrors(errors, item, group, playSize, prefix) {
  const groupNumbers = getGroupNumbers(item.selectionMode, group)
  if (hasOutOfRangeNumber(groupNumbers)) {
    errors.push(`${prefix}：号码范围必须在 1 到 80 之间`)
  }
  if (hasDuplicateNumber(groupNumbers)) {
    errors.push(`${prefix}：同一号码组内号码不能重复`)
  }

  if (item.selectionMode === 'single' && group.numbers.length !== playSize) {
    errors.push(`${prefix}：单式需要选择 ${playSize} 个号码`)
  }

  if (item.selectionMode === 'compound' && group.numbers.length < playSize) {
    errors.push(`${prefix}：复式至少需要选择 ${playSize} 个号码`)
  }

  if (item.selectionMode !== 'dantuo') return
  if (group.bankerNumbers.length >= playSize) {
    errors.push(`${prefix}：胆码数量必须少于玩法要求数量`)
  }
  if (group.bankerNumbers.length + group.dragNumbers.length < playSize) {
    errors.push(`${prefix}：胆码和拖码合计至少需要 ${playSize} 个号码`)
  }
}

function hasOutOfRangeNumber(numbers) {
  return numbers.some((number) => number < 1 || number > 80)
}

function hasDuplicateNumber(numbers) {
  return new Set(numbers).size !== numbers.length
}

function normalizeDraftRecord(draft) {
  const issue = getIssueCode(draft.issue || draft.issueOption)
  const betDate = draft.betDate || getIssueDate(draft.issueOption)
  const items = normalizeDraftItems(draft.items ?? [])
  const totals = getRecordTotals(items)

  return {
    issueOption: draft.issueOption || getIssueOptionValue(issue, betDate),
    issue,
    betDate,
    items,
    totalStakeCount: totals.totalStakeCount,
    totalStakeAmount: totals.totalStakeAmount,
  }
}

function normalizeDraftItems(items) {
  return items.map(normalizeDraftItem)
}

function normalizeDraftItem(item) {
  const numberGroups = normalizeDraftGroups(item)
  const totals = getItemTotals({
    playType: item.playType,
    selectionMode: item.selectionMode,
    multiplier: Number(item.multiplier),
    numberGroups,
  })

  return {
    id: item.id || crypto.randomUUID(),
    playType: item.playType,
    selectionMode: item.selectionMode,
    multiplier: Number(item.multiplier),
    numberGroups,
    stakeCount: totals.stakeCount,
    stakeAmount: totals.stakeAmount,
    settlement: null,
  }
}

function normalizeDraftGroups(item) {
  return (item.numberGroups ?? []).map((group) => normalizeDraftGroup(item, group))
}

function normalizeDraftGroup(item, group) {
  const normalizedGroup = {
    id: group.id || crypto.randomUUID(),
    numbers: normalizeNumbers(group.numbers ?? []),
    bankerNumbers: normalizeNumbers(group.bankerNumbers ?? []),
    dragNumbers: normalizeNumbers(group.dragNumbers ?? []),
  }
  const stakeCount = calculateNumberGroupStakeCount(item, normalizedGroup)

  return {
    ...normalizedGroup,
    stakeCount,
    stakeAmount: calculateStakeAmount(stakeCount, item.multiplier),
    settlement: null,
  }
}

function normalizeStoredItem(item) {
  const normalizedGroups = (item.numberGroups ?? []).map((group) => ({
    ...group,
    id: group.id || crypto.randomUUID(),
    numbers: normalizeNumbers(group.numbers ?? []),
    bankerNumbers: normalizeNumbers(group.bankerNumbers ?? []),
    dragNumbers: normalizeNumbers(group.dragNumbers ?? []),
  }))
  const totals = getItemTotals({
    playType: item.playType,
    selectionMode: item.selectionMode,
    multiplier: Number(item.multiplier),
    numberGroups: normalizedGroups,
  })

  return {
    ...item,
    id: item.id || crypto.randomUUID(),
    multiplier: Number(item.multiplier),
    numberGroups: normalizedGroups,
    stakeCount: totals.stakeCount,
    stakeAmount: totals.stakeAmount,
  }
}

function getItemTotals(item) {
  const stakeCount = item.numberGroups.reduce(
    (total, group) => total + calculateNumberGroupStakeCount(item, group),
    0,
  )

  return {
    stakeCount,
    stakeAmount: calculateStakeAmount(stakeCount, item.multiplier),
  }
}

function getRecordTotals(items) {
  return items.reduce(
    (totals, item) => ({
      totalStakeCount: totals.totalStakeCount + item.stakeCount,
      totalStakeAmount: totals.totalStakeAmount + item.stakeAmount,
    }),
    { totalStakeCount: 0, totalStakeAmount: 0 },
  )
}

function settleItem(item, settlementContext) {
  const settledGroups = item.numberGroups.map((group) =>
    settleNumberGroup(item, group, settlementContext),
  )
  const settlement = createItemSettlement(settledGroups, item.stakeAmount)

  return {
    ...item,
    numberGroups: settledGroups,
    settlement,
  }
}

function settleNumberGroup(item, group, settlementContext) {
  const hitNumbers = getGroupNumbers(item.selectionMode, group).filter((number) =>
    settlementContext.drawNumbers.includes(number),
  )
  const prizeCounts = getPrizeCounts(item, group, settlementContext.drawNumbers)
  const prizeAmount = getTotalPrizeAmount(prizeCounts, item)
  const floatingPrizeHits = getFloatingPrizeHits(prizeCounts, item)

  return {
    ...group,
    settlement: {
      hitNumbers,
      maxHitCount: getMaxHitCount(prizeCounts),
      winningStakeCount: getWinningStakeCount(prizeCounts, item.playType),
      prizeAmount,
      revenue: prizeAmount - group.stakeAmount,
      hasUnconfirmedPrize: floatingPrizeHits.length > 0,
      unconfirmedPrizeHits: floatingPrizeHits,
    },
  }
}

function createItemSettlement(numberGroups, stakeAmount) {
  const prizeAmount = numberGroups.reduce(
    (total, group) => total + (group.settlement?.prizeAmount ?? 0),
    0,
  )
  const winningStakeCount = numberGroups.reduce(
    (total, group) => total + (group.settlement?.winningStakeCount ?? 0),
    0,
  )
  const hitNumbers = [...new Set(numberGroups.flatMap((group) => group.settlement?.hitNumbers ?? []))]
  const unconfirmedPrizeHits = getMergedUnconfirmedPrizeHits(
    numberGroups.flatMap((group) => group.settlement?.unconfirmedPrizeHits ?? []),
  )

  return {
    groupCount: numberGroups.length,
    winningGroupCount: numberGroups.filter((group) => (group.settlement?.winningStakeCount ?? 0) > 0)
      .length,
    winningStakeCount,
    prizeAmount,
    revenue: prizeAmount - stakeAmount,
    hitNumbers,
    maxHitCount: Math.max(0, ...numberGroups.map((group) => group.settlement?.maxHitCount ?? 0)),
    hasUnconfirmedPrize: unconfirmedPrizeHits.length > 0,
    unconfirmedPrizeHits,
  }
}

function createRecordSettlement(items, totalStakeAmount, drawNumbers) {
  const prizeAmount = items.reduce((total, item) => total + (item.settlement?.prizeAmount ?? 0), 0)
  const winningStakeCount = items.reduce(
    (total, item) => total + (item.settlement?.winningStakeCount ?? 0),
    0,
  )
  const unconfirmedPrizeHits = getMergedUnconfirmedPrizeHits(
    items.flatMap((item) => item.settlement?.unconfirmedPrizeHits ?? []),
  )

  return {
    drawNumbers,
    itemCount: items.length,
    winningItemCount: items.filter((item) => (item.settlement?.winningStakeCount ?? 0) > 0).length,
    winningStakeCount,
    prizeAmount,
    revenue: prizeAmount - totalStakeAmount,
    settledAt: new Date().toISOString(),
    hasUnconfirmedPrize: unconfirmedPrizeHits.length > 0,
    unconfirmedPrizeHits,
  }
}

function createRecordFromLegacyShape(record) {
  const legacyItem = createLegacyItem(record)
  const items = [legacyItem]

  return {
    id: record.id,
    schemaVersion: SCHEMA_VERSION,
    issueOption: record.issueOption || getIssueOptionValue(record.issue, record.betDate),
    issue: getIssueCode(record.issue || record.issueOption),
    betDate: record.betDate || getIssueDate(record.issueOption),
    items,
    totalStakeCount: legacyItem.stakeCount,
    totalStakeAmount: legacyItem.stakeAmount,
    status: record.settlement ? 'settled' : 'pending',
    settlement: createLegacyRecordSettlement(record),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

function createLegacyItem(record) {
  const legacyGroup = createLegacyGroup(record)

  return {
    id: crypto.randomUUID(),
    playType: record.playType,
    selectionMode: record.selectionMode,
    multiplier: Number(record.multiplier),
    numberGroups: [legacyGroup],
    stakeCount: Number(record.stakeCount ?? 0),
    stakeAmount: Number(record.stakeAmount ?? 0),
    settlement: createLegacyItemSettlement(record),
  }
}

function createLegacyGroup(record) {
  return {
    id: crypto.randomUUID(),
    numbers: normalizeNumbers(record.numbers ?? []),
    bankerNumbers: normalizeNumbers(record.bankerNumbers ?? []),
    dragNumbers: normalizeNumbers(record.dragNumbers ?? []),
    stakeCount: Number(record.stakeCount ?? 0),
    stakeAmount: Number(record.stakeAmount ?? 0),
    settlement: createLegacyGroupSettlement(record.settlement),
  }
}

function createLegacyGroupSettlement(settlement) {
  if (!settlement) return null

  return {
    hitNumbers: normalizeNumbers(settlement.hitNumbers ?? []),
    maxHitCount: Number(settlement.maxHitCount ?? 0),
    winningStakeCount: Number(settlement.winningStakeCount ?? 0),
    prizeAmount: Number(settlement.prizeAmount ?? 0),
    revenue: Number(settlement.revenue ?? 0),
    hasUnconfirmedPrize: Boolean(settlement.hasUnconfirmedPrize),
    unconfirmedPrizeHits: normalizeUnconfirmedPrizeHits(settlement.unconfirmedPrizeHits),
  }
}

function createLegacyItemSettlement(record) {
  if (!record.settlement) return null

  return {
    groupCount: 1,
    winningGroupCount: record.settlement.winningStakeCount > 0 ? 1 : 0,
    winningStakeCount: Number(record.settlement.winningStakeCount ?? 0),
    prizeAmount: Number(record.settlement.prizeAmount ?? 0),
    revenue: Number(record.settlement.revenue ?? 0),
    hitNumbers: normalizeNumbers(record.settlement.hitNumbers ?? []),
    maxHitCount: Number(record.settlement.maxHitCount ?? 0),
    hasUnconfirmedPrize: Boolean(record.settlement.hasUnconfirmedPrize),
    unconfirmedPrizeHits: normalizeUnconfirmedPrizeHits(record.settlement.unconfirmedPrizeHits),
  }
}

function createLegacyRecordSettlement(record) {
  if (!record.settlement) return null

  return {
    drawNumbers: normalizeNumbers(record.settlement.drawNumbers ?? []),
    itemCount: 1,
    winningItemCount: record.settlement.winningStakeCount > 0 ? 1 : 0,
    winningStakeCount: Number(record.settlement.winningStakeCount ?? 0),
    prizeAmount: Number(record.settlement.prizeAmount ?? 0),
    revenue: Number(record.settlement.revenue ?? 0),
    settledAt: record.settlement.settledAt,
    hasUnconfirmedPrize: Boolean(record.settlement.hasUnconfirmedPrize),
    unconfirmedPrizeHits: normalizeUnconfirmedPrizeHits(record.settlement.unconfirmedPrizeHits),
  }
}

function getNumberGroupSignature(issue, item, group) {
  return [
    getIssueCode(issue),
    item.playType,
    item.selectionMode,
    Number(item.multiplier),
    normalizeNumbers(group.numbers ?? []).join(','),
    normalizeNumbers(group.bankerNumbers ?? []).join(','),
    normalizeNumbers(group.dragNumbers ?? []).join(','),
  ].join('|')
}

function getIssueCode(value = '') {
  return String(value).split('(')[0].trim()
}

function getIssueDate(value = '') {
  const match = String(value).match(/\((.+)\)$/)
  return match?.[1] ?? ''
}

function getIssueOptionValue(issue, betDate) {
  if (!issue || !betDate) return ''
  return `${issue}(${betDate})`
}

function getGroupNumbers(selectionMode, group) {
  if (selectionMode === 'dantuo') {
    return [...group.bankerNumbers, ...group.dragNumbers]
  }

  return group.numbers
}

function getPrizeCounts(item, group, drawNumbers) {
  if (item.selectionMode === 'dantuo') {
    return getDantuoPrizeCounts(item, group, drawNumbers)
  }

  return getRegularPrizeCounts(item, group, drawNumbers)
}

function getRegularPrizeCounts(item, group, drawNumbers) {
  const hitCount = getIntersectionCount(group.numbers, drawNumbers)

  return calculateRegularPrizeCounts({
    playType: item.playType,
    selectedCount: group.numbers.length,
    hitCount,
  })
}

function getDantuoPrizeCounts(item, group, drawNumbers) {
  const bankerHitCount = getIntersectionCount(group.bankerNumbers, drawNumbers)
  const dragHitCount = getIntersectionCount(group.dragNumbers, drawNumbers)

  return calculateDantuoPrizeCounts({
    playType: item.playType,
    bankerCount: group.bankerNumbers.length,
    dragCount: group.dragNumbers.length,
    bankerHitCount,
    dragHitCount,
  })
}

function getTotalPrizeAmount(prizeCounts, item) {
  return prizeCounts.reduce((total, prizeCount) => {
    return (
      total +
      prizeCount.count * getConfirmedPrizeAmount(item.playType, prizeCount.hitSize) * item.multiplier
    )
  }, 0)
}

function getWinningStakeCount(prizeCounts, playType) {
  return prizeCounts.reduce((total, item) => {
    if (!hasPrizeRule(playType, item.hitSize)) return total
    return total + item.count
  }, 0)
}

function getFloatingPrizeHits(prizeCounts, item) {
  return prizeCounts.flatMap((prizeCount) => {
    if (!prizeCount.count) return []
    if (!isFloatingPrize(item.playType, prizeCount.hitSize)) return []

    return [
      {
        playType: item.playType,
        hitCount: prizeCount.hitSize,
        winningStakeCount: prizeCount.count,
        notice: getFloatingPrizeNotice(item.playType, prizeCount.hitSize),
      },
    ]
  })
}

function getMergedUnconfirmedPrizeHits(entries) {
  const mergedEntries = new Map()

  entries.forEach((entry) => {
    const normalizedEntry = normalizeUnconfirmedPrizeHit(entry)
    if (!normalizedEntry) return

    const key = `${normalizedEntry.playType}-${normalizedEntry.hitCount}`
    const currentEntry = mergedEntries.get(key)
    if (!currentEntry) {
      mergedEntries.set(key, normalizedEntry)
      return
    }

    mergedEntries.set(key, {
      ...currentEntry,
      winningStakeCount: currentEntry.winningStakeCount + normalizedEntry.winningStakeCount,
    })
  })

  return [...mergedEntries.values()]
}

function normalizeUnconfirmedPrizeHits(entries) {
  return getMergedUnconfirmedPrizeHits(entries ?? [])
}

function normalizeUnconfirmedPrizeHit(entry) {
  const playType = entry?.playType
  const hitCount = Number(entry?.hitCount ?? 0)
  const winningStakeCount = Number(entry?.winningStakeCount ?? 0)
  const notice = getFloatingPrizeNotice(playType, hitCount)

  if (!playType || !hitCount || !winningStakeCount || !notice) return null

  return {
    playType,
    hitCount,
    winningStakeCount,
    notice,
  }
}

function getMaxHitCount(prizeCounts) {
  const hitSizes = prizeCounts.filter((item) => item.count > 0).map((item) => item.hitSize)
  return Math.max(0, ...hitSizes)
}

function getIntersectionCount(numbers, drawNumbers) {
  return numbers.filter((number) => drawNumbers.includes(number)).length
}
