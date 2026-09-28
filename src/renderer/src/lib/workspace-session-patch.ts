import type {
  WorkspaceSessionPatch,
  WorkspaceSessionState
} from '../../../shared/workspace-session-state-types'
import { pruneLocalTerminalScrollbackBuffers } from '../../../shared/workspace-session-terminal-buffers'
import { normalizeBrowserHistoryEntries } from '../../../shared/workspace-session-browser-history'
import { normalizeWorkspaceDocHistoryEntries } from '../../../shared/workspace-doc-history'
import {
  buildEditorSessionData,
  buildSanitizedTabsByWorktree,
  buildTerminalSessionData,
  type WorkspaceSessionSnapshot
} from './workspace-session'
import { withoutStagedBrowserTabs } from './workspace-session-staged-browser-tabs'
import { buildPersistedUnifiedTabSessionData } from './workspace-session-unified-tabs'
import { buildLastVisitedAtByWorktreeId } from './workspace-session-focus-recency'
import { buildSleepingAgentSessionData } from './workspace-session-sleeping-agents'
import { buildPersistedClosedTerminalTabTombstones } from './workspace-session-closed-tab-tombstones'

type SessionRelevantField = keyof WorkspaceSessionSnapshot

function hasAnyChangedField(
  changedFields: ReadonlySet<SessionRelevantField>,
  fields: readonly SessionRelevantField[]
): boolean {
  return fields.some((field) => changedFields.has(field))
}

function buildPrunedTerminalScrollback(
  snapshot: WorkspaceSessionSnapshot
): Pick<WorkspaceSessionState, 'terminalLayoutsByTabId' | 'localOnlyScrollbackByTabId'> {
  const pruned = pruneLocalTerminalScrollbackBuffers(
    {
      activeRepoId: snapshot.activeRepoId,
      activeWorktreeId: snapshot.activeWorktreeId,
      activeTabId: snapshot.activeTabId,
      tabsByWorktree: snapshot.tabsByWorktree,
      terminalLayoutsByTabId: snapshot.terminalLayoutsByTabId,
      localOnlyScrollbackByTabId: snapshot.localOnlyScrollbackByTabId
    },
    snapshot.repos
  )
  return {
    terminalLayoutsByTabId: pruned.terminalLayoutsByTabId,
    // Why `{}` and not undefined: a patch assigns the key, so an emptied map must be written as empty.
    localOnlyScrollbackByTabId: pruned.localOnlyScrollbackByTabId ?? {}
  }
}

export function buildWorkspaceSessionPatch(
  fullSnapshot: WorkspaceSessionSnapshot,
  changedFields: Iterable<SessionRelevantField>
): WorkspaceSessionPatch {
  const snapshot = withoutStagedBrowserTabs(fullSnapshot)
  const changed = new Set(changedFields)
  const patch: WorkspaceSessionPatch = {}

  if (changed.has('activeRepoId')) {
    patch.activeRepoId = snapshot.activeRepoId
  }
  if (changed.has('activeWorktreeId')) {
    patch.activeWorktreeId = snapshot.activeWorktreeId
  }
  if (changed.has('activeTabId')) {
    patch.activeTabId = snapshot.activeTabId
  }
  if (changed.has('tabsByWorktree')) {
    patch.tabsByWorktree = buildSanitizedTabsByWorktree(snapshot.tabsByWorktree)
  }
  const scrollbackHomesChanged = hasAnyChangedField(changed, [
    'terminalLayoutsByTabId',
    'localOnlyScrollbackByTabId',
    'tabsByWorktree',
    'repos'
  ] as const)
  if (scrollbackHomesChanged) {
    const pruned = buildPrunedTerminalScrollback(snapshot)
    if (
      hasAnyChangedField(changed, ['terminalLayoutsByTabId', 'tabsByWorktree', 'repos'] as const)
    ) {
      patch.terminalLayoutsByTabId = pruned.terminalLayoutsByTabId
    }
    if (
      hasAnyChangedField(changed, [
        'localOnlyScrollbackByTabId',
        'tabsByWorktree',
        'repos'
      ] as const)
    ) {
      patch.localOnlyScrollbackByTabId = pruned.localOnlyScrollbackByTabId
    }
  }
  if (changed.has('activeTabIdByWorktree')) {
    patch.activeTabIdByWorktree = snapshot.activeTabIdByWorktree
  }
  if (
    hasAnyChangedField(changed, [
      'tabsByWorktree',
      'ptyIdsByTabId',
      'lastKnownRelayPtyIdByTabId',
      'pendingReconnectPtyIdByTabId',
      'deferredSshSessionIdsByTabId',
      'repos',
      'worktreesByRepo'
    ] as const)
  ) {
    const terminalSessionData = buildTerminalSessionData(snapshot)
    Object.assign(patch, terminalSessionData)
  }
  if (
    hasAnyChangedField(changed, [
      'openFiles',
      'editorDrafts',
      'markdownFrontmatterVisible',
      'activeFileIdByWorktree',
      'activeTabTypeByWorktree'
    ] as const)
  ) {
    Object.assign(
      patch,
      buildEditorSessionData(
        snapshot.openFiles,
        snapshot.editorDrafts,
        snapshot.markdownFrontmatterVisible,
        snapshot.activeFileIdByWorktree,
        snapshot.activeTabTypeByWorktree
      )
    )
  }
  // Why: withoutStagedBrowserTabs hides rows based on the handle map, so clearing a staged flag
  // changes which browser and tab rows persist even when the rows themselves are untouched.
  const stagedVisibilityChanged = changed.has('remoteBrowserPageHandlesByPageId')
  if (stagedVisibilityChanged || changed.has('activeBrowserTabIdByWorktree')) {
    patch.activeBrowserTabIdByWorktree = snapshot.activeBrowserTabIdByWorktree
  }
  if (changed.has('browserUrlHistory')) {
    patch.browserUrlHistory = normalizeBrowserHistoryEntries(snapshot.browserUrlHistory)
  }
  if (changed.has('workspaceDocHistory')) {
    patch.workspaceDocHistory = normalizeWorkspaceDocHistoryEntries(snapshot.workspaceDocHistory)
  }
  if (changed.has('clientHostedBrowserCloseIntentsByEnvironment')) {
    patch.clientHostedBrowserCloseIntentsByEnvironment =
      snapshot.clientHostedBrowserCloseIntentsByEnvironment
  }
  if (
    stagedVisibilityChanged ||
    hasAnyChangedField(changed, [
      'activeGroupIdByWorktree',
      'groupsByWorktree',
      'layoutByWorktree',
      'unifiedTabsByWorktree'
    ] as const)
  ) {
    Object.assign(patch, buildPersistedUnifiedTabSessionData(snapshot))
  }
  if (changed.has('lastVisitedAtByWorktreeId')) {
    patch.lastVisitedAtByWorktreeId = buildLastVisitedAtByWorktreeId(snapshot)
  }
  if (changed.has('defaultTerminalTabsAppliedByWorktreeId')) {
    patch.defaultTerminalTabsAppliedByWorktreeId =
      snapshot.defaultTerminalTabsAppliedByWorktreeId &&
      Object.keys(snapshot.defaultTerminalTabsAppliedByWorktreeId).length > 0
        ? snapshot.defaultTerminalTabsAppliedByWorktreeId
        : undefined
  }
  if (changed.has('closedTerminalTabTombstonesByTabId')) {
    patch.closedTerminalTabTombstonesByTabId = buildPersistedClosedTerminalTabTombstones(
      snapshot.closedTerminalTabTombstonesByTabId
    )
  }
  if (changed.has('sleepingAgentSessionsByPaneKey')) {
    patch.sleepingAgentSessionsByPaneKey =
      buildSleepingAgentSessionData(snapshot).sleepingAgentSessionsByPaneKey
  }

  return patch
}
