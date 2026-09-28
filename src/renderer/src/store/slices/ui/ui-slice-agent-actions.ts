import type { UISlice, UISliceGet, UISliceSet } from './ui-slice-contract'
import { deriveRunningAgentSendTargets } from '../../../lib/running-agent-targets'
import { createUiActivityActions } from './ui-slice-activity-actions'

let agentSendTargetModeInstanceCounter = 0

function createAgentSendTargetModeInstanceId(): string {
  agentSendTargetModeInstanceCounter += 1
  return `${Date.now()}:${agentSendTargetModeInstanceCounter}`
}

export function createUiAgentActions(
  set: UISliceSet,
  get: UISliceGet
): Pick<
  UISlice,
  | 'sidebarOpen'
  | 'sidebarWidth'
  | 'toggleSidebar'
  | 'setSidebarOpen'
  | 'setSidebarWidth'
  | 'agentSendPopoverTargetMode'
  | 'openAgentSendPopoverTargetMode'
  | 'closeAgentSendPopoverTargetMode'
  | 'sendPromptToSidebarAgentTarget'
  | 'diffNotesSendMenuOpenRequest'
  | 'openDiffNotesSendMenuForActiveWorktree'
  | 'consumeDiffNotesSendMenuOpenRequest'
  | 'acknowledgedAgentsByPaneKey'
  | 'acknowledgeAgents'
  | 'unacknowledgeAgents'
  | 'activityClearedAtByPaneKey'
  | 'applyActivityClearedAt'
  | 'manuallyUnreadTurnsByPaneKey'
  | 'clearManuallyUnreadTurns'
> {
  return {
    ...createUiActivityActions(set, get),
    sidebarOpen: true,
    sidebarWidth: 280,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setSidebarWidth: (width) => set({ sidebarWidth: width }),
    agentSendPopoverTargetMode: null,
    openAgentSendPopoverTargetMode: (args) => {
      const targets = deriveRunningAgentSendTargets(get(), args.worktreeId)
      const previousMode = get().agentSendPopoverTargetMode
      if (previousMode?.id === args.id && previousMode.status === 'sending') {
        return
      }
      const disabledPaneKeys: Record<string, string> = {}
      for (const target of targets) {
        if (target.status === 'disabled' && target.disabledReason) {
          disabledPaneKeys[target.paneKey] = target.disabledReason
        }
      }
      set({
        agentSendPopoverTargetMode: {
          ...args,
          instanceId: createAgentSendTargetModeInstanceId(),
          eligiblePaneKeys: targets
            .filter((target) => target.status === 'eligible')
            .map((target) => target.paneKey),
          disabledPaneKeys,
          status: 'open'
        }
      })
      if (
        targets.some((target) => target.status === 'eligible') &&
        (previousMode?.id !== args.id || previousMode.worktreeId !== args.worktreeId)
      ) {
        get().revealWorktreeInSidebar(args.worktreeId, { behavior: 'auto', highlight: true })
      }
    },
    diffNotesSendMenuOpenRequest: null,
    openDiffNotesSendMenuForActiveWorktree: () => {
      const worktreeId = get().activeWorktreeId
      if (!worktreeId) {
        return false
      }
      // Why: no unsent notes means nothing to send, so don't hijack focus or reveal the panel.
      if (
        !get()
          .getDiffComments(worktreeId)
          .some((comment) => !comment.sentAt)
      ) {
        return false
      }
      get().setRightSidebarTab('source-control')
      get().setRightSidebarOpen(true)
      const nonce = (get().diffNotesSendMenuOpenRequest?.nonce ?? 0) + 1
      set({ diffNotesSendMenuOpenRequest: { worktreeId, nonce, issuedAt: Date.now() } })
      return true
    },
    consumeDiffNotesSendMenuOpenRequest: (worktreeId) =>
      set((s) =>
        s.diffNotesSendMenuOpenRequest?.worktreeId === worktreeId
          ? { diffNotesSendMenuOpenRequest: null }
          : s
      ),
    closeAgentSendPopoverTargetMode: (id, instanceId) =>
      set((s) => {
        if (!s.agentSendPopoverTargetMode) {
          return s
        }
        if (id && s.agentSendPopoverTargetMode.id !== id) {
          return s
        }
        if (instanceId && s.agentSendPopoverTargetMode.instanceId !== instanceId) {
          return s
        }
        return { agentSendPopoverTargetMode: null }
      }),
    sendPromptToSidebarAgentTarget: async () => {
      // Prompt delivery to a running agent went through the culled runtime
      // mirror (`terminal.send`/`terminal.wait`); until the send-target UI is
      // removed with it, the action fails closed instead of half-delivering.
      return false
    }
  }
}
