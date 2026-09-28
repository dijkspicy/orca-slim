import type { ExecutionHostId } from './execution-host'

/** 'foreign' = the id proves the PTY runs off this host but cannot name where. */
export type PtyExecutionHost = ExecutionHostId | 'foreign' | null

// Why: a PTY id, not a path, is the authority on where a terminal runs. `null`
// means the id carries no host at all, so the caller may fall back to the
// worktree's host.
export function getPtyExecutionHost(ptyId: string | null | undefined): PtyExecutionHost {
  if (!ptyId) {
    return null
  }
  if (ptyId.startsWith('ssh:') || ptyId.startsWith('remote:')) {
    return 'foreign'
  }
  return null
}
