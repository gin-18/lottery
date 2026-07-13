import { defineStore } from 'pinia'
import { bettingDb } from '@/stores/betting-ledger/betting-ledger-db'
import { sortRecords } from '@/stores/betting-ledger/betting-ledger-sort'
import { formatData } from '@/utils/lottery-data'
import { getDataByCode, getDataByNum } from '@/api/lottery'
import {
  createBetRecord,
  mergeImportedRecords,
  migrateLegacyRecord,
  parseImportedBettingLedgerFile,
  normalizeStoredRecord,
  settleBetRecord,
  updateBetRecord,
  validateBetDraft,
  getRecordNumberGroupSignatures,
} from '@/stores/betting-ledger/betting-ledger-model'

export const useBettingLedgerStore = defineStore('betting_ledger', {
  state: () => ({
    records: [],
    recentDraws: [],
    isLoading: false,
    error: null,
    notice: null,
  }),
  getters: {
    sortedRecords: (state) => sortRecords(state.records),
    monthlyStats: (state) => getMonthlyStats(state.records),
  },
  actions: {
    async loadRecords() {
      await this.runDbAction(async () => {
        const records = await bettingDb.records.toArray()
        this.records = records.map(normalizeStoredRecord)
      }, '投注记录加载失败')
    },
    async loadRecentDraws() {
      await this.runDbAction(async () => {
        const result = await getDataByNum(30)
        this.recentDraws = result.data.list
      }, '最近期次加载失败')
    },
    async saveRecord(draft) {
      const errors = validateBetDraft(draft)
      if (errors.length) return this.setError(errors[0])

      return await this.runDbAction(async () => {
        const record = createBetRecord(draft)
        await bettingDb.records.add(record)
        this.records.push(record)
        this.notice = getDuplicateNotice(record, this.records)
        return record
      }, '投注记录保存失败')
    },
    async updateRecord(record, draft) {
      const errors = validateBetDraft(draft)
      if (errors.length) return this.setError(errors[0])

      return await this.runDbAction(async () => {
        const updatedRecord = updateBetRecord(record, draft)
        await bettingDb.records.put(updatedRecord)
        this.replaceRecord(updatedRecord)
        this.notice = '投注记录已更新'
        return updatedRecord
      }, '投注记录更新失败')
    },
    async deleteRecord(recordId) {
      await this.runDbAction(async () => {
        await bettingDb.records.delete(recordId)
        this.records = this.records.filter((record) => record.id !== recordId)
        this.notice = '投注记录已删除'
      }, '投注记录删除失败')
    },
    async importRecords(file) {
      return await this.runDbAction(async () => {
        const fileText = await file.text()
        const { records: importedRecords } = parseImportedBettingLedgerFile(fileText)
        const merged = mergeImportedRecords(this.records, importedRecords)

        await bettingDb.records.bulkPut(merged.records)
        this.records = merged.records
        this.notice = getImportNotice(merged)
        return merged
      }, '投注记录导入失败')
    },
    async settleRecord(record) {
      this.isLoading = true
      this.clearMessages()

      try {
        const normalizedRecord = migrateLegacyRecord(record)
        const drawNumbers = await getDrawNumbers(normalizedRecord.issue)
        const settledRecord = settleBetRecord(normalizedRecord, { drawNumbers })
        await bettingDb.records.put(settledRecord)
        this.replaceRecord(settledRecord)
        this.notice = '投注记录已结算'
      } catch (error) {
        this.error = getSettlementErrorMessage(error, record)
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    clearMessages() {
      this.error = null
      this.notice = null
    },
    setError(message) {
      this.error = message
      return null
    },
    replaceRecord(updatedRecord) {
      this.records = this.records.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record,
      )
    },
    async runDbAction(action, message) {
      this.isLoading = true
      this.clearMessages()

      try {
        return await action()
      } catch (error) {
        this.error = message
        console.error(error)
        return null
      } finally {
        this.isLoading = false
      }
    },
  },
})

function getSettlementErrorMessage(error, record) {
  if (error instanceof DrawNotFoundError) {
    return `未查询到第 ${record.issue} 期开奖号码`
  }

  return '投注记录结算失败，请查看控制台错误'
}

function getMonthlyStats(records) {
  const monthlyMap = new Map()

  records.forEach((record) => {
    const key = record.betDate.slice(0, 7)
    const stats = monthlyMap.get(key) ?? createEmptyStats(key)
    addRecordToStats(stats, record)
    monthlyMap.set(key, stats)
  })

  return [...monthlyMap.values()].sort((first, second) =>
    second.month.localeCompare(first.month),
  )
}

function createEmptyStats(month) {
  return {
    month,
    recordCount: 0,
    stakeAmount: 0,
    prizeAmount: 0,
    revenue: 0,
    hasUnconfirmedPrize: false,
  }
}

function addRecordToStats(stats, record) {
  const settlement = record.settlement
  const prizeAmount = settlement?.prizeAmount ?? 0

  stats.recordCount += 1
  stats.stakeAmount += record.totalStakeAmount
  stats.prizeAmount += prizeAmount
  stats.revenue = stats.prizeAmount - stats.stakeAmount
  stats.hasUnconfirmedPrize = stats.hasUnconfirmedPrize || Boolean(settlement?.hasUnconfirmedPrize)
}

function getDuplicateNotice(record, records) {
  const signatureSet = new Set(getRecordNumberGroupSignatures(record))
  const duplicateCount = records.reduce(
    (count, savedRecord) => count + countDuplicateGroups(signatureSet, savedRecord),
    0,
  )

  if (duplicateCount > signatureSet.size) {
    return '已保存，存在一组可能重复的投注号码'
  }

  return '投注记录已保存'
}

function getImportNotice(merged) {
  const parts = ['投注记录已导入']
  if (merged.replacedCount) parts.push(`覆盖 ${merged.replacedCount} 条`)
  if (merged.addedCount) parts.push(`新增 ${merged.addedCount} 条`)
  return parts.join('，')
}

function countDuplicateGroups(signatureSet, record) {
  return getRecordNumberGroupSignatures(record).filter((signature) =>
    signatureSet.has(signature),
  ).length
}

async function getDrawNumbers(issue) {
  const result = await getDataByCode(issue)
  const draw = result?.data?.list?.[0]

  if (!draw) throw new DrawNotFoundError(issue)

  return formatData(draw).balls.map((number) => Number(number))
}

class DrawNotFoundError extends Error {
  constructor(issue) {
    super(`Draw not found: ${issue}`)
    this.name = 'DrawNotFoundError'
  }
}
