import type {
  RuntimeMobileSessionClientTab,
  RuntimeMobileSessionTabsResult,
  RuntimeMobileSessionTabsSnapshot
} from '../../shared/runtime-types'
import { dropRetirementProofsForLiveSurfaces } from './mobile-session-terminal-retirement-proof'
import type { RuntimeMobileSessionTabGroup, TabGroupLayoutNode } from '../../shared/tab-types'

/** Structural stand-in for the culled projection contract: only the group/layout seams
 *  the surviving finalization still needs. */
type FinalizationHost = {
  sanitizeGroups(
    groups: readonly RuntimeMobileSessionTabGroup[] | undefined,
    tabs: readonly RuntimeMobileSessionClientTab[]
  ): RuntimeMobileSessionTabGroup[] | undefined
  pruneGroupLayout(
    layout: TabGroupLayoutNode | null | undefined,
    validGroupIds: ReadonlySet<string>
  ): TabGroupLayoutNode | null
  collectTabIds(tabs: readonly RuntimeMobileSessionClientTab[]): ReadonlySet<string>
}

type ProjectionInput = {
  snapshot: RuntimeMobileSessionTabsSnapshot
  tabs: readonly RuntimeMobileSessionClientTab[]
}

export function finalizeRuntimeMobileSessionTabsResult(
  { snapshot, tabs }: ProjectionInput,
  host: FinalizationHost
): RuntimeMobileSessionTabsResult {
  const active =
    tabs.find((tab) => tab.isActive && tab.id === snapshot.activeTabId) ??
    tabs.find((tab) => tab.isActive) ??
    (snapshot.activeTabId ? (tabs[0] ?? null) : null)
  const normalizedTabs =
    active && !tabs.some((tab) => tab.isActive)
      ? tabs.map((tab) => (tab.id === active.id ? { ...tab, isActive: true } : tab))
      : tabs
  const tabGroups = host.sanitizeGroups(snapshot.tabGroups, normalizedTabs)
  const validGroupIds = new Set(tabGroups?.map((group) => group.id) ?? [])
  const tabGroupLayout =
    snapshot.tabGroupLayout === undefined
      ? undefined
      : host.pruneGroupLayout(snapshot.tabGroupLayout, validGroupIds)
  const activeGroupId =
    snapshot.activeGroupId && validGroupIds.has(snapshot.activeGroupId)
      ? snapshot.activeGroupId
      : (tabGroups?.find((group) =>
          active ? group.tabOrder.some((tabId) => host.collectTabIds([active]).has(tabId)) : false
        )?.id ??
        tabGroups?.[0]?.id ??
        null)
  return {
    worktree: snapshot.worktree,
    publicationEpoch: snapshot.publicationEpoch,
    snapshotVersion: snapshot.snapshotVersion,
    activeGroupId,
    activeTabId: active?.id ?? null,
    activeTabType: active?.type ?? null,
    ...(tabGroups ? { tabGroups } : {}),
    ...(snapshot.tabGroupLayout !== undefined ? { tabGroupLayout } : {}),
    ...(snapshot.retiredTerminalSurfaces
      ? {
          retiredTerminalSurfaces: dropRetirementProofsForLiveSurfaces(
            snapshot.retiredTerminalSurfaces,
            snapshot.tabs
          )
        }
      : {}),
    tabs: normalizedTabs
  }
}
