import type { PublicKnownRuntimeEnvironment } from '../../shared/runtime-environments'
import type { RuntimeStatus } from '../../shared/runtime-types'

type VerifyAndAddRuntimeEnvironmentArgs = {
  name: string
  pairingCode: string
  allowLoopback?: boolean
}

/** Local copy of the removed shared pairing-verification result contract. */
type RemotePairingFailure = {
  ok: false
  kind:
    | 'host-unreachable'
    | 'host-identity-mismatch'
    | 'access-link-invalid'
    | 'protocol-incompatible'
    | 'connection-interrupted'
    | 'environment-save-failed'
  message: string
}

export type VerifyAndAddRuntimeEnvironmentResult =
  | {
      ok: true
      environment: PublicKnownRuntimeEnvironment
      runtimeStatus: RuntimeStatus
    }
  | RemotePairingFailure

/**
 * Kept for the renderer's `runtimeEnvironments:verifyAndAddFromPairingCode`
 * contract. Verification had to reach the remote host through the pairing
 * client that was removed with the remote-runtime domain, so it now reports
 * the host as unreachable instead of verifying.
 */
export async function verifyAndAddRuntimeEnvironmentFromPairingCode(
  _userDataPath: string,
  _args: VerifyAndAddRuntimeEnvironmentArgs
): Promise<VerifyAndAddRuntimeEnvironmentResult> {
  return {
    ok: false,
    kind: 'host-unreachable',
    message: 'Cannot reach Orca at the access link. The pairing transport is unavailable.'
  }
}
