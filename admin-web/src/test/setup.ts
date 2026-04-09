import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  const scrollToMock = vi.fn()
  vi.stubGlobal('scrollTo', scrollToMock)
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    value: scrollToMock,
    writable: true,
  })
})

afterEach(() => {
  sessionStorage.clear()
  vi.unstubAllGlobals()
})
