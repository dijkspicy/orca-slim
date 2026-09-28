// Test fixture for a compatible runtime status response, migrated from the
// deleted renderer-mirror compat fixture so runtime-status suites keep their
// canned IPC envelopes.
import type { RuntimeRpcResponse } from '../../../../shared/runtime-rpc-envelope'
import type { RuntimeStatus } from '../../../../shared/runtime-types'
import {
  MIN_COMPATIBLE_RUNTIME_CLIENT_VERSION,
  RUNTIME_CAPABILITIES,
  RUNTIME_PROTOCOL_VERSION
} from '../../../../shared/protocol-version'

export function createCompatibleRuntimeStatusResponse(
  runtimeId = 'remote-runtime'
): RuntimeRpcResponse<RuntimeStatus> {
  return {
    id: 'status',
    ok: true,
    result: {
      runtimeId,
      rendererGraphEpoch: 0,
      graphStatus: 'ready',
      authoritativeWindowId: null,
      liveTabCount: 0,
      liveLeafCount: 0,
      runtimeProtocolVersion: RUNTIME_PROTOCOL_VERSION,
      minCompatibleRuntimeClientVersion: MIN_COMPATIBLE_RUNTIME_CLIENT_VERSION,
      capabilities: [...RUNTIME_CAPABILITIES]
    },
    _meta: { runtimeId }
  }
}
