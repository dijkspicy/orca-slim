import { parseExecutionHostId } from '../../../shared/execution-host'
import type { WorktreeRuntimeOwnerState } from './worktree-runtime-owner'
import { splitWorktreeSortOrderByHost } from './worktree-sort-order-host-split'

function ignoreSortOrderPersistenceFailure(promise: Promise<unknown>): void {
  void promise.catch(() => {
    // Why: sort-order restore is best-effort; a failed persist must not surface
    // as an unhandled rejection that pollutes crash diagnostics.
  })
}

export function persistWorktreeSortOrderByHost(
  state: WorktreeRuntimeOwnerState,
  orderedIds: readonly string[]
): void {
  for (const group of splitWorktreeSortOrderByHost(state, orderedIds)) {
    const parsed = parseExecutionHostId(group.hostId)
    if (parsed?.kind === 'runtime') {
      // Runtime hosts were the remote cull's target; no remote transport remains.
      continue
    }

    ignoreSortOrderPersistenceFailure(
      window.api.worktrees.persistSortOrder({ orderedIds: group.orderedIds })
    )
  }
}
