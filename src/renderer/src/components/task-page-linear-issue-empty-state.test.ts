import { describe, expect, it } from 'vitest'
import {
  resolveLinearIssueEmptyKind,
  shouldOfferLinearIssueFetchMore
} from './task-page-linear-issue-empty-state'

describe('task-page-linear-issue-empty-state', () => {
  it('prefers context, then search, then client team, then unfiltered', () => {
    expect(
      resolveLinearIssueEmptyKind({
        hasContextLabel: true,
        searchActive: true,
        serverIssueCount: 0,
        filteredIssueCount: 0
      })
    ).toBe('context')

    expect(
      resolveLinearIssueEmptyKind({
        hasContextLabel: false,
        searchActive: true,
        serverIssueCount: 0,
        filteredIssueCount: 0
      })
    ).toBe('search')

    expect(
      resolveLinearIssueEmptyKind({
        hasContextLabel: false,
        searchActive: false,
        serverIssueCount: 3,
        filteredIssueCount: 0
      })
    ).toBe('client-team')

    expect(
      resolveLinearIssueEmptyKind({
        hasContextLabel: false,
        searchActive: false,
        serverIssueCount: 0,
        filteredIssueCount: 0
      })
    ).toBe('unfiltered-scope')
  })

  it('offers fetch more only for client-team thinning with server hasMore', () => {
    expect(shouldOfferLinearIssueFetchMore({ emptyKind: 'client-team', serverHasMore: true })).toBe(
      true
    )
    expect(shouldOfferLinearIssueFetchMore({ emptyKind: 'search', serverHasMore: true })).toBe(
      false
    )
  })
})
