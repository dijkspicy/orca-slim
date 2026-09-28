/** Structural stand-ins for the deleted task-source/ssh shared modules; only
 *  the fields the task-source summary and availability surfaces read. */

export type SshConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'auth-failed'
  | 'deploying-relay'
  | 'connected'
  | 'reconnecting'
  | 'reconnection-failed'
  | 'error'

export type TaskProvider = 'github' | 'gitlab' | 'linear' | 'jira'

export type TaskProviderIdentity =
  | { provider: 'github'; owner: string; repo: string }
  | {
      provider: 'gitlab'
      projectId?: string | null
      namespace?: string | null
      project?: string | null
      webUrl?: string | null
    }
  | { provider: 'linear'; workspaceId?: string | null; workspaceName?: string | null }
  | {
      provider: 'jira'
      siteId?: string | null
      siteUrl?: string | null
      projectKey?: string | null
    }

export type TaskSourceContextRef = {
  hostId: string
  providerIdentity?: TaskProviderIdentity | null
  accountLabel?: string | null
}
