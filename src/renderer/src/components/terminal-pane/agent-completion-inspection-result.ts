import type { RecognizedAgentProcess } from '../../../../shared/agent-process-recognition'
import { recognizeAgentProcess } from '../../../../shared/agent-process-recognition'
import { isClientOnlyUnverifiableInspection } from '../../../../shared/terminal-process-inspection'
import type { TerminalProcessInspection } from '../../../../shared/terminal-process-inspection'
import type { AgentCompletionCoordinatorOptions } from './agent-completion-coordinator-types'
import type {
  AgentCompletionIdentityScope,
  LastCompletionIdentity
} from './agent-completion-identity-store'
import type { ProcessMonitorState } from './agent-completion-process-types'
import { POLL_TIER_INTERVAL_MS } from './agent-completion-poll-cadence'

export type RemoteInspectionState = {
  authorityGeneration: string | null
  observationEpoch: number
  bindingKey: string | null
  knownAuthorityGenerations: Set<string>
}

type CompletionDispatch = (
  source: 'hook' | 'title' | 'process-exit',
  title: string,
  options?: { terminalIdleConfirmed?: boolean; completionIdentity?: LastCompletionIdentity | null }
) => boolean

// Two foreground misses can span one process handoff; only sustained absence confirms exit.
const LOCAL_PROCESS_EXIT_SETTLE_MS = POLL_TIER_INTERVAL_MS.active * 2

export function handleAgentCompletionInspectionResult(args: {
  result: TerminalProcessInspection
  requestStartedAtMonotonic: number
  options: AgentCompletionCoordinatorOptions
  state: ProcessMonitorState
  identityScope: AgentCompletionIdentityScope
  clearAgentRunEvidence: () => void
  hasPendingHookDone: () => boolean
  scheduleNextPoll: () => void
  handleRecognizedProcess: (process: RecognizedAgentProcess) => void
  dispatchCompletion: CompletionDispatch
  remoteInspection: RemoteInspectionState
}): boolean {
  const {
    result,
    requestStartedAtMonotonic: _requestStartedAtMonotonic,
    options,
    state,
    identityScope,
    clearAgentRunEvidence,
    hasPendingHookDone,
    scheduleNextPoll,
    handleRecognizedProcess,
    dispatchCompletion
  } = args
  // Remote/SSH hosts are gone, so every inspection result is local evidence.
  if (
    isClientOnlyUnverifiableInspection(result) ||
    result.childProcessEvidence === 'unverifiable'
  ) {
    state.pendingProcessExit = null
    state.consecutiveInspectionErrors += 1
    scheduleNextPoll()
    return false
  }
  state.consecutiveInspectionErrors = 0
  const recognized = recognizeAgentProcess(result.foregroundProcess)
  if (recognized) {
    handleRecognizedProcess(recognized)
    return true
  }
  if (hasPendingHookDone()) {
    scheduleNextPoll()
    return false
  }
  if (state.lastForegroundAgent && state.hasAgentRunEvidence) {
    if (result.hasChildProcesses) {
      state.pendingProcessExit = null
      scheduleNextPoll()
      return false
    }
    const pending = state.pendingProcessExit
    if (
      !pending ||
      pending.process.agent !== state.lastForegroundAgent.agent ||
      pending.process.processName !== state.lastForegroundAgent.processName
    ) {
      state.pendingProcessExit = {
        process: state.lastForegroundAgent,
        firstObservedAtMonotonic: performance.now()
      }
      scheduleNextPoll()
      return false
    }
    if (performance.now() - pending.firstObservedAtMonotonic <= LOCAL_PROCESS_EXIT_SETTLE_MS) {
      scheduleNextPoll()
      return false
    }
    const exited = state.lastForegroundAgent
    state.pendingProcessExit = null
    if (options.shouldSuppressConfirmedProcessExitCompletion?.(exited) !== true) {
      const replayIdentityBeforeExit = identityScope.getLast()
      const committed = dispatchCompletion('process-exit', exited.processName, {
        terminalIdleConfirmed: true,
        completionIdentity: {
          source: 'process-exit',
          identity: `${exited.agent}:${exited.processName}`,
          agentIdentity: exited.agent
        }
      })
      if (
        !committed &&
        !identityScope.hasUnconsumedStampedTail() &&
        replayIdentityBeforeExit?.source === 'hook' &&
        replayIdentityBeforeExit.agentIdentity === exited.agent
      ) {
        identityScope.deleteLast()
      }
    }
    state.lastForegroundAgent = null
    clearAgentRunEvidence()
  } else {
    state.lastForegroundAgent = null
    clearAgentRunEvidence()
  }
  return false
}
