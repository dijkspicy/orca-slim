import { z } from 'zod'
import type { SkillPackageManifestV1 } from './skill-package-manifest'
import type { SkillBundleManifestV1 } from './skill-bundle-manifest'
import { SkillDiscoveryTargetSchema } from './skills'

export const AGENT_SKILL_SHARING_UNSUPPORTED_ENVIRONMENT_CODE =
  'agent_skill_sharing_unsupported_environment'
export const AGENT_SKILL_SELECTOR_NOT_FOUND_CODE = 'agent_skill_selector_not_found'
export const AGENT_SKILL_SELECTOR_AMBIGUOUS_CODE = 'agent_skill_selector_ambiguous'
export const AGENT_SKILL_SHARING_BUSY_CODE = 'agent_skill_sharing_busy'
export const AGENT_SKILL_NOT_SHAREABLE_CODE = 'agent_skill_not_shareable'

export const AgentSkillShareRequestSchema = z
  .object({
    skillSelectors: z.array(z.string().trim().min(1).max(4_096)).min(1).max(512),
    bundleName: z.string().regex(/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]{0,62}[a-z0-9])?$/),
    releaseNotes: z.string().max(10_000).default(''),
    target: SkillDiscoveryTargetSchema.optional()
  })
  .strict()

export type AgentSkillShareRequest = z.infer<typeof AgentSkillShareRequestSchema>

export type AgentSkillShareSelectedSkill = {
  id: string
  name: string
  description: string | null
}

// Verbatim shapes formerly supplied by `skill-cloud-contract.ts` (culled);
// the agent skill-sharing wire contract is unchanged.
type SkillCloudVersionShape = {
  packageId: string
  versionId: string
  name: string
  description: string
  packageDigest: string
  archiveSha256: string
  compressedBytes: number
  createdAt: string
  releaseNotes: string
  manifest: SkillPackageManifestV1 | SkillBundleManifestV1
}

type SkillCloudPublishResultShape = {
  version: SkillCloudVersionShape
  share: { id: string; url: string }
}

type SkillCloudOperationShape<T> =
  | { status: 'ok'; value: T }
  | { status: 'unconfigured'; message: string }
  | { status: 'reconnect-required' }

export type AgentSkillShareResult = SkillCloudPublishResultShape & {
  selectedSkills: AgentSkillShareSelectedSkill[]
}

export type AgentSkillShareOperation = SkillCloudOperationShape<AgentSkillShareResult>

export class AgentSkillSharingError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly data?: unknown
  ) {
    super(message)
    this.name = 'AgentSkillSharingError'
  }
}
