import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const componentSource = readFileSync(
  new URL('../src/components/range/RangeTendencyStatistics.vue', import.meta.url),
  'utf8',
)

test('RangeTendencyStatistics renders on initial mount', () => {
  const hasImmediateWatch = /watch\([\s\S]*renderChart[\s\S]*immediate:\s*true/.test(componentSource)
  const hasMountedRender = /onMounted\(\s*renderChart\s*\)/.test(componentSource)

  assert.equal(
    hasImmediateWatch || hasMountedRender,
    true,
    'RangeTendencyStatistics must render the chart on initial mount',
  )
})
