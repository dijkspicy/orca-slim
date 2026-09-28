import { waitForPromiseWithSignal } from '../../shared/abort-signal-reason'
import type { PairingOffer } from '../../shared/pairing'
import type {
  RuntimeOrchestrationEnvelope,
  RuntimeRpcResponse
} from '../../shared/runtime-rpc-envelope'
import type { KnownRuntimeEnvironment } from '../../shared/runtime-environments'
import { getPreferredPairingOffer } from '../../shared/runtime-environments'
import { markEnvironmentUsed, resolveEnvironment } from '../../shared/runtime-environment-store'
import { recordRuntimeEnvironmentUsage } from './runtime-environment-usage-record'
import {
  isRuntimeEnvironmentCapabilityOutcomeCurrent,
  type RuntimeEnvironmentCapabilityOutcome
} from './runtime-environment-capability-evidence'
import { runtimeEnvironmentRevisionFailure } from './runtime-environment-revision-guard'
import { supportsSharedControl } from './runtime-environment-shared-control-support'
import { sendRemoteRuntimeSharedControlRequestAbortable } from './runtime-environment-abortable-requests'

const TRANSPORT_UNAVAILABLE_MESSAGE = 'Runtime environment transport is unavailable'

type SupportRoute = {
  environment: KnownRuntimeEnvironment
  pairing: PairingOffer
  outcome: Exclude<RuntimeEnvironmentCapabilityOutcome, { kind: 'stale_incarnation' }>
}

type SubscriptionCallbacks = {
  onEvent: (
    payload:
      | { type: 'response'; response: RuntimeRpcResponse<unknown> }
      | { type: 'binary'; bytes: Uint8Array<ArrayBufferLike> }
      | { type: 'error'; code: string; message: string }
      | { type: 'close' }
  ) => void
  onClose: () => void
}

export function shouldRouteCallBySupport(method: string): boolean {
  // Snapshot recovery must stay available while shared-control streams reconnect after a restart.
  return (
    method !== 'status.get' && method !== 'session.tabs.list' && method !== 'session.tabs.listAll'
  )
}

export function shouldRouteSubscriptionBySupport(method: string): boolean {
  if (method === 'browser.screencast' || method === 'terminal.multiplex') {
    return false
  }
  return (
    method === 'runtime.clientEvents.subscribe' ||
    method === 'session.tabs.subscribe' ||
    method === 'session.tabs.subscribeAll' ||
    method === 'accounts.subscribe' ||
    method === 'notifications.subscribe' ||
    method === 'files.watch'
  )
}

export function executeSupportRoutedCall(args: {
  userDataPath: string
  environment: KnownRuntimeEnvironment
  method: string
  params: unknown
  timeoutMs: number
  expectedPairingRevision?: number
  envelope?: RuntimeOrchestrationEnvelope
  signal?: AbortSignal
}): Promise<RuntimeRpcResponse<unknown>> {
  return routeRuntimeEnvironmentCallBySupport({
    userDataPath: args.userDataPath,
    initialEnvironment: args.environment,
    method: args.method,
    timeoutMs: args.timeoutMs,
    expectedPairingRevision: args.expectedPairingRevision,
    signal: args.signal,
    supported: (route) =>
      sendRemoteRuntimeSharedControlRequestAbortable(
        route.environment.id,
        route.pairing,
        args.method,
        args.params,
        args.timeoutMs,
        args.envelope,
        args.signal
      ),
    unsupported: () => {
      // The direct one-shot socket client was removed with the remote runtime domain.
      throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
    },
    markUsed: (environmentId, response) => {
      if (response.ok) {
        markEnvironmentUsed(args.userDataPath, environmentId, {
          runtimeId: response._meta.runtimeId
        })
      }
    }
  })
}

export async function subscribeSupportRoutedRuntimeEnvironment(args: {
  userDataPath: string
  environment: KnownRuntimeEnvironment
  method: string
  params: unknown
  timeoutMs: number
  callbacks: SubscriptionCallbacks
  isCurrent: () => boolean
}): Promise<never> {
  let markedUsed = false
  const callbacks = subscriptionCallbacks(args, () => {
    if (markedUsed || !args.isCurrent()) {
      return false
    }
    markedUsed = true
    return true
  })
  await routeRuntimeEnvironmentSubscriptionBySupport({
    userDataPath: args.userDataPath,
    environment: args.environment,
    timeoutMs: args.timeoutMs,
    isCurrent: args.isCurrent,
    supported: (route) => {
      void route
      // The shared-control subscription transport was removed with the remote runtime domain.
      throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
    },
    unsupported: () => {
      // The direct subscription client was removed with the remote runtime domain.
      throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
    },
    callbacks
  })
  throw new Error(TRANSPORT_UNAVAILABLE_MESSAGE)
}

export async function routeRuntimeEnvironmentCallBySupport(args: {
  userDataPath: string
  initialEnvironment: KnownRuntimeEnvironment
  method: string
  timeoutMs: number
  expectedPairingRevision?: number
  signal?: AbortSignal
  supported: (route: SupportRoute) => Promise<RuntimeRpcResponse<unknown>>
  unsupported: (route: SupportRoute) => Promise<RuntimeRpcResponse<unknown>>
  markUsed: (environmentId: string, response: RuntimeRpcResponse<unknown>) => void
}): Promise<RuntimeRpcResponse<unknown>> {
  let environment = args.initialEnvironment
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const revisionFailure = runtimeEnvironmentRevisionFailure(
      environment,
      args.expectedPairingRevision,
      args.method
    )
    if (revisionFailure) {
      return revisionFailure
    }
    const pairing = getPreferredPairingOffer(environment)
    const outcome = await waitForPromiseWithSignal(
      supportsSharedControl(args.userDataPath, environment, pairing, args.timeoutMs),
      args.signal
    )
    if (
      outcome.kind !== 'stale_incarnation' &&
      isRuntimeEnvironmentCapabilityOutcomeCurrent(outcome)
    ) {
      const route = { environment, pairing, outcome }
      const response = await (outcome.kind === 'supported'
        ? args.supported(route)
        : args.unsupported(route))
      if (isRuntimeEnvironmentCapabilityOutcomeCurrent(outcome)) {
        args.markUsed(environment.id, response)
      }
      return response
    }
    environment = resolveEnvironment(args.userDataPath, environment.id)
  }
  return runtimeEnvironmentChangedFailure(environment, args.method)
}

export async function routeRuntimeEnvironmentSubscriptionBySupport(args: {
  userDataPath: string
  environment: KnownRuntimeEnvironment
  timeoutMs: number
  isCurrent: () => boolean
  supported: (route: SupportRoute) => Promise<never>
  unsupported: (route: SupportRoute) => Promise<never>
  callbacks: SubscriptionCallbacks
}): Promise<never> {
  const pairing = getPreferredPairingOffer(args.environment)
  const outcome = await supportsSharedControl(
    args.userDataPath,
    args.environment,
    pairing,
    args.timeoutMs
  )
  if (
    outcome.kind === 'stale_incarnation' ||
    !args.isCurrent() ||
    !isRuntimeEnvironmentCapabilityOutcomeCurrent(outcome)
  ) {
    throw new Error('Runtime environment pairing changed; refresh and try again')
  }
  const route = { environment: args.environment, pairing, outcome }
  return outcome.kind === 'supported' ? args.supported(route) : args.unsupported(route)
}

function runtimeEnvironmentChangedFailure(
  environment: KnownRuntimeEnvironment,
  method: string
): RuntimeRpcResponse<never> {
  return {
    id: method,
    ok: false,
    error: {
      code: 'runtime_environment_changed',
      message: 'Runtime environment pairing changed; refresh and try again'
    },
    _meta: { runtimeId: environment.runtimeId }
  }
}

function subscriptionCallbacks(
  args: Pick<
    Parameters<typeof subscribeSupportRoutedRuntimeEnvironment>[0],
    'userDataPath' | 'environment' | 'callbacks'
  >,
  shouldMarkUsed: () => boolean
): SubscriptionCallbacks {
  return {
    onResponse: (response: RuntimeRpcResponse<unknown>) => {
      if (response.ok && shouldMarkUsed()) {
        recordRuntimeEnvironmentUsage(args.userDataPath, args.environment.id, {
          runtimeId: response._meta.runtimeId
        })
      }
      args.callbacks.onEvent({ type: 'response' as const, response })
    },
    onBinary: (bytes: Uint8Array<ArrayBufferLike>) =>
      args.callbacks.onEvent({ type: 'binary' as const, bytes }),
    onError: (error: { code: string; message: string }) =>
      args.callbacks.onEvent({ type: 'error' as const, code: error.code, message: error.message }),
    onClose: () => {
      args.callbacks.onEvent({ type: 'close' as const })
      args.callbacks.onClose()
    }
  }
}
