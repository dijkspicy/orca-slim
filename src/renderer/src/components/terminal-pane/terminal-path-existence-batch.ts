import {
  PATH_EXISTENCE_BATCH_MAX,
  type PathExistenceResult
} from '../../../../shared/path-existence-batch'

/** Structural subset of the file-operation context this batch reads. */
type TerminalPathContext = {
  worktreeId?: string | null
  worktreePath?: string | null
  connectionId?: string
}

type PendingPath = {
  path: string
  resolve: (exists: boolean) => void
  reject: (error: unknown) => void
  promise: Promise<boolean>
}
type PathGroup = {
  context: TerminalPathContext
  paths: Map<string, PendingPath>
}

/** One hover turn shares a host request; no answers survive into another turn. */
export function createTerminalPathExistenceBatch(): (
  context: TerminalPathContext,
  path: string
) => Promise<boolean> {
  const groups = new Map<string, PathGroup>()
  let queued = false
  return (context, path) => {
    const key = JSON.stringify([context.worktreeId, context.worktreePath, context.connectionId])
    let group = groups.get(key)
    if (!group) {
      group = { context, paths: new Map() }
      groups.set(key, group)
    }
    const existing = group.paths.get(path)
    if (existing) {
      return existing.promise
    }
    let resolve!: (exists: boolean) => void
    let reject!: (error: unknown) => void
    const promise = new Promise<boolean>((yes, no) => {
      resolve = yes
      reject = no
    })
    group.paths.set(path, { path, resolve, reject, promise })
    if (!queued) {
      queued = true
      queueMicrotask(() => {
        void flush()
      })
    }
    return promise
  }

  async function flush(): Promise<void> {
    const ready = [...groups.values()]
    groups.clear()
    queued = false
    await Promise.all(
      ready.flatMap((group) => {
        const pending = [...group.paths.values()]
        return Array.from(
          { length: Math.ceil(pending.length / PATH_EXISTENCE_BATCH_MAX) },
          (_, index) =>
            run(
              group,
              pending.slice(
                index * PATH_EXISTENCE_BATCH_MAX,
                (index + 1) * PATH_EXISTENCE_BATCH_MAX
              )
            )
        )
      })
    )
  }
  async function run(group: PathGroup, pending: PendingPath[]): Promise<void> {
    try {
      const paths = pending.map((row) => row.path)
      // Runtime and SSH transports are gone; existence is always probed locally.
      const values = window.api.shell.pathsExist
        ? await window.api.shell.pathsExist(paths)
        : await Promise.all(paths.map((path) => window.api.shell.pathExists(path)))
      if (values.length !== paths.length || values.some((value) => typeof value !== 'boolean')) {
        throw new Error('Invalid local path existence response')
      }
      const results: PathExistenceResult[] = values.map((exists) => ({ exists }))
      results.forEach((result, index) => {
        if ('exists' in result) {
          pending[index].resolve(result.exists)
        } else {
          pending[index].reject(new Error(result.error))
        }
      })
    } catch (error) {
      pending.forEach((row) => row.reject(error))
    }
  }
}
