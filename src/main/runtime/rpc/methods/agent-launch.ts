/**
 * `agent.launch` — the one method that starts an agent, whatever surface it turns out to be.
 *
 * It exists because the routing decision had no host-side home: `worktree.create` never consulted
 * it, so any client that created a worktree with `startupAgent` got a PTY agent no matter what the
 * user's default said. That is not fixable inside `worktree.create`, because its contract is
 * exactly "spawn a PTY agent and hand me its `agentTerminalHandle`" — a host that quietly answered
 * it with a structured session would hand every older client a response with no handle and no
 * error. So `worktree.create` keeps that meaning verbatim, forever, and everything that has to
 * choose a surface comes here instead, behind a negotiated capability.
 *
 * A caller therefore never asks for a mode, and must read `outcome.kind` rather than assume one:
 * the receipt always says which surface ran and why, so a downgrade is never silent.
 *
 * A caller may still name the launch with `operationId`, but the durable admission ledger that
 * made a retry harmless lived in the structured-session host and is gone with it; the method now
 * runs the in-process path, whose only idempotency is the 60-second worktree-create dedupe.
 */

import { AGENT_LAUNCH_RUNTIME_CAPABILITY } from '../../../../shared/protocol-version'
import type {
  AgentLaunchIntent,
  AgentLaunchResult,
  AgentLaunchTarget
} from '../../../../shared/agent-launch-intent'
import { executeAgentLaunch } from '../../../agent-launch/agent-launch-executor'
import type { OrcaRuntimeService } from '../../orca-runtime'
import { defineMethod, type RpcContext } from '../core'
import { AgentLaunch, type AgentLaunchParams } from './agent-launch-schemas'
import { agentLaunchSurfaceFactory } from './agent-launch-surfaces'
import { agentLaunchWorkspaceFactory } from './agent-launch-worktree-creation'

/**
 * Advertising `agent.launch.v2` is a client's statement that it understands EITHER outcome — a
 * structured session it can open, or a terminal agent. A client that can only render one of the
 * two must keep using the surface-specific methods instead. The `clientKind === undefined` branch
 * is not "whatever ships in this build": it is the `orca` CLI over the runtime socket and the
 * SSH-remote CLI bridges, which carry no capability list at all. The desktop renderer ships in
 * this build and still arrives as `clientKind: 'runtime'`, so it advertises like any other client.
 */
export function supportsAgentLaunch(
  context: Pick<RpcContext, 'clientKind' | 'clientCapabilities'>
): boolean {
  return (
    context.clientKind === undefined ||
    context.clientCapabilities?.includes(AGENT_LAUNCH_RUNTIME_CAPABILITY) === true
  )
}

/**
 * A client addresses a workspace by selector, but the result's `worktreeId` is an id and every
 * step below the executor re-prefixes it as `id:<worktreeId>`. Resolving here is what keeps a
 * caller's `id:wt-7` from reaching the runtime as `id:id:wt-7`.
 *
 * The launch *scope* is what is asked for, because the id below is the only thing read off it. The
 * git-worktree record is the narrower answer — it does not exist for the floating workspace, so
 * asking for one refused a launch this method can perfectly well run, on a workspace whose id it
 * had already resolved. A folder workspace survived that only because the resolver fabricates a
 * worktree row for it; the scope is the answer that is real for all three kinds.
 */
async function agentLaunchTarget(
  params: AgentLaunchParams,
  runtime: Pick<OrcaRuntimeService, 'showTerminalWorkspaceLaunchScope'>
): Promise<AgentLaunchTarget> {
  if (params.target.kind === 'create-worktree') {
    return { kind: 'create-worktree', create: { ...params.target.create } }
  }
  const workspace = await runtime.showTerminalWorkspaceLaunchScope(params.target.worktree)
  return { kind: 'existing', worktree: workspace.id, workspacePath: workspace.path }
}

async function agentLaunchIntent(
  params: AgentLaunchParams,
  runtime: OrcaRuntimeService
): Promise<AgentLaunchIntent> {
  return {
    agent: params.agent,
    target: await agentLaunchTarget(params, runtime),
    ...(params.prompt ? { prompt: params.prompt } : {}),
    ...(params.sessionOptions ? { sessionOptions: params.sessionOptions } : {}),
    ...(params.reuseTerminal ? { reuseTerminal: params.reuseTerminal } : {}),
    // `null` means "no arguments" and must survive; only absence falls back to the settings default.
    ...(params.agentArgs !== undefined ? { agentArgs: params.agentArgs } : {}),
    ...(params.cwd ? { cwd: params.cwd } : {}),
    ...(params.launchSource ? { launchSource: params.launchSource } : {}),
    ...(params.paneKey ? { paneKey: params.paneKey } : {}),
    ...(params.sessionId ? { sessionId: params.sessionId } : {})
  }
}

async function validateReusedTerminal(
  intent: AgentLaunchIntent,
  runtime: Pick<OrcaRuntimeService, 'showTerminal' | 'isTerminalRunningAgent'>
): Promise<void> {
  if (!intent.reuseTerminal) {
    return
  }
  if (intent.target.kind !== 'existing') {
    throw new Error('agent_launch_reuse_requires_existing_workspace')
  }
  const terminal = await runtime.showTerminal(intent.reuseTerminal.handle)
  if (terminal.worktreeId !== intent.target.worktree) {
    throw new Error('agent_launch_terminal_worktree_mismatch')
  }
  if (!(await runtime.isTerminalRunningAgent(intent.reuseTerminal.handle))) {
    throw new Error('agent_launch_terminal_not_running_agent')
  }
}

/**
 * The half before anything is created: resolve the caller's selector, then check a reused terminal.
 * A throw from here proves no surface was built, which is what lets the ledger record a launch that
 * failed in it as `failed` rather than `unknown`.
 */
async function resolveUnlaunchedIntent(
  params: AgentLaunchParams,
  runtime: OrcaRuntimeService
): Promise<AgentLaunchIntent> {
  const intent = await agentLaunchIntent(params, runtime)
  await validateReusedTerminal(intent, runtime)
  return intent
}

function runAgentLaunch(
  intent: AgentLaunchIntent,
  context: RpcContext,
  attachOperationId?: string,
  operationCallerKey?: string
): Promise<AgentLaunchResult> {
  return executeAgentLaunch({
    runtime: context.runtime,
    intent,
    surfaces: agentLaunchSurfaceFactory(context, attachOperationId, operationCallerKey),
    workspaces: agentLaunchWorkspaceFactory(context, intent.agent)
  })
}

/**
 * The pre-ledger path, unchanged and kept for every caller that names no operation.
 *
 * `dedupeWorktreeCreate` is an in-memory 60-second window over the create half of a launch, keyed
 * on repo plus mutation id with no caller partition, and it dies with the process. That was the
 * only idempotency `agent.launch` ever had, and an existing-workspace launch never got even that.
 * It is deliberately NOT a second correctness authority now: once a caller supplies `operationId`,
 * durable admission encloses the whole operation and this cache is bypassed entirely, so there is
 * one place that decides whether a launch runs.
 */
function runLegacyAgentLaunch(
  params: AgentLaunchParams,
  context: RpcContext
): Promise<AgentLaunchResult> {
  const execute = async () =>
    runAgentLaunch(await resolveUnlaunchedIntent(params, context.runtime), context)
  if (params.target.kind === 'create-worktree' && params.target.create.clientMutationId) {
    return context.runtime.dedupeWorktreeCreate(
      params.target.create.repo,
      `agent.launch:${params.target.create.clientMutationId}`,
      execute
    )
  }
  return execute()
}

export const AGENT_LAUNCH_METHODS = [
  defineMethod({
    name: 'agent.launch',
    params: AgentLaunch,
    handler: async (params, context): Promise<AgentLaunchResult> => {
      if (!supportsAgentLaunch(context)) {
        throw new Error('agent_launch_unsupported')
      }
      // A named `operationId` used to enter the durable admission ledger owned by the
      // structured-session host. That host is gone, so every launch now runs the
      // in-process path: same-process retries still join the 60-second create dedupe.
      return runLegacyAgentLaunch(params, context)
    }
  })
]
