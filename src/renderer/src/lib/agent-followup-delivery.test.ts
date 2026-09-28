import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendFollowupPromptWhenAgentReady } from './agent-followup-delivery'
import { TUI_AGENT_CONFIG } from '../../../shared/tui-agent-config'

// The interpreter-wrapped agents that deliver their prompt over stdin after the
// process starts. These are pip console-scripts, so the PTY foreground comm is
// python/python3 — never the agent's own name.
const INTERPRETER_WRAPPED_AGENTS = [
  { agent: 'aider', expectedProcess: TUI_AGENT_CONFIG.aider.expectedProcess },
  { agent: 'mistral-vibe', expectedProcess: TUI_AGENT_CONFIG['mistral-vibe'].expectedProcess }
] as const

describe('sendFollowupPromptWhenAgentReady — interpreter-wrapped agents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('globalThis', globalThis)
    // Deliver the prompt write eagerly so the test does not depend on retries.
    vi.stubGlobal('window', {
      setTimeout,
      api: {
        pty: {
          inspectProcess: vi.fn(),
          writeAccepted: vi.fn().mockResolvedValue(true),
          write: vi.fn()
        }
      }
    })
  })

  it('sanity: config keeps aider/vibe as stdin-after-start with python-style expected process', () => {
    expect(TUI_AGENT_CONFIG.aider.promptInjectionMode).toBe('stdin-after-start')
    expect(TUI_AGENT_CONFIG['mistral-vibe'].promptInjectionMode).toBe('stdin-after-start')
  })

  for (const { agent, expectedProcess } of INTERPRETER_WRAPPED_AGENTS) {
    it(`types the prompt once ${agent} is up behind a python3 wrapper with a live child`, async () => {
      // The console-script agent is running: foreground comm is python3 and the
      // PTY has a non-shell child. The exact agent name never appears.
      vi.mocked(window.api.pty.inspectProcess).mockResolvedValue({
        foregroundProcess: 'python3',
        hasChildProcesses: true
      })

      const delivered = await sendFollowupPromptWhenAgentReady({
        ptyId: 'pty-1',
        expectedProcess,
        prompt: 'ship it'
      })

      expect(delivered).toBe(true)
      expect(window.api.pty.writeAccepted).toHaveBeenCalledWith('pty-1', 'ship it\r')
    })

    it(`still refuses to type into a bare ${agent} shell foreground`, async () => {
      // No agent yet: foreground is a plain shell with no non-shell child. The
      // guard must NOT write user text into an arbitrary shell.
      vi.mocked(window.api.pty.inspectProcess).mockResolvedValue({
        foregroundProcess: 'zsh',
        hasChildProcesses: false
      })

      const delivered = await sendFollowupPromptWhenAgentReady({
        ptyId: 'pty-1',
        expectedProcess,
        prompt: 'ship it'
      })

      expect(delivered).toBe(false)
      expect(window.api.pty.writeAccepted).not.toHaveBeenCalled()
    })

    it(`refuses to type into a ${agent} wrapper without a live child`, async () => {
      vi.mocked(window.api.pty.inspectProcess).mockResolvedValue({
        foregroundProcess: 'python3',
        hasChildProcesses: false
      })

      const delivered = await sendFollowupPromptWhenAgentReady({
        ptyId: 'pty-1',
        expectedProcess,
        prompt: 'ship it'
      })

      expect(delivered).toBe(false)
      expect(window.api.pty.writeAccepted).not.toHaveBeenCalled()
    })
  }

  it('types immediately when the resolver already returns the agent name (local ps path)', async () => {
    // On local desktop the ps-table resolver usually resolves python3 → aider
    // before we poll; the exact-match path must keep working.
    vi.mocked(window.api.pty.inspectProcess).mockResolvedValue({
      foregroundProcess: 'aider',
      hasChildProcesses: true
    })

    const delivered = await sendFollowupPromptWhenAgentReady({
      ptyId: 'pty-1',
      expectedProcess: 'aider',
      prompt: 'ship it'
    })

    expect(delivered).toBe(true)
    expect(window.api.pty.writeAccepted).toHaveBeenCalledWith('pty-1', 'ship it\r')
  })
})
