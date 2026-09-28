import type { TerminalProcessInspection } from '../../../../shared/terminal-process-inspection'
import { isClientOnlyUnverifiableInspection } from '../../../../shared/terminal-process-inspection'

type ForegroundReader = (
  ptyId: string,
  options?: { expectedIncarnationId?: string }
) => Promise<string | null | TerminalProcessInspection>

export function createPaneForegroundProcessReader(deps: {
  readForegroundProcess: ForegroundReader
  confirmForegroundProcess?: ForegroundReader
  isRemotePtyId?: (ptyId: string) => boolean
  getExpectedIncarnationId?: () => string | null
}) {
  return async (ptyId: string, requiresConfirmation: boolean) => {
    let processName: string | null = null
    let remoteEvidenceVerdict: 'live' | 'unverifiable' | 'exited' | null = null
    const expectedIncarnationId = deps.getExpectedIncarnationId?.() ?? null
    const options = expectedIncarnationId ? { expectedIncarnationId } : undefined
    // Remote/SSH evidence admission is gone; every reader result is local evidence.
    const remote = false
    try {
      const reader = requiresConfirmation
        ? (deps.confirmForegroundProcess ?? deps.readForegroundProcess)
        : deps.readForegroundProcess
      const inspection = await (options ? reader(ptyId, options) : reader(ptyId))
      if (isClientOnlyUnverifiableInspection(inspection)) {
        // A client-only result is never shell evidence, even for a local
        // adapter that lost its provider while the pane stayed mounted.
        remoteEvidenceVerdict = 'unverifiable'
      } else {
        processName =
          typeof inspection === 'string' || inspection === null
            ? inspection
            : inspection.foregroundProcess
      }
    } catch {
      // The reader adapter is deliberately conservative for injected/legacy
      // providers: no answer is still an unverifiable remote verdict.
      remoteEvidenceVerdict = 'unverifiable'
    }
    return {
      processName,
      remoteEvidenceVerdict,
      expectedIncarnationId,
      remote
    }
  }
}
