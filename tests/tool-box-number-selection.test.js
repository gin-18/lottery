import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const toolBoxSource = readFileSync(
  new URL('../src/views/tool-box/ToolBox.vue', import.meta.url),
  'utf8',
)
const numberSelectionSource = readFileSync(
  new URL('../src/views/tool-box/components/number-selection/NumberSelection.vue', import.meta.url),
  'utf8',
)
const compoundBetSource = readFileSync(
  new URL('../src/views/tool-box/CompoundBet.vue', import.meta.url),
  'utf8',
)
const attachedBetSource = readFileSync(
  new URL('../src/views/tool-box/AttachedBet.vue', import.meta.url),
  'utf8',
)

test('tool-box number selection is a trigger button instead of owning the drawer', () => {
  assert.doesNotMatch(numberSelectionSource, /SettingBox/)
  assert.doesNotMatch(numberSelectionSource, /LoDrawer/)
  assert.match(numberSelectionSource, /defineEmits\(\['open'\]\)/)
})

test('tool-box number selection opens from the count button', () => {
  const buttonMatch = numberSelectionSource.match(/<button[\s\S]*?{{ props\.selectedNumber }} 个[\s\S]*?<\/button>/)

  assert.ok(buttonMatch, 'expected the selected count button to exist')
  assert.match(buttonMatch[0], /@click="\$emit\('open'\)"/)
})

test('tool-box number selection keeps count button content on one line', () => {
  const buttonMatch = numberSelectionSource.match(/<button[\s\S]*?{{ props\.selectedNumber }} 个[\s\S]*?<\/button>/)

  assert.ok(buttonMatch, 'expected the selected count button to exist')
  assert.match(buttonMatch[0], /min-w-20/)
  assert.match(buttonMatch[0], /whitespace-nowrap/)
  assert.match(buttonMatch[0], /shrink-0/)
  assert.match(buttonMatch[0], /<span class="whitespace-nowrap">{{ props\.selectedNumber }} 个<\/span>/)
})

test('attached bet keeps banker and drag labels on one line', () => {
  assert.match(attachedBetSource, /<span class="whitespace-nowrap">胆码<\/span>/)
  assert.match(attachedBetSource, /<span class="whitespace-nowrap">拖码<\/span>/)
})

test('calculator tabs keep their titles on one line', () => {
  assert.match(toolBoxSource, /class="tab whitespace-nowrap"\s+aria-label="复式"/)
  assert.match(toolBoxSource, /class="tab whitespace-nowrap"\s+aria-label="胆拖"/)
})

test('compound bet owns one shared number selection drawer', () => {
  assert.match(compoundBetSource, /import NumberSelectionDrawer from '\.\/components\/number-selection\/NumberSelectionDrawer\.vue'/)
  assert.equal((compoundBetSource.match(/<NumberSelectionDrawer/g) ?? []).length, 1)
})

test('attached bet owns one shared number selection drawer', () => {
  assert.match(attachedBetSource, /import NumberSelectionDrawer from '\.\/components\/number-selection\/NumberSelectionDrawer\.vue'/)
  assert.equal((attachedBetSource.match(/<NumberSelectionDrawer/g) ?? []).length, 1)
})
