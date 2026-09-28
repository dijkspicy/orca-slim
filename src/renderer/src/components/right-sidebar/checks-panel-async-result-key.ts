// Structural stand-in for the deleted shared/github identity types: callers only
// ever pass the owner/repo(/host) triple, and the key format must stay stable.
type PrRepoIdentity = {
  owner: string
  repo: string
  host?: string
}

function normalizedPRRepoIdentity(prRepo?: PrRepoIdentity | null): string {
  if (!prRepo) {
    return 'none'
  }
  const slug = `${prRepo.owner.toLowerCase()}/${prRepo.repo.toLowerCase()}`
  const host = prRepo.host?.trim().toLowerCase()
  return host && host !== 'github.com' ? `${host}/${slug}` : slug
}

export function checksPanelAsyncResultKey(
  repoId: string,
  branch: string,
  prNumber: number | null,
  prRepo?: PrRepoIdentity | null,
  headSha?: string | null
): string {
  return `${repoId}::${branch}::${normalizedPRRepoIdentity(prRepo)}::${prNumber ?? 'none'}::${
    headSha ?? 'none'
  }`
}

export function checksPanelHostedReviewAsyncResultKey(
  repoId: string,
  branch: string,
  provider: string,
  reviewNumber: number | null,
  headSha?: string | null
): string {
  return `${repoId}::${branch}::${provider}::${reviewNumber ?? 'none'}::${headSha ?? 'none'}`
}

export function shouldCommitChecksPanelAsyncResult(
  currentKey: string,
  requestKey: string
): boolean {
  return currentKey === requestKey
}
