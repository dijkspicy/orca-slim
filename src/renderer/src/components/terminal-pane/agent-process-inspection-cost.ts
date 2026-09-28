/**
 * Why: process inspection shells out on every Windows cache miss, and unlike
 * direct-SSH/remote authorities (removed with the remote hosts) there is no
 * cheaper foreground-evidence source for local panes.
 */
export function isAgentProcessInspectionCostly(userAgent: string, ptyId: string | null): boolean {
  if (!userAgent.includes('Windows')) {
    return false
  }
  return ptyId !== null
}
