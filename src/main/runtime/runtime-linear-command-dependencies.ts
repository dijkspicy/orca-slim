import type { RuntimeClientEvent } from '../../shared/runtime-client-events'

export { randomUUID } from 'node:crypto'
export { resolve } from 'node:path'
export type { RuntimeClientEvent } from '../../shared/runtime-client-events'
export type { LinearIssueUpdate } from '../../shared/issue-mutation-types'
export { isPathInsideOrEqual } from '../../shared/cross-platform-path'

export type LinearCreateFieldIntent = {
  stateId?: string
  assigneeId?: string | null
  priority?: number
  estimate?: number | null
  dueDate?: string | null
  labelIds?: string[]
  projectId?: string
}

export type LinearLinkedIssueUpdatedEvent = Extract<
  RuntimeClientEvent,
  { type: 'linearLinkedIssueUpdated' }
>

export function sameStringSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false
  }
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

export function labelsForIds(
  ids: string[],
  labels: { id?: string | null; name?: string | null; color?: string | null }[]
): { id: string; name: string; color?: string | null }[] {
  return ids.map((id) => {
    const label = labels.find((candidate) => candidate.id === id)
    return { id, name: label?.name ?? id, ...(label?.color ? { color: label.color } : {}) }
  })
}
