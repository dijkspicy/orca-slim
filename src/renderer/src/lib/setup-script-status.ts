import { resolveHookCommandSourcePolicy } from '../../../shared/hook-command-source-policy'
import type { Repo } from '../../../shared/repo-types'

// Why: the runtime hooks client was culled; the check result is a plain serializable shape.
export type HookCheckResult = {
  status?: 'ok' | 'error'
  hasHooks: boolean
  hooks: {
    scripts?: { setup?: string }
  } | null
  mayNeedUpdate: boolean
}

export function hasEffectiveSetupCommand(repo: Repo, hooksResult: HookCheckResult): boolean {
  const localSetup = repo.hookSettings?.scripts?.setup?.trim()
  const sharedSetup = hooksResult.hooks?.scripts?.setup?.trim()
  const rawPolicy = repo.hookSettings?.commandSourcePolicy
  const sourcePolicy = resolveHookCommandSourcePolicy(rawPolicy, {
    hasLocalScript: Boolean(localSetup)
  })

  if (sourcePolicy === 'local-only') {
    return Boolean(localSetup)
  }

  if (sourcePolicy === 'run-both') {
    return Boolean(sharedSetup || localSetup)
  }

  return Boolean(sharedSetup)
}
