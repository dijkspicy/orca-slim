import type { Worktree } from '../../../shared/worktree/types'
import type { TaskPageLinearIssue } from './task-page-linear-cache-selectors'

export type LinkedLinearIssueRef = {
  identifier: string
  workspaceId: string | null
  organizationUrlKey?: string
}

type LinkedLinearWorktreeFields = Pick<Worktree, 'linkedLinearIssue'> &
  Partial<
    Pick<
      Worktree,
      'isArchived' | 'linkedLinearIssueWorkspaceId' | 'linkedLinearIssueOrganizationUrlKey'
    >
  >

// Why: Has Workspace is an Orca workspace view, not a Linear API filter.
export function collectLinkedLinearIssueRefsFromWorktrees(
  worktrees: readonly LinkedLinearWorktreeFields[],
  options?: {
    workspaceId?: string | null
    workspaces?: readonly { id: string; organizationUrlKey?: string }[]
  }
): LinkedLinearIssueRef[] {
  const selectedWorkspaceId =
    options?.workspaceId && options.workspaceId !== 'all' ? options.workspaceId : null
  const workspaceIdByOrgKey = new Map<string, string>()
  for (const workspace of options?.workspaces ?? []) {
    if (workspace.organizationUrlKey) {
      workspaceIdByOrgKey.set(workspace.organizationUrlKey.toLowerCase(), workspace.id)
    }
  }
  const byIdentifier = new Map<string, LinkedLinearIssueRef[]>()

  for (const worktree of worktrees) {
    if (worktree.isArchived) {
      continue
    }
    // Why: links can be stored in any casing; the Linear read needs the bare identifier.
    const identifier = worktree.linkedLinearIssue?.trim().toUpperCase() || null
    if (!identifier) {
      continue
    }
    const organizationUrlKey = worktree.linkedLinearIssueOrganizationUrlKey?.trim() || null
    const workspaceId =
      worktree.linkedLinearIssueWorkspaceId?.trim() ||
      (organizationUrlKey
        ? (workspaceIdByOrgKey.get(organizationUrlKey.toLowerCase()) ?? null)
        : null)
    if (selectedWorkspaceId && workspaceId && workspaceId !== selectedWorkspaceId) {
      continue
    }
    const ref: LinkedLinearIssueRef = {
      identifier,
      workspaceId,
      ...(organizationUrlKey ? { organizationUrlKey } : {})
    }
    const refScope = `${workspaceId ?? ''}::${organizationUrlKey?.toLowerCase() ?? ''}`
    const existing = byIdentifier.get(identifier)
    if (!existing) {
      byIdentifier.set(identifier, [ref])
      continue
    }
    if (
      existing.some(
        (candidate) =>
          `${candidate.workspaceId ?? ''}::${candidate.organizationUrlKey?.toLowerCase() ?? ''}` ===
          refScope
      )
    ) {
      continue
    }
    const unscopedIndex = existing.findIndex(
      (candidate) => !candidate.workspaceId && !candidate.organizationUrlKey
    )
    if ((workspaceId || organizationUrlKey) && unscopedIndex !== -1) {
      existing[unscopedIndex] = ref
    } else {
      existing.push(ref)
    }
  }

  return [...byIdentifier.values()].flat()
}

export function filterLinearIssuesForInOrcaWorkspace(
  issues: readonly TaskPageLinearIssue[],
  workspaceId: string | null | undefined
): TaskPageLinearIssue[] {
  if (!workspaceId || workspaceId === 'all') {
    return [...issues]
  }
  return issues.filter((issue) => !issue.workspaceId || issue.workspaceId === workspaceId)
}

export function filterLinearIssuesBySearchQuery(
  issues: readonly TaskPageLinearIssue[],
  query: string
): TaskPageLinearIssue[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return [...issues]
  }
  return issues.filter((issue) => {
    return (
      issue.identifier.toLowerCase().includes(trimmed) ||
      issue.title.toLowerCase().includes(trimmed) ||
      issue.team.name.toLowerCase().includes(trimmed) ||
      (issue.assignee?.displayName.toLowerCase().includes(trimmed) ?? false)
    )
  })
}

export function linkedLinearIssueRefsSignature(refs: readonly LinkedLinearIssueRef[]): string {
  return refs
    .map(
      (ref) =>
        `${ref.identifier.toUpperCase()}::${ref.workspaceId ?? ''}::${ref.organizationUrlKey?.toLowerCase() ?? ''}`
    )
    .sort()
    .join('|')
}

export async function readLinkedLinearIssuesWithLimit(
  refs: readonly LinkedLinearIssueRef[],
  read: (ref: LinkedLinearIssueRef) => Promise<TaskPageLinearIssue | null>,
  concurrency = 6
): Promise<(TaskPageLinearIssue | null)[]> {
  const results = Array.from({ length: refs.length }, (): TaskPageLinearIssue | null => null)
  let nextIndex = 0
  const workerCount = Math.min(refs.length, Math.max(1, Math.floor(concurrency)))
  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < refs.length) {
        const index = nextIndex++
        results[index] = await read(refs[index])
      }
    })
  )
  return results
}
