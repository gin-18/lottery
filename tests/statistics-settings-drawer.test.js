import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const statisticsViewPaths = [
  '../src/views/interval-statistics/IntervalStatistics.vue',
  '../src/views/number-statistics/NumberStatistics.vue',
  '../src/views/tail-statistics/TailStatistics.vue',
]

const statisticsViewSources = statisticsViewPaths.map((path) =>
  readFileSync(new URL(path, import.meta.url), 'utf8'),
)

test('statistics views own their settings trigger and drawer', () => {
  for (const source of statisticsViewSources) {
    assert.match(source, /import LoDrawer from '@\/components\/content\/LoDrawer\.vue'/)
    assert.match(source, /aria-label="打开设置"/)
    assert.match(source, /class="btn fixed bottom-4 right-4"/)
    assert.match(source, /<LoDrawer[\s\S]*v-model="isSettingsDrawerOpen"/)
    assert.doesNotMatch(source, /SettingBox/)
  }
})

test('the retired SettingBox component is removed', () => {
  const settingBoxUrl = new URL(
    '../src/components/content/SettingBox.vue',
    import.meta.url,
  )

  assert.equal(existsSync(settingBoxUrl), false)
})

test('statistics settings drawers match the betting form width', () => {
  for (const source of statisticsViewSources) {
    assert.match(source, /panel-class="md:w-1\/3 lg:w-1\/4"/)
  }
})
