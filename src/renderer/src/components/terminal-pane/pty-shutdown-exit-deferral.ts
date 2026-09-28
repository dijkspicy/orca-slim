export type PtyShutdownSettlement = 'committed' | 'rolled-back'

const deferredExitCallbacksByPtyId = new Map<
  string,
  Set<(settlement: PtyShutdownSettlement) => void>
>()
const committedExitExpiresAtByPtyId = new Map<string, number>()
const committedPendingSettlements = new Set<string>()
// Why: RPC and transport streams can reorder a committed exit; 30 seconds covers delayed delivery while 512 bounds abandoned guards.
const COMMITTED_EXIT_GRACE_MS = 30_000
const COMMITTED_EXIT_MAX = 512

function pruneCommittedExitGuards(now = Date.now()): void {
  for (const [ptyId, expiresAt] of committedExitExpiresAtByPtyId) {
    if (expiresAt <= now) {
      committedExitExpiresAtByPtyId.delete(ptyId)
    }
  }
  while (committedExitExpiresAtByPtyId.size > COMMITTED_EXIT_MAX) {
    const oldestPtyId = committedExitExpiresAtByPtyId.keys().next().value
    if (typeof oldestPtyId !== 'string') {
      break
    }
    committedExitExpiresAtByPtyId.delete(oldestPtyId)
  }
}

export function markCommittedPtyShutdowns(ptyIds: readonly string[]): void {
  const expiresAt = Date.now() + COMMITTED_EXIT_GRACE_MS
  for (const ptyId of ptyIds) {
    committedExitExpiresAtByPtyId.delete(ptyId)
    committedExitExpiresAtByPtyId.set(ptyId, expiresAt)
  }
  pruneCommittedExitGuards()
}

export function noteCommittedPtyShutdownSettlements(ptyIds: readonly string[]): void {
  for (const ptyId of ptyIds) {
    committedPendingSettlements.add(ptyId)
  }
}

export function hasCommittedPtyShutdownSettlement(ptyId: string): boolean {
  return committedPendingSettlements.has(ptyId)
}

export function clearCommittedPtyShutdownSettlements(ptyIds: readonly string[]): void {
  for (const ptyId of ptyIds) {
    committedPendingSettlements.delete(ptyId)
  }
}

export function consumeCommittedPtyShutdownExit(
  ptyId: string,
  _runtimeEnvironmentId?: string | null
): boolean {
  pruneCommittedExitGuards()
  if (!committedExitExpiresAtByPtyId.has(ptyId)) {
    return false
  }
  committedExitExpiresAtByPtyId.delete(ptyId)
  return true
}

export function deferPtyShutdownExit(
  ptyId: string,
  callback: (settlement: PtyShutdownSettlement) => void
): void {
  const callbacks = deferredExitCallbacksByPtyId.get(ptyId) ?? new Set()
  callbacks.add(callback)
  deferredExitCallbacksByPtyId.set(ptyId, callbacks)
}

export function settleDeferredPtyShutdownExits(
  ptyIds: readonly string[],
  settlement: PtyShutdownSettlement
): void {
  for (const ptyId of ptyIds) {
    const callbacks = deferredExitCallbacksByPtyId.get(ptyId)
    if (!callbacks) {
      continue
    }
    deferredExitCallbacksByPtyId.delete(ptyId)
    if (settlement === 'committed') {
      // Why: replay classifies the old exit; retaining its guard could misclassify a same-ID session woken immediately afterward.
      committedExitExpiresAtByPtyId.delete(ptyId)
    }
    for (const callback of callbacks) {
      try {
        callback(settlement)
      } catch (error) {
        // Why: settlement is already fixed; one stale pane callback cannot block sibling cleanup or alter the reported outcome.
        console.error('[terminal] deferred PTY shutdown exit cleanup failed', {
          ptyId,
          settlement,
          error
        })
      }
    }
  }
}
