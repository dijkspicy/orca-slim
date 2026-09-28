import type { WorkspaceSessionState } from './workspace-session-state-types'

type BrowserHistoryEntry = {
  url: string
  normalizedUrl: string
  title: string
  faviconUrl?: string | null
  lastVisitedAt: number
  visitCount: number
}

// Moved from browser-url (removed with the browser domain): Kagi private-session
// links carry an account bearer token — strip it before URLs reach history.
function redactKagiSessionToken(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl)
    const hostname = parsed.hostname.toLowerCase()
    if (
      parsed.protocol === 'https:' &&
      (hostname === 'kagi.com' || hostname === 'www.kagi.com') &&
      (parsed.pathname === '/search' || parsed.pathname === '/search/') &&
      parsed.searchParams.has('token')
    ) {
      parsed.searchParams.delete('token')
      return parsed.toString()
    }
  } catch {
    // Keep non-URL inputs unchanged.
  }
  return rawUrl
}

export const MAX_BROWSER_HISTORY_ENTRIES = 200

export function normalizeBrowserHistoryUrl(url: string): string {
  try {
    const parsed = new URL(redactKagiSessionToken(url))
    parsed.hostname = parsed.hostname.toLowerCase()
    parsed.protocol = parsed.protocol.toLowerCase()
    let normalized = parsed.toString()
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1)
    }
    return normalized
  } catch {
    return redactKagiSessionToken(url).toLowerCase()
  }
}

export function normalizeBrowserHistoryEntries(
  entries: readonly BrowserHistoryEntry[]
): BrowserHistoryEntry[] {
  const seen = new Set<string>()
  const normalizedEntries: BrowserHistoryEntry[] = []
  // Persisted history may be unordered; normalize only until the retained cap is filled.
  const candidates = [...entries].sort((a, b) => b.lastVisitedAt - a.lastVisitedAt)

  for (const entry of candidates) {
    const safeUrl = redactKagiSessionToken(entry.url)
    const key = normalizeBrowserHistoryUrl(safeUrl)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    normalizedEntries.push(
      entry.url === safeUrl && entry.normalizedUrl === key
        ? entry
        : { ...entry, url: safeUrl, normalizedUrl: key }
    )
    if (normalizedEntries.length >= MAX_BROWSER_HISTORY_ENTRIES) {
      break
    }
  }
  return normalizedEntries
}

export function pruneWorkspaceSessionBrowserHistory(
  session: WorkspaceSessionState
): WorkspaceSessionState {
  if (!session.browserUrlHistory) {
    return session
  }
  const browserUrlHistory = normalizeBrowserHistoryEntries(session.browserUrlHistory)
  if (
    browserUrlHistory.length === session.browserUrlHistory.length &&
    browserUrlHistory.every((entry, index) => entry === session.browserUrlHistory?.[index])
  ) {
    return session
  }
  return { ...session, browserUrlHistory }
}
