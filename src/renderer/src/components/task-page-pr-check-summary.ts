import { summarizeProviderChecks } from '../../../shared/provider-check-summary'

export function deriveTaskPagePRCheckSummary(
  checks: Parameters<typeof summarizeProviderChecks>[0]
): ReturnType<typeof summarizeProviderChecks> {
  return summarizeProviderChecks(checks)
}
