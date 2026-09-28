import { getPreferredPairingOffer } from '../../shared/runtime-environments'
import { resolveEnvironment, markEnvironmentUsed } from '../../shared/runtime-environment-store'
import type {
  RuntimeOrchestrationEnvelope,
  RuntimeRpcResponse
} from '../../shared/runtime-rpc-envelope'
import type { RuntimeStatus } from '../../shared/runtime-types'
import { enqueueRuntimeCall } from './runtime-environment-call-queue'
import { getRuntimeEnvironmentStatusOwner } from './runtime-environment-request-connections'
import { sendRemoteRuntimeConnectionRequestAbortable } from './runtime-environment-abortable-requests'
import { attachRemoteControlDiagnostics } from './runtime-environment-status-diagnostics'
import { isRuntimeEnvironmentManuallyDisconnected } from './runtime-environment-manual-disconnect'
import { runtimeEnvironmentRevisionFailure } from './runtime-environment-revision-guard'
import { withTailscaleHintForResponse } from './runtime-environment-tailscale-response'
import { resetSharedControlSupport } from './runtime-environment-shared-control-support'

const DEFAULT_REMOTE_RUNTIME_TIMEOUT_MS = 15_000
const TRANSPORT_UNAVAILABLE_MESSAGE = 'Runtime environment transport is unavailable'

/** Local stand-in for the removed remote-runtime subscription handle. */
export type RuntimeEnvironmentSubscription = {
  requestId: string
  close: () => void
  sendBinary: (bytes: Uint8Array<ArrayBufferLike>) => boolean
}

export { resetSharedControlSupport }

export async function getRuntimeEnvironmentStatus(
  userDataPath: string,
  selector: string,
  timeoutMs?: number,
  options?: { observeOnly?: true; signal?: AbortSignal; reconnect?: true }
): Promise<RuntimeRpcResponse<RuntimeStatus>> {
  const environment = resolveEnvironment(userDataPath, selector)
  if (isRuntimeEnvironmentManuallyDisconnected(environment.id)) {
    return {
      id: 'status.get',
      ok: false,
      error: {
        code: 'runtime_manually_disconnected',
        message: 'Runtime environment is manually disconnected.'
      }
    }
  }
  const response = await getRuntimeEnvironmentStatusOwner(userDataPath, environment.id).refresh({
    timeoutMs,
    ...options
  })
  return attachRemoteControlDiagnostics(
    withTailscaleHintForResponse(response, getPreferredPairingOffer(environment).endpoint),
    environment.id
  )
}

export async function callRuntimeEnvironment(
  userDataPath: string,
  selector: string,
  method: string,
  params: unknown,
  timeoutMs?: number,
  expectedEnvironmentPairingRevision?: number,
  _envelope?: RuntimeOrchestrationEnvelope,
  options?: { signal?: AbortSignal; expectedEnvironmentRuntimeId?: string }
): Promise<RuntimeRpcResponse<unknown>> {
  if (method === 'status.get') {
    const environment = resolveEnvironment(userDataPath, selector)
    const failure = runtimeEnvironmentRevisionFailure(
      environment,
      expectedEnvironmentPairingRevision,
      method
    )
    return failure ?? getRuntimeEnvironmentStatus(userDataPath, selector, timeoutMs, options)
  }
  const environment = resolveEnvironment(userDataPath, selector)
  return enqueueRuntimeCall(
    environment.id,
    method,
    async () => {
      const currentEnvironment = resolveEnvironment(userDataPath, environment.id)
      const revisionFailure = runtimeEnvironmentRevisionFailure(
        currentEnvironment,
        expectedEnvironmentPairingRevision,
        method,
        options?.expectedEnvironmentRuntimeId
      )
      if (revisionFailure) {
        return revisionFailure
      }
      const effectiveTimeoutMs = timeoutMs ?? DEFAULT_REMOTE_RUNTIME_TIMEOUT_MS
      if (shouldUseCachedRequestConnection(method)) {
        const response = await sendRemoteRuntimeConnectionRequestAbortable(
          currentEnvironment.id,
          getPreferredPairingOffer(currentEnvironment),
          method,
          params,
          effectiveTimeoutMs,
          options?.signal
        )
        markEnvironmentUsedFromResponse(userDataPath, currentEnvironment.id, response)
        return response
      }
      // Why: the direct one-shot and support-routed socket clients were removed with the
      // remote-runtime domain, so every remaining call path reports the transport as gone.
      throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
    },
    options?.signal
  )
}

export async function subscribeRuntimeEnvironment(
  _userDataPath: string,
  _selector: string,
  _method: string,
  _params: unknown,
  _timeoutMs: number | undefined,
  callbacks: {
    onEvent: (
      payload:
        | { type: 'response'; response: RuntimeRpcResponse<unknown> }
        | { type: 'binary'; bytes: Uint8Array<ArrayBufferLike> }
        | { type: 'error'; code: string; message: string }
        | { type: 'close' }
    ) => void
    onClose: () => void
  },
  _isCurrent: () => boolean = () => true
): Promise<RuntimeEnvironmentSubscription> {
  // Why: the direct and shared-control subscription clients were removed with the
  // remote-runtime domain; report the failure through the subscription error channel
  // so the renderer sees the same error shape a mid-stream failure would carry.
  callbacks.onEvent({
    type: 'error',
    code: 'runtime_transport_unavailable',
    message: TRANSPORT_UNAVAILABLE_MESSAGE
  })
  callbacks.onEvent({ type: 'close' })
  callbacks.onClose()
  return {
    requestId: 'runtime-environment-transport-unavailable',
    close: () => {},
    sendBinary: () => false
  }
}

function markEnvironmentUsedFromResponse(
  userDataPath: string,
  environmentId: string,
  response: RuntimeRpcResponse<unknown>
): void {
  if (response.ok === true) {
    markEnvironmentUsed(userDataPath, environmentId, { runtimeId: response._meta.runtimeId })
  }
}

function shouldUseCachedRequestConnection(method: string): boolean {
  return method === 'terminal.send' || method === 'terminal.updateViewport'
}
