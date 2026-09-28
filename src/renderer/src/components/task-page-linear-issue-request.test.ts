import { describe, expect, it } from 'vitest'
import {
  buildLinearIssueListReadArgs,
  buildLinearIssueListRequestSignature,
  isLinearIssueSearchActive,
  shouldForceLinearIssueListRead
} from './task-page-linear-issue-request'

describe('task-page-linear-issue-request', () => {
  it('treats immediate or applied search as active', () => {
    expect(isLinearIssueSearchActive('q', '')).toBe(true)
    expect(isLinearIssueSearchActive('', 'q')).toBe(true)
    expect(isLinearIssueSearchActive('  ', '  ')).toBe(false)
  })

  it('builds list read args with filter and limit', () => {
    expect(buildLinearIssueListReadArgs({ limit: 36 })).toEqual({
      kind: 'list',
      filter: 'all',
      limit: 36
    })
    expect(buildLinearIssueListReadArgs({ limit: 36, filter: 'assigned' })).toEqual({
      kind: 'list',
      filter: 'assigned',
      limit: 36
    })
  })

  it('includes workspace, filter, and limit in the request identity', () => {
    const signature = buildLinearIssueListRequestSignature({
      workspaceId: 'ws-1',
      limit: 36
    })
    expect(signature).toBe('local::ws-1::list::all::36')
    expect(
      buildLinearIssueListRequestSignature({
        workspaceId: 'ws-1',
        limit: 36,
        searchQuery: 'bug'
      })
    ).toBe('local::ws-1::search::bug')
  })

  it('forces a read when the filter signature changes within one workspace', () => {
    expect(
      shouldForceLinearIssueListRead({
        previousFilterRead: { workspaceId: 'ws-1', signature: 'a' },
        nextFilterRead: { workspaceId: 'ws-1', signature: 'b' },
        refreshForced: false
      })
    ).toBe(true)
    expect(
      shouldForceLinearIssueListRead({
        previousFilterRead: { workspaceId: 'ws-1', signature: 'a' },
        nextFilterRead: { workspaceId: 'ws-1', signature: 'a' },
        refreshForced: false
      })
    ).toBe(false)
  })

  it('does not force the first read of a session, so a restored filter serves warm cache', () => {
    expect(
      shouldForceLinearIssueListRead({
        previousFilterRead: null,
        nextFilterRead: { workspaceId: 'ws-1', signature: 'restored' },
        refreshForced: false
      })
    ).toBe(false)
    expect(
      shouldForceLinearIssueListRead({
        previousFilterRead: null,
        nextFilterRead: { workspaceId: 'ws-1', signature: 'restored' },
        refreshForced: true
      })
    ).toBe(true)
  })

  // Why: the list cache is workspace-keyed, so B's warm entry is already correct —
  // forcing would mean a round trip behind a blocking spinner on every switch.
  it('does not force on a workspace switch, even when each workspace has its own filter', () => {
    expect(
      shouldForceLinearIssueListRead({
        previousFilterRead: { workspaceId: 'ws-1', signature: 'filter-a' },
        nextFilterRead: { workspaceId: 'ws-2', signature: 'filter-b' },
        refreshForced: false
      })
    ).toBe(false)
  })
})
