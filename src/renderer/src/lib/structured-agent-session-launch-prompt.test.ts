// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  settleStructuredAgentLaunchPrompt,
  type StructuredAgentSessionOutboxEntry
} from './structured-agent-session-launch-prompt'

const mocks = vi.hoisted(() => ({ call: vi.fn() }))

// Why: the launch now rides the local runtime bridge directly.
vi.stubGlobal('window', { api: { runtime: { call: mocks.call } } })

describe('settleStructuredAgentLaunchPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reports an admitted launch prompt delivered while retaining it for the provider echo', async () => {
    const stagedEntry: StructuredAgentSessionOutboxEntry = {
      clientMessageId: 'op-1',
      sessionId: 'session-1',
      body: { kind: 'message', role: 'user', blocks: [{ type: 'text', text: 'review this' }] },
      previewUris: [],
      state: 'queued',
      queuedAt: Date.now(),
      lastAttemptAt: null,
      retryAfterUnknownSubmittedAt: null,
      source: 'launch'
    }
    const onPromptDelivered = vi.fn()
    mocks.call.mockResolvedValue({
      ok: true,
      result: {
        ok: true,
        replayed: false,
        fence: 1,
        cursor: { epoch: 'epoch-1', sequence: 1 },
        value: {
          clientMessageId: stagedEntry.clientMessageId,
          submission: {
            clientMessageId: stagedEntry.clientMessageId,
            fence: 1,
            payloadFingerprint: 'fingerprint',
            dispatchState: 'pending',
            providerItemId: null,
            reason: null,
            submittedAt: 1,
            resolvedAt: null
          }
        }
      }
    })

    await expect(
      settleStructuredAgentLaunchPrompt({
        launchResult: Promise.resolve({ sessionId: 'session-1', fence: 1 }),
        options: { prompt: 'review this', onPromptDelivered },
        stagedEntry
      })
    ).resolves.toEqual({ delivered: true, failureNotified: false })

    expect(onPromptDelivered).toHaveBeenCalledOnce()
    expect(mocks.call).toHaveBeenCalledWith(
      'agentSession.send',
      expect.objectContaining({
        envelope: expect.objectContaining({
          sessionId: 'session-1',
          clientOperationId: stagedEntry.clientMessageId,
          expectedRuntimeFence: 1
        })
      })
    )
  })
})
