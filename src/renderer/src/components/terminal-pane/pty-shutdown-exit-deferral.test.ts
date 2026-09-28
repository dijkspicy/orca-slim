import { expect, it, vi } from 'vitest'
import {
  consumeCommittedPtyShutdownExit,
  deferPtyShutdownExit,
  markCommittedPtyShutdowns,
  settleDeferredPtyShutdownExits
} from './pty-shutdown-exit-deferral'

it('settles every deferred exit even when one cleanup throws', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const second = vi.fn()
  deferPtyShutdownExit('pty-callback-isolation', () => {
    throw new Error('disposed pane')
  })
  deferPtyShutdownExit('pty-callback-isolation', second)

  expect(() =>
    settleDeferredPtyShutdownExits(['pty-callback-isolation'], 'committed')
  ).not.toThrow()
  expect(second).toHaveBeenCalledWith('committed')
  expect(consoleError).toHaveBeenCalled()
  consoleError.mockRestore()
})

it('consumes a committed late-exit guard only once', () => {
  markCommittedPtyShutdowns(['pty-late-commit'])

  expect(consumeCommittedPtyShutdownExit('pty-late-commit')).toBe(true)
  expect(consumeCommittedPtyShutdownExit('pty-late-commit')).toBe(false)
})

it('clears a committed guard when its deferred exit is replayed', () => {
  const callback = vi.fn()
  deferPtyShutdownExit('pty-deferred-commit', callback)
  markCommittedPtyShutdowns(['pty-deferred-commit'])

  settleDeferredPtyShutdownExits(['pty-deferred-commit'], 'committed')

  expect(callback).toHaveBeenCalledWith('committed')
  expect(consumeCommittedPtyShutdownExit('pty-deferred-commit')).toBe(false)
})
