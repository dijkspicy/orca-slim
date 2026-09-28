import { describe, expect, it } from 'vitest'
import { CodexBackgroundTaskTracker } from './codex-background-task-tracker'

const PRIMARY = 'parent-thread'
const PARENT_TURN = 'parent-turn'

function turn(
  method: 'turn/started' | 'turn/completed',
  threadId: string,
  turnId: string,
  status = 'completed'
): { method: string; threadId: string; params: Record<string, unknown> } {
  return { method, threadId, params: { threadId, turn: { id: turnId, status } } }
}

function command(
  threadId = PRIMARY,
  method = 'item/started',
  commandText = 'sleep 90'
): { method: string; threadId: string; params: Record<string, unknown> } {
  return {
    method,
    threadId,
    params: {
      threadId,
      turnId: PARENT_TURN,
      item: {
        type: 'commandExecution',
        id: 'exec-1',
        processId: '71831',
        source: 'unifiedExecStartup',
        command: commandText,
        status: method === 'item/started' ? 'inProgress' : 'completed'
      }
    }
  }
}

describe('CodexBackgroundTaskTracker command integration', () => {
  it('keeps a primary shell visible from launch until its own completion', () => {
    const tracker = new CodexBackgroundTaskTracker(PRIMARY)
    const shell = [{ id: 'codex-command:primary:exec-1', kind: 'command', description: 'sleep 90' }]
    tracker.observe(turn('turn/started', PRIMARY, PARENT_TURN))
    tracker.observe(command())
    // Visible while the turn that launched it is still running.
    expect(tracker.state?.tasks).toEqual(shell)
    tracker.observe(turn('turn/completed', PRIMARY, PARENT_TURN))
    expect(tracker.state?.tasks).toEqual(shell)
    // Only the shell's own completion retires the row.
    tracker.observe(command(PRIMARY, 'item/completed'))
    expect(tracker.state).toBeNull()
  })

  it('never cuts an unqualified primary command mid surrogate pair', () => {
    const tracker = new CodexBackgroundTaskTracker(PRIMARY)
    tracker.observe(turn('turn/started', PRIMARY, PARENT_TURN))
    // The pair straddles the raw description bound itself.
    tracker.observe(
      command(PRIMARY, 'item/started', `${'C'.repeat(511)}\u{1F600}${'D'.repeat(50)}`)
    )
    tracker.observe(turn('turn/completed', PRIMARY, PARENT_TURN))
    const description = tracker.state?.tasks?.[0]?.description ?? ''
    expect(description.length).toBeLessThanOrEqual(512)
    expect(description.isWellFormed()).toBe(true)
  })
})
