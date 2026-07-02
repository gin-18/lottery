import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  buildIssueOptions,
  createEmptyForm,
} from '../src/views/betting-ledger/utils/betting-record-form-draft.js'

const ledgerSource = readFileSync(
  new URL('../src/views/betting-ledger/BettingLedger.vue', import.meta.url),
  'utf8',
)
const componentSource = readFileSync(
  new URL('../src/views/betting-ledger/components/BettingRecordFormDrawer.vue', import.meta.url),
  'utf8',
)

test('createEmptyForm defaults first item to pick1 single', () => {
  const form = createEmptyForm(() => 'id-1')

  assert.equal(form.items[0].playType, 'pick1')
  assert.equal(form.items[0].selectionMode, 'single')
})

test('buildIssueOptions prepends the next draw issue', () => {
  const options = buildIssueOptions([
    {
      code: '2026171',
      day: '2026-06-30',
      next_code: '2026172',
      next_open_time: '2026-07-01 21:30:00',
    },
    {
      code: '2026170',
      day: '2026-06-29',
      next_code: '2026171',
      next_open_time: '2026-06-30 21:30:00',
    },
  ])

  assert.deepEqual(
    options.map((option) => option.value),
    [
      '2026172(2026-07-01)',
      '2026171(2026-06-30)',
      '2026170(2026-06-29)',
    ],
  )
})

test('delete group button uses error style instead of ghost', () => {
  const buttonMatch = componentSource.match(/<button[\s\S]*?删除号码组[\s\S]*?<\/button>/)

  assert.ok(buttonMatch, 'expected to find the delete group button')
  assert.match(buttonMatch[0], /@click="removeGroup\(item.id, group.id\)"/)
  assert.match(buttonMatch[0], /class="btn btn-xs btn-error"/)
  assert.doesNotMatch(buttonMatch[0], /btn-ghost/)
})

test('add item button lives in the drawer footer', () => {
  const footerMatch = componentSource.match(/<template #footer>[\s\S]*?<\/template>/)
  const sourceBeforeFooter = componentSource.split('<template #footer>')[0]

  assert.ok(footerMatch, 'expected to find the drawer footer')
  assert.match(footerMatch[0], /@click="addItem"/)
  assert.match(footerMatch[0], /添加投注项/)
  assert.match(footerMatch[0], /form="betting-record-form"/)
  assert.match(footerMatch[0], /class="btn btn-sm btn-primary"/)
  assert.doesNotMatch(footerMatch[0], /{{ form\.items\.length }} 个投注项 \/ {{ draftTotals\.totalStakeCount }} 注 \//)
  assert.match(componentSource, /const totalDetailItems = computed\(\(\) => getTotalDetailItems\(draftTotals\.value, form\.items\.length\)\)/)
  assert.match(componentSource, /{ key: 'itemCount', label: '投注项', value: `\$\{itemCount\} 个` }/)
  assert.doesNotMatch(sourceBeforeFooter, /{{ form\.items\.length }} 个投注项 \/ {{ draftTotals\.totalStakeCount }} 注 \//)
  assert.match(footerMatch[0], /<div class="flex items-center gap-2">[\s\S]*重置[\s\S]*保存/)
})

test('adding an item wires scroll, focus, and reduced-motion handling', () => {
  assert.match(componentSource, /import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'/)
  assert.match(componentSource, /form\.items = \[\.\.\.form\.items, newItem\]\s+revealAddedItem\(newItem\.id\)/)
  assert.match(componentSource, /await nextTick\(\)\s+scrollAddedItemIntoView\(itemId\)\s+focusAddedItemPlayType\(itemId\)\s+highlightAddedItem\(itemId\)/)
  assert.match(componentSource, /:ref="\(element\) => setItemSectionRef\(item\.id, element\)"/)
  assert.match(componentSource, /:ref="\(element\) => setItemPlayTypeRef\(item\.id, element\)"/)
  assert.match(componentSource, /scrollContainer\.scrollTo\(\{\s+top: nextScrollTop,\s+behavior: getScrollBehavior\(\),\s+\}\)/)
  assert.match(componentSource, /playTypeSelect\.focus\(\{ preventScroll: true \}\)/)
  assert.match(componentSource, /window\.matchMedia\(REDUCED_MOTION_MEDIA_QUERY\)\.matches/)
  assert.match(componentSource, /:class="\{ 'border-primary bg-primary\/5': highlightedItemId === item\.id \}"/)
})

test('betting ledger page exposes import trigger and hidden file input', () => {
  assert.match(ledgerSource, /function triggerImport\(\) \{/)
  assert.match(ledgerSource, /ledgerStore\.importRecords\(file\)/)
  assert.match(ledgerSource, /accept="application\/json"/)
  assert.match(ledgerSource, /icon-\[octicon--download-16\]/)
  assert.match(ledgerSource, /icon-\[octicon--upload-16\]/)
  assert.match(
    ledgerSource,
    /aria-label="导出"[\s\S]*aria-label="导入"[\s\S]*aria-label="月份汇总"[\s\S]*aria-label="新增"/,
  )
})
