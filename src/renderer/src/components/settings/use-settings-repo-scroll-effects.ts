import { useEffect } from 'react'
import type { SettingsStoreModel } from './use-settings-store-model'
import type { SettingsInteractionController } from './use-settings-interaction-controller'
import type { SettingsNavigationModel } from './use-settings-navigation-model'
import type { SettingsTerminalModel } from './use-settings-terminal-model'
import { watchForSettingsDeepLinkTarget } from './settings-deep-link-target-watcher'
import {
  cancelPendingSettingsDeepLinkTargetWatch,
  cancelPendingSettingsSubsectionScrollFrame,
  getFallbackVisibleSection,
  getSettingsScrollTarget,
  scrollSubsectionIntoView
} from './settings-navigation-foundations'

export function useSettingsRepoScrollEffects(
  model: SettingsStoreModel,
  interactions: SettingsInteractionController,
  navigation: SettingsNavigationModel,
  // Why: hooks loading moved out with the runtime-hooks domain, but callers still pass the terminal model.
  _terminal: SettingsTerminalModel
): void {
  const {
    activeSectionId,
    pendingNavRequestTick,
    setActiveSectionId,
    setPendingNavRequestTick,
    setSettingsSearchQuery,
    settingsSearchQuery
  } = model
  const {
    contentScrollRef,
    pendingNavSectionRef,
    pendingScrollTargetRef,
    pendingScrollTargetWatchRef,
    pendingSubsectionScrollFrameRef
  } = interactions
  const { visibleNavSections, visibleSectionIds } = navigation

  useEffect(() => {
    const scrollTargetId = pendingScrollTargetRef.current
    const pendingNavSectionId = pendingNavSectionRef.current
    // Why: this pass re-decides whether to wait for the target, so drop any watch armed by the previous one.
    cancelPendingSettingsDeepLinkTargetWatch(pendingScrollTargetWatchRef)

    // Why: subsection deep links clear a stale filter that could hide the target row; pane-level links keep it to force-open the matching section.
    if (
      scrollTargetId &&
      pendingNavSectionId &&
      scrollTargetId !== pendingNavSectionId &&
      settingsSearchQuery.trim() !== ''
    ) {
      setSettingsSearchQuery('')
      return
    }

    if (scrollTargetId && pendingNavSectionId && visibleSectionIds.has(pendingNavSectionId)) {
      // Why: inactive panes don't render; activate the pane first, then find the subsection next render.
      if (activeSectionId !== pendingNavSectionId) {
        setActiveSectionId(pendingNavSectionId)
        return
      }
      const container = contentScrollRef.current
      if (container) {
        container.scrollTo({ top: 0 })
      }
      // Why: deep links can target a row inside the already-visible pane.
      if (scrollTargetId !== pendingNavSectionId) {
        // Why: target can arrive before the lazy section mounts; keep pending refs until it does.
        if (!getSettingsScrollTarget(scrollTargetId, container)) {
          // Why: async panes (the server list, say) mount rows after this pass, and nothing else re-runs the effect.
          pendingScrollTargetWatchRef.current = watchForSettingsDeepLinkTarget({
            root: container,
            isTargetPresent: () =>
              getSettingsScrollTarget(scrollTargetId, contentScrollRef.current) !== null,
            onTargetPresent: () => setPendingNavRequestTick((tick) => tick + 1)
          })
          return
        }
        const scrollToSubsection = (): void => {
          scrollSubsectionIntoView(scrollTargetId, contentScrollRef.current)
        }
        scrollToSubsection()
        cancelPendingSettingsSubsectionScrollFrame(pendingSubsectionScrollFrameRef)
        let completed = false
        let frameId: number | undefined
        frameId = requestAnimationFrame(() => {
          completed = true
          if (pendingSubsectionScrollFrameRef.current === frameId) {
            pendingSubsectionScrollFrameRef.current = null
          }
          scrollToSubsection()
        })
        if (!completed) {
          pendingSubsectionScrollFrameRef.current = frameId
        }
      }
      setActiveSectionId(pendingNavSectionId)
      pendingNavSectionRef.current = null
      pendingScrollTargetRef.current = null
      return
    }

    if (!visibleSectionIds.has(activeSectionId) && visibleNavSections.length > 0) {
      setActiveSectionId(getFallbackVisibleSection(visibleNavSections)?.id ?? activeSectionId)
    }
  }, [
    activeSectionId,
    contentScrollRef,
    pendingNavRequestTick,
    pendingNavSectionRef,
    pendingScrollTargetRef,
    pendingScrollTargetWatchRef,
    pendingSubsectionScrollFrameRef,
    setActiveSectionId,
    setPendingNavRequestTick,
    setSettingsSearchQuery,
    settingsSearchQuery,
    visibleSectionIds,
    visibleNavSections
  ])
}
