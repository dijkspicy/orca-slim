import type { TaskPageLinearIssue } from './task-page-linear-cache-selectors'

/** Structural workflow state used to match issue states to team states. */
export type LinearWorkflowStateRef = {
  id: string
  name: string
  type: string
  color: string
  position: number
}

export type LinearProjectTab = 'overview' | 'issues'
export type LinearGroupSection = {
  key: string
  label: string
  issues: TaskPageLinearIssue[]
}
export type LinearIssueListRow =
  | {
      type: 'section'
      key: string
      label: string
      count: number
    }
  | {
      type: 'issue'
      issue: TaskPageLinearIssue
    }
export const LINEAR_CUSTOM_VIEW_MODELS = ['issue', 'project'] satisfies readonly (
  | 'issue'
  | 'project'
)[]
export function mergeLinearCollectionResults<T>(
  results: { items: T[]; errors?: { message?: string }[]; hasMore?: boolean }[]
): { items: T[]; errors?: { message?: string }[]; hasMore?: boolean } {
  const errors = results.flatMap((result) => result.errors ?? [])
  return {
    items: results.flatMap((result) => result.items),
    ...(errors.length > 0
      ? {
          errors
        }
      : {}),
    ...(results.some((result) => result.hasMore)
      ? {
          hasMore: true
        }
      : {})
  }
}
export function getLinearStatusSectionState(
  section: LinearGroupSection
): TaskPageLinearIssue['state'] | null {
  if (!section.key.startsWith('status:')) {
    return null
  }
  return section.issues[0]?.state ?? null
}
export function findLinearWorkflowStateForStatus(
  states: LinearWorkflowStateRef[],
  targetState: TaskPageLinearIssue['state']
): LinearWorkflowStateRef | undefined {
  return (
    states.find((state) => state.name === targetState.name && state.type === targetState.type) ??
    states.find((state) => state.name === targetState.name)
  )
}
