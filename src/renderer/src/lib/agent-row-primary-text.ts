import type { AgentStatusEntry } from '../../../shared/agent-status-types'

// Orca dispatch prompts (and their task markers) rode on the culled
// orchestration fleet; agent rows now show the live prompt as-is.
export function getAgentRowPrimaryText(
  entry: Pick<AgentStatusEntry, 'orchestration' | 'prompt'>
): string {
  return entry.prompt.trim()
}

export function getAgentRowGeneratedTitleText(
  entry: Pick<AgentStatusEntry, 'orchestration' | 'prompt'>
): string {
  return entry.prompt
}
