import { vi, type Mock } from 'vitest'
import type { AgentStatusEntry } from '../../../shared/agent-status-types'
import type { TerminalLayoutSnapshot, TerminalTab } from '../../../shared/terminal-tab-types'
import { useAppStore } from '@/store'
import type { AppState } from '@/store/types'
import { DEFAULT_AGENT_HIBERNATION_IDLE_MS } from './agent-hibernation-planner'
import { resetAgentHibernationCoordinatorForTests } from './agent-hibernation-coordinator'
import { hydrateDrivers } from './pane-manager/mobile-driver-state'
import { resetForegroundTerminalTabIdsForTests } from './foreground-terminal-tabs'
import { resetAgentHibernationOutputActivityForTests } from './agent-hibernation-output-activity'
import {
  observeHibernationPtyBindings,
  resetHibernationPaneAgeForTests
} from './agent-hibernation-pane-age'

export const NOW = 10_000_000
export const LEAF = '11111111-1111-4111-8111-111111111111'

export function tab(): TerminalTab {
  return {
    id: 'tab-1',
    ptyId: null,
    worktreeId: 'wt-bg',
    title: 'Agent',
    customTitle: null,
    color: null,
    sortOrder: 0,
    createdAt: 1
  }
}

export function layout(): TerminalLayoutSnapshot {
  return {
    root: { type: 'leaf', leafId: LEAF },
    activeLeafId: LEAF,
    expandedLeafId: null,
    ptyIdsByLeafId: { [LEAF]: 'pty-1' }
  }
}

export function entry(): AgentStatusEntry {
  return {
    state: 'done',
    prompt: 'ship it',
    updatedAt: NOW - DEFAULT_AGENT_HIBERNATION_IDLE_MS - 1,
    stateStartedAt: NOW - DEFAULT_AGENT_HIBERNATION_IDLE_MS - 1,
    paneKey: `tab-1:${LEAF}`,
    tabId: 'tab-1',
    worktreeId: 'wt-bg',
    agentType: 'claude',
    providerSession: { key: 'session_id', id: 'session-1' },
    stateHistory: []
  }
}

export type HibernationShutdownStub = Mock<AppState['shutdownCompletedAgentPaneForHibernation']>

export function installEligibleState(
  shutdownCompletedAgentPaneForHibernation: HibernationShutdownStub = vi.fn(),
  overrides: Partial<AppState> = {}
): HibernationShutdownStub {
  const e = entry()
  const runtimeOwnerEnvironmentId = overrides.settings?.activeRuntimeEnvironmentId ?? undefined
  useAppStore.setState({
    settings: {
      experimentalAgentHibernation: true,
      agentHibernationIdleMs: DEFAULT_AGENT_HIBERNATION_IDLE_MS
    } as never,
    activeWorktreeId: 'wt-active',
    repos: [],
    worktreesByRepo: {
      'fixture-repo': [
        {
          id: 'wt-bg',
          repoId: 'fixture-repo',
          hostId: 'local',
          runtimeOwnerEnvironmentId
        }
      ]
    } as never,
    detectedWorktreesByRepo: {},
    tabsByWorktree: { 'wt-bg': [tab()] },
    terminalLayoutsByTabId: { 'tab-1': layout() },
    ptyIdsByTabId: { 'tab-1': ['pty-1'] },
    agentStatusByPaneKey: { [e.paneKey]: e },
    sleepingAgentSessionsByPaneKey: {},
    lastTerminalInputAtByPaneKey: {},
    shutdownCompletedAgentPaneForHibernation: shutdownCompletedAgentPaneForHibernation as never,
    shutdownWorktreeTerminals: vi.fn() as never,
    ...overrides
  })
  // Why: a pane idle long enough to hibernate has necessarily been observed by earlier
  // coordinator passes, so its PTY binding is old. Seed that here — otherwise the
  // binding-age floor (which exists to stop a wake or app restart sleeping the whole
  // backlog immediately) would defer every candidate on its first observed tick.
  const state = useAppStore.getState()
  observeHibernationPtyBindings({
    tabsByWorktree: state.tabsByWorktree,
    terminalLayoutsByTabId: state.terminalLayoutsByTabId,
    now: NOW - DEFAULT_AGENT_HIBERNATION_IDLE_MS - 60_000,
    idleMs: DEFAULT_AGENT_HIBERNATION_IDLE_MS
  })
  return shutdownCompletedAgentPaneForHibernation
}

export function resetAgentHibernationCoordinatorFixture(): void {
  resetAgentHibernationCoordinatorForTests()
  resetForegroundTerminalTabIdsForTests()
  resetAgentHibernationOutputActivityForTests()
  resetHibernationPaneAgeForTests()
  hydrateDrivers([])
  vi.useRealTimers()
}
