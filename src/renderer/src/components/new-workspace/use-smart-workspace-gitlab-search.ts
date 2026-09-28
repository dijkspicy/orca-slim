import { useEffect } from 'react'
import type { useSmartWorkspaceNameFieldFoundation } from './use-smart-workspace-name-field-foundation'

type Foundation = ReturnType<typeof useSmartWorkspaceNameFieldFoundation>

export function useSmartWorkspaceGitlabSearch({
  foundation,
  sourceQueryWithinLimit,
  shouldQueryGitlab
}: {
  foundation: Foundation
  sourceQueryWithinLimit: boolean
  shouldQueryGitlab: boolean
}): void {
  const { setGitlabItems, setGitlabLoading } = foundation
  // Why: GitLab work-item lookups were culled with the forge domain; GitLab search stays empty.
  useEffect(() => {
    if (!shouldQueryGitlab || !sourceQueryWithinLimit) {
      return
    }
    setGitlabItems([])
    setGitlabLoading(false)
  }, [setGitlabItems, setGitlabLoading, shouldQueryGitlab, sourceQueryWithinLimit])
}
