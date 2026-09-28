import { useAppStore } from '@/store'
import { isTerminalTabPresent } from '@/store/slices/terminal-tab-retirement'

export async function retireUnownedTerminal(args: {
  /** Present tab id, or `{ worktreeId }` for a launch whose tab is created after the spawn. */
  owner: { tabId: string } | { worktreeId: string }
  ptyId: string
  onRetire?: () => void
}): Promise<boolean> {
  const state = useAppStore.getState()
  const owner = args.owner
  const isOwned =
    'tabId' in owner
      ? isTerminalTabPresent(state, owner.tabId)
      : // Folder workspaces exist only in getKnownWorktreeById.
        state.getKnownWorktreeById(owner.worktreeId) !== undefined
  if (isOwned) {
    return false
  }
  // Close can win before the provider is bindable to store state.
  args.onRetire?.()
  await retireProvider(args)
  return true
}

export async function retireProvider(args: { ptyId: string }): Promise<void> {
  try {
    await window.api.pty.kill(args.ptyId)
  } catch {
    // Best-effort provider teardown; the retired tab must not be recreated.
  }
}
