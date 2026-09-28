import type { RuntimeRpcResponse } from '../../shared/runtime-rpc-envelope'

/**
 * The Tailscale hint formatter lived in the removed remote-runtime domain, so
 * responses now pass through unchanged.
 */
export function withTailscaleHintForResponse<TResult>(
  response: RuntimeRpcResponse<TResult>,
  _endpoint: string
): RuntimeRpcResponse<TResult> {
  return response
}
