import { beforeEach, describe, expect, it, vi } from 'vitest'
import { waitForAgentReady } from './agent-ready-wait'
import { useAppStore } from '@/store'

vi.mock('@/store', () => ({
  useAppStore: {
    getState: vi.fn()
  }
}))

vi.mock('./tui-agent-startup', () => ({
  isShellProcess: vi.fn(() => false)
}))

describe('waitForAgentReady', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('window', {
      setTimeout,
      api: { pty: { inspectProcess: vi.fn() } }
    })
    vi.mocked(useAppStore.getState).mockReturnValue({
      ptyIdsByTabId: { 'tab-1': ['pty-1'] },
      runtimePaneTitlesByTabId: {},
      tabsByWorktree: {},
      settings: {}
    } as never)
  })

  it('recognizes a Windows foreground process reported as a full executable path', async () => {
    vi.mocked(window.api.pty.inspectProcess).mockResolvedValue({
      foregroundProcess: String.raw`C:\Users\dev\AppData\Roaming\npm\claude.exe`,
      hasChildProcesses: false
    })

    await expect(waitForAgentReady('tab-1', 'claude', { timeoutMs: 100 })).resolves.toEqual({
      ready: true,
      reason: 'foreground-match'
    })
  })
})
