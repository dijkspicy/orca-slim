import type {
  AgentSessionFastModeSupport,
  AgentSessionModelOption,
  AgentSessionOptionChoice,
  AgentSessionOptionsResult
} from '../../shared/agent-session-wire'
import type { CodexAppServerConnection } from './codex-app-server-connection'
import {
  applyCodexConfiguredLaunchDefaults,
  readCodexConfiguredLaunchDefaults
} from './codex-configured-launch-defaults'

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function tierRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function fastModeTier(row: Record<string, unknown>): { id?: string; supportKnown: boolean } {
  const modern = Array.isArray(row.serviceTiers) ? row.serviceTiers : null
  const advertised = modern?.flatMap((value) => {
    const tier = tierRecord(value)
    const id = text(tier?.id)
    const name = text(tier?.name)
    return id && name ? [{ id, name }] : []
  })
  const exactModern = advertised?.find(
    (tier) => tier.name.toLowerCase() === 'fast' || tier.id.toLowerCase() === 'fast'
  )
  if (exactModern) {
    return { id: exactModern.id, supportKnown: true }
  }
  const legacy = Array.isArray(row.additionalSpeedTiers) ? row.additionalSpeedTiers : null
  const exactLegacy = legacy?.map(text).find((tier) => tier?.toLowerCase() === 'fast')
  return {
    ...(exactLegacy ? { id: exactLegacy } : {}),
    supportKnown: modern !== null || legacy !== null
  }
}

function fastModeSupport(
  models: readonly AgentSessionModelOption[]
): AgentSessionFastModeSupport | undefined {
  if (models.some((model) => model.supportsFastMode === true)) {
    return { supported: true }
  }
  return models.length > 0 && models.every((model) => model.supportsFastMode === false)
    ? { supported: false, reason: 'model-not-supported' }
    : undefined
}

const MODEL_PAGE_LIMIT = 100
const MAX_MODEL_PAGES = 20

function effortLabel(value: string): string {
  return value === 'xhigh'
    ? 'Extra high'
    : value === 'minimal'
      ? 'Minimal'
      : `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

function effortChoice(value: unknown): AgentSessionOptionChoice | null {
  const row = record(value)
  const effort = text(row?.reasoningEffort)
  if (!effort) {
    return null
  }
  const description = text(row?.description)
  return {
    value: effort,
    label: effortLabel(effort),
    ...(description ? { description } : {})
  }
}

type ParsedCodexModelOption = {
  option: AgentSessionModelOption
  fastModeTierId?: string
}

function modelOption(value: unknown): ParsedCodexModelOption | null {
  const row = record(value)
  if (!row) {
    return null
  }
  const id = text(row.model) ?? text(row.id)
  const label = text(row.displayName) ?? id
  if (!id || !label || row.hidden === true) {
    return null
  }
  const description = text(row.description)
  const defaultEffort = text(row.defaultReasoningEffort)
  const efforts = Array.isArray(row.supportedReasoningEfforts)
    ? row.supportedReasoningEfforts
        .map(effortChoice)
        .filter((choice): choice is AgentSessionOptionChoice => choice !== null)
    : []
  const fastMode = fastModeTier(row)
  return {
    option: {
      id,
      label,
      ...(description ? { description } : {}),
      isDefault: row.isDefault === true,
      ...(defaultEffort ? { defaultEffort } : {}),
      efforts,
      ...(fastMode.supportKnown ? { supportsFastMode: Boolean(fastMode.id) } : {})
    },
    ...(fastMode.id ? { fastModeTierId: fastMode.id } : {})
  }
}

export type CodexSessionOptionCatalog = {
  result: AgentSessionOptionsResult
  fastModeTierByModel: Map<string, string>
}

export type CodexModelCatalogListing = {
  models: AgentSessionModelOption[]
  fastModeTierByModel: Map<string, string>
}

/** One paginated `model/list` pass. The provider fetch and the shaping of a
 *  session's answer are split so a host-cached listing can answer without one. */
export async function fetchCodexModelCatalogListing(input: {
  connection: Pick<CodexAppServerConnection, 'request'>
  timeoutMs?: number
}): Promise<CodexModelCatalogListing> {
  const parsedModels: ParsedCodexModelOption[] = []
  let cursor: string | null = null
  for (let page = 0; page < MAX_MODEL_PAGES; page += 1) {
    const response = record(
      await input.connection.request(
        'model/list',
        { limit: MODEL_PAGE_LIMIT, includeHidden: false, ...(cursor ? { cursor } : {}) },
        { timeoutMs: input.timeoutMs }
      )
    )
    const rows = Array.isArray(response?.data) ? response.data : []
    for (const row of rows) {
      const parsed = modelOption(row)
      if (parsed && !parsedModels.some((model) => model.option.id === parsed.option.id)) {
        parsedModels.push(parsed)
      }
    }
    cursor = text(response?.nextCursor)
    if (!cursor) {
      break
    }
  }
  const configured = await readCodexConfiguredLaunchDefaults(input.connection)
  return {
    models: applyCodexConfiguredLaunchDefaults(
      parsedModels.map((entry) => entry.option),
      configured
    ),
    fastModeTierByModel: new Map(
      parsedModels.flatMap((entry) =>
        entry.fastModeTierId ? [[entry.option.id, entry.fastModeTierId] as const] : []
      )
    )
  }
}

/** Shapes one session's options answer from a listing, wherever it came from. */
export function composeCodexSessionOptionCatalog(
  listing: CodexModelCatalogListing,
  input: {
    current: { model?: string; effort?: string; fastMode?: boolean }
    reportedServiceTier?: string | null
    reportedServiceTierKnown?: boolean
  }
): CodexSessionOptionCatalog {
  const models = listing.models.map((entry) => ({ ...entry }))
  if (input.current.model && !models.some((model) => model.id === input.current.model)) {
    models.push({
      id: input.current.model,
      label: input.current.model,
      isDefault: false,
      efforts: []
    })
  }
  const model = input.current.model ?? models.find((entry) => entry.isDefault)?.id ?? models[0]?.id
  if (!model) {
    throw new Error('codex app-server returned no available models')
  }
  const fastModeTierByModel = new Map(listing.fastModeTierByModel)
  const reportedFastMode = input.reportedServiceTierKnown
    ? input.reportedServiceTier === null || input.reportedServiceTier === 'default'
      ? false
      : input.reportedServiceTier === fastModeTierByModel.get(model)
        ? true
        : undefined
    : undefined
  const fastMode = input.current.fastMode ?? reportedFastMode
  const support = fastModeSupport(models)
  return {
    result: {
      models,
      ...(support ? { fastModeSupport: support } : {}),
      current: {
        model,
        ...(input.current.effort ? { effort: input.current.effort } : {}),
        ...(fastMode !== undefined ? { fastMode } : {}),
        ...(reportedFastMode !== undefined && input.current.fastMode === undefined
          ? { confirmed: ['fastMode'] }
          : {})
      }
    },
    fastModeTierByModel
  }
}

export async function readCodexStructuredSessionOptionCatalog(input: {
  connection: Pick<CodexAppServerConnection, 'request'>
  current: { model?: string; effort?: string; fastMode?: boolean }
  reportedServiceTier?: string | null
  reportedServiceTierKnown?: boolean
  timeoutMs?: number
}): Promise<CodexSessionOptionCatalog> {
  const listing = await fetchCodexModelCatalogListing({
    connection: input.connection,
    ...(input.timeoutMs === undefined ? {} : { timeoutMs: input.timeoutMs })
  })
  return composeCodexSessionOptionCatalog(listing, input)
}
