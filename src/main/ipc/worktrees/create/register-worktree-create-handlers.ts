import { ipcMain } from 'electron'
import { getLocalWorktreeCatalogVersion } from '../../../local-worktree-scan-generation'
import type {
  CreateWorktreeArgs,
  CreateWorktreeResult
} from '../../../../shared/worktree/create-types'
import { isFolderRepo } from '../../../../shared/repo-kind'
import { createLocalWorktree, notifyWorktreesChanged } from '../../worktree-remote'
import { normalizeLinkedWorkItemFields } from '../ipc-context-schemas'
import { createFolderWorkspace } from './folder-workspace-creation'
import { requireWorktreeCreateRoute } from '../../../worktree-create-execution-host-route'
import type { WorktreeIpcContext } from '../worktree-ipc-context'

export function registerWorktreeCreateHandlers(context: WorktreeIpcContext): void {
  const { mainWindow, store, runtime, options } = context

  ipcMain.handle(
    'worktrees:create',
    async (_event, rawArgs: CreateWorktreeArgs): Promise<CreateWorktreeResult> => {
      const args = normalizeLinkedWorkItemFields(rawArgs)
      const repo = store.getRepo(args.repoId)
      if (!repo) {
        throw new Error(`Repo not found: ${args.repoId}`)
      }

      let result: CreateWorktreeResult
      if (isFolderRepo(repo)) {
        // A folder workspace is a registration, not a filesystem create, so it is host-agnostic.
        result = createFolderWorkspace(args, repo, store)
      } else {
        // Why: refuse non-local hosts instead of running their `git worktree add` on this client.
        requireWorktreeCreateRoute(repo)
        result = await createLocalWorktree(args, repo, store, mainWindow, runtime)
      }

      if (isFolderRepo(repo)) {
        notifyWorktreesChanged(mainWindow, repo.id)
      }

      options?.onWorktreeLifecycle?.({
        kind: 'created',
        worktreeId: result.worktree.id,
        path: result.worktree.path,
        branch: result.worktree.branch
      })

      // Why stamped last: the create's own change notification bumped the generation, so this
      // names the catalog that contains the new worktree.
      return { ...result, catalogVersion: getLocalWorktreeCatalogVersion(repo.id) }
    }
  )
}
