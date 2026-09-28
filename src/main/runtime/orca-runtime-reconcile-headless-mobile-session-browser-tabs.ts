// @ts-nocheck -- mechanically split from OrcaRuntimeService; behavior is covered by AST equivalence and characterization tests.
import { OrcaRuntimeWithHydrateHeadlessMobileSessionTabsFromWorkspaceSession } from './orca-runtime-hydrate-headless-mobile-session-tabs-from-workspace-session'
import type {
  RuntimeMobileSessionBrowserTab,
  RuntimeMobileSessionSnapshotTab,
  RuntimeMobileSessionTabsSnapshot,
  RuntimeMobileSessionTerminalTab
} from '../../shared/runtime-types'
import { headlessBrowserTabsUnchanged } from './mobile-session-browser-equality'
import { appendBrowserTabOrder } from './mobile-session-browser-group-projection'
import type { WorkspaceSessionState } from '../../shared/workspace-session-state-types'

export class OrcaRuntimeWithReconcileHeadlessMobileSessionBrowserTabs extends OrcaRuntimeWithHydrateHeadlessMobileSessionTabsFromWorkspaceSession {
  // Why: keep an existing snapshot's browser tabs in sync with the live bridge
  // without rebuilding stable terminal state. Replaces browser entries with the
  // current live set and rewrites the browser portion of the primary group order.
  protected reconcileHeadlessMobileSessionBrowserTabs(
    worktreeId: string,
    existing: RuntimeMobileSessionTabsSnapshot
  ): void {
    const existingBrowserTabs = existing.tabs.filter(
      (tab): tab is RuntimeMobileSessionBrowserTab => tab.type === 'browser'
    )
    const publishedBrowserTabs = this.buildHeadlessMobileSessionBrowserTabs(worktreeId)
    // An attached renderer owns its browser rows; the client-page registry cannot retire them.
    const rendererBrowserTabs =
      this.getAvailableAuthoritativeWindow() && !this.offscreenBrowserBackend
        ? existingBrowserTabs.filter((tab) => tab.placement?.kind !== 'client')
        : []
    // Keyed by id so no row can publish twice whatever the two sources overlap on; a freshly
    // built row wins over the retained one it replaces.
    const liveById = new Map(
      [...rendererBrowserTabs, ...publishedBrowserTabs].map((tab) => [tab.id, tab])
    )
    // Emit in the order the snapshot already had, because the equality check below compares by
    // index: rebuilding renderer-first would read a pure reordering as a change and republish.
    const retainedInOrder = existingBrowserTabs.flatMap((tab) => {
      const live = liveById.get(tab.id)
      return live && liveById.delete(tab.id) ? [live] : []
    })
    const liveBrowserTabs = [...retainedInOrder, ...liveById.values()]
    const liveIds = liveBrowserTabs.map((tab) => tab.id)
    const existingBrowserIds = existingBrowserTabs.map((tab) => tab.id)
    if (headlessBrowserTabsUnchanged(liveBrowserTabs, existingBrowserTabs)) {
      return
    }
    const nonBrowserTabs = existing.tabs.filter((tab) => tab.type !== 'browser')
    const nextTabs: RuntimeMobileSessionSnapshotTab[] = [...nonBrowserTabs, ...liveBrowserTabs]
    const liveIdSet = new Set(liveIds)
    const tabGroups = appendBrowserTabOrder(
      (existing.tabGroups ?? []).map((group) => ({
        ...group,
        // Drop closed browser ids; appendBrowserTabOrder re-adds the live ones.
        tabOrder: group.tabOrder.filter(
          (id) => liveIdSet.has(id) || !existingBrowserIds.includes(id)
        )
      })),
      liveIds
    )
    const activeStillPresent = nextTabs.some((tab) => tab.id === existing.activeTabId)
    const active = activeStillPresent
      ? null
      : (nextTabs.find((tab) => tab.isActive) ?? nextTabs[0] ?? null)
    this.storeMobileSessionSnapshot(worktreeId, {
      ...existing,
      snapshotVersion: existing.snapshotVersion + 1,
      ...(activeStillPresent
        ? {}
        : { activeTabId: active?.id ?? null, activeTabType: active?.type ?? null }),
      tabGroups,
      tabs: nextTabs
    })
  }

  protected isServeOwnedPtyId(ptyId: string | null | undefined): boolean {
    return typeof ptyId === 'string' && ptyId.startsWith('serve-')
  }

  protected isSshOwnedPtyId(ptyId: string | null | undefined): boolean {
    // The ssh-pty-id parser was culled with the SSH host; keep the id-shape check
    // for historical records (no new `ssh:` ids can be minted).
    return typeof ptyId === 'string' && ptyId.startsWith('ssh:')
  }

  protected workspaceSessionHasRuntimeOwnedPtyCandidate(session: WorkspaceSessionState): boolean {
    return Object.entries(session.tabsByWorktree ?? {}).some(([worktreeId, tabs]) =>
      this.workspaceSessionWorktreeHasRuntimeOwnedPtyCandidate(session, worktreeId, tabs)
    )
  }

  protected workspaceSessionWorktreeHasRuntimeOwnedPtyCandidate(
    session: WorkspaceSessionState,
    worktreeId: string,
    tabs: WorkspaceSessionState['tabsByWorktree'][string]
  ): boolean {
    // Why resolved lazily and reused: the per-tab question is the same lease sweep with a
    // different tabId, so asking it once per worktree answers every tab. Kept lazy so a
    // worktree whose first tab already owns a serve/SSH pty never sweeps at all.
    return tabs.some((tab) => {
      if (this.isServeOrSshOwnedPtyId(tab.ptyId)) {
        return true
      }
      const leafPtyIds = session.terminalLayoutsByTabId?.[tab.id]?.ptyIdsByLeafId
      return Boolean(
        leafPtyIds && Object.values(leafPtyIds).some((ptyId) => this.isServeOrSshOwnedPtyId(ptyId))
      )
    })
  }

  // Why: serve-* (local serve) and ssh:<conn>@@<relay> (SSH relay) ids are minted
  // ONLY for runtime-owned terminals and are preserved/re-hydrated, so tear them
  // down even if the renderer adopted a view (else they resurrect). The daemon
  // session form <worktreeId>@@<shortUuid> is deliberately NOT here: the daemon
  // mints it for ordinary renderer-owned local terminals too, so id shape can't
  // classify ownership for that form — renderer-graph membership does (below).
  protected isServeOrSshOwnedPtyId(ptyId: string | null | undefined): boolean {
    return this.isServeOwnedPtyId(ptyId) || this.isSshOwnedPtyId(ptyId)
  }

  protected hasServeOrSshOwnedBinding(tab: RuntimeMobileSessionTerminalTab): boolean {
    if (this.isServeOrSshOwnedPtyId(tab.ptyId)) {
      return true
    }
    return Object.values(tab.parentLayout?.ptyIdsByLeafId ?? {}).some((ptyId) =>
      this.isServeOrSshOwnedPtyId(ptyId)
    )
  }
}
