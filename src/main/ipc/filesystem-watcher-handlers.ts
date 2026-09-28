import { ipcMain } from 'electron'
import { watcherLifecycleState } from './filesystem-watcher-lifecycle-state'
import {
  subscribeLocalWatcher,
  unsubscribeLocalWatcher
} from './filesystem-watcher-local-subscription'

export function registerFilesystemWatcherHandlers(): void {
  ipcMain.handle(
    'fs:watchWorktree',
    async (event, args: { worktreePath: string; connectionId?: string }): Promise<void> => {
      // Why: remote (SSH relay) worktree watching was removed with the remote-host
      // domain; a connectionId can no longer name a watchable remote root.
      if (args.connectionId) {
        return
      }
      // Why: reopen the local subsystem for tests and post-shutdown reattachment; stale callers keep the prior generation.
      watcherLifecycleState.localWatchersClosed = false
      await subscribeLocalWatcher(args.worktreePath, event.sender)
    }
  )

  ipcMain.handle(
    'fs:unwatchWorktree',
    (_event, args: { worktreePath: string; connectionId?: string }): void => {
      if (args.connectionId) {
        return
      }
      const senderId = _event.sender.id
      unsubscribeLocalWatcher(args.worktreePath, senderId)
    }
  )
}
