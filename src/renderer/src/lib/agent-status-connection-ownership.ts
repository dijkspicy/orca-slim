import { parsePaneKey } from '../../../shared/stable-pane-id'

export type AgentStatusConnectionRouting = { connectionId: string | null }

type AgentStatusRoutingState = {
  terminalLayoutsByTabId:
    | Record<string, { ptyIdsByLeafId?: Record<string, string | undefined> } | undefined>
    | undefined
  ptyIdsByTabId: Record<string, string[] | undefined> | undefined
  sshConnectionStates: ReadonlyMap<string, { status: string }>
  transientClearedAgentStatusConnectionIds: Record<string, true>
}

// SSH and remote-runtime PTY namespaces were culled with the remote hosts; a
// remaining concrete PTY is authoritative local/WSL ownership.
export function resolveAgentStatusConnectionRouting(args: {
  ptyId: string | null | undefined
  expectedConnectionId?: string | null
  runtimeEnvironmentId?: string | null
}): AgentStatusConnectionRouting | undefined {
  const ptyId = args.ptyId?.trim()
  if (!ptyId) {
    return undefined
  }
  // Why: launch contexts that name an expected connection own their routing;
  // a local status observation must not answer for one.
  if (typeof args.expectedConnectionId === 'string') {
    return undefined
  }
  return { connectionId: null }
}

export function resolveLiveAgentStatusConnectionRouting(args: {
  state: AgentStatusRoutingState
  paneKey: string
  ptyId: string
  expectedConnectionId?: string | null
  runtimeEnvironmentId?: string | null
}): AgentStatusConnectionRouting | undefined {
  const pane = parsePaneKey(args.paneKey)
  if (
    !pane ||
    !args.state.ptyIdsByTabId?.[pane.tabId]?.includes(args.ptyId) ||
    args.state.terminalLayoutsByTabId?.[pane.tabId]?.ptyIdsByLeafId?.[pane.leafId] !== args.ptyId
  ) {
    return undefined
  }
  return resolveAgentStatusConnectionRouting(args)
}
