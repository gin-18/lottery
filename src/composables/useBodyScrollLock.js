import { onBeforeUnmount, watch } from 'vue'

let lockCount = 0
let previousBodyOverflow = ''
let previousBodyPosition = ''
let previousBodyTop = ''
let previousBodyWidth = ''
let previousHtmlOverflow = ''
let lockedScrollY = 0

function getScrollTargets() {
  if (typeof document === 'undefined') return null

  return {
    body: document.body,
    html: document.documentElement,
  }
}

function getCurrentScrollY() {
  if (typeof window === 'undefined') return 0

  return window.scrollY || window.pageYOffset || 0
}

function restoreScrollPosition(scrollY) {
  if (typeof window === 'undefined') return
  if (typeof window.scrollTo !== 'function') return

  window.scrollTo(0, scrollY)
}

export function lockBodyScroll() {
  const targets = getScrollTargets()
  if (!targets) return

  if (lockCount === 0) {
    lockedScrollY = getCurrentScrollY()
    previousBodyOverflow = targets.body.style.overflow
    previousBodyPosition = targets.body.style.position
    previousBodyTop = targets.body.style.top
    previousBodyWidth = targets.body.style.width
    previousHtmlOverflow = targets.html.style.overflow
    targets.body.style.overflow = 'hidden'
    targets.body.style.position = 'fixed'
    targets.body.style.top = `-${lockedScrollY}px`
    targets.body.style.width = '100%'
    targets.html.style.overflow = 'hidden'
  }

  lockCount += 1
}

export function unlockBodyScroll() {
  const targets = getScrollTargets()
  if (!targets || lockCount === 0) return

  lockCount -= 1
  if (lockCount > 0) return

  targets.body.style.overflow = previousBodyOverflow
  targets.body.style.position = previousBodyPosition
  targets.body.style.top = previousBodyTop
  targets.body.style.width = previousBodyWidth
  targets.html.style.overflow = previousHtmlOverflow
  previousBodyOverflow = ''
  previousBodyPosition = ''
  previousBodyTop = ''
  previousBodyWidth = ''
  previousHtmlOverflow = ''
  restoreScrollPosition(lockedScrollY)
  lockedScrollY = 0
}

export function useBodyScrollLock(isLocked) {
  let isApplied = false

  function syncBodyScrollLock(shouldLock) {
    if (shouldLock && !isApplied) {
      lockBodyScroll()
      isApplied = true
      return
    }

    if (!shouldLock && isApplied) {
      unlockBodyScroll()
      isApplied = false
    }
  }

  watch(isLocked, syncBodyScrollLock, { immediate: true })

  onBeforeUnmount(() => {
    syncBodyScrollLock(false)
  })
}
