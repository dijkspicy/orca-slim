import type { CommitMessageAgentEnvironmentResolvers } from '../text-generation/commit-message-agent-environment'

export class RuntimeAccountController {
  private commitMessageAgentEnvironment: CommitMessageAgentEnvironmentResolvers | null = null

  setCommitMessageAgentEnvironment(resolvers: CommitMessageAgentEnvironmentResolvers): void {
    this.commitMessageAgentEnvironment = resolvers
  }

  getCommitMessageAgentEnvironment(): CommitMessageAgentEnvironmentResolvers | undefined {
    return this.commitMessageAgentEnvironment ?? undefined
  }
}
