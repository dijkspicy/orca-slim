import { getWorkspaceSourceProvider } from './new-workspace/workspace-source'
import type { TaskProvider } from './task-providers'
import type { TaskProviderIdentity } from './task-provider-identity'
import type { WorkspaceLinkedItem } from './worktree/types'

// Moved from jira-issue-url (removed with the forge domain).
type ParsedJiraIssueUrl = {
  issueKey: string
  origin: string
  sitePath: string
}

const JIRA_ISSUE_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_]*-\d+$/

function normalizeSitePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/g, '')
  return trimmed === '/' ? '' : trimmed
}

function parseJiraIssueUrl(value: string): ParsedJiraIssueUrl | null {
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    return null
  }
  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    url.username.length > 0 ||
    url.password.length > 0
  ) {
    return null
  }
  const match = url.pathname.match(/^(.*)\/browse\/([^/]+)$/)
  if (!match || !JIRA_ISSUE_KEY_PATTERN.test(match[2])) {
    return null
  }
  return {
    issueKey: match[2].toUpperCase(),
    origin: url.origin.toLowerCase(),
    sitePath: normalizeSitePath(match[1])
  }
}

// Structural subset of the removed task-source-context contract that matching needs.
type LinkedItemSourceContext = {
  provider: TaskProvider
  providerIdentity?: TaskProviderIdentity | null
}

function resolveLinkedItemProvider(
  item: Pick<WorkspaceLinkedItem, 'type' | 'number' | 'url'> & Partial<WorkspaceLinkedItem>
): WorkspaceLinkedItem['provider'] {
  if (item.provider) {
    return item.provider
  }
  // Why: TaskPage seeds can omit title; provider inference only needs type/url/identifiers.
  return getWorkspaceSourceProvider({
    type: item.type,
    number: item.number,
    url: item.url,
    title: item.title ?? '',
    ...(item.linearIdentifier ? { linearIdentifier: item.linearIdentifier } : {}),
    ...(item.jiraIdentifier ? { jiraIdentifier: item.jiraIdentifier } : {}),
    ...(item.repoId ? { repoId: item.repoId } : {})
  })
}

export function isWorkspaceLinkedItemSourceContextMatch(
  item:
    | (Pick<WorkspaceLinkedItem, 'type' | 'number' | 'url'> & Partial<WorkspaceLinkedItem>)
    | null
    | undefined,
  context: LinkedItemSourceContext | null | undefined
): boolean {
  if (!item || !context) {
    return false
  }
  // Why: TaskPage still seeds some GH/GL items without provider; use the same inference as write paths.
  const itemProvider = resolveLinkedItemProvider(item)
  if (itemProvider !== context.provider) {
    return false
  }
  if (itemProvider !== 'jira') {
    return true
  }
  const identity = context.providerIdentity
  const itemUrl = parseJiraIssueUrl(item.url)
  if (
    item.type !== 'issue' ||
    item.number !== 0 ||
    identity?.provider !== 'jira' ||
    !identity.siteId ||
    !identity.siteUrl ||
    !identity.projectKey ||
    !item.jiraIdentifier ||
    !itemUrl
  ) {
    return false
  }
  const siteUrl = parseJiraIssueUrl(
    `${identity.siteUrl.replace(/\/+$/g, '')}/browse/${itemUrl.issueKey}`
  )
  const projectKey = itemUrl.issueKey.slice(0, itemUrl.issueKey.lastIndexOf('-'))
  return (
    item.jiraIdentifier.toUpperCase() === itemUrl.issueKey &&
    identity.projectKey.toUpperCase() === projectKey &&
    siteUrl !== null &&
    itemUrl.origin === siteUrl.origin &&
    itemUrl.sitePath === siteUrl.sitePath
  )
}
