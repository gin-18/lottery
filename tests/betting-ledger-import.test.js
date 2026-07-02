import test from 'node:test'
import assert from 'node:assert/strict'
import {
  mergeImportedRecords,
  parseImportedBettingLedgerFile,
} from '../src/stores/betting-ledger/betting-ledger-model.js'

test('parseImportedBettingLedgerFile accepts export payloads with records', () => {
  const parsed = parseImportedBettingLedgerFile(
    JSON.stringify({
      schemaVersion: 2,
      exportedAt: '2026-07-01T00:00:00.000Z',
      records: [{ id: 'record-1', issue: '2026171', betDate: '2026-07-01', items: [] }],
    }),
  )

  assert.equal(parsed.schemaVersion, 2)
  assert.equal(parsed.records.length, 1)
  assert.equal(parsed.records[0].id, 'record-1')
})

test('parseImportedBettingLedgerFile accepts single legacy record payloads', () => {
  const parsed = parseImportedBettingLedgerFile(
    JSON.stringify({ id: 'record-legacy', issue: '2026170', betDate: '2026-06-30', items: [] }),
  )

  assert.equal(parsed.records.length, 1)
  assert.equal(parsed.records[0].id, 'record-legacy')
})

test('mergeImportedRecords replaces local records with matching ids', () => {
  const merged = mergeImportedRecords(
    [
      { id: 'record-1', issue: '2026170', createdAt: '2026-07-01T00:00:00.000Z' },
      { id: 'record-2', issue: '2026169', createdAt: '2026-07-01T00:00:01.000Z' },
    ],
    [
      { id: 'record-1', issue: '2026171', createdAt: '2026-07-01T00:00:02.000Z' },
      { id: 'record-3', issue: '2026168', createdAt: '2026-07-01T00:00:03.000Z' },
    ],
  )

  assert.deepEqual(
    merged.records.map((record) => record.id),
    ['record-1', 'record-2', 'record-3'],
  )
  assert.equal(merged.replacedCount, 1)
  assert.equal(merged.addedCount, 1)
})

test('parseImportedBettingLedgerFile rejects invalid json payloads', () => {
  assert.throws(() => parseImportedBettingLedgerFile('not json'))
})
