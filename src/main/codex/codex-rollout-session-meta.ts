import { open } from 'node:fs/promises'

const ROLLOUT_READ_LIMIT = 64 * 1024

/** Scan-priority vocabulary kept for call compatibility; reads are no longer
 *  scheduled through the transcript gate. */
type RolloutReadPriority = 'exact' | 'scan'

/**
 * Read the Codex session id without streaming the full rollout transcript.
 * Defaults to `exact` because the live-resume proof is interactive; the AI
 * Vault scan passes `scan` so a bulk sweep cannot starve it.
 */
export async function readCodexRolloutSessionMetaId(
  filePath: string,
  signal?: AbortSignal,
  _priority?: RolloutReadPriority
): Promise<string | null> {
  let head: Buffer
  try {
    // Bounded head read: a rollout may be megabytes and only the first record
    // carries the session id. A listed rollout may also vanish before it is
    // read — Codex prunes and rewrites these files — and one missing file must
    // not abort the scan.
    const handle = await open(filePath, 'r')
    try {
      const buffer = Buffer.alloc(ROLLOUT_READ_LIMIT)
      const { bytesRead } = await handle.read(buffer, 0, ROLLOUT_READ_LIMIT, 0)
      head = buffer.subarray(0, bytesRead)
    } finally {
      await handle.close()
    }
  } catch (error) {
    // A cancelled scan must surface as cancellation, not as one more rollout
    // that could not prove its id.
    if (signal?.aborted) {
      throw error
    }
    return null
  }
  if (signal?.aborted) {
    throw new Error('Rollout session-meta read aborted')
  }
  const firstLine = head.toString('utf8').split(/\r?\n/, 1)[0]?.trim()
  if (!firstLine) {
    return null
  }
  try {
    const record = JSON.parse(firstLine) as {
      type?: unknown
      id?: unknown
      session_id?: unknown
      thread_id?: unknown
      payload?: { id?: unknown; session_id?: unknown; thread_id?: unknown }
    }
    if (record.type !== 'session_meta') {
      return null
    }
    const id =
      record.payload?.id ??
      record.payload?.session_id ??
      record.payload?.thread_id ??
      record.id ??
      record.session_id ??
      record.thread_id
    return typeof id === 'string' && id.length > 0 ? id : null
  } catch {
    return null
  }
}
