import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const navBarSource = readFileSync(
  new URL('../src/components/NavBar.vue', import.meta.url),
  'utf8',
)

test('navbar scrolls horizontally on narrow screens', () => {
  const navMatch = navBarSource.match(/<nav[\s\S]*?>/)
  const listMatch = navBarSource.match(/<ul[\s\S]*?>/)

  assert.ok(navMatch, 'expected the navbar nav element to exist')
  assert.ok(listMatch, 'expected the navbar list element to exist')
  assert.match(navMatch[0], /w-full/)
  assert.match(navMatch[0], /max-w-full/)
  assert.match(navMatch[0], /overflow-x-auto/)
  assert.match(listMatch[0], /flex-nowrap/)
})

test('navbar item text stays on one line', () => {
  const linkMatch = navBarSource.match(/<RouterLink[\s\S]*?>/)

  assert.ok(linkMatch, 'expected navbar links to exist')
  assert.match(linkMatch[0], /whitespace-nowrap/)
})
