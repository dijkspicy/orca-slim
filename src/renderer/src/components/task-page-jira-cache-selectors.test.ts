import { describe, expect, it } from 'vitest'
import { findTaskPageJiraIssue } from './task-page-jira-cache-selectors'

function issue(key: string, title: string, siteId = 'site-1') {
  return {
    id: `${siteId}:${key}`,
    key,
    title,
    url: `https://example.atlassian.net/browse/${key}`,
    siteId,
    siteName: 'Example Jira',
    project: { id: '10000', key: 'ALP', name: 'Alpha', siteId },
    issueType: { id: '10001', name: 'Bug' },
    status: { id: '1', name: 'Todo', categoryKey: 'new', categoryName: 'To Do' },
    labels: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
}

describe('findTaskPageJiraIssue', () => {
  it('finds an issue cached under an issue-key entry', () => {
    const found = findTaskPageJiraIssue(
      {
        'scope::site-1::ALP-1': {
          data: issue('ALP-1', 'Cached issue'),
          fetchedAt: Date.now()
        }
      },
      {},
      'ALP-1'
    )

    expect(found?.title).toBe('Cached issue')
  })

  it('filters same-key Jira issues by site id', () => {
    const found = findTaskPageJiraIssue(
      {},
      {
        'scope::site-1::list::assigned::30': {
          data: [issue('ALP-1', 'Site one issue', 'site-1')],
          fetchedAt: Date.now()
        },
        'scope::site-2::list::assigned::30': {
          data: [issue('ALP-1', 'Site two issue', 'site-2')],
          fetchedAt: Date.now()
        }
      },
      'ALP-1',
      { siteId: 'site-2' }
    )

    expect(found?.title).toBe('Site two issue')
  })
})
