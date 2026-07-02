import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  buildIssueOptions,
  createEmptyForm,
  getBankerNumberLimit,
  getAvailableDragNumbers,
  getNextBankerSelection,
  getNextDragNumbers,
  hasSelectedAllDragNumbers,
  trimBankerSelection,
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

test('drag bulk selection selects all non-banker numbers and then clears', () => {
  const group = {
    bankerNumbers: [1, 2],
    dragNumbers: [3, 4],
  }

  const nextDragNumbers = getNextDragNumbers(group)

  assert.equal(nextDragNumbers.length, 78)
  assert.deepEqual(nextDragNumbers.slice(0, 3), [3, 4, 5])
  assert.equal(nextDragNumbers.at(-1), 80)
  assert.equal(nextDragNumbers.includes(1), false)
  assert.equal(nextDragNumbers.includes(2), false)
  assert.equal(hasSelectedAllDragNumbers({ ...group, dragNumbers: nextDragNumbers }), true)
  assert.deepEqual(getNextDragNumbers({ ...group, dragNumbers: nextDragNumbers }), [])
})

test('drag all-selected state follows the current banker exclusions', () => {
  const dragNumbers = getAvailableDragNumbers({ bankerNumbers: [1], dragNumbers: [] })
  const group = {
    bankerNumbers: [1, 2],
    dragNumbers: dragNumbers.filter((number) => number !== 2),
  }

  assert.equal(hasSelectedAllDragNumbers(group), true)
})

test('banker selection limit follows the selected play type', () => {
  assert.equal(getBankerNumberLimit('pick1'), 0)
  assert.equal(getBankerNumberLimit('pick2'), 1)
  assert.equal(getBankerNumberLimit('pick10'), 9)
})

test('banker selection replaces the latest selected banker after reaching the play limit', () => {
  const selection = getNextBankerSelection({
    playType: 'pick3',
    number: 9,
    group: {
      bankerNumbers: [3, 7],
      bankerNumberOrder: [7, 3],
      dragNumbers: [9, 10],
    },
  })

  assert.deepEqual(selection.bankerNumbers, [7, 9])
  assert.deepEqual(selection.bankerNumberOrder, [7, 9])
  assert.deepEqual(selection.dragNumbers, [10])
})

test('banker selection removal updates the temporary selected order', () => {
  const selection = getNextBankerSelection({
    playType: 'pick4',
    number: 7,
    group: {
      bankerNumbers: [3, 7],
      bankerNumberOrder: [7, 3],
      dragNumbers: [10],
    },
  })

  assert.deepEqual(selection.bankerNumbers, [3])
  assert.deepEqual(selection.bankerNumberOrder, [3])
  assert.deepEqual(selection.dragNumbers, [10])
})

test('banker selection trims newer selected bankers when play limit shrinks', () => {
  const selection = trimBankerSelection(
    {
      bankerNumbers: [3, 7, 9, 12],
      bankerNumberOrder: [7, 3, 12, 9],
      dragNumbers: [10, 11],
    },
    'pick3',
  )

  assert.deepEqual(selection.bankerNumbers, [3, 7])
  assert.deepEqual(selection.bankerNumberOrder, [7, 3])
  assert.deepEqual(selection.dragNumbers, [10, 11])
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

test('number selection uses tabs inside each number group', () => {
  assert.match(componentSource, /function getNumberTabName\(group\) \{\s+return `number-tabs-\$\{group\.id\}`\s+\}/)
  assert.match(
    componentSource,
    /<div v-if="item\.selectionMode !== DANTUO_MODE" role="tablist" class="tabs tabs-lifted">[\s\S]*class="tab whitespace-nowrap"[\s\S]*aria-label="号码"/,
  )
  assert.match(
    componentSource,
    /<div v-else role="tablist" class="tabs tabs-lifted">[\s\S]*class="tab whitespace-nowrap"[\s\S]*aria-label="胆码"[\s\S]*class="tab whitespace-nowrap"[\s\S]*aria-label="拖码"/,
  )
  assert.doesNotMatch(componentSource, /class="tab"[\s\S]*aria-label="号码"/)
  assert.doesNotMatch(componentSource, /class="tab"[\s\S]*aria-label="胆码"/)
  assert.doesNotMatch(componentSource, /class="tab"[\s\S]*aria-label="拖码"/)
  assert.match(componentSource, /class="tab-content bg-base-100 border-base-300 rounded-box p-4"/)
  assert.doesNotMatch(componentSource, /<div class="text-sm font-medium">胆码<\/div>/)
  assert.doesNotMatch(componentSource, /<div class="text-sm font-medium">拖码<\/div>/)
})

test('dantuo group header exposes bulk drag selection before the delete button', () => {
  const groupHeaderMatch = componentSource.match(
    /<div class="text-sm font-medium">号码组 \{\{ groupIndex \+ 1 \}\}<\/div>[\s\S]*?<div class="flex items-center gap-2">[\s\S]*?<\/div>/,
  )
  const dragTabMatch = componentSource.match(/aria-label="拖码"[\s\S]*?`drag-\$\{group\.id\}-\$\{number\}`/)

  assert.ok(groupHeaderMatch, 'expected to find the number group header controls')
  assert.ok(dragTabMatch, 'expected to find the drag tab content')
  assert.match(groupHeaderMatch[0], /v-if="item\.selectionMode === DANTUO_MODE"/)
  assert.match(
    groupHeaderMatch[0],
    /@click="toggleDragNumbers\(group\)"[\s\S]*@click="removeGroup\(item\.id, group\.id\)"/,
  )
  assert.match(groupHeaderMatch[0], /{{ getDragBulkButtonLabel\(group\) }}/)
  assert.doesNotMatch(dragTabMatch[0], /@click="toggleDragNumbers\(group\)"/)
})

test('betting form keeps banker selection order temporary and trims it on play changes', () => {
  const getDraftMatch = componentSource.match(/function getDraft\(\) \{[\s\S]*?function handleSubmit/)

  assert.ok(getDraftMatch, 'expected to find getDraft')
  assert.match(componentSource, /bankerNumberOrder: \[\.\.\.group\.bankerNumbers\]/)
  assert.match(componentSource, /@change="handlePlayTypeChange\(item, \$event\.target\.value\)"/)
  assert.match(componentSource, /applyBankerSelection\(group, trimBankerSelection\(group, playType\)\)/)
  assert.doesNotMatch(getDraftMatch[0], /bankerNumberOrder/)
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
