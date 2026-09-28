import type { WorkspaceSourceProvider } from './new-workspace/workspace-source'

// ─── Inlined link parsers ───────────────────────────────────────────────────
// Verbatim logic formerly supplied by `github/links.ts` and `linear/links.ts`
// (culled with the forge integrations); this module is the sole remaining
// consumer, so the parsers live beside the contract they serve.

type RepoSlug = { owner: string; repo: string; host?: string }

type GitHubIssueOrPRLink = {
  slug: RepoSlug
  number: number
  type: 'issue' | 'pr'
}

const GH_ITEM_PATH_RE = /^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)(?:\/.*)?$/i

function parseGitHubItemNumber(value: string): number | null {
  const parsed = Number.parseInt(value, 10)
  return parsed > 0 ? parsed : null
}

/**
 * Parses an owner/repo slug plus issue/PR number from a GitHub URL. Returns
 * null for anything that isn't a recognizable GitHub-shaped issue or pull URL.
 */
function parseGitHubIssueOrPRLink(input: string): GitHubIssueOrPRLink | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null
  }

  const match = GH_ITEM_PATH_RE.exec(url.pathname.replace(/\/+$/, ''))
  if (!match) {
    return null
  }
  const number = parseGitHubItemNumber(match[4])
  if (number === null) {
    return null
  }

  return {
    // Why: the URL proves the host — GHES links must keep their server identity
    // instead of being treated as github.com slugs.
    // Why: GHES installations on non-default ports require the full URL host;
    // `hostname` would silently redirect later API calls to port 443.
    slug: { owner: match[1], repo: match[2], host: url.host },
    type: match[3].toLowerCase() === 'pull' ? 'pr' : 'issue',
    number
  }
}

type ParsedLinearIssueInput = {
  identifier: string
  organizationUrlKey?: string
}

const LINEAR_IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9_]*-\d+$/

function parseLinearIssueInput(input: string): ParsedLinearIssueInput | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  if (LINEAR_IDENTIFIER_PATTERN.test(trimmed)) {
    return { identifier: trimmed.toUpperCase() }
  }

  try {
    const parsed = new URL(trimmed)
    // Why: hostname alone accepts file://linear.app/..., which then passes
    // validation and persists as a link. The GitHub parser already gates on
    // protocol; this keeps the two in step.
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null
    }
    if (parsed.hostname !== 'linear.app') {
      return null
    }
    const parts = parsed.pathname.split('/').filter(Boolean)
    const issueIndex = parts.indexOf('issue')
    const organizationUrlKey = parts[0]
    const rawIdentifier = issueIndex !== -1 ? parts[issueIndex + 1] : undefined
    if (!organizationUrlKey || !rawIdentifier) {
      return null
    }
    const identifier = decodeURIComponent(rawIdentifier).split(/[/?#]/)[0]
    if (!LINEAR_IDENTIFIER_PATTERN.test(identifier)) {
      return null
    }
    return {
      identifier: identifier.toUpperCase(),
      organizationUrlKey: decodeURIComponent(organizationUrlKey)
    }
  } catch {
    return null
  }
}

// Why: narrows the canonical provider union instead of minting a parallel one,
// so adding Jira here is a one-entry change rather than a new axis.
export const ISSUE_LINK_PROVIDERS = [
  'github',
  'linear'
] as const satisfies readonly WorkspaceSourceProvider[]

export type IssueLinkProvider = (typeof ISSUE_LINK_PROVIDERS)[number]

export function isIssueLinkProvider(value: unknown): value is IssueLinkProvider {
  return ISSUE_LINK_PROVIDERS.includes(value as IssueLinkProvider)
}

/** URL input only. Linear and Jira issue keys are byte-identical in shape, so a
 *  bare `STA-335` can never decide a provider — it would override the chip. */
export function getIssueLinkProviderFromUrl(input: string): IssueLinkProvider | null {
  const trimmed = input.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    return null
  }

  // Why: a URL is decisive only if it names that provider's *issue*. A GitHub
  // pull URL is a valid GitHub link but not an issue, and must not flip the
  // provider into a state where the field then refuses to save it.
  if (parseGitHubIssueOrPRLink(trimmed)?.type === 'issue') {
    return 'github'
  }
  if (parseLinearIssueInput(trimmed)) {
    return 'linear'
  }
  return null
}

export type ParsedIssueLinkInput =
  | { provider: 'github'; number: number }
  | { provider: 'linear'; identifier: string; organizationUrlKey?: string }

/**
 * Single parse shared by the dialog's save gate and its payload builder, so a
 * value that enables Save is always the value that gets written.
 */
export function parseIssueLinkInput(
  input: string,
  provider: IssueLinkProvider
): ParsedIssueLinkInput | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  if (provider === 'linear') {
    const parsed = parseLinearIssueInput(trimmed)
    return parsed ? { provider: 'linear', ...parsed } : null
  }

  const link = parseGitHubIssueOrPRLink(trimmed)
  if (link) {
    // Why: issue and PR numbers live in separate GitHub namespaces for refs; a
    // pull URL pasted here must not silently become an issue link.
    return link.type === 'issue' ? { provider: 'github', number: link.number } : null
  }

  const numeric = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed
  if (!/^\d+$/.test(numeric)) {
    return null
  }
  const parsed = Number.parseInt(numeric, 10)
  // Why: `/^\d+$/` happily accepts 400 digits, which parseInt turns into
  // Infinity — Save would enable and JSON.stringify would persist `null`.
  return Number.isSafeInteger(parsed) && parsed > 0 ? { provider: 'github', number: parsed } : null
}
