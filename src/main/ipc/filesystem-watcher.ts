import type { WorktreeWatcherRemoval } from './worktree-watcher-removal'
import {
  closeLocalWatcherForWorktreePath,
  forgetLocalWatcherRemovalSnapshot,
  restoreLocalWatcherAfterFailedRemoval
} from './filesystem-watcher-local-removal'

export { closeLocalWatcherForWorktreePath } from './filesystem-watcher-local-removal'
export { restoreLocalWatcherAfterFailedRemoval } from './filesystem-watcher-local-removal'
export { forgetLocalWatcherRemovalSnapshot } from './filesystem-watcher-local-removal'
export { registerFilesystemWatcherHandlers } from './filesystem-watcher-handlers'
export { closeAllWatchers } from './filesystem-watcher-shutdown'

// ── Public API ───────────────────────────────────────────────────────

/** The desktop binding for {@link WorktreeWatcherRemoval}. Installed during startup. */
export const desktopWorktreeWatcherRemoval: WorktreeWatcherRemoval = {
  closeLocal: (worktreePath, deadline) =>
    deadline
      ? closeLocalWatcherForWorktreePath(worktreePath, deadline)
      : closeLocalWatcherForWorktreePath(worktreePath),
  restoreLocal: restoreLocalWatcherAfterFailedRemoval,
  forgetLocal: forgetLocalWatcherRemovalSnapshot,
  // Why inert: remote (SSH relay) watchers no longer exist, so there is never
  // anything to close, restore, or forget — the interface's documented no-owner state.
  closeRemote: async () => {},
  restoreRemote: async () => {},
  forgetRemote: () => {}
}
