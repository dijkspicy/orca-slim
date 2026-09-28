import type {
  AgentSessionBackgroundTask,
  AgentSessionBackgroundTaskState
} from '../../shared/agent-session-wire'
import {
  CodexBackgroundCommandTracker,
  type CodexBackgroundTaskEvent
} from './codex-background-command-tracker'

/** Projects provider background-command frames into the tasks strip. */
export class CodexBackgroundTaskTracker {
  private publishedFingerprint = '[]'
  private publishedState: AgentSessionBackgroundTaskState | null = null
  private readonly commands: CodexBackgroundCommandTracker

  constructor(private readonly primaryThreadId: string) {
    this.commands = new CodexBackgroundCommandTracker(primaryThreadId)
  }

  get state(): AgentSessionBackgroundTaskState | null {
    // Journal admission precedes observe; readers must not see its pending facts.
    return this.publishedState
  }

  canObserve(event: CodexBackgroundTaskEvent): boolean {
    return this.commands.canObserve(event)
  }

  observe(event: CodexBackgroundTaskEvent): boolean {
    const itemEvent = event.method === 'item/started' || event.method === 'item/completed'
    if (itemEvent) {
      this.commands.observe(event)
      return this.refresh()
    }
    return false
  }

  clear(): boolean {
    this.commands.clear()
    return this.refresh()
  }

  private tasks(): AgentSessionBackgroundTask[] {
    return [...this.commands.tasks()]
  }

  private refresh(): boolean {
    const tasks = this.tasks()
    const fingerprint = JSON.stringify(tasks)
    if (fingerprint === this.publishedFingerprint) {
      return false
    }
    this.publishedFingerprint = fingerprint
    this.publishedState = tasks.length
      ? { state: 'monitoring', tasks, supportsStopAll: false }
      : null
    return true
  }
}
