// The concrete browser command implementations were culled with the browser domain.
// Only the command-surface types remain, for the availability/rejection plumbing in
// runtime-browser-commands-factory (every browser RPC now rejects as unavailable).

export type BrowserCommandTargetParams = {
  worktree?: string
  page?: string
}

// No host members are callable any more: every consumer of them was culled.
export type RuntimeBrowserCommandHost = Record<string, unknown>

export type RuntimeBrowserCommands = Record<string, (...args: never[]) => unknown>
