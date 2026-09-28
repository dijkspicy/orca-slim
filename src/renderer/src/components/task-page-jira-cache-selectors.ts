import type { CacheEntry } from '@/store/github/cache-model'

type JiraIssueRef = { key: string; siteId?: string }

type JiraIssueCache = Record<string, CacheEntry<JiraIssueRef>>
type JiraSearchCache = Record<string, CacheEntry<JiraIssueRef[]>>

export type TaskPageJiraIssueLookupOptions = {
  siteId?: string | null
}

export function findTaskPageJiraIssue(
  jiraIssueCache: JiraIssueCache,
  jiraSearchCache: JiraSearchCache,
  jiraIssueKey: string | null,
  options: TaskPageJiraIssueLookupOptions = {}
): JiraIssueRef | null {
  if (!jiraIssueKey) {
    return null
  }
  const matchesLookup = (issue: JiraIssueRef | null | undefined): boolean => {
    if (!issue || issue.key !== jiraIssueKey) {
      return false
    }
    // Why: Jira issue keys are only unique within a site, so drawer lookup
    // must not borrow a same-key issue cached for another site.
    return !options.siteId || issue.siteId === options.siteId
  }

  for (const entry of Object.values(jiraIssueCache)) {
    if (matchesLookup(entry?.data)) {
      return entry.data
    }
  }

  for (const entry of Object.values(jiraSearchCache)) {
    const found = entry?.data?.find((issue) => matchesLookup(issue))
    if (found) {
      return found
    }
  }

  return null
}
