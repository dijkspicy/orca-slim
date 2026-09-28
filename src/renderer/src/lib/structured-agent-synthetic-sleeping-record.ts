import type { SleepingAgentSessionRecord } from '../../../shared/agent-session-resume'
import { parsePaneKey } from '../../../shared/stable-pane-id'

/** Old structured projections persisted their desktop id as if a terminal could resume it. */
export function isStructuredAgentSyntheticSleepingRecord(
  record: SleepingAgentSessionRecord
): boolean {
  const pane = parsePaneKey(record.paneKey)
  return (
    pane !== null &&
    record.providerSession.key === 'session_id' &&
    // Structured projections named their tab `structured-agent-session-<sessionId>`.
    `structured-agent-session-${record.providerSession.id}` === pane.tabId
  )
}
