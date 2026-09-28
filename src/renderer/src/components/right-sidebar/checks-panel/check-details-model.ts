/** Provider-neutral check row the panel renders; carries only the identity/status fields the panel reads. */
export type ChecksPanelCheck = {
  name: string
  status: string
  conclusion: string | null
  url: string | null
  checkRunId?: number
  workflowRunId?: number
  gitlabJobId?: number
}

/** Structural subset of a fetched check-run payload used by the inline details UI. */
export type ChecksPanelCheckRunDetails = {
  name: string
  status: string | null
  conclusion: string | null
  url: string | null
  startedAt: string | null
  completedAt: string | null
  title: string | null
  summary: string | null
  text: string | null
  annotations: {
    path: string | null
    startLine: number | null
    annotationLevel: string | null
    title: string | null
    message: string
    rawDetails: string | null
  }[]
  jobs: {
    name: string
    status: string | null
    conclusion: string | null
    steps: { name: string; status: string | null; conclusion: string | null }[]
    logTail: string | null
  }[]
}

export type ChecksPanelGitLabProjectRef = { host: string; path: string }

export type ChecksPanelGitHubRepositoryIdentity = { owner: string; repo: string; host?: string }

export type CheckDetailsLoadState = {
  requestId?: number
  loading: boolean
  details: ChecksPanelCheckRunDetails | null
  error: string | null
  /** Check state when the load failed or returned nothing, so a later state change can retry it. */
  errorAt?: { status: ChecksPanelCheck['status']; conclusion: ChecksPanelCheck['conclusion'] }
}

function getCheckIdentityKey(check: ChecksPanelCheck, index: number): string {
  if (check.checkRunId) {
    return `check-run:${check.checkRunId}`
  }
  if (check.workflowRunId) {
    return `workflow-run:${check.workflowRunId}`
  }
  // Why: manual/created GitLab jobs have no web_url, so they would otherwise key on
  // the list index and lose their cached log whenever the pipeline re-sorts.
  if (check.gitlabJobId) {
    return `gitlab-job:${check.gitlabJobId}`
  }
  if (check.url) {
    return `url:${check.url}`
  }
  return `fallback:${check.name}:${index}`
}

export function getCheckDetailsKey(
  contextKey: string,
  check: ChecksPanelCheck,
  index: number
): string {
  return `${contextKey}::${getCheckIdentityKey(check, index)}`
}

export function getCheckConclusion(
  check: ChecksPanelCheck
): NonNullable<ChecksPanelCheck['conclusion']> {
  return check.conclusion ?? 'pending'
}

export function isFailedCheck(check: ChecksPanelCheck): boolean {
  // Why: action_required blocks merge just like a failure, so it must count as
  // not-passing — otherwise the summary reads "all checks passing" while
  // auto-merge stays blocked.
  return ['failure', 'cancelled', 'timed_out', 'action_required'].includes(
    getCheckConclusion(check)
  )
}

export function isFailureState(state: string | null | undefined): boolean {
  return state === 'failure' || state === 'failed' || state === 'cancelled' || state === 'timed_out'
}

export function getCheckStatusLabel(check: ChecksPanelCheck): string {
  const conclusion = getCheckConclusion(check)
  if (conclusion === 'success') {
    return 'Successful'
  }
  if (conclusion === 'failure') {
    return 'Failed'
  }
  if (conclusion === 'cancelled') {
    return 'Cancelled'
  }
  if (conclusion === 'timed_out') {
    return 'Timed out'
  }
  if (conclusion === 'action_required') {
    return 'Action required'
  }
  if (conclusion === 'neutral') {
    return 'Neutral'
  }
  if (conclusion === 'skipped') {
    return 'Skipped'
  }
  if (check.status === 'queued') {
    return 'Queued'
  }
  if (check.status === 'in_progress') {
    return 'In progress'
  }
  return 'Pending'
}

export function formatCheckTimestamp(input: string | null | undefined): string | null {
  if (!input) {
    return null
  }
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function getFailedChecksForDetails(checks: ChecksPanelCheck[]): ChecksPanelCheck[] {
  return checks.filter(isFailedCheck)
}

export type CheckDetailsStickySurface = 'sidebar' | 'card'

export function getCheckDetailsStickySurfaceClass(surface: CheckDetailsStickySurface): string {
  return surface === 'card' ? 'bg-card/95' : 'bg-sidebar/95'
}
