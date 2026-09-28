import { defineMethod } from '../core'
import { GitBranchDiff, GitCommitDiff, GitDiff } from './git-params'

export const GIT_DIFF_METHODS = [
  defineMethod({
    name: 'git.diff',
    params: GitDiff,
    handler: async (params, { runtime }) =>
      // The request-scoped content budget existed for the paired mobile/relay transports,
      // which are gone; every remaining caller reads the full-fidelity diff.
      runtime.getRuntimeGitDiff(
        params.worktree,
        params.filePath,
        params.staged,
        params.compareAgainstHead,
        undefined
      )
  }),
  defineMethod({
    name: 'git.branchDiff',
    params: GitBranchDiff,
    handler: async (params, { runtime }) =>
      runtime.getRuntimeGitBranchDiff(
        params.worktree,
        params.compare,
        params.filePath,
        params.oldPath,
        undefined
      )
  }),
  defineMethod({
    name: 'git.commitDiff',
    params: GitCommitDiff,
    handler: async (params, { runtime }) =>
      runtime.getRuntimeGitCommitDiff(
        params.worktree,
        {
          commitOid: params.commitOid,
          parentOid: params.parentOid,
          filePath: params.filePath,
          oldPath: params.oldPath
        },
        undefined
      )
  })
]
