/**
 * How `agent.launch` builds the surface the executor decided on.
 *
 * The structured-session half is gone with the native-chat domain: the factory
 * answers the host's own `structured_agent_session_unsupported` refusal, which
 * the executor treats as definitive and downgrades to a terminal agent. The
 * terminal half is deliberately the plain, user-facing form: a terminal agent
 * created exactly as a new agent tab is.
 *
 * Delivering the launch text is here for the same reason: it is the wire-shaped
 * half. A terminal agent takes it on its launch command or as a paste into its
 * PTY, which is the executor's decision, carried in as `startupPrompt` or asked
 * for through `deliverTerminalPrompt`.
 */

import {
  AgentLaunchStructuredSessionRefusedError,
  type AgentLaunchSurfaceFactory
} from '../../../agent-launch/agent-launch-surface-factories'
import { deliverTerminalAgentLaunchPrompt } from './agent-launch-terminal-prompt'
import { toAgentLaunchPreferences } from '../../../../shared/agent-launch-preferences'
import { paneIdentity } from '../../runtime-terminal-pane-identity'
import type { RpcContext } from '../core'

/** Replay-safe launches kept the nested attach in the launch's caller namespace; the ledger that
 *  named it went with the structured-session domain, so the ids are simply unused here. */
export function agentLaunchSurfaceFactory(
  context: RpcContext,
  _attachOperationId?: string,
  _operationCallerKey?: string
): AgentLaunchSurfaceFactory {
  return {
    createStructuredSession: async () => {
      // The native-chat domain is gone. A definitive refusal is the executor's
      // downgrade signal, so the launch lands on a terminal agent instead of failing.
      throw new AgentLaunchStructuredSessionRefusedError(
        'structured_agent_session_unsupported',
        'Structured agent sessions are not supported by this build.'
      )
    },
    createTerminalAgent: async ({
      worktreeId,
      agent,
      startupPrompt,
      agentArgs,
      cwd,
      paneKey,
      options
    }) => {
      const launchPreferences = toAgentLaunchPreferences(options)
      const terminal = await context.runtime.createTerminal(`id:${worktreeId}`, {
        // The agent id is not a shell command — `cursor` is the desktop app, its CLI is
        // `cursor-agent` — so the runtime builds the configured launcher.
        startupAgent: agent,
        // Folded into that launcher by the same startup plan a new agent tab is built from, so an
        // argv agent's prompt is in its argv at exec time rather than typed in afterwards.
        ...(startupPrompt ? { startupPrompt } : {}),
        ...(agentArgs !== undefined ? { agentArgs } : {}),
        ...(cwd ? { cwd } : {}),
        // The model the user picked outranks configured args here too, as it does on a chat.
        ...(launchPreferences ? { launchPreferences } : {}),
        // A live reserved pane would be attached, not launched into, so the runtime refuses it.
        ...(paneKey ? { ...paneIdentity(paneKey), requireFreshPane: true } : {})
      })
      return {
        handle: terminal.handle,
        // The runtime already minted this pane and baked it into the PTY's env and its own reveal;
        // dropping it here was what left a client with no way to name the tab it just asked for.
        ...(terminal.paneKey ? { paneKey: terminal.paneKey } : {}),
        ...(terminal.warning ? { warning: terminal.warning } : {})
      }
    },
    deliverTerminalPrompt: async ({ handle, prompt }) =>
      deliverTerminalAgentLaunchPrompt({
        runtime: context.runtime,
        handle,
        text: prompt.text
      })
  }
}
