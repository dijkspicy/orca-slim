import type { PairingOffer } from '../../shared/pairing'
import type { RuntimeOrchestrationEnvelope } from '../../shared/runtime-rpc-envelope'
import {
  sendRemoteRuntimeConnectionRequest,
  sendRemoteRuntimeSharedControlRequest
} from './runtime-environment-request-connections'

export function sendRemoteRuntimeConnectionRequestAbortable(
  environmentId: string,
  pairing: PairingOffer,
  method: string,
  params: unknown,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<unknown> {
  return signal
    ? sendRemoteRuntimeConnectionRequest(environmentId, pairing, method, params, timeoutMs, signal)
    : sendRemoteRuntimeConnectionRequest(environmentId, pairing, method, params, timeoutMs)
}

export function sendRemoteRuntimeSharedControlRequestAbortable(
  environmentId: string,
  pairing: PairingOffer,
  method: string,
  params: unknown,
  timeoutMs: number,
  envelope?: RuntimeOrchestrationEnvelope,
  signal?: AbortSignal
) {
  return signal
    ? sendRemoteRuntimeSharedControlRequest(
        environmentId,
        pairing,
        method,
        params,
        timeoutMs,
        envelope,
        signal
      )
    : sendRemoteRuntimeSharedControlRequest(environmentId, pairing, method, params, timeoutMs)
}
