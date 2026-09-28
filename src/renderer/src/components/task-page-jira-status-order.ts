type JiraIssueRef = { project: { key: string; siteId?: string }; siteId?: string }

export type TaskPageJiraProjectScope = {
  key: string
  projectKey: string
  siteId: string
}

export function getTaskPageJiraStatusOrderScopeKey(
  runtimeScopeKey: string,
  projectScope: TaskPageJiraProjectScope
): string {
  return `${encodeURIComponent(runtimeScopeKey)}:${projectScope.key}`
}

function issueProjectScope(issue: JiraIssueRef): TaskPageJiraProjectScope | null {
  const projectKey = issue.project.key.trim()
  const siteId = issue.siteId?.trim() || issue.project.siteId?.trim()
  if (!projectKey || !siteId) {
    return null
  }
  return {
    key: `${encodeURIComponent(siteId)}:${encodeURIComponent(projectKey)}`,
    projectKey,
    siteId
  }
}

export function getSingleJiraProjectScope(
  issues: readonly JiraIssueRef[]
): TaskPageJiraProjectScope | null {
  let onlyScope: TaskPageJiraProjectScope | null = null
  for (const issue of issues) {
    const scope = issueProjectScope(issue)
    if (!scope || (onlyScope && onlyScope.key !== scope.key)) {
      return null
    }
    onlyScope = scope
  }
  return onlyScope
}
