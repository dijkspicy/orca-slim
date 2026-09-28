import { createRuntimeRpcAbortError } from '@/runtime/abortable-runtime-environment-call'

/** Delays a file request so typing settles before the host scans. */
export function debounceFileRequest<T>(
  delayMs: number,
  signal: AbortSignal,
  request: () => Promise<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = (): void => {
      signal.removeEventListener('abort', onAbort)
      window.clearTimeout(timer)
      reject(createRuntimeRpcAbortError())
    }
    const timer = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      void request().then(resolve, reject)
    }, delayMs)
    signal.addEventListener('abort', onAbort, { once: true })
    if (signal.aborted) {
      onAbort()
    }
  })
}

export type QuickOpenFileListingArgs = {
  rootPath: string
  connectionId?: string
  excludePaths?: string[]
  requestToken: string
}

/**
 * Lists workspace files for quick open over the local preload fs bridge.
 *
 * Local semantics: the Explorer name filter applies only without a connection, and naming the cap
 * (#12547) is what makes a full page readable as "there is more".
 */
export function listQuickOpenFiles(
  args: QuickOpenFileListingArgs,
  maxResults: number,
  nameFilter?: string
): Promise<string[]> {
  return window.api.fs.listFiles({
    rootPath: args.rootPath,
    connectionId: args.connectionId,
    excludePaths: args.excludePaths,
    requestToken: args.requestToken,
    maxResults,
    ...(nameFilter && !args.connectionId ? { nameFilter } : {})
  })
}

/** Searches file paths for quick open; lists one past the limit so truncation is knowable. */
export async function searchQuickOpenFilePaths(
  args: QuickOpenFileListingArgs,
  query: string,
  limit = 32
): Promise<{ files: string[]; truncated: boolean }> {
  if (!args.connectionId) {
    return { files: [], truncated: false }
  }
  const files = await window.api.fs.listFiles({
    rootPath: args.rootPath,
    connectionId: args.connectionId,
    excludePaths: args.excludePaths,
    requestToken: args.requestToken,
    maxResults: limit + 1,
    searchQuery: query
  })
  return { files: files.slice(0, limit), truncated: files.length > limit }
}

/** Best-effort abort of an in-flight listing (#7721): cancellation is advisory, not authoritative. */
export function cancelQuickOpenFileList(requestToken: string): void {
  void window.api.fs.cancelListFiles({ requestToken }).catch(() => {})
}
