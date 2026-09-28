import type { GitRuntimeOptions } from '../git/git-runtime-options'
import type { Repo } from '../../shared/repo-types'
import { readIssueCommand, writeIssueCommand } from '../issue-command-file'
import { isFolderRepo } from '../../shared/repo-kind'

type RuntimeRepositoryIssueCommandDeps = {
  resolveRepo: (selector: string) => Promise<Repo>
  getLocalGitArgs: (repo: Repo) => [] | [GitRuntimeOptions]
}

export class RuntimeRepositoryIssueCommand {
  constructor(private readonly deps: RuntimeRepositoryIssueCommandDeps) {}

  async read(repoSelector: string) {
    const repo = await this.deps.resolveRepo(repoSelector)
    if (isFolderRepo(repo)) {
      return {
        localContent: null,
        sharedContent: null,
        effectiveContent: null,
        localFilePath: '',
        source: 'none' as const
      }
    }
    return readIssueCommand(repo.path)
  }

  /** Save a private override on its execution host; blank content restores the shared command. */
  async write(repoSelector: string, content: string): Promise<{ ok: true }> {
    const repo = await this.deps.resolveRepo(repoSelector)
    if (isFolderRepo(repo)) {
      return { ok: true }
    }
    await writeIssueCommand(repo.path, content, () => this.deps.getLocalGitArgs(repo)[0] ?? {})
    return { ok: true }
  }
}
