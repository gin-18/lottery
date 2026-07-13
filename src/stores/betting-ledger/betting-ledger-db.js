import Dexie from 'dexie'
import { migrateLegacyRecord } from './betting-ledger-model'

export const bettingDb = new Dexie('lottery_betting_ledger')

bettingDb.version(1).stores({
  records:
    '&id, issue, betDate, status, playType, selectionMode, createdAt, updatedAt',
})

bettingDb.version(2).stores({
  records: '&id, issue, betDate, status, createdAt, updatedAt',
}).upgrade(async (tx) => {
  await tx
    .table('records')
    .toCollection()
    .modify((record) => {
      Object.assign(record, migrateLegacyRecord(record))
    })
})
