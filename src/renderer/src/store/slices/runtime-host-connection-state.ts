// Host connection-state derivation, migrated from the deleted renderer-mirror
// module of the same name so the surviving store selectors keep their verdicts.
import { runtimeHostContactFromSnapshot } from '../../../../shared/runtime-host-contact'
import type { RuntimeHostStatusSnapshot } from '../../../../shared/runtime-host-status'
import type { RuntimeStatus } from '../../../../shared/runtime-types'
import { isRuntimeWorkspaceWindowClosed } from '../../../../shared/runtime-workspace-window-availability'

// Why: 'workspace-window-closed' is a reachable host that cannot serve graph-backed
// work — connected for counting purposes, but not interchangeable with 'connected'.
export type RuntimeHostConnectionState =
  | 'connected'
  // The SSH/control transport is up, but the Orca runtime did not answer its
  // status probe. This is distinct from a disconnected transport.
  | 'runtime-unavailable'
  | 'workspace-window-closed'
  | 'checking'
  | 'reconnecting'
  | 'disconnected'

// Why: one derivation for every host surface (status bar + Settings > Available Hosts),
// so a degraded host can never read "Connected" in one place and "Ready" in the other.
export function runtimeHostConnectionState({
  hasStatusEntry,
  status,
  transportChecking = false,
  remoteControl = null
}: {
  hasStatusEntry: boolean
  status: RuntimeStatus | null | undefined
  /** Transport evidence is independent from the runtime status RPC result. */
  transportChecking?: boolean
  remoteControl?: RuntimeStatus['remoteControl'] | null
}): RuntimeHostConnectionState {
  if (!hasStatusEntry) {
    return 'checking'
  }
  if (status?.remoteControl?.state === 'reconnecting' || remoteControl?.state === 'reconnecting') {
    return 'reconnecting'
  }
  if (!status) {
    if (remoteControl?.state === 'ready') {
      return 'runtime-unavailable'
    }
    // The control channel is still negotiating/reconnecting, so the host's
    // runtime outcome is not yet knowable.
    return remoteControl?.state === 'awaiting_ready' ||
      remoteControl?.state === 'awaiting_authenticated' ||
      transportChecking
      ? 'checking'
      : 'disconnected'
  }
  // Why no lastError requirement: a clean close (server restart, host sleep, network
  // blip) leaves lastError null, and demanding an error string painted those hosts green.
  if (statusRemoteControlIsClosed(status, remoteControl)) {
    return 'disconnected'
  }
  // Why: the socket is up but ready/auth has not completed, so nothing can run there yet.
  const activeRemoteControl = status.remoteControl ?? remoteControl
  if (activeRemoteControl && activeRemoteControl.state !== 'ready') {
    return 'checking'
  }
  // Why: reachable but graph-less — the transport is fine, so this is not a network
  // disconnect, but calling it "Connected" hides that nothing will run there.
  if (isRuntimeWorkspaceWindowClosed(status)) {
    return 'workspace-window-closed'
  }
  // Why: "connected" means attached/reachable, NOT "is the active default host".
  return 'connected'
}

function statusRemoteControlIsClosed(
  status: RuntimeStatus,
  remoteControl: RuntimeStatus['remoteControl'] | null
): boolean {
  return (status.remoteControl ?? remoteControl)?.state === 'closed'
}

export function isConnectedRuntimeHostState(state: RuntimeHostConnectionState): boolean {
  return (
    state === 'connected' || state === 'runtime-unavailable' || state === 'workspace-window-closed'
  )
}

/** The same derivation, read straight off a recorded status entry. */
export function runtimeHostConnectionStateForEntry(
  entry:
    | {
        status: RuntimeStatus | null
        remoteControl?: RuntimeStatus['remoteControl'] | null
        snapshot?: RuntimeHostStatusSnapshot
      }
    | null
    | undefined
): RuntimeHostConnectionState {
  const snapshot = entry?.snapshot
  if (snapshot) {
    // Why the contact and not the snapshot fields: these branches were the only place
    // that knew a non-verified probe has kinds, and every other reader had to re-derive
    // them or guess. Naming them once means the next reader picks an arm instead of
    // re-reading a null.
    const contact = runtimeHostContactFromSnapshot(snapshot, entry?.status ?? null)
    if (contact.verdict === 'retired' || contact.verdict === 'refused') {
      return 'disconnected'
    }
    if (contact.verdict === 'unverifiable') {
      if (contact.reason === 'transport-down') {
        return 'reconnecting'
      }
      if (contact.reason === 'checking') {
        return 'checking'
      }
      if (contact.reason === 'probe-failed') {
        return 'runtime-unavailable'
      }
    }
  }
  return runtimeHostConnectionState({
    hasStatusEntry: Boolean(entry),
    status: entry?.status ?? null,
    // Why only 'connecting': a transport mid-handshake fell through to the default and
    // reported a host still establishing contact as down.
    transportChecking: snapshot?.transport === 'connecting',
    remoteControl: entry?.remoteControl ?? entry?.status?.remoteControl ?? null
  })
}
