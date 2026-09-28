import type { GitDiffResult } from './git-diff-compare-types'

export const GIT_DIFF_TOO_LARGE_CODE = 'diff_too_large'

/** Whether the complete diff result exceeds `maxBytes` once JSON-encoded. */
export function gitDiffExceedsTransportBudget(result: GitDiffResult, maxBytes: number): boolean {
  try {
    return Buffer.byteLength(JSON.stringify(result), 'utf8') > maxBytes
  } catch {
    // Why: a result that cannot serialize at all is over budget by definition.
    return true
  }
}

/** `maxBytes === undefined` means uncapped: local and in-process callers keep full fidelity. */
export function assertGitDiffWithinTransportBudget<T extends GitDiffResult>(
  result: T,
  maxBytes: number | undefined
): T {
  if (maxBytes === undefined || !gitDiffExceedsTransportBudget(result, maxBytes)) {
    return result
  }
  throw Object.assign(new Error('This diff is too large to open over a remote connection.'), {
    code: GIT_DIFF_TOO_LARGE_CODE,
    data: { maxBytes }
  })
}
