// ─── Native chat message block model (cross-process, JSON-serializable) ─────
// Verbatim shapes formerly supplied by `native-chat-types.ts` /
// `native-chat-tool-identity.ts` (both culled with the renderer chat mirror);
// the journal wire contract and its persisted rows are unchanged.

import type {
  AgentSessionBackgroundTask,
  AgentSessionBackgroundTaskRunState
} from './agent-session-background-task-wire'

export const NATIVE_CHAT_ROLES = ['user', 'assistant', 'tool', 'reasoning', 'system'] as const
export type NativeChatRole = (typeof NATIVE_CHAT_ROLES)[number]

export type NativeChatToolMetadata = {
  mcpIdentity?: { server: string; tool: string }
  exitCode?: number
  durationMs?: number
  webSearchResults?: { title: string; url: string }[]
}

/** Plain prose / markdown; `presentation`/`tone` are display hints readers narrow by. */
export type NativeChatTextBlock = {
  type: 'text'
  text: string
  presentation?: string
  tone?: string
  providerFrame?: {
    provider: string
    kind: string
    payload: { head: string; byteLength: number; digest: string; truncated: boolean }
  }
}

/** A tool invocation; `input` stays `unknown` because each tool's shape differs. */
export type NativeChatToolCallBlock = NativeChatToolMetadata & {
  type: 'tool-call'
  name: string
  input: unknown
  /** Provider-supplied identity; absent on legacy transcripts and peers. */
  callId?: string
  state?: 'running' | 'completed' | 'failed'
}

/** One resolved hunk from a provider's edit result, carrying true file ranges. */
export type NativeChatEditPatchHunk = {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: string[]
}

export type NativeChatEditPatch = { filePath?: string; hunks: NativeChatEditPatchHunk[] }

/** The result returned to the agent for a prior tool call. */
export type NativeChatToolResultBlock = {
  type: 'tool-result'
  output: string
  isError?: boolean
  editPatch?: NativeChatEditPatch
}

/** A reference to an image, by local path or remote URL. */
export type NativeChatImageRefBlock = {
  type: 'image-ref'
  path?: string
  url?: string
  alt?: string
}

export const NATIVE_CHAT_SUBAGENT_STATES = [
  'working',
  'idle',
  'completed',
  'failed',
  'stopped',
  'unverifiable'
] as const
export type NativeChatSubagentState = (typeof NATIVE_CHAT_SUBAGENT_STATES)[number]

/** One child agent in a spawn group; `id` is the roster key. */
export type NativeChatSubagentEntry = {
  id: string
  label: string
  state: NativeChatSubagentState
  tokens?: number
  startedAt?: number
  settledAt?: number
}

/** One spawn group's roster, revised in place as its children report activity. */
export type NativeChatSubagentGroupBlock = {
  type: 'subagent-group'
  groupId: string
  agents: NativeChatSubagentEntry[]
}

/** One provider background task beside the turn, as its own durable row. */
export type NativeChatBackgroundTaskBlock = {
  type: 'background-task'
  taskId: string
  kind: AgentSessionBackgroundTask['kind']
  label: string
  state: AgentSessionBackgroundTaskRunState
  parentToolUseId?: string
  summary?: string
  error?: string
  outputFile?: string
  tokens?: number
  startedAt?: number
  settledAt?: number
}

export type NativeChatBlock =
  | NativeChatTextBlock
  | NativeChatToolCallBlock
  | NativeChatToolResultBlock
  | NativeChatImageRefBlock
  | NativeChatSubagentGroupBlock
  | NativeChatBackgroundTaskBlock
