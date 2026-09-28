import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('electron', async () =>
  (await import('./createMainWindow-test-harness')).electronModuleMock()
)
vi.mock('@electron-toolkit/utils', async () =>
  (await import('./createMainWindow-test-harness')).electronToolkitUtilsMock()
)
vi.mock('./macos-tahoe-release', async () =>
  (await import('./createMainWindow-test-harness')).macosTahoeReleaseMock()
)
vi.mock('../app-icon', async () => (await import('./createMainWindow-test-harness')).appIconMock())

import { createMainWindow } from './createMainWindow'
import { browserWindowMock, resetMainWindowMocks } from './createMainWindow-test-harness'

describe('createMainWindow', () => {
  beforeEach(() => {
    resetMainWindowMocks()
    vi.useRealTimers()
  })

  it('does not read destroyed webContents during closed cleanup', () => {
    const windowHandlers: Record<string, (...args: any[]) => void> = {}
    const webContents = {
      on: vi.fn(),
      setZoomLevel: vi.fn(),
      setBackgroundThrottling: vi.fn(),
      invalidate: vi.fn(),
      setWindowOpenHandler: vi.fn(),
      send: vi.fn(),
      isDevToolsOpened: vi.fn(),
      openDevTools: vi.fn(),
      closeDevTools: vi.fn()
    }
    let webContentsDestroyed = false
    const browserWindowInstance = {
      get webContents() {
        if (webContentsDestroyed) {
          throw new Error('Object has been destroyed')
        }
        return webContents
      },
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      isDestroyed: vi.fn(() => false),
      isMaximized: vi.fn(() => true),
      isFullScreen: vi.fn(() => false),
      getSize: vi.fn(() => [1200, 800]),
      setSize: vi.fn(),
      maximize: vi.fn(),
      show: vi.fn(),
      loadFile: vi.fn(() => Promise.resolve()),
      loadURL: vi.fn(() => Promise.resolve())
    }
    browserWindowMock.mockImplementation(function () {
      return browserWindowInstance
    })

    createMainWindow(null)

    webContentsDestroyed = true

    // Why: Electron may destroy webContents before BrowserWindow's `closed`
    // cleanup runs during updater shutdown. The cleanup must not crash, or
    // Squirrel.Mac never reaches the relaunch step.
    expect(() => windowHandlers.closed?.()).not.toThrow()
  })

  it('notifies the caller when the renderer process is gone', () => {
    const windowHandlers: Record<string, (...args: any[]) => void> = {}
    const webContents = {
      id: 142,
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      setZoomLevel: vi.fn(),
      setBackgroundThrottling: vi.fn(),
      invalidate: vi.fn(),
      setWindowOpenHandler: vi.fn(),
      send: vi.fn()
    }
    const browserWindowInstance = {
      webContents,
      on: vi.fn(),
      isDestroyed: vi.fn(() => false),
      isMaximized: vi.fn(() => true),
      isFullScreen: vi.fn(() => false),
      getSize: vi.fn(() => [1200, 800]),
      setSize: vi.fn(),
      maximize: vi.fn(),
      show: vi.fn(),
      loadFile: vi.fn(() => Promise.resolve()),
      loadURL: vi.fn(() => Promise.resolve())
    }
    browserWindowMock.mockImplementation(function () {
      return browserWindowInstance
    })
    const onRendererProcessGone = vi.fn()

    createMainWindow(null, { onRendererProcessGone })

    const details = { reason: 'crashed', exitCode: 5 } as Electron.RenderProcessGoneDetails
    windowHandlers['render-process-gone']?.({} as never, details)

    expect(onRendererProcessGone).toHaveBeenCalledWith(details, 142)
  })

  it('passes the renderer webContents id through crash recording and recovery callbacks', () => {
    vi.useFakeTimers()

    const windowHandlers: Record<string, (...args: any[]) => void> = {}
    const webContents = {
      id: 424,
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      setZoomLevel: vi.fn(),
      setBackgroundThrottling: vi.fn(),
      invalidate: vi.fn(),
      setWindowOpenHandler: vi.fn(),
      send: vi.fn()
    }
    const browserWindowInstance = {
      webContents,
      on: vi.fn(),
      isDestroyed: vi.fn(() => false),
      isMaximized: vi.fn(() => true),
      isFullScreen: vi.fn(() => false),
      getSize: vi.fn(() => [1200, 800]),
      setSize: vi.fn(),
      maximize: vi.fn(),
      show: vi.fn(),
      loadFile: vi.fn(() => Promise.resolve()),
      loadURL: vi.fn(() => Promise.resolve())
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    browserWindowMock.mockImplementation(function () {
      return browserWindowInstance
    })
    const onRendererProcessGone = vi.fn()
    const shouldRecoverRenderer = vi.fn(() => true)

    try {
      createMainWindow(null, {
        onRendererProcessGone,
        shouldRecoverRenderer
      })

      const details = { reason: 'crashed', exitCode: 5 } as Electron.RenderProcessGoneDetails
      windowHandlers['render-process-gone']?.({} as never, details)
      vi.advanceTimersByTime(250)

      expect(onRendererProcessGone).toHaveBeenCalledWith(details, 424)
      expect(shouldRecoverRenderer).toHaveBeenCalledWith(details, 424)
    } finally {
      consoleError.mockRestore()
    }
  })

  it('forwards expected renderer teardowns so the recorder can diagnose suppression', () => {
    const windowHandlers: Record<string, (...args: any[]) => void> = {}
    const webContents = {
      id: 142,
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      setZoomLevel: vi.fn(),
      setBackgroundThrottling: vi.fn(),
      invalidate: vi.fn(),
      setWindowOpenHandler: vi.fn(),
      send: vi.fn()
    }
    const browserWindowInstance = {
      webContents,
      on: vi.fn(),
      isDestroyed: vi.fn(() => false),
      isMaximized: vi.fn(() => true),
      isFullScreen: vi.fn(() => false),
      getSize: vi.fn(() => [1200, 800]),
      setSize: vi.fn(),
      maximize: vi.fn(),
      show: vi.fn(),
      loadFile: vi.fn(() => Promise.resolve()),
      loadURL: vi.fn(() => Promise.resolve())
    }
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    browserWindowMock.mockImplementation(function () {
      return browserWindowInstance
    })
    const onRendererProcessGone = vi.fn()

    createMainWindow(null, { onRendererProcessGone })

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'killed',
        exitCode: 15
      } as Electron.RenderProcessGoneDetails
    )

    expect(onRendererProcessGone).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'killed', exitCode: 15 }),
      expect.any(Number)
    )

    consoleError.mockRestore()
  })

  const createRendererRecoveryWindowHarness = () => {
    const windowHandlers: Record<string, (...args: any[]) => void> = {}
    const webContents = {
      id: 143,
      getURL: vi.fn(() => 'file:///opt/orca/renderer/index.html'),
      isDestroyed: vi.fn(() => false),
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      setZoomLevel: vi.fn(),
      setBackgroundThrottling: vi.fn(),
      invalidate: vi.fn(),
      setWindowOpenHandler: vi.fn(),
      send: vi.fn()
    }
    const browserWindowInstance = {
      webContents,
      on: vi.fn((event, handler) => {
        windowHandlers[event] = handler
      }),
      isDestroyed: vi.fn(() => false),
      isMaximized: vi.fn(() => true),
      isFullScreen: vi.fn(() => false),
      getSize: vi.fn(() => [1200, 800]),
      setSize: vi.fn(),
      maximize: vi.fn(),
      show: vi.fn(),
      loadFile: vi.fn(() => Promise.resolve()),
      loadURL: vi.fn(() => Promise.resolve())
    }
    browserWindowMock.mockImplementation(function () {
      return browserWindowInstance
    })

    return { browserWindowInstance, windowHandlers }
  }

  it('reloads the app shell after an unexpected renderer process loss', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null)

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'crashed',
        exitCode: 5
      } as Electron.RenderProcessGoneDetails
    )
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(2)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('does not reload after renderer loss when recovery is disabled', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null, { shouldRecoverRenderer: () => false })

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'crashed',
        exitCode: 5
      } as Electron.RenderProcessGoneDetails
    )
    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(1)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('rechecks the renderer recovery predicate before reloading', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()
    let shouldRecover = true

    createMainWindow(null, { shouldRecoverRenderer: () => shouldRecover })

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'crashed',
        exitCode: 5
      } as Electron.RenderProcessGoneDetails
    )
    shouldRecover = false
    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(1)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('coalesces repeated renderer losses into one recovery reload', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null)

    const details = {
      reason: 'crashed',
      exitCode: 5
    } as Electron.RenderProcessGoneDetails
    windowHandlers['render-process-gone']?.({} as never, details)
    windowHandlers['render-process-gone']?.({} as never, details)
    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(2)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('does not reload after a clean renderer exit', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null)

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'clean-exit',
        exitCode: 0
      } as Electron.RenderProcessGoneDetails
    )
    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(1)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('cancels renderer recovery when the crashed window is closing', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null)

    windowHandlers['render-process-gone']?.(
      {} as never,
      {
        reason: 'crashed',
        exitCode: 5
      } as Electron.RenderProcessGoneDetails
    )
    windowHandlers.close({ preventDefault: vi.fn() } as never)
    vi.advanceTimersByTime(250)

    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(1)
    expect(browserWindowInstance.loadURL).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('stops auto-reloading after a rapid renderer crash loop trips the breaker', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRendererRecoveryExhausted = vi.fn()
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null, { onRendererRecoveryExhausted })

    const details = { reason: 'crashed', exitCode: 5 } as Electron.RenderProcessGoneDetails
    // Each cycle: renderer dies, breaker allows the first 3 reloads, then opens.
    const driveCrashCycle = (): void => {
      windowHandlers['render-process-gone']?.({} as never, details)
      vi.advanceTimersByTime(250)
    }
    driveCrashCycle()
    driveCrashCycle()
    driveCrashCycle()
    // 1 initial load + 3 recoveries.
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(4)
    expect(onRendererRecoveryExhausted).not.toHaveBeenCalled()

    // 4th crash within the window: breaker is open, no further reload.
    driveCrashCycle()
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(4)
    expect(onRendererRecoveryExhausted).toHaveBeenCalledTimes(1)
    expect(onRendererRecoveryExhausted).toHaveBeenCalledWith(
      expect.objectContaining({ recentRecoveryCount: 3 })
    )

    consoleError.mockRestore()
  })

  it('serves a manual retry while the breaker stays open for the next crash', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRendererRecoveryExhausted = vi.fn()
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    createMainWindow(null, { onRendererRecoveryExhausted })

    const details = { reason: 'crashed', exitCode: 5 } as Electron.RenderProcessGoneDetails
    const driveCrashCycle = (): void => {
      windowHandlers['render-process-gone']?.({} as never, details)
      vi.advanceTimersByTime(250)
    }
    driveCrashCycle()
    driveCrashCycle()
    driveCrashCycle()
    driveCrashCycle()
    expect(onRendererRecoveryExhausted).toHaveBeenCalledTimes(1)
    // 1 initial load + 3 recoveries; the 4th crash was refused.
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(4)

    // The recovery prompt's Reload button takes the watched retry, which the breaker never gates.
    onRendererRecoveryExhausted.mock.calls[0]?.[0].retry()
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(5)

    // Still-poisoned machine: the next crash re-raises the prompt immediately instead of re-arming auto-reloads.
    driveCrashCycle()
    expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(5)
    expect(onRendererRecoveryExhausted).toHaveBeenCalledTimes(2)

    consoleError.mockRestore()
  })

  it('bounds renderer launch-failed recovery with the crash-loop breaker', () => {
    vi.useFakeTimers()

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onRendererRecoveryExhausted = vi.fn()
    const { browserWindowInstance, windowHandlers } = createRendererRecoveryWindowHarness()

    try {
      createMainWindow(null, {
        onRendererRecoveryExhausted,
        shouldRecoverRenderer: (details) => details.reason === 'launch-failed'
      })

      const details = {
        reason: 'launch-failed',
        exitCode: 18
      } as Electron.RenderProcessGoneDetails
      const driveLaunchFailure = (): void => {
        windowHandlers['render-process-gone']?.({} as never, details)
        vi.advanceTimersByTime(250)
      }

      driveLaunchFailure()
      driveLaunchFailure()
      driveLaunchFailure()
      expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(4)

      driveLaunchFailure()
      expect(browserWindowInstance.loadFile).toHaveBeenCalledTimes(4)
      expect(onRendererRecoveryExhausted).toHaveBeenCalledOnce()
      expect(onRendererRecoveryExhausted).toHaveBeenCalledWith(
        expect.objectContaining({ details, recentRecoveryCount: 3 })
      )
    } finally {
      consoleError.mockRestore()
    }
  })
})
