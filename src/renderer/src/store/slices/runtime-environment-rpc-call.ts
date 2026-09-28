// Runtime-environment RPC plumbing for the surviving store slices: the client
// target routing and one envelope-unwrapped call through the preload bridge,
// migrated off the deleted renderer-mirror RPC client (its compat-cache and
// revision-fencing extras are not carried over).
import type { RuntimeRpcResponse } from '../../../../shared/runtime-rpc-envelope'
import type { RuntimeCapability } from '../../../../shared/protocol-version'
import type { RuntimeStatus } from '../../../../shared/runtime-types'
import type { GlobalSettings } from '../../../../shared/global-settings-types'

export type RuntimeClientTarget = { kind: 'local' } | { kind: 'environment'; environmentId: string }

export function getActiveRuntimeTarget(
  settings: Pick<GlobalSettings, 'activeRuntimeEnvironmentId'> | null | undefined
): RuntimeClientTarget {
  const environmentId = settings?.activeRuntimeEnvironmentId?.trim()
  return environmentId ? { kind: 'environment', environmentId } : { kind: 'local' }
}

export type RuntimeEnvironmentRpcResult<TResult> =
  | { ok: true; result: TResult }
  | { ok: false; errorCode: string; errorMessage: string }

export async function callRuntimeEnvironmentRpc<TResult>(
  environmentId: string,
  method: string,
  params?: unknown,
  options?: { timeoutMs?: number }
): Promise<RuntimeEnvironmentRpcResult<TResult>> {
  const response: RuntimeRpcResponse<unknown> = await window.api.runtimeEnvironments.call({
    selector: environmentId,
    method,
    params,
    ...(options?.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {})
  })
  if (response.ok === false) {
    return { ok: false, errorCode: response.error.code, errorMessage: response.error.message }
  }
  // oxlint-disable-next-line typescript/consistent-type-assertions -- SAFETY: the preload bridge types the RPC result as unknown; each call site owns its method's result contract.
  return { ok: true, result: response.result as TResult }
}

/** One status.get probe answered whether the host advertises a capability. */
export async function runtimeEnvironmentSupportsCapability(
  environmentId: string,
  capability: RuntimeCapability,
  timeoutMs?: number
): Promise<boolean> {
  const response = await callRuntimeEnvironmentRpc<RuntimeStatus>(
    environmentId,
    'status.get',
    undefined,
    { timeoutMs }
  )
  if (!response.ok) {
    throw new Error(response.errorMessage)
  }
  return response.result.capabilities?.includes(capability) === true
}
