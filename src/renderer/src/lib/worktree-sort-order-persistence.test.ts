import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WorktreeRuntimeOwnerState } from './worktree-runtime-owner'
import { persistWorktreeSortOrderByHost } from './worktree-sort-order-persistence'

const localPersistSortOrder = vi.fn()
const UNHANDLED_REJECTION_SETTLE_MS = 20

const state: WorktreeRuntimeOwnerState = {
  settings: { activeRuntimeEnvironmentId: null },
  repos: [{ id: 'local-repo', connectionId: null, executionHostId: 'local' }],
  worktreesByRepo: {
    'local-repo': [{ id: 'local-repo::wt-a', repoId: 'local-repo' }]
  }
}

async function collectUnhandledRejections(run: () => void): Promise<unknown[]> {
  const reasons: unknown[] = []
  const onUnhandledRejection = (reason: unknown): void => {
    reasons.push(reason)
  }

  process.on('unhandledRejection', onUnhandledRejection)
  try {
    run()
    await new Promise((resolve) => setTimeout(resolve, UNHANDLED_REJECTION_SETTLE_MS))
  } finally {
    process.off('unhandledRejection', onUnhandledRejection)
  }

  return reasons
}

beforeEach(() => {
  localPersistSortOrder.mockReset()
  localPersistSortOrder.mockResolvedValue(undefined)
  vi.stubGlobal('window', {
    api: {
      worktrees: {
        persistSortOrder: localPersistSortOrder
      }
    }
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('persistWorktreeSortOrderByHost', () => {
  it('persists each owner host through the local transport', () => {
    persistWorktreeSortOrderByHost(state, ['local-repo::wt-a'])

    expect(localPersistSortOrder).toHaveBeenCalledWith({ orderedIds: ['local-repo::wt-a'] })
  })

  it('handles best-effort persistence rejections without leaking them', async () => {
    localPersistSortOrder.mockRejectedValueOnce(new Error('local store unavailable'))

    const unhandledRejections = await collectUnhandledRejections(() => {
      persistWorktreeSortOrderByHost(state, ['local-repo::wt-a'])
    })

    expect(unhandledRejections).toEqual([])
  })
})
