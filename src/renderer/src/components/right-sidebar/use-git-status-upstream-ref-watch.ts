import { useCallback, useEffect } from 'react'
import { getConnectionId } from '@/lib/connection-context'
import type { GitStatusResult } from '../../../../shared/git-status-types'

export function useGitStatusUpstreamRefWatch(args: {
  enabled: boolean
  executionHostId: string | null | undefined
  worktreeId: string | null
  worktreePath: string | null
}): (status: GitStatusResult) => void {
  const connectionId = args.worktreeId ? (getConnectionId(args.worktreeId) ?? undefined) : undefined
  const scope =
    args.enabled && args.executionHostId
      ? `${args.executionHostId}\0${args.worktreeId}\0${args.worktreePath}`
      : null

  const publish = useCallback(
    (status: GitStatusResult): void => {
      if (!scope || !args.executionHostId || !args.worktreeId || !args.worktreePath) {
        return
      }
      const upstreamName = status.upstreamStatus?.hasUpstream
        ? status.upstreamStatus.upstreamName
        : undefined
      void window.api.git
        .setStatusUpstreamRefWatch({
          worktreeId: args.worktreeId,
          worktreePath: args.worktreePath,
          executionHostId: args.executionHostId,
          ...(connectionId ? { connectionId } : {}),
          ...(status.branch ? { branch: status.branch } : {}),
          ...(upstreamName ? { upstreamName } : {})
        })
        .catch(() => {})
    },
    [args.executionHostId, args.worktreeId, args.worktreePath, connectionId, scope]
  )

  useEffect(() => {
    if (!scope || !args.executionHostId || !args.worktreeId || !args.worktreePath) {
      return
    }
    const executionHostId = args.executionHostId
    const worktreeId = args.worktreeId
    const worktreePath = args.worktreePath
    return () => {
      void window.api.git
        .setStatusUpstreamRefWatch({
          worktreeId,
          worktreePath,
          executionHostId,
          ...(connectionId ? { connectionId } : {})
        })
        .catch(() => {})
    }
  }, [args.executionHostId, args.worktreeId, args.worktreePath, connectionId, scope])

  return publish
}
