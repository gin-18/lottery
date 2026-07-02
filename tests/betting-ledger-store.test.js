import test from 'node:test'
import assert from 'node:assert/strict'
import { sortRecords } from '../src/stores/betting-ledger/betting-ledger-sort.js'

test('sortedRecords sorts by issue descending before createdAt', () => {
  const sortedRecords = sortRecords([
    { id: 'older-issue', issue: '2026170', createdAt: '2026-07-01T10:00:00.000Z' },
    { id: 'newer-created', issue: '2026169', createdAt: '2026-07-01T11:00:00.000Z' },
  ])

  assert.deepEqual(
    sortedRecords.map((record) => record.id),
    ['older-issue', 'newer-created'],
  )
})
