import type { ExecutionHostId, LOCAL_EXECUTION_HOST_ID } from './execution-host'
import type { DetectedWorktreeListResult } from './worktree/types'

export const PROVIDER_REQUEST_ID_MAX_UTF8_BYTES = 128
export type ProviderRequestId = string & { readonly __providerRequestId: unique symbol }
export type SshExecutionHostId = Extract<ExecutionHostId, `ssh:${string}`>

export type LocalDetectedWorktreeRequest = {
  providerRequestId: ProviderRequestId
  repoId: string
  executionHostId: typeof LOCAL_EXECUTION_HOST_ID
}

export type ListDetectedWorktreesArgs = LocalDetectedWorktreeRequest

/**
 * Hosts whose persisted metadata a scan can retire: exactly those `gcStaleWorktreeMeta` skips,
 * because it only ever condemns rows that are local on both the repo and the meta's `hostId`.
 */
export type OffHostExecutionHostId = Extract<ExecutionHostId, `ssh:${string}` | `runtime:${string}`>

export type ForgetRemovedWorktreesForExecutionHostArgs = {
  repoId: string
  executionHostId: OffHostExecutionHostId
  /** Ids an authoritative scan of this host proved gone — the only evidence that retires persisted metadata. */
  worktreeIds: readonly string[]
}

export type ForgetRemovedWorktreesForExecutionHostResult = {
  forgottenWorktreeIds: string[]
}

export type AuthoritativeDetectedWorktreeHost = {
  kind: 'local'
  executionHostId: typeof LOCAL_EXECUTION_HOST_ID
}

export type HostQualifiedDetectedWorktreeResult =
  | {
      status: 'complete' | 'non-authoritative'
      providerRequestId: ProviderRequestId
      repoId: string
      authority: AuthoritativeDetectedWorktreeHost
      result: DetectedWorktreeListResult
    }
  | {
      providerRequestId: ProviderRequestId
      executionHostId: ExecutionHostId
      status:
        | 'canceled'
        | 'timed-out'
        | 'stale'
        | 'ambiguous-owner'
        | 'authority-unknown'
        | 'rejected'
    }

export type LegacyDetectedWorktreeRequest = { repoId: string }
