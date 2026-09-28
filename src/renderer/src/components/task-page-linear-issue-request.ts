import type { LinearIssueListReadArgs } from '../store/slices/linear'

export function isLinearIssueSearchActive(immediateQuery: string, appliedQuery: string): boolean {
  return immediateQuery.trim().length > 0 || appliedQuery.trim().length > 0
}

export function buildLinearIssueListReadArgs(options: {
  filter?: 'assigned' | 'created' | 'all' | 'completed'
  limit: number
}): LinearIssueListReadArgs {
  return {
    kind: 'list',
    filter: options.filter ?? 'all',
    limit: options.limit
  }
}

export function buildLinearIssueListRequestSignature(options: {
  workspaceId: string | null | undefined
  filter?: 'assigned' | 'created' | 'all' | 'completed'
  limit: number
  searchQuery?: string
}): string {
  const workspace = options.workspaceId ?? 'default'
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    return `local::${workspace}::search::${options.searchQuery.trim()}`
  }
  return `local::${workspace}::list::${options.filter ?? 'all'}::${options.limit}`
}

export type LinearIssueListFilterRead = { workspaceId: string | null; signature: string }

export function shouldForceLinearIssueListRead(options: {
  previousFilterRead: LinearIssueListFilterRead | null
  nextFilterRead: LinearIssueListFilterRead
  refreshForced: boolean
}): boolean {
  if (options.refreshForced) {
    return true
  }
  if (options.previousFilterRead === null) {
    return false
  }
  if (options.previousFilterRead.workspaceId !== options.nextFilterRead.workspaceId) {
    return false
  }
  return options.previousFilterRead.signature !== options.nextFilterRead.signature
}
