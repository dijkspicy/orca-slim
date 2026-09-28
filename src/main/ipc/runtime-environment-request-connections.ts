import type { PairingOffer } from '../../shared/pairing'
import { resolveEnvironment } from '../../shared/runtime-environment-store'
import { getPreferredPairingOffer } from '../../shared/runtime-environments'
import type { RuntimeHostStatusOwner } from '../../shared/runtime-host-status-owner'
import type {
  RuntimeOrchestrationEnvelope,
  RuntimeRpcResponse
} from '../../shared/runtime-rpc-envelope'
import { createRuntimeEnvironmentStatusOwner } from './runtime-environment-status-owner'
import { isRuntimeEnvironmentManuallyDisconnected } from './runtime-environment-manual-disconnect'

/** Local stand-in for the removed shared-control diagnostics record. */
export type RuntimeEnvironmentConnectionDiagnostics = {
  state: 'connecting' | 'ready' | 'reconnecting' | 'closed'
}

const TRANSPORT_UNAVAILABLE_MESSAGE = 'Runtime environment transport is unavailable'

type CachedSharedControlConnection = {
  pairingKey: string
}

const sharedControlConnections = new Map<string, CachedSharedControlConnection>()
const statusOwners = new Map<string, { key: string; owner: RuntimeHostStatusOwner }>()

export function getRuntimeEnvironmentStatusOwner(
  userDataPath: string,
  selector: string
): RuntimeHostStatusOwner {
  const environment = resolveEnvironment(userDataPath, selector)
  const pairing = getPreferredPairingOffer(environment)
  const key = `${userDataPath}\0${environment.pairingRevision ?? environment.createdAt}\0${getPairingKey(pairing)}`
  let cached = statusOwners.get(environment.id)
  if (!cached || cached.key !== key || cached.owner.read().retired) {
    if (cached) {
      closeRemoteRuntimeRequestConnection(environment.id)
    }
    const owner = createRuntimeEnvironmentStatusOwner(userDataPath, environment, {
      isReady: () => false,
      request: () => {
        throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
      },
      establish: () => {},
      pause: () => {}
    })
    cached = { key, owner }
    statusOwners.set(environment.id, cached)
    if (isRuntimeEnvironmentManuallyDisconnected(environment.id)) {
      owner.dispose()
    }
  }
  return cached.owner
}

export function resetRuntimeEnvironmentStatusOwners(): void {
  for (const id of statusOwners.keys()) {
    closeRemoteRuntimeRequestConnection(id)
  }
}

export function getRuntimeEnvironmentStatusSnapshots() {
  return [...statusOwners.values()].map(({ owner }) => owner.read())
}

export function closeRemoteRuntimeRequestConnection(environmentId: string): void {
  const status = statusOwners.get(environmentId)
  statusOwners.delete(environmentId)
  status?.owner.dispose()
  closeRemoteRuntimeSharedControlConnection(environmentId)
}

export function sendRemoteRuntimeConnectionRequest<TResult>(
  _environmentId: string,
  _pairing: PairingOffer,
  _method: string,
  _params: unknown,
  _timeoutMs: number,
  _signal?: AbortSignal
): Promise<RuntimeRpcResponse<TResult>> {
  throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
}

export function sendRemoteRuntimeSharedControlRequest<TResult>(
  _environmentId: string,
  _pairing: PairingOffer,
  _method: string,
  _params: unknown,
  _timeoutMs: number,
  _envelope?: RuntimeOrchestrationEnvelope,
  _signal?: AbortSignal
): Promise<RuntimeRpcResponse<TResult>> {
  throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
}

export function subscribeRemoteRuntimeSharedControlRequest(
  _environmentId: string,
  _pairing: PairingOffer,
  _method: string,
  _params: unknown,
  _timeoutMs: number,
  _callbacks: unknown
): Promise<never> {
  throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
}

export function closeRemoteRuntimeSharedControlConnection(environmentId: string): void {
  sharedControlConnections.delete(environmentId)
}

export function getRemoteRuntimeSharedControlDiagnostics(
  environmentId: string
): RuntimeEnvironmentConnectionDiagnostics | null {
  return sharedControlConnections.has(environmentId) ? { state: 'closed' } : null
}

export function reconnectRemoteRuntimeSharedControlConnection(_environmentId: string): void {}

export function retryRemoteRuntimeSharedControlConnectionNow(_environmentId: string): void {}

export function pauseRemoteRuntimeSharedControlRetry(_environmentId: string): void {}

export function ensureRemoteRuntimeSharedControlConnection(
  _environmentId: string,
  _pairing: PairingOffer
): void {}

export function retryRemoteRuntimeSharedControlConnectionsNow(): void {
  // No shared-control connections can exist without the removed transport.
}
