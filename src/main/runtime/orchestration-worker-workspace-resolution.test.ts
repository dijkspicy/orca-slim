import { rm } from 'node:fs/promises'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const electronMocks = vi.hoisted(() => {
  const ipcMain = {
    on: vi.fn(() => ipcMain),
    removeListener: vi.fn(() => ipcMain),
    emit: vi.fn(() => true)
  }
  return {
    BrowserWindow: { fromId: vi.fn((): unknown => null) },
    webContents: { fromId: vi.fn((): unknown => null) },
    ipcMain,
    app: { getPath: vi.fn(() => '/tmp'), isPackaged: false }
  }
})
vi.mock('electron', () => electronMocks)

const scanLocalRepoWorktreesForResolution = vi.hoisted(() => vi.fn())
vi.mock('./repo-worktree-resolution-scan', () => ({ scanLocalRepoWorktreesForResolution }))

import { FLOATING_TERMINAL_WORKTREE_ID } from '../../shared/constants'
import type { FolderWorkspace } from '../../shared/folder-workspace-types'
import type { ProjectGroup } from '../../shared/project-group-types'
import type { Repo } from '../../shared/repo-types'
import type { WorktreeMeta } from '../../shared/worktree/meta-types'
import { OrcaRuntimeService } from './orca-runtime'

const REPO_ID = 'repo-1'
const REPO_PATH = '/repo'
const WORKTREE_PATH = '/repo/feature'
const WORKTREE_ID = `${REPO_ID}::${WORKTREE_PATH}`

function makeMeta(displayName: string, hostId?: WorktreeMeta['hostId']): WorktreeMeta {
  return {
    displayName,
    comment: '',
    linkedIssue: null,
    linkedPR: null,
    linkedLinearIssue: null,
    linkedGitLabMR: null,
    linkedGitLabIssue: null,
    isArchived: false,
    isUnread: false,
    isPinned: false,
    sortOrder: 0,
    lastActivityAt: 0,
    ...(hostId ? { hostId } : {})
  }
}

function makeStore(
  options: {
    repos?: Repo[]
    meta?: Record<string, WorktreeMeta>
    folderWorkspaces?: FolderWorkspace[]
    projectGroups?: ProjectGroup[]
  } = {}
) {
  const repos = options.repos ?? [
    {
      id: REPO_ID,
      path: REPO_PATH,
      displayName: 'App',
      badgeColor: 'blue',
      addedAt: 1
    }
  ]
  const meta = options.meta ?? { [WORKTREE_ID]: makeMeta('Feature') }
  const store = {
    getRepo: (id: string) => repos.find((repo) => repo.id === id),
    getRepos: () => repos,
    getAllWorktreeMeta: () => meta,
    getWorktreeMeta: (id: string) => meta[id],
    setWorktreeMeta: (id: string, patch: Partial<WorktreeMeta>) => {
      meta[id] = { ...(meta[id] ?? makeMeta('')), ...patch }
      return meta[id]
    },
    getAllWorktreeLineage: () => ({}),
    getAllWorkspaceLineage: () => ({}),
    removeWorktreeLineage: vi.fn(),
    removeWorkspaceLineage: vi.fn(),
    getGitHubCache: () => undefined,
    getSettings: () => ({
      workspaceDir: '/tmp/workspaces',
      nestWorkspaces: false,
      refreshLocalBaseRefOnWorktreeCreate: false,
      branchPrefix: 'none',
      branchPrefixCustom: ''
    }),
    getProjects: () => [],
    getFolderWorkspaces: () => options.folderWorkspaces ?? [],
    getProjectGroups: () => options.projectGroups ?? []
  }
  return store
}

describe('orchestration worker workspace resolution', () => {
  const tempPaths: string[] = []

  beforeEach(() => {
    scanLocalRepoWorktreesForResolution.mockReset().mockResolvedValue({
      ok: true,
      worktrees: [
        {
          path: WORKTREE_PATH,
          head: 'abc',
          branch: 'feature',
          isBare: false,
          isMainWorktree: false
        }
      ]
    })
  })

  afterEach(async () => {
    await Promise.all(tempPaths.splice(0).map((path) => rm(path, { recursive: true, force: true })))
  })

  it.each([
    ['full id', `id:${WORKTREE_ID}`],
    ['path', `path:${WORKTREE_PATH}`],
    ['name', 'name:Feature']
  ])('resolves a local worktree by %s with one catalog scan', async (_label, selector) => {
    const runtime = new OrcaRuntimeService(makeStore() as never)

    await expect(runtime.showManagedTerminalWorkspace(selector)).resolves.toMatchObject({
      id: WORKTREE_ID,
      path: WORKTREE_PATH
    })
    expect(scanLocalRepoWorktreesForResolution).toHaveBeenCalledOnce()
  })

  it('does not fall back from the floating terminal sentinel to another workspace', async () => {
    const runtime = new OrcaRuntimeService(makeStore() as never)

    await expect(
      runtime.showManagedTerminalWorkspace(`id:${FLOATING_TERMINAL_WORKTREE_ID}`)
    ).rejects.toThrow('selector_not_found')
    expect(scanLocalRepoWorktreesForResolution).not.toHaveBeenCalled()
  })

  it('rejects an ambiguous worktree name', async () => {
    const secondPath = '/repo/other'
    scanLocalRepoWorktreesForResolution.mockResolvedValue({
      ok: true,
      worktrees: [
        { path: WORKTREE_PATH, head: 'a', branch: 'one', isBare: false, isMainWorktree: false },
        { path: secondPath, head: 'b', branch: 'two', isBare: false, isMainWorktree: false }
      ]
    })
    const runtime = new OrcaRuntimeService(
      makeStore({
        meta: {
          [WORKTREE_ID]: makeMeta('Duplicate'),
          [`${REPO_ID}::${secondPath}`]: makeMeta('Duplicate')
        }
      }) as never
    )

    await expect(runtime.showManagedTerminalWorkspace('name:Duplicate')).rejects.toThrow(
      'selector_ambiguous'
    )
  })

  it('rejects a folder workspace whose execution host is ambiguous', async () => {
    const folderPath = '/workspace'
    const group = { id: 'group-1', name: 'Group', parentPath: folderPath } as ProjectGroup
    const folder = {
      id: 'folder-1',
      projectGroupId: group.id,
      name: 'Ambiguous folder',
      folderPath
    } as FolderWorkspace
    const repos = [
      { id: 'local', path: '/workspace/local', projectGroupId: group.id },
      { id: 'remote', path: '/workspace/remote', projectGroupId: group.id, connectionId: 'ssh-1' }
    ].map((repo) => ({
      displayName: repo.id,
      badgeColor: 'blue',
      addedAt: 1,
      ...repo
    })) as Repo[]
    const runtime = new OrcaRuntimeService(
      makeStore({ repos, folderWorkspaces: [folder], projectGroups: [group] }) as never
    )

    await expect(runtime.showManagedTerminalWorkspace('folder:folder-1')).rejects.toThrow(
      'folder_workspace_connection_ambiguous'
    )
    expect(scanLocalRepoWorktreesForResolution).not.toHaveBeenCalled()
  })
})
