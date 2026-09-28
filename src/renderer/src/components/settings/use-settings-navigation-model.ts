import { useCallback, useMemo } from 'react'
import { applyDocumentTheme } from '@/lib/document-theme'
import { useSettingsNavigationMetadata } from '@/hooks/useSettingsNavigationMetadata'
import type { SettingsNavInstallStatus } from '@/lib/settings-navigation-types'
import { getProjectHostSetupProjectionFromState } from '../../store/selectors'

// Skill-freshness inventory rode on the culled skill-sharing service; install
// status now reads only the local discovery state.
const skillInstallStatus = (installed: boolean, loading: boolean): SettingsNavInstallStatus =>
  loading ? 'checking' : installed ? 'installed' : 'install'
import { getSettingsSectionSearchEntries, rankSettingsSearchItems } from './settings-search'
import { deriveNeededSectionIds } from './settings-load-performance'
import { SCROLLBACK_PRESETS_ROWS } from './SettingsConstants'
import type { SettingsStoreModel } from './use-settings-store-model'
import type { SettingsInteractionController } from './use-settings-interaction-controller'

export function useSettingsNavigationModel(
  model: SettingsStoreModel,
  interactions: SettingsInteractionController
) {
  // Why: recompute scrollback mode only when the row value changes, not on every settings mutation.
  if (model.settings?.terminalScrollbackRows !== model.prevScrollbackRows) {
    model.setPrevScrollbackRows(model.settings?.terminalScrollbackRows)
    if (model.settings) {
      model.setScrollbackMode(
        SCROLLBACK_PRESETS_ROWS.includes(
          model.settings.terminalScrollbackRows as (typeof SCROLLBACK_PRESETS_ROWS)[number]
        )
          ? 'preset'
          : 'custom'
      )
    }
  }

  const applyTheme = useCallback((theme: 'system' | 'dark' | 'light') => {
    applyDocumentTheme(theme)
  }, [])

  const displayedGitUsername = model.repos[0]?.gitUsername ?? ''
  const baseNavSections = useSettingsNavigationMetadata()
  const { installed: orchestrationSkillInstalled, loading: orchestrationSkillLoading } =
    model.orchestrationSkill
  const { installed: computerUseSkillInstalled, loading: computerUseSkillLoading } =
    model.computerUseSkill
  const capabilityInstallStatusBySectionId = useMemo(() => {
    const next = new Map<string, SettingsNavInstallStatus>([
      ['orchestration', skillInstallStatus(orchestrationSkillInstalled, orchestrationSkillLoading)]
    ])
    if (model.showDesktopOnlySettings) {
      next.set(
        'computer-use',
        skillInstallStatus(computerUseSkillInstalled, computerUseSkillLoading)
      )
    }
    return next
  }, [
    computerUseSkillInstalled,
    computerUseSkillLoading,
    model.showDesktopOnlySettings,
    orchestrationSkillInstalled,
    orchestrationSkillLoading
  ])
  const navSections = useMemo(
    () =>
      baseNavSections.map((section) => {
        const installStatus = capabilityInstallStatusBySectionId.get(section.id)
        return installStatus ? { ...section, installStatus } : section
      }),
    [baseNavSections, capabilityInstallStatusBySectionId]
  )
  const navSectionById = useMemo(
    () => new Map(navSections.map((section) => [section.id, section] as const)),
    [navSections]
  )
  const getSectionSearchEntries = (sectionId: string) => {
    const section = navSectionById.get(sectionId)
    return section ? getSettingsSectionSearchEntries(section) : []
  }

  const visibleNavSections = useMemo(() => {
    const rankedSections = rankSettingsSearchItems(
      model.settingsSearchQuery,
      navSections,
      getSettingsSectionSearchEntries
    ).map(({ item }) => item)
    if (
      !interactions.hasUnsavedSourceControlAiPromptChanges ||
      rankedSections.some((section) => section.id === 'git')
    ) {
      return rankedSections
    }
    const gitSection = navSectionById.get('git')
    return gitSection ? [...rankedSections, gitSection] : rankedSections
  }, [
    interactions.hasUnsavedSourceControlAiPromptChanges,
    navSectionById,
    navSections,
    model.settingsSearchQuery
  ])
  const visibleSectionIds = useMemo(
    () => new Set(visibleNavSections.map((section) => section.id)),
    [visibleNavSections]
  )
  const projectByRepoId = useMemo(() => {
    const projection = getProjectHostSetupProjectionFromState({
      repos: model.repos,
      projects: model.projects,
      projectHostSetups: model.projectHostSetups
    })
    const projectById = new Map(projection.projects.map((project) => [project.id, project]))
    const nextProjectByRepoId = new Map<string, (typeof projection.projects)[number]>()
    for (const setup of projection.setups) {
      const project = projectById.get(setup.projectId)
      if (project && setup.repoId.trim()) {
        nextProjectByRepoId.set(setup.repoId, project)
      }
    }
    return nextProjectByRepoId
  }, [model.projectHostSetups, model.projects, model.repos])
  const neededSectionIds = useMemo(
    () =>
      deriveNeededSectionIds({
        navSectionIds: navSections.map((section) => section.id),
        mountedSectionIds: model.mountedSectionIds,
        activeSectionId: model.activeSectionId,
        pendingSectionId: interactions.pendingNavSectionRef.current,
        query: model.settingsSearchQuery,
        visibleSectionIds
      }),
    [
      model.activeSectionId,
      model.mountedSectionIds,
      interactions.pendingNavSectionRef,
      navSections,
      model.settingsSearchQuery,
      visibleSectionIds
    ]
  )

  return {
    applyTheme,
    displayedGitUsername,
    navSections,
    getSectionSearchEntries,
    visibleNavSections,
    visibleSectionIds,
    projectByRepoId,
    neededSectionIds
  }
}

export type SettingsNavigationModel = ReturnType<typeof useSettingsNavigationModel>
