// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RuntimeMobileSessionTabsResult } from '../../../shared/runtime-session-contracts'
import type * as RecoveryModule from '@/lib/structured-agent-session-launch-recovery'

const mocks = vi.hoisted(() => ({
  abandonIntent: vi.fn(),
  callStructuredAgentSession: vi.fn(),
  createIntent: vi.fn(),
  launch: vi.fn(),
  seedDraft: vi.fn(),
  clearDraft: vi.fn(),
  rendererTabs: {} as Record<string, unknown[]>,
  listeners: new Set<(state: { unifiedTabsByWorktree: Record<string, unknown[]> }) => void>()
}))

vi.mock('sonner', () => ({ toast: { error: vi.fn(), message: vi.fn() } }))

vi.mock('@/lib/launch-structured-agent-session', () => {
  class StructuredAgentSessionCreateRefusalError extends Error {}
  return {
    createStructuredAgentSessionLaunchIntent: mocks.createIntent,
    abandonStructuredAgentSessionLaunchIntent: mocks.abandonIntent,
    launchStructuredAgentSession: mocks.launch,
    StructuredAgentSessionCreateRefusalError
  }
})

vi.mock('@/lib/structured-agent-session-launch-recovery', async () => {
  const actual = await vi.importActual<typeof RecoveryModule>(
    '@/lib/structured-agent-session-launch-recovery'
  )
  return { ...actual, launchAndReconcile: vi.fn(actual.launchAndReconcile) }
})

// Why: the tabs-sync and structured-session RPC clients were culled; the launch rides
// window.api.runtime.call directly, stubbed through mocks.callStructuredAgentSession.
vi.stubGlobal('window', { api: { runtime: { call: mocks.callStructuredAgentSession } } })

vi.mock('@/store', () => ({
  useAppStore: {
    getState: () => ({
      unifiedTabsByWorktree: mocks.rendererTabs,
      seedNativeChatLaunchDraft: mocks.seedDraft,
      clearNativeChatLaunchDraft: mocks.clearDraft
    }),
    subscribe: (
      listener: (state: { unifiedTabsByWorktree: Record<string, unknown[]> }) => void
    ) => {
      mocks.listeners.add(listener)
      return () => mocks.listeners.delete(listener)
    }
  }
}))

vi.mock('@/i18n/i18n', () => ({
  translate: (_key: string, fallback: string) => fallback
}))

vi.mock('@/lib/agent-catalog', () => ({
  getAgentLabel: () => 'Codex',
  getAgentCatalog: () => [{ id: 'codex', label: 'Codex' }]
}))

import type { StructuredAgentSessionLaunchIntent } from '@/lib/launch-structured-agent-session'
import {
  startStructuredAgentLaunch,
  type StructuredAgentLaunchOptions
} from './structured-agent-session-launch'

function launchIntent(worktreeId: string, sessionId: string): StructuredAgentSessionLaunchIntent {
  return {
    worktreeId,
    sessionId,
    agent: 'codex',
    params: {
      envelope: {
        sessionId,
        clientOperationId: `operation-${sessionId}`,
        expectedRuntimeFence: null,
        payloadFingerprint: `fingerprint-${sessionId}`
      },
      worktree: `id:${worktreeId}`,
      agent: 'codex'
    }
  }
}

function publishedSnapshot(worktreeId: string, sessionId: string): RuntimeMobileSessionTabsResult {
  return {
    worktree: worktreeId,
    publicationEpoch: 'epoch-1',
    snapshotVersion: 1,
    activeGroupId: null,
    activeTabId: null,
    activeTabType: null,
    tabs: [
      {
        type: 'agent-session',
        id: 'tab-1',
        title: 'Codex',
        sessionId,
        agent: 'codex',
        isActive: true
      }
    ]
  }
}

async function flushLaunchSettlement(): Promise<void> {
  for (let i = 0; i < 20; i += 1) {
    await Promise.resolve()
  }
}

describe('coalesced launch delivery mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mocks.rendererTabs = {}
    mocks.listeners.clear()
    mocks.callStructuredAgentSession.mockImplementation(({ method }) => {
      if (method === 'session.tabs.listAll') {
        return Promise.resolve({ ok: true, result: { snapshots: [] } })
      }
      return Promise.resolve({ ok: true, result: { ok: true, page: { fence: 1 } } })
    })
  })

  async function coalesce(args: {
    worktreeId: string
    sessionId: string
    established: StructuredAgentLaunchOptions
    joining: StructuredAgentLaunchOptions
  }) {
    const intent = launchIntent(args.worktreeId, args.sessionId)
    let resolveLaunch!: (receipt: { sessionId: string; fence: number }) => void
    mocks.createIntent.mockReturnValueOnce(intent)
    mocks.launch.mockImplementation(
      () =>
        new Promise<{ sessionId: string; fence: number }>((resolve) => (resolveLaunch = resolve))
    )
    mocks.callStructuredAgentSession.mockImplementation(({ method }) => {
      if (method === 'session.tabs.listAll') {
        return Promise.resolve({
          ok: true,
          result: { snapshots: [publishedSnapshot(args.worktreeId, intent.sessionId)] }
        })
      }
      return Promise.resolve({ ok: true, result: { ok: true, page: { fence: 1 } } })
    })

    startStructuredAgentLaunch(args.worktreeId, 'codex', args.established)
    const joiner = startStructuredAgentLaunch(args.worktreeId, 'codex', args.joining)
    resolveLaunch({ sessionId: intent.sessionId, fence: 1 })
    await flushLaunchSettlement()
    return { joiner }
  }

  it('keeps a joiner as a draft when the launch it joined established no mode', async () => {
    // The onboarding folder launch establishes an identity carrying neither prompt nor mode.
    const { joiner } = await coalesce({
      worktreeId: 'wt-unset-delivery-mode',
      sessionId: 'unset-delivery-session',
      established: {},
      joining: { prompt: 'PR context', promptDelivery: 'draft' }
    })

    // Why: an unset established mode must not read as submit; the joiner never consented to send.
    expect(joiner.promptDeliveryResult).toBeUndefined()
    expect(
      mocks.callStructuredAgentSession.mock.calls.some(
        (call) => call[0]?.method === 'agentSession.send'
      )
    ).toBe(false)
    expect(mocks.seedDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tabId: 'structured-agent-session-unset-delivery-session',
        text: 'PR context'
      })
    )
  })
})
