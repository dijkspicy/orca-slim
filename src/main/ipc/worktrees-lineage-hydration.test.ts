import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { WorktreeMeta } from '../../shared/worktree/meta-types'
import type { Worktree } from '../../shared/worktree/types'
import { listWorktreesMock } from './worktrees-test-module-mocks'
import { handlers, ipcEvent, setupWorktreeHandlers, store } from './worktrees-test-harness'
import { makeWorktreeMeta } from './worktrees-test-fixtures'

vi.mock('electron', async () =>
  (await import('./worktrees-test-module-mocks')).electronModuleMock()
)
vi.mock('../git/worktree', async () =>
  (await import('./worktrees-test-module-mocks')).gitWorktreeModuleMock()
)
vi.mock('../git/runner', async () =>
  (await import('./worktrees-test-module-mocks')).gitRunnerModuleMock()
)
vi.mock('../git/repo', async () =>
  (await import('./worktrees-test-module-mocks')).gitRepoModuleMock()
)
vi.mock('../git/git-username', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resolveLocalGitUsername: (await import('./worktrees-test-module-mocks'))
    .resolveLocalGitUsernameMock
}))
vi.mock('../github/client', async () =>
  (await import('./worktrees-test-module-mocks')).githubClientModuleMock()
)
vi.mock('../source-control/hosted-review', async () =>
  (await import('./worktrees-test-module-mocks')).hostedReviewModuleMock()
)
vi.mock('../providers/ssh-git-dispatch', async () =>
  (await import('./worktrees-test-module-mocks')).sshGitDispatchModuleMock()
)
vi.mock('../providers/ssh-filesystem-dispatch', async () =>
  (await import('./worktrees-test-module-mocks')).sshFilesystemDispatchModuleMock()
)
vi.mock('./worktree-symlinks', async () =>
  (await import('./worktrees-test-module-mocks')).worktreeSymlinksModuleMock()
)
vi.mock('./ssh', async () => (await import('./worktrees-test-module-mocks')).sshModuleMock())
vi.mock('../ssh/ssh-target-registry', async () =>
  (await import('./worktrees-test-module-mocks')).sshTargetRegistryModuleMock()
)
vi.mock('../hooks', async () => (await import('./worktrees-test-module-mocks')).hooksModuleMock())
vi.mock('../setup-runner-script-text', async (importOriginal) =>
  (await import('./worktrees-test-module-mocks')).setupRunnerScriptTextModuleMock(
    (await importOriginal()) as Record<string, unknown>
  )
)
vi.mock('../worktree-runner-script', async (importOriginal) =>
  (await import('./worktrees-test-module-mocks')).worktreeRunnerScriptModuleMock(
    (await importOriginal()) as Record<string, unknown>
  )
)
vi.mock('../effective-hook-config', async (importOriginal) =>
  (await import('./worktrees-test-module-mocks')).effectiveHookConfigModuleMock(
    (await importOriginal()) as Record<string, unknown>
  )
)
vi.mock('../setup-hook-env-vars', async (importOriginal) =>
  (await import('./worktrees-test-module-mocks')).setupHookEnvVarsModuleMock(
    (await importOriginal()) as Record<string, unknown>
  )
)
vi.mock('./worktree-logic', async (importOriginal) =>
  (await import('./worktrees-test-module-mocks')).worktreeLogicModuleMock(
    (await importOriginal()) as Record<string, unknown>
  )
)
vi.mock('../terminal-history-deletion', async () =>
  (await import('./worktrees-test-module-mocks')).terminalHistoryDeletionModuleMock()
)
vi.mock('../ports/advertised-url-watcher', async () =>
  (await import('./worktrees-test-module-mocks')).advertisedUrlWatcherModuleMock()
)
vi.mock('../workspace-cleanup-scan-snapshot', async () =>
  (await import('./worktrees-test-module-mocks')).workspaceCleanupScanSnapshotModuleMock()
)
vi.mock('../workspace-space-analysis-snapshot', async () =>
  (await import('./worktrees-test-module-mocks')).workspaceSpaceAnalysisSnapshotModuleMock()
)
vi.mock('../workspace-cleanup-removal-snapshot-prune', async () =>
  (await import('./worktrees-test-module-mocks')).workspaceCleanupRemovalSnapshotPruneModuleMock()
)
vi.mock('../runtime/worktree-teardown', async () =>
  (await import('./worktrees-test-module-mocks')).worktreeTeardownModuleMock()
)
vi.mock('./pty', async () => (await import('./worktrees-test-module-mocks')).ptyModuleMock())

describe('registerWorktreeHandlers', () => {
  beforeEach(() => {
    setupWorktreeHandlers()
  })

  it('snapshots lineage catalogs once and memoizes repeated owner resolution', async () => {
    const worktreeIds = Array.from(
      { length: 101 },
      (_, index) => `repo-1::/workspace/repo-${index}`
    )
    const lineage = Object.fromEntries(
      worktreeIds.slice(1).map((worktreeId, index) => [
        worktreeId,
        {
          worktreeId,
          worktreeInstanceId: `child-${index}`,
          parentWorktreeId: worktreeIds[index],
          parentWorktreeInstanceId: `parent-${index}`,
          origin: 'cli',
          capture: { source: 'cwd-context', confidence: 'inferred' },
          createdAt: index
        }
      ])
    )
    store.getAllWorktreeLineage.mockReturnValue(lineage)
    store.getRepos.mockClear()
    store.getFolderWorkspaces.mockClear()
    store.getProjectGroups.mockClear()
    store.getWorktreeMeta.mockClear()

    const result = await handlers['worktrees:listLineageForHost'](ipcEvent, {
      executionHostId: 'local'
    })

    expect(result).toMatchObject({ authoritative: true })
    expect(
      Object.keys((result as { worktreeLineageById: Record<string, unknown> }).worktreeLineageById)
    ).toHaveLength(100)
    expect(store.getRepos).toHaveBeenCalledOnce()
    expect(store.getFolderWorkspaces).toHaveBeenCalledOnce()
    expect(store.getProjectGroups).toHaveBeenCalledOnce()
    expect(store.getWorktreeMeta).toHaveBeenCalledTimes(101)
  })

  it('preserves ambiguous legacy lineage instead of guessing among duplicate repo owners', async () => {
    const child = 'duplicate::/child'
    const parent = 'duplicate::/parent'
    store.getRepos.mockReturnValue([
      {
        id: 'duplicate',
        path: '/local',
        displayName: 'local',
        badgeColor: '#000',
        addedAt: 0
      },
      {
        id: 'duplicate',
        path: '/remote',
        displayName: 'remote',
        badgeColor: '#000',
        addedAt: 0,
        connectionId: 'target-a'
      }
    ])
    store.getAllWorktreeLineage.mockReturnValue({
      [child]: {
        worktreeId: child,
        worktreeInstanceId: 'child',
        parentWorktreeId: parent,
        parentWorktreeInstanceId: 'parent',
        origin: 'cli',
        capture: { source: 'cwd-context', confidence: 'inferred' },
        createdAt: 1
      }
    })

    await expect(
      handlers['worktrees:listLineageForHost'](ipcEvent, { executionHostId: 'local' })
    ).resolves.toEqual({
      authoritative: false,
      executionHostId: 'local',
      reason: 'ambiguous-owner'
    })
    expect(store.removeWorktreeLineage).not.toHaveBeenCalled()
  })

  it('hydrates detected worktrees with instance-validated legacy lineage after an update', async () => {
    const parentPath = '/workspace/assigned-issues'
    const childPath = '/workspace/issue-9276-nested-ssh-runtime-routing'
    const parentId = `repo-1::${parentPath}`
    const childId = `repo-1::${childPath}`
    const metaById: Record<string, { instanceId: string }> = {
      [parentId]: { instanceId: 'parent-instance' },
      [childId]: { instanceId: 'child-instance' }
    }
    store.getWorktreeMeta.mockImplementation((id: string) => metaById[id])
    store.setWorktreeMeta.mockImplementation((id: string, updates: Partial<WorktreeMeta>) => ({
      ...metaById[id],
      ...updates
    }))
    store.getAllWorktreeLineage.mockReturnValue({
      [childId]: {
        worktreeId: childId,
        worktreeInstanceId: 'child-instance',
        parentWorktreeId: parentId,
        parentWorktreeInstanceId: 'parent-instance',
        origin: 'cli',
        capture: { source: 'explicit-cli-flag', confidence: 'explicit' },
        createdAt: 1
      }
    })
    listWorktreesMock.mockResolvedValue([
      {
        path: childPath,
        head: 'child-head',
        branch: 'refs/heads/child',
        isBare: false,
        isMainWorktree: false
      },
      {
        path: parentPath,
        head: 'parent-head',
        branch: 'refs/heads/parent',
        isBare: false,
        isMainWorktree: false
      }
    ])

    const result = (await handlers['worktrees:listDetected'](null, {
      repoId: 'repo-1'
    })) as { worktrees: (Worktree & { lineage?: unknown; parentWorktreeId?: string | null })[] }

    expect(result.worktrees).toEqual([
      expect.objectContaining({
        id: childId,
        parentWorktreeId: parentId,
        lineage: expect.objectContaining({ parentWorktreeInstanceId: 'parent-instance' })
      }),
      expect.objectContaining({
        id: parentId,
        parentWorktreeId: null,
        childWorktreeIds: [childId],
        lineage: null
      })
    ])
  })

  it('hydrates folder-repo detected rows with instance-validated legacy lineage', async () => {
    const folderRepo = {
      id: 'repo-1',
      path: '/workspace/folder',
      displayName: 'folder',
      badgeColor: '#000',
      addedAt: 0,
      kind: 'folder' as const
    }
    const parentId = `${folderRepo.id}::${folderRepo.path}`
    const childId = `${parentId}::workspace:child-instance`
    const metaById: Record<string, Record<string, unknown>> = {
      [parentId]: makeWorktreeMeta({
        instanceId: 'parent-instance',
        projectId: 'repo:repo-1',
        hostId: 'local',
        projectHostSetupId: 'repo-1'
      }),
      [childId]: makeWorktreeMeta({
        instanceId: 'child-instance',
        projectId: 'repo:repo-1',
        hostId: 'local',
        projectHostSetupId: 'repo-1'
      })
    }
    store.getRepos.mockReturnValue([folderRepo])
    store.getRepo.mockReturnValue(folderRepo)
    store.getAllWorktreeMeta.mockReturnValue(metaById)
    store.getWorktreeMeta.mockImplementation((worktreeId: string) => metaById[worktreeId])
    store.getAllWorktreeLineage.mockReturnValue({
      [childId]: {
        worktreeId: childId,
        worktreeInstanceId: 'child-instance',
        parentWorktreeId: parentId,
        parentWorktreeInstanceId: 'parent-instance',
        origin: 'cli',
        capture: { source: 'explicit-cli-flag', confidence: 'explicit' },
        createdAt: 1
      }
    })

    const result = (await handlers['worktrees:listDetected'](null, {
      repoId: folderRepo.id
    })) as { worktrees: (Worktree & { lineage?: unknown; parentWorktreeId?: string | null })[] }

    expect(result.worktrees).toEqual([
      expect.objectContaining({
        id: parentId,
        parentWorktreeId: null,
        childWorktreeIds: [childId],
        lineage: null
      }),
      expect.objectContaining({
        id: childId,
        parentWorktreeId: parentId,
        lineage: expect.objectContaining({ parentWorktreeInstanceId: 'parent-instance' })
      })
    ])
  })

  it('hides agent scratch created inside a linked checkout from desktop listings', async () => {
    const linkedCheckoutPath = '/workspace/feature-x'
    const scratchPath = `${linkedCheckoutPath}/.claude/worktrees/agent-a04ccaaa`
    listWorktreesMock.mockResolvedValue([
      {
        path: '/workspace/repo',
        head: 'main-head',
        branch: 'refs/heads/main',
        isBare: false,
        isMainWorktree: true
      },
      {
        path: linkedCheckoutPath,
        head: 'feature-head',
        branch: 'refs/heads/feature-x',
        isBare: false,
        isMainWorktree: false
      },
      {
        path: scratchPath,
        head: 'scratch-head',
        branch: 'refs/heads/worktree-agent-a04ccaaa',
        isBare: false,
        isMainWorktree: false
      }
    ])

    const detected = (await handlers['worktrees:listDetected'](null, {
      repoId: 'repo-1'
    })) as { worktrees: (Worktree & { ownership: string; visible: boolean })[] }
    const visible = (await handlers['worktrees:list'](null, { repoId: 'repo-1' })) as Worktree[]

    expect(detected.worktrees.find((worktree) => worktree.path === scratchPath)).toMatchObject({
      ownership: 'agent-scratch',
      visible: false
    })
    expect(visible.map((worktree) => worktree.path)).toEqual([
      '/workspace/repo',
      linkedCheckoutPath
    ])
  })
})
