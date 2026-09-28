import type { RuntimeEnvironmentStatus } from './runtime-status'
import type { RuntimeHostStatusSnapshot } from '../../../../shared/runtime-host-status'

export async function refreshRuntimeEnvironmentStatus(
  environmentId: string,
  timeoutMs: number,
  publish: (status: RuntimeEnvironmentStatus) => void,
  // Why separate: a snapshot carries the host's own verdict, so it goes through
  // applyRuntimeHostStatusSnapshot — the single place that decides when status is nulled.
  applySnapshot: (snapshot: RuntimeHostStatusSnapshot) => void
): Promise<boolean> {
  try {
    const response = await window.api.runtimeEnvironments.getStatus({
      selector: environmentId,
      timeoutMs
    })
    if (window.api.runtimeEnvironments.getStatusSnapshots) {
      try {
        const snapshots = await window.api.runtimeEnvironments.getStatusSnapshots()
        const snapshot = snapshots.find((entry) => entry.environmentId === environmentId)
        if (snapshot) {
          applySnapshot(snapshot)
        }
      } catch (error) {
        console.error('Failed to read runtime host status snapshot:', error)
      }
      return response.ok
    }
    if (response.ok === false) {
      publish({ status: null, checkedAt: Date.now() })
      return false
    }
    publish({ status: response.result, checkedAt: Date.now() })
    return true
  } catch {
    publish({ status: null, checkedAt: Date.now() })
    return false
  }
}
