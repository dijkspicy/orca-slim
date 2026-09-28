import { SESSION_TAB_CLOSE_INTENT_RUNTIME_CAPABILITY } from '../../../../shared/protocol-version'
import { defineMethod } from '../core'
import { CloseLifecycleTab, CloseTab } from './session-tabs-schemas'
import { assertProjectedSessionTabVisible } from './session-tab-browser-placement-projection'
import { assertAgentSessionTabDestructiveMutationSupported } from './session-tab-agent-status-projection'
import { projectSessionTabsForClient } from './session-tabs-inventory'
import { isStructuredNativeChatEnabled } from './structured-agent-session-policy'

export const SESSION_TAB_CLOSE_METHODS = [
  defineMethod({
    name: 'session.tabs.close',
    params: CloseTab,
    handler: async (params, context) => {
      if (context.clientKind) {
        const raw = await context.runtime.listMobileSessionTabs(
          params.worktree,
          context.pairedDeviceId
        )
        const visible = projectSessionTabsForClient(
          raw,
          context.clientKind,
          context.clientCapabilities,
          isStructuredNativeChatEnabled(context.runtime)
        )
        assertProjectedSessionTabVisible(visible, params.tabId)
        assertAgentSessionTabDestructiveMutationSupported(
          raw,
          params.tabId,
          context.clientKind,
          context.clientCapabilities
        )
      }
      const requiresIntent =
        context.clientKind === undefined ||
        (context.clientKind === 'runtime' &&
          context.clientCapabilities?.includes(SESSION_TAB_CLOSE_INTENT_RUNTIME_CAPABILITY) ===
            true)
      // Why: old runtime clicks and cleanup are wire-identical, so changing their behavior would regress mixed-version pairings.
      if (!params.reason && requiresIntent) {
        return context.runtime.refuseUnattributedMobileSessionTabClose(
          params.worktree,
          params.tabId
        )
      }
      return context.runtime.closeMobileSessionTab(params.worktree, params.tabId, {
        reason: 'user',
        ...(context.pairedDeviceId ? { clientNavigationId: context.pairedDeviceId } : {})
      })
    }
  }),
  defineMethod({
    name: 'session.tabs.closeLifecycle',
    params: CloseLifecycleTab,
    handler: async (params, context) => {
      if (context.clientKind) {
        const raw = await context.runtime.listMobileSessionTabs(
          params.worktree,
          context.pairedDeviceId
        )
        const visible = projectSessionTabsForClient(
          raw,
          context.clientKind,
          context.clientCapabilities,
          isStructuredNativeChatEnabled(context.runtime)
        )
        assertProjectedSessionTabVisible(visible, params.tabId)
        assertAgentSessionTabDestructiveMutationSupported(
          raw,
          params.tabId,
          context.clientKind,
          context.clientCapabilities
        )
      }
      return context.runtime.closeMobileSessionTab(params.worktree, params.tabId, {
        reason: params.reason,
        expectedPublicationEpoch: params.publicationEpoch,
        expectedTerminalHandle: params.terminal,
        ...(context.pairedDeviceId ? { clientNavigationId: context.pairedDeviceId } : {})
      })
    }
  })
]
