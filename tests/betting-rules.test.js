import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createBetRecord,
  settleBetRecord,
} from '../src/stores/betting-ledger/betting-ledger-model.js'
import {
  FLOATING_PRIZE_NOTICE,
  PRIZE_RULES,
  getPrizeDisplayValue,
} from '../src/utils/lottery-rules.js'

test('PRIZE_RULES matches current kl8 prize table', () => {
  assert.deepEqual(PRIZE_RULES, {
    pick1: { 1: 4.5 },
    pick2: { 2: 19 },
    pick3: { 2: 3, 3: 52 },
    pick4: { 2: 3, 3: 5, 4: 93 },
    pick5: { 3: 3, 4: 20, 5: 1000 },
    pick6: { 3: 3, 4: 10, 5: 30, 6: 2880 },
    pick7: { 0: 2, 4: 4, 5: 30, 6: 300, 7: 8500 },
    pick8: { 0: 2, 4: 3, 5: 10, 6: 80, 7: 800, 8: 50000 },
    pick9: { 0: 2, 4: 3, 5: 5, 6: 22, 7: 225, 8: 2000, 9: 250000 },
    pick10: { 0: 2, 5: 3, 6: 5, 7: 80, 8: 720, 9: 8000, 10: 5000000 },
  })
})

test('getPrizeDisplayValue labels floating prize caps', () => {
  assert.equal(getPrizeDisplayValue('pick9', 9), '浮动奖金，单注最高 25 万')
  assert.equal(getPrizeDisplayValue('pick10', 10), '浮动奖金，单注最高 500 万')
  assert.equal(getPrizeDisplayValue('pick7', 7), 8500)
})

test('settleBetRecord pays pick8 miss-all prize', () => {
  const record = createBetRecord({
    issueOption: '2026170(2026-06-29)',
    issue: '2026170',
    betDate: '2026-06-29',
    items: [
      {
        playType: 'pick8',
        selectionMode: 'single',
        multiplier: 1,
        numberGroups: [
          {
            numbers: [73, 74, 75, 76, 77, 78, 79, 80],
            bankerNumbers: [],
            dragNumbers: [],
          },
        ],
      },
    ],
  })

  const settledRecord = settleBetRecord(record, {
    drawNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  })

  assert.equal(settledRecord.settlement.prizeAmount, 2)
  assert.equal(settledRecord.settlement.winningStakeCount, 1)
})

test('settleBetRecord marks floating prize as unconfirmed', () => {
  const record = createBetRecord({
    issueOption: '2026170(2026-06-29)',
    issue: '2026170',
    betDate: '2026-06-29',
    items: [
      {
        playType: 'pick10',
        selectionMode: 'single',
        multiplier: 1,
        numberGroups: [
          {
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            bankerNumbers: [],
            dragNumbers: [],
          },
        ],
      },
    ],
  })

  const settledRecord = settleBetRecord(record, {
    drawNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
  })

  assert.equal(settledRecord.settlement.prizeAmount, 0)
  assert.equal(settledRecord.settlement.winningStakeCount, 1)
  assert.equal(settledRecord.settlement.hasUnconfirmedPrize, true)
  assert.deepEqual(settledRecord.settlement.unconfirmedPrizeHits, [
    {
      playType: 'pick10',
      hitCount: 10,
      winningStakeCount: 1,
      notice: FLOATING_PRIZE_NOTICE,
    },
  ])
  assert.equal(settledRecord.items[0].settlement.prizeAmount, 0)
  assert.equal(
    settledRecord.items[0].numberGroups[0].settlement.hasUnconfirmedPrize,
    true,
  )
})
