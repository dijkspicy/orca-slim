import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createPtySpawnTiming } from './pty-spawn-timing'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['performance'] })
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

it('keeps disabled spawn timing silent', () => {
  vi.stubEnv('ORCA_PTY_SPAWN_TIMING', '0')
  const timing = createPtySpawnTiming()
  timing.mark('provider_spawn')
  timing.log('pty-1')
  expect(console.log).not.toHaveBeenCalled()
})

it('writes numeric monotonic phase durations to the opt-in log line', () => {
  vi.stubEnv('ORCA_PTY_SPAWN_TIMING', '1')
  const timing = createPtySpawnTiming()
  vi.advanceTimersByTime(25)
  timing.mark('preflight')
  vi.advanceTimersByTime(80)
  timing.mark('provider_spawn')
  timing.log('pty-1', { daemon: true, reattach: false })
  expect(console.log).toHaveBeenCalledWith(
    expect.stringContaining('total=105ms preflight=25ms provider_spawn=80ms')
  )
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('daemon=true reattach=false'))
})
