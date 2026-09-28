import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from '@/store'
import { activateAndRevealWorktree } from './worktree-activation'
import {
  makeCreatedAgentWorktree as makeWorktree,
  seedAlreadyActiveWorktree,
  seedEmptyActivatableWorktree
} from '@/lib/worktree-activation-created-agent-test-state'

const initialAppStoreState = useAppStore.getState()

/** Activates and asserts a focusable tab appeared with no queued startup, returning its id. */
function activateAndExpectNoRelaunch(
  worktreeId: string,
  opts?: Parameters<typeof activateAndRevealWorktree>[1]
): string {
  const result = activateAndRevealWorktree(worktreeId, opts)
  const tabId = result === false ? undefined : (result.primaryTabId ?? undefined)

  expect(tabId).toBeDefined()
  expect(useAppStore.getState().pendingStartupByTabId[tabId!]).toBeUndefined()
  return tabId!
}

afterEach(() => {
  delete (globalThis as { __ORCA_WEB_CLIENT__?: boolean }).__ORCA_WEB_CLIENT__
  vi.unstubAllGlobals()
  useAppStore.setState(initialAppStoreState, true)
})

describe('activateAndRevealWorktree', () => {
  it('does not restamp focus recency when reselecting the already-active terminal worktree', () => {
    const worktree = makeWorktree()
    const { markWorktreeVisited, recordWorktreeVisit, revealWorktreeInSidebar } =
      seedAlreadyActiveWorktree(worktree)

    const result = activateAndRevealWorktree(worktree.id)

    expect(result).toEqual({ primaryTabId: null })
    expect(markWorktreeVisited).not.toHaveBeenCalled()
    expect(recordWorktreeVisit).not.toHaveBeenCalled()
    expect(revealWorktreeInSidebar).toHaveBeenCalledWith(worktree.id)
  })

  it('records a visit when activating the same worktree changes the current view', () => {
    const worktree = makeWorktree()
    const { markWorktreeVisited, recordWorktreeVisit } = seedAlreadyActiveWorktree(worktree, {
      activeView: 'tasks'
    })

    const result = activateAndRevealWorktree(worktree.id)

    expect(result).toEqual({ primaryTabId: null })
    expect(markWorktreeVisited).toHaveBeenCalledWith(worktree.id)
    expect(recordWorktreeVisit).toHaveBeenCalledWith(worktree.id)
  })

  it('adds the activated project to an active project filter', () => {
    const worktree = makeWorktree()
    seedEmptyActivatableWorktree(worktree)
    useAppStore.setState({ filterRepoIds: ['repo-2'] })

    activateAndRevealWorktree(worktree.id)

    expect(useAppStore.getState().filterRepoIds).toEqual(['repo-2', worktree.repoId])
  })

  it('does not relaunch the creation-time agent when reopening an empty worktree', () => {
    const worktree = makeWorktree()
    const { revealWorktreeInSidebar } = seedEmptyActivatableWorktree(worktree)

    const result = activateAndRevealWorktree(worktree.id)
    const state = useAppStore.getState()
    const reopenedTab = state.tabsByWorktree[worktree.id]?.[0]

    // A focusable surface still appears — it is just a plain shell, with no queued agent launch.
    expect(result).toEqual({ primaryTabId: reopenedTab?.id })
    expect(reopenedTab).toBeDefined()
    expect(state.pendingStartupByTabId[reopenedTab!.id]).toBeUndefined()
    expect(revealWorktreeInSidebar).toHaveBeenCalledWith(worktree.id)
  })

  it('does not relaunch on repeated activate/close cycles', () => {
    const worktree = makeWorktree()
    seedEmptyActivatableWorktree(worktree)

    for (let cycle = 0; cycle < 3; cycle += 1) {
      activateAndExpectNoRelaunch(worktree.id)

      // Return to zero tabs, the state that used to re-arm the relaunch. Sets state
      // directly rather than via closeTab — the sleeping-record purge is covered in
      // worktree-reactivation-tab-forkbomb.test.ts.
      useAppStore.setState({ tabsByWorktree: {}, activeTabIdByWorktree: {} })
    }
  })

  it('does not relaunch when activating a sibling worktree the user never opened', () => {
    const sibling = makeWorktree()
    const target = { ...makeWorktree(), id: 'wt-handoff', displayName: 'handoff' }
    seedEmptyActivatableWorktree(target, { extraWorktrees: [sibling] })

    // The shape post-delete focus handoff produces. That caller passes no opts at all —
    // asserted directly in active-worktree-focus-after-delete.test.ts.
    activateAndExpectNoRelaunch(target.id)
  })

  it('does not relaunch when activation opts carry no startup payload', () => {
    const worktree = makeWorktree()
    seedEmptyActivatableWorktree(worktree)

    // The opts shape CLI/relay navigation and notification clicks arrive with; those
    // callers are asserted in useIpcEvents.test.ts. The host's `didSpawnStartup` leg is
    // a main-process concern and is not reachable from here.
    activateAndExpectNoRelaunch(worktree.id, { notifyHostRuntime: false })
  })

  it('still queues an explicit startup supplied by the caller', () => {
    const worktree = makeWorktree()
    seedEmptyActivatableWorktree(worktree)

    const result = activateAndRevealWorktree(worktree.id, {
      startup: { command: 'codex' }
    })
    const state = useAppStore.getState()
    const tabId = result === false ? undefined : (result.primaryTabId ?? undefined)

    expect(tabId).toBeDefined()
    expect(state.pendingStartupByTabId[tabId!]).toEqual(
      expect.objectContaining({ command: 'codex' })
    )
  })

  it('does not duplicate a sleeping agent session owned by a preserved slept pane', () => {
    const worktree = makeWorktree()
    const revealWorktreeInSidebar = vi.fn()

    useAppStore.setState({
      repos: [
        {
          id: 'repo-1',
          path: '/workspace/repo',
          displayName: 'repo',
          badgeColor: '#000000',
          addedAt: 0
        }
      ],
      worktreesByRepo: { 'repo-1': [worktree] },
      activeRepoId: 'repo-1',
      activeView: 'terminal',
      tabsByWorktree: {
        [worktree.id]: [
          {
            id: 'slept-tab',
            ptyId: 'wake-hint',
            worktreeId: worktree.id,
            title: 'Codex',
            customTitle: null,
            color: null,
            sortOrder: 0,
            createdAt: 1
          }
        ]
      },
      ptyIdsByTabId: {},
      unifiedTabsByWorktree: {},
      groupsByWorktree: {},
      layoutByWorktree: {},
      activeGroupIdByWorktree: {},
      openFiles: [],
      browserTabsByWorktree: {},
      activeFileIdByWorktree: {},
      activeBrowserTabIdByWorktree: {},
      activeTabTypeByWorktree: {},
      activeTabIdByWorktree: {},
      tabBarOrderByWorktree: {},
      pendingStartupByTabId: {},
      sleepingAgentSessionsByPaneKey: {
        'slept-tab:0': {
          paneKey: 'slept-tab:0',
          tabId: 'slept-tab',
          worktreeId: worktree.id,
          agent: 'codex',
          providerSession: { key: 'session_id', id: 'codex-session-1' },
          prompt: 'resume prior task',
          state: 'working',
          capturedAt: 1000,
          updatedAt: 1000,
          terminalTitle: 'Codex'
        }
      },
      settings: {
        agentCmdOverrides: {},
        setupScriptLaunchMode: 'new-tab'
      } as unknown as ReturnType<typeof useAppStore.getState>['settings'],
      markWorktreeVisited: vi.fn(),
      recordWorktreeVisit: vi.fn(),
      refreshGitHubForWorktreeIfStale: vi.fn(),
      revealWorktreeInSidebar
    })

    const result = activateAndRevealWorktree(worktree.id)
    const state = useAppStore.getState()
    const resumedTab = state.tabsByWorktree[worktree.id]?.find((tab) => tab.id !== 'slept-tab')

    expect(result).toEqual({ primaryTabId: null })
    expect(resumedTab).toBeUndefined()
    expect(state.pendingStartupByTabId).toEqual({})
    expect(state.sleepingAgentSessionsByPaneKey['slept-tab:0']).toMatchObject({
      paneKey: 'slept-tab:0',
      providerSession: { key: 'session_id', id: 'codex-session-1' }
    })
    expect(revealWorktreeInSidebar).toHaveBeenCalledWith(worktree.id)
  })

  it('forwards an explicit sidebar reveal behavior', () => {
    const worktree = makeWorktree()
    const revealWorktreeInSidebar = vi.fn()

    useAppStore.setState({
      repos: [
        {
          id: 'repo-1',
          path: '/workspace/repo',
          displayName: 'repo',
          badgeColor: '#000000',
          addedAt: 0
        }
      ],
      worktreesByRepo: { 'repo-1': [worktree] },
      activeRepoId: 'repo-1',
      activeView: 'terminal',
      tabsByWorktree: {},
      unifiedTabsByWorktree: {},
      groupsByWorktree: {},
      layoutByWorktree: {},
      activeGroupIdByWorktree: {},
      openFiles: [],
      browserTabsByWorktree: {},
      activeFileIdByWorktree: {},
      activeBrowserTabIdByWorktree: {},
      activeTabTypeByWorktree: {},
      activeTabIdByWorktree: {},
      tabBarOrderByWorktree: {},
      pendingStartupByTabId: {},
      settings: {
        agentCmdOverrides: {},
        setupScriptLaunchMode: 'new-tab'
      } as unknown as ReturnType<typeof useAppStore.getState>['settings'],
      markWorktreeVisited: vi.fn(),
      recordWorktreeVisit: vi.fn(),
      refreshGitHubForWorktreeIfStale: vi.fn(),
      revealWorktreeInSidebar
    })

    const result = activateAndRevealWorktree(worktree.id, { sidebarRevealBehavior: 'auto' })

    expect(result).toEqual({ primaryTabId: expect.any(String) })
    expect(revealWorktreeInSidebar).toHaveBeenCalledWith(worktree.id, { behavior: 'auto' })
  })
})
