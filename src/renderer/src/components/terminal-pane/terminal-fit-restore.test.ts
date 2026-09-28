import { beforeEach, describe, expect, it, vi } from 'vitest'
import { restoreTerminalFitToDesktop, restoreTerminalFitsToDesktop } from './terminal-fit-restore'

const restoreTerminalFit = vi.fn()

describe('terminal-fit-restore', () => {
  beforeEach(() => {
    restoreTerminalFit.mockReset()
    vi.stubGlobal('window', {
      api: {
        runtime: {
          restoreTerminalFit
        }
      }
    })
  })

  it('restores local terminals through desktop IPC', async () => {
    restoreTerminalFit.mockResolvedValue({ restored: true })

    await expect(
      restoreTerminalFitToDesktop('pty-local', { activeRuntimeEnvironmentId: 'env-unused' })
    ).resolves.toBe(true)

    expect(restoreTerminalFit).toHaveBeenCalledWith('pty-local')
  })

  it('deduplicates bulk restore PTYs and succeeds when any restore succeeds', async () => {
    restoreTerminalFit.mockImplementation(async (ptyId: string) => ({
      restored: ptyId === 'pty-2'
    }))

    await expect(
      restoreTerminalFitsToDesktop(['pty-1', 'pty-1', 'pty-2'], undefined)
    ).resolves.toBe(true)

    expect(restoreTerminalFit).toHaveBeenCalledTimes(2)
    expect(restoreTerminalFit).toHaveBeenNthCalledWith(1, 'pty-1')
    expect(restoreTerminalFit).toHaveBeenNthCalledWith(2, 'pty-2')
  })

  it('treats failed local restore transport as not restored', async () => {
    restoreTerminalFit.mockRejectedValue(new Error('restore failed'))

    await expect(restoreTerminalFitToDesktop('pty-local', undefined)).resolves.toBe(false)
  })

  it('fails a local restore whose invoke never resolves instead of hanging', async () => {
    vi.useFakeTimers()
    try {
      // Why: models a wedged runtime/daemon after system sleep (#9447) — the
      // IPC invoke stays pending forever.
      restoreTerminalFit.mockReturnValue(new Promise(() => {}))

      let settled: boolean | null = null
      const pending = restoreTerminalFitToDesktop('pty-local', undefined).then((restored) => {
        settled = restored
      })
      await vi.advanceTimersByTimeAsync(14_999)
      expect(settled).toBeNull()
      await vi.advanceTimersByTimeAsync(1)
      await pending
      expect(settled).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('gives restores started later only the remainder of the shared bulk deadline', async () => {
    vi.useFakeTimers()
    try {
      restoreTerminalFit.mockImplementation(
        (ptyId: string) =>
          new Promise((resolve) => {
            if (ptyId === 'pty-0') {
              setTimeout(() => resolve({ restored: false }), 10_000)
            }
          })
      )
      const ptyIds = Array.from({ length: 100 }, (_, index) => `pty-${index}`)

      const pending = restoreTerminalFitsToDesktop(ptyIds, undefined)
      expect(restoreTerminalFit).toHaveBeenCalledTimes(8)
      await vi.advanceTimersByTimeAsync(10_000)
      expect(restoreTerminalFit).toHaveBeenCalledTimes(9)
      await vi.advanceTimersByTimeAsync(4_999)
      let settled = false
      void pending.then(() => {
        settled = true
      })
      expect(settled).toBe(false)
      await vi.advanceTimersByTimeAsync(1)

      await expect(pending).resolves.toBe(false)
      expect(restoreTerminalFit).toHaveBeenCalledTimes(9)
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })
})
