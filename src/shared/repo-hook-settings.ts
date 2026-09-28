// ─── Repo hook settings (orca.yaml) — persisted shapes ──────────────────────
// Verbatim shapes formerly supplied by `orca-yaml-hook-types.ts` (culled with
// the yaml-hook type module); the hook settings wire contract is unchanged.

import type { SetupAgentStartupPolicy } from './setup-agent-startup-policy'
import type { HookCommandSourcePolicy } from './hook-command-source-policy'

export type SetupRunPolicy = 'ask' | 'run-by-default' | 'skip-by-default'

export type RepoHookSettings = {
  // Why: persisted data may still include the old mode field from the earlier
  // hook UI. Keep it in the shape so existing local state reads without a migration.
  mode: 'auto' | 'override'
  setupRunPolicy?: SetupRunPolicy
  setupAgentStartupPolicy?: SetupAgentStartupPolicy
  commandSourcePolicy?: HookCommandSourcePolicy
  scripts: {
    setup: string
    archive: string
  }
}

export type PersistedTrustedOrcaHookEntry = {
  contentHash: string
  approvedAt: number
}

export type PersistedTrustedOrcaHookRepo = {
  all?: {
    approvedAt: number
  }
  setup?: PersistedTrustedOrcaHookEntry
  archive?: PersistedTrustedOrcaHookEntry
  issueCommand?: PersistedTrustedOrcaHookEntry
  vmRecipe?: PersistedTrustedOrcaHookEntry
}

export type PersistedTrustedOrcaHooks = Record<string, PersistedTrustedOrcaHookRepo>
