import { getConnectionId, getConnectionIdForFile } from '@/lib/connection-context'
import type { GlobalSettings } from '../../../shared/global-settings-types'
import { useAppStore } from '@/store'

/** Which host owns a workspace file, resolved the same way for every surface that opens one. */
export type RuntimeFileOperationContext = {
  settings: Pick<GlobalSettings, 'activeRuntimeEnvironmentId'> | null | undefined
  worktreeId: string | null | undefined
  worktreePath: string | null | undefined
  connectionId?: string
}

/** Settings resolution inlined from the removed runtime-client-target helper. */
function settingsForFileHostOwner(
  settings: Pick<GlobalSettings, 'activeRuntimeEnvironmentId'> | null | undefined,
  runtimeEnvironmentId: string | null | undefined
): Pick<GlobalSettings, 'activeRuntimeEnvironmentId'> | null | undefined {
  if (runtimeEnvironmentId === null) {
    return { activeRuntimeEnvironmentId: null }
  }
  const ownerId = runtimeEnvironmentId?.trim()
  return ownerId ? { activeRuntimeEnvironmentId: ownerId } : settings
}

export function buildWorkspaceFileContext(
  worktreeId: string,
  worktreePath: string,
  runtimeEnvironmentId?: string | null
): RuntimeFileOperationContext {
  const settings = useAppStore.getState().settings
  return {
    settings: settingsForFileHostOwner(settings, runtimeEnvironmentId),
    worktreeId: worktreeId || null,
    worktreePath,
    connectionId: getConnectionId(worktreeId || null) ?? undefined
  }
}

/**
 * Same, for a surface that already resolved ownership per file rather than per workspace. A folder
 * workspace can span repos on different hosts, so its workspace-scoped answer is `undefined` where
 * the file's own answer is a concrete host — and `undefined` reads downstream as "local".
 */
export function buildWorkspaceFileContextForFile(
  worktreeId: string,
  worktreePath: string,
  filePath: string,
  runtimeEnvironmentId?: string | null
): RuntimeFileOperationContext {
  return {
    ...buildWorkspaceFileContext(worktreeId, worktreePath, runtimeEnvironmentId),
    connectionId: getConnectionIdForFile(worktreeId || null, filePath) ?? undefined
  }
}

/**
 * Whether the client's OS can launch this path at all. With the remote runtime/SSH hosts culled,
 * a file is locally openable unless an SSH connection still owns it.
 */
export function canClientOsOpenWorkspaceFile(
  fileContext: RuntimeFileOperationContext,
  _filePath: string
): boolean {
  return !fileContext.connectionId
}
