import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { lockBodyScroll, unlockBodyScroll } from '../src/composables/useBodyScrollLock.js'

const composableSource = readFileSync(
  new URL('../src/composables/useBodyScrollLock.js', import.meta.url),
  'utf8',
)
const drawerSource = readFileSync(
  new URL('../src/components/content/LoDrawer.vue', import.meta.url),
  'utf8',
)

test('LoDrawer uses the shared body scroll lock while open', () => {
  assert.match(drawerSource, /useBodyScrollLock/)
  assert.match(drawerSource, /computed\(\(\) => props\.modelValue\)/)
})

test('body scroll lock stores previous overflow before hiding page scroll', () => {
  assert.match(composableSource, /previousBodyOverflow = targets\.body\.style\.overflow/)
  assert.match(composableSource, /previousHtmlOverflow = targets\.html\.style\.overflow/)
  assert.match(composableSource, /targets\.body\.style\.overflow = 'hidden'/)
  assert.match(composableSource, /targets\.body\.style\.position = 'fixed'/)
  assert.match(composableSource, /targets\.html\.style\.overflow = 'hidden'/)
})

test('body scroll lock uses a counter so overlapping overlays do not unlock early', () => {
  assert.match(composableSource, /let lockCount = 0/)
  assert.match(composableSource, /lockCount \+= 1/)
  assert.match(composableSource, /lockCount -= 1/)
  assert.match(composableSource, /if \(lockCount > 0\) return/)
})

test('body scroll lock keeps the page locked until every overlay closes', () => {
  const originalDocument = globalThis.document
  const originalWindow = globalThis.window
  const scrollCalls = []

  globalThis.document = {
    body: {
      style: {
        overflow: 'auto',
        position: 'relative',
        top: '',
        width: '',
      },
    },
    documentElement: { style: { overflow: 'clip' } },
  }
  globalThis.window = {
    scrollY: 72,
    pageYOffset: 72,
    scrollTo: (...args) => scrollCalls.push(args),
  }

  try {
    lockBodyScroll()
    lockBodyScroll()

    assert.equal(document.body.style.overflow, 'hidden')
    assert.equal(document.body.style.position, 'fixed')
    assert.equal(document.body.style.top, '-72px')
    assert.equal(document.body.style.width, '100%')
    assert.equal(document.documentElement.style.overflow, 'hidden')

    unlockBodyScroll()
    assert.equal(document.body.style.overflow, 'hidden')
    assert.equal(document.body.style.position, 'fixed')
    assert.equal(document.documentElement.style.overflow, 'hidden')
    assert.deepEqual(scrollCalls, [])

    unlockBodyScroll()
    assert.equal(document.body.style.overflow, 'auto')
    assert.equal(document.body.style.position, 'relative')
    assert.equal(document.body.style.top, '')
    assert.equal(document.body.style.width, '')
    assert.equal(document.documentElement.style.overflow, 'clip')
    assert.deepEqual(scrollCalls, [[0, 72]])
  } finally {
    globalThis.document = originalDocument
    globalThis.window = originalWindow
  }
})
