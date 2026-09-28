import { BrowserWindow } from 'electron'
import { REMOTE_RUNTIME_SHARED_CONTROL_CAPABILITY } from '../../shared/protocol-version'
import {
  getPreferredPairingOffer,
  type KnownRuntimeEnvironment
} from '../../shared/runtime-environments'
import { recordRuntimeEnvironmentUsage } from './runtime-environment-usage-record'
import { RuntimeHostStatusOwner } from '../../shared/runtime-host-status-owner'
import {
  RUNTIME_HOST_STATUS_CHANNEL,
  type RuntimeHostStatusResponse
} from '../../shared/runtime-host-status'
import {
  applyRuntimeEnvironmentCapabilityVerdict,
  captureRuntimeEnvironmentCapabilityEvidence
} from './runtime-environment-capability-evidence'
import { isRuntimeEnvironmentManuallyDisconnected } from './runtime-environment-manual-disconnect'

export function createRuntimeEnvironmentStatusOwner(
  userDataPath: string,
  environment: KnownRuntimeEnvironment,
  transport: {
    isReady: () => boolean
    request: (signal: AbortSignal) => Promise<RuntimeHostStatusResponse>
    establish: () => void
    pause: () => void
  }
): RuntimeHostStatusOwner {
  const pairing = getPreferredPairingOffer(environment)
  let evidence = captureRuntimeEnvironmentCapabilityEvidence(environment.id, pairing)
  return new RuntimeHostStatusOwner({
    environmentId: environment.id,
    pairingRevision: environment.pairingRevision ?? environment.createdAt,
    request: (signal) => {
      evidence = captureRuntimeEnvironmentCapabilityEvidence(environment.id, pairing)
      return transport.request(signal)
    },
    verified: (response, active) => {
      const capable =
        response.result.capabilities?.includes(REMOTE_RUNTIME_SHARED_CONTROL_CAPABILITY) ?? false
      const accepted = applyRuntimeEnvironmentCapabilityVerdict({
        evidence,
        verdict: capable ? 'capable' : 'absent',
        runtimeId: response._meta.runtimeId
      })
      if (accepted && active && !isRuntimeEnvironmentManuallyDisconnected(environment.id)) {
        recordRuntimeEnvironmentUsage(userDataPath, environment.id, {
          runtimeId: response._meta.runtimeId,
          pairedDeviceId: response.result.pairedDeviceId
        })
        if (capable) {
          transport.establish()
        } else {
          transport.pause()
        }
      }
      return capable && active
    },
    publish: (snapshot) => {
      for (const window of BrowserWindow.getAllWindows()) {
        if (window.isDestroyed()) {
          continue
        }
        try {
          window.webContents.send(RUNTIME_HOST_STATUS_CHANNEL, snapshot)
        } catch {
          /* A renderer can close during publication. */
        }
      }
    }
  })
}
