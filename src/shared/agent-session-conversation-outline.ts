// The conversation outline: every user message a structured session's transcript
// draws, loaded by the client or not, so the message rail can map the whole
// thread instead of only the pages a client happens to hold.

import type { AgentJournalCursor } from './agent-session-journal-types'

/** Previews are cut on the host: the rail clamps to two lines, so a whole prompt
 *  would cross the wire only to be hidden. */
export const AGENT_SESSION_OUTLINE_PREVIEW_MAX_CHARS = 200

export type AgentSessionConversationOutlineEntry = {
  /** The journal item id, which is also the transcript row's message id. */
  itemId: string
  /** Creation sequence, so a client can tell which entries its loaded window already covers. */
  sequence: number
  /** Prose with whitespace collapsed, at most the preview cap. Empty when the
   *  message is images only, or when the host dropped previews to fit the reply. */
  preview: string
  imageCount: number
}

export type AgentSessionConversationOutline = {
  sessionId: string
  /** Journal position the outline is current through: every user message created
   *  at or before `cursor.sequence` is listed, unless `omittedEntries` says otherwise. */
  cursor: AgentJournalCursor
  entries: AgentSessionConversationOutlineEntry[]
  /** Oldest entries left out because the whole list could not fit one reply. */
  omittedEntries: number
}

export type NativeChatUserMessagePreview = { text: string; imageCount: number }

/** Cuts on a code-point boundary so a clipped emoji never leaves a lone surrogate. */
export function truncateOutlinePreview(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text
  }
  const last = text.charCodeAt(maxChars - 1)
  const end = last >= 0xd800 && last <= 0xdbff ? maxChars - 1 : maxChars
  return text.slice(0, end).trimEnd()
}
