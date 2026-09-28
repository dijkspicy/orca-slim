import type { CacheEntry } from '@/store/github/cache-model'
import { sortedStrings } from './task-page-work-item-signatures'

/** Structural Linear issue covering the fields the task-page surfaces read. */
export type TaskPageLinearIssue = {
  id: string
  identifier: string
  title: string
  url: string
  workspaceId?: string
  state: { name: string; type: string; color: string }
  team: { id: string; name: string; key: string }
  labels?: readonly string[]
  assignee?: { id: string; displayName: string } | null
  priority?: number | null
  updatedAt: string
}

export type TaskPageLinearCollectionResult<T> = {
  items: T[]
  errors?: { message?: string }[]
  hasMore?: boolean
}

type LinearIssueCache = Record<string, CacheEntry<TaskPageLinearIssue>>
type LinearSearchCache = Record<string, CacheEntry<TaskPageLinearIssue[]>>
type LinearListCache = Record<
  string,
  CacheEntry<TaskPageLinearCollectionResult<TaskPageLinearIssue>>
>

function linearIssueKey(issue: TaskPageLinearIssue): string {
  return issue.id
}

function linearIssueStatusSignature(issue: TaskPageLinearIssue): string {
  return JSON.stringify([
    issue.identifier,
    issue.title,
    issue.url,
    issue.state.name,
    issue.state.type,
    issue.state.color,
    issue.team.id,
    issue.team.name,
    issue.team.key,
    sortedStrings(issue.labels),
    issue.assignee?.id ?? null,
    issue.assignee?.displayName ?? null,
    issue.priority,
    issue.updatedAt
  ])
}

export function shouldReplaceTaskPageLinearIssuesAfterRefresh(
  currentIssues: readonly TaskPageLinearIssue[],
  refreshedIssues: readonly TaskPageLinearIssue[]
): boolean {
  if (currentIssues.length !== refreshedIssues.length) {
    return true
  }
  const currentKeys = new Set(currentIssues.map(linearIssueKey))
  return refreshedIssues.some((issue) => !currentKeys.has(linearIssueKey(issue)))
}

export function reconcileTaskPageLinearIssuesAfterLandingRefresh(
  currentIssues: readonly TaskPageLinearIssue[],
  refreshedIssues: readonly TaskPageLinearIssue[]
): TaskPageLinearIssue[] {
  if (shouldReplaceTaskPageLinearIssuesAfterRefresh(currentIssues, refreshedIssues)) {
    return [...refreshedIssues]
  }
  const refreshedByKey = new Map(refreshedIssues.map((issue) => [linearIssueKey(issue), issue]))
  let changed = false
  const next = currentIssues.map((issue) => {
    const refreshed = refreshedByKey.get(linearIssueKey(issue))
    if (!refreshed || linearIssueStatusSignature(issue) === linearIssueStatusSignature(refreshed)) {
      return issue
    }
    changed = true
    return refreshed
  })
  return changed ? next : (currentIssues as TaskPageLinearIssue[])
}

export function findTaskPageLinearIssue(
  linearIssueCache: LinearIssueCache,
  linearSearchCache: LinearSearchCache,
  linearListCache: LinearListCache,
  linearIssueId: string | null
): TaskPageLinearIssue | null {
  if (!linearIssueId) {
    return null
  }
  for (const entry of Object.values(linearIssueCache)) {
    if (entry?.data?.id === linearIssueId) {
      return entry.data
    }
  }
  for (const entry of Object.values(linearSearchCache)) {
    const found = entry?.data?.find((issue) => issue.id === linearIssueId)
    if (found) {
      return found
    }
  }
  for (const entry of Object.values(linearListCache)) {
    const found = entry?.data?.items.find((issue) => issue.id === linearIssueId)
    if (found) {
      return found
    }
  }
  return null
}

export const findTaskPageLinearDrawerIssue = findTaskPageLinearIssue
