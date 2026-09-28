// @ts-nocheck -- mechanically split class members.
import type { ChildProcessHandle } from '../../shared/child-process/process-spec'
import type { TerminalFileGrant } from './runtime-file-commands-mobile-file-list-limit'

export class RuntimeFileCommandsWithActiveRuntimeTextSearches {
  protected activeRuntimeTextSearches = new Map<string, ChildProcessHandle>()

  protected terminalFileGrants = new Map<string, TerminalFileGrant>()

  // The mux drops ErrnoException.code, so match not-found by message shape (vs transport/permission/provider errors).
  protected static isRemoteNotFoundErrorMessage(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error)
    return /\bENOENT\b|no such file|not found|does not exist/i.test(message)
  }
}
