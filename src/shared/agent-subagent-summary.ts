// One spawn group's roster → the numbers a single flat row needs.
//
// Producer-side summary rules extracted keep-side from the culled
// native-chat-subagent-summary: the terminal/latch predicates and the
// write-time-frozen fallback sentence. The renderer-side block filters lived
// with the deleted chat mirror and were not carried over.

import type { NativeChatSubagentEntry, NativeChatSubagentState } from './native-chat-blocks'

/** Every state a child cannot leave. `working` is the only in-flight state:
 *  providers report several (started/interacted, pending/running/paused) and the
 *  producer collapses them before the roster is written. */
const TERMINAL_SUBAGENT_STATES: ReadonlySet<string> = new Set([
  'idle',
  'completed',
  'failed',
  'stopped',
  'unverifiable'
])

/** Settled-state precedence for the group's one-line verdict: the worst
 *  outcome wins, and `completed` only shows when nothing else is left. */
const SETTLED_PRECEDENCE = ['failed', 'stopped', 'unverifiable', 'idle', 'completed'] as const

/** Outcomes that must be visible immediately, not held back until the last
 *  sibling stops working: a fan-out with a dead child is not a neutral row. */
const ADVERSE_PRECEDENCE = ['failed', 'stopped', 'unverifiable'] as const

/** A state this build does not know reads as `unverifiable`, never as working:
 *  a roster written by a newer build must not leave the row spinning forever. */
export function normalizeSubagentState(state: string): NativeChatSubagentState {
  if (state === 'working') {
    return 'working'
  }
  return TERMINAL_SUBAGENT_STATES.has(state) ? (state as NativeChatSubagentState) : 'unverifiable'
}

export function isTerminalSubagentState(state: string): boolean {
  return normalizeSubagentState(state) !== 'working'
}

/** The child's own verdict about itself. `unverifiable` is deliberately absent:
 *  it records that we stopped being able to see the child, not what it did, so
 *  a later authoritative report must still be able to correct it. */
const LATCHED_SUBAGENT_STATES: ReadonlySet<string> = new Set([
  'idle',
  'completed',
  'failed',
  'stopped'
])

/** Whether `next` may replace `current`.
 *
 *  A child that reported its own outcome keeps it. A child we merely lost sight
 *  of may still settle: the session sweep marks live children `unverifiable`,
 *  and contact can return before the row is read — latching the sweep would
 *  report a child that finished as one we never saw finish.
 *  The reverse is refused: nothing returns to `working` once we have given up on
 *  it, so a straggler progress tick cannot re-light a settled row. */
export function canReplaceSubagentState(current: string, next: string): boolean {
  const from = normalizeSubagentState(current)
  if (from === 'working') {
    return true
  }
  if (LATCHED_SUBAGENT_STATES.has(from)) {
    return false
  }
  // `from` is `unverifiable`: only a real verdict may land.
  return LATCHED_SUBAGENT_STATES.has(normalizeSubagentState(next))
}

type NativeChatSubagentSummary = {
  total: number
  working: number
  /** The group's verdict once nothing is in flight; null while any child works. */
  settledState: NativeChatSubagentState | null
  /** How many children hold `settledState`. */
  settledCount: number
  /** Worst adverse outcome already recorded, reported even while siblings still
   *  work. Null when nothing has gone wrong. */
  adverseState: NativeChatSubagentState | null
  /** How many children hold `adverseState`. */
  adverseCount: number
}

function summarizeSubagentGroup(
  agents: readonly NativeChatSubagentEntry[]
): NativeChatSubagentSummary {
  const counts = new Map<NativeChatSubagentState, number>()
  let working = 0
  for (const agent of agents) {
    const state = normalizeSubagentState(agent.state)
    if (state === 'working') {
      working += 1
    } else {
      counts.set(state, (counts.get(state) ?? 0) + 1)
    }
  }
  const settledState =
    working > 0 ? null : (SETTLED_PRECEDENCE.find((state) => counts.has(state)) ?? null)
  const adverseState = ADVERSE_PRECEDENCE.find((state) => counts.has(state)) ?? null
  return {
    total: agents.length,
    working,
    settledState,
    settledCount: settledState === null ? 0 : (counts.get(settledState) ?? 0),
    adverseState,
    adverseCount: adverseState === null ? 0 : (counts.get(adverseState) ?? 0)
  }
}

/** Plain-text stand-in for the roster, frozen into the journal at write time for
 *  clients without the block type.
 *
 *  It states only what stays true once the writing process is gone: the group was
 *  spawned, and whatever outcome had already latched. It deliberately carries NO
 *  live count. The row is durable and replayed on every reconnect, and the
 *  clients that read this sentence instead of the block reconcile nothing and
 *  cannot re-check the children — so a frozen `N working` would go on asserting
 *  a liveness only the dead process could have observed. Liveness stays with the
 *  structured block, which the writing host revises in place for as long as it
 *  can see the children.
 *
 *  `Kicked off` vs `Ran` is kept, and is not a liveness claim: it reports
 *  whether an outcome had been recorded when the row was written. Saying `Ran`
 *  while children were in flight would assert they exited, which is the same
 *  error in the other direction.
 *
 *  The adverse count stays: a reader that only ever sees this sentence must not
 *  be told a failing fan-out is fine. */
export function subagentGroupFallbackText(agents: readonly NativeChatSubagentEntry[]): string {
  const { total, working, adverseState, adverseCount } = summarizeSubagentGroup(agents)
  const noun = total === 1 ? 'subagent' : 'subagents'
  const adverse = adverseState === null ? '' : ` (${adverseCount} ${adverseState})`
  return `${working > 0 ? 'Kicked off' : 'Ran'} ${total} ${noun}${adverse}`
}
