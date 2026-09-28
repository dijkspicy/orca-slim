import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  installNavigationPolicy: vi.fn()
}))

vi.mock('./privileged-window-navigation', () => ({
  installPrivilegedWindowNavigationPolicy: mocks.installNavigationPolicy
}))

import { installMainWindowWebviewSecurity } from './main-window-webview-security'

describe('main window webview security', () => {
  beforeEach(() => {
    mocks.installNavigationPolicy.mockClear()
  })

  it('installs the privileged navigation policy', () => {
    const webContents = { on: vi.fn() }
    installMainWindowWebviewSecurity({ webContents } as never)
    expect(mocks.installNavigationPolicy).toHaveBeenCalledWith(webContents)
  })

  it('fails closed: every webview attach is denied', () => {
    const handlers: Record<string, (event: { preventDefault: () => void }) => void> = {}
    const webContents = {
      on: vi.fn((event, handler) => {
        handlers[event] = handler
      })
    }
    installMainWindowWebviewSecurity({ webContents } as never)

    const preventDefault = vi.fn()
    handlers['will-attach-webview']?.({ preventDefault })
    expect(preventDefault).toHaveBeenCalledOnce()
  })
})
