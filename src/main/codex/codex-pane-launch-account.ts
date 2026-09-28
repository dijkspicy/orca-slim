import { normalizeRuntimePathForComparison } from '../../shared/cross-platform-path'
import { parseWslUncPath } from '../../shared/wsl-paths'
import {
  getCodexSelectionLaneKey,
  type CodexAccountSelectionTarget
} from '../../shared/codex-selection-lane'
import type { CodexPaneAccountRecord, CodexPaneHomeRoute } from './codex-pane-account-registry'
import type {
  CodexEnvironmentHomeOverride,
  CodexShellStartupHomeOverride
} from './codex-real-home-path'

/**
 * Records how a PTY launched Codex: the launch lane key and the home route, so
 * a restart can tell which panes no longer match the current home routing.
 *
 * Returns null when the launch cannot be attributed, which keeps the pane out of
 * the stale-pane report entirely.
 */
export function resolveCodexPaneLaunchAccount(args: {
  pinnedByResume: boolean
  launchCodexHomePath: string | null
  recordComparableHomeRoute?: boolean
  shellStartupHomeOverride?: CodexShellStartupHomeOverride
  environmentHomeOverride?: CodexEnvironmentHomeOverride
  systemCodexHomePath: string
  /** Present for caller compatibility; account selection no longer exists. */
  settings?: unknown
  target?: CodexAccountSelectionTarget | null
}): CodexPaneAccountRecord | null {
  const selectionKey = getCodexSelectionLaneKey(args.target)
  const resolvedHomeRoute = resolveCodexPaneHomeRoute(args)
  const homeRoute =
    args.recordComparableHomeRoute === false && resolvedHomeRoute === 'shared-home'
      ? 'custom-home'
      : resolvedHomeRoute
  return {
    selectionKey,
    accountId: null,
    ...(homeRoute ? { homeRoute } : {}),
    ...(args.shellStartupHomeOverride
      ? { shellStartupHomeOverride: args.shellStartupHomeOverride }
      : {}),
    ...(args.environmentHomeOverride
      ? { environmentHomeOverride: args.environmentHomeOverride }
      : {})
  }
}

function resolveCodexPaneHomeRoute(args: {
  launchCodexHomePath: string | null
  systemCodexHomePath: string
  target?: CodexAccountSelectionTarget | null
}): CodexPaneHomeRoute {
  if (
    !args.launchCodexHomePath ||
    normalizeRuntimePathForComparison(args.launchCodexHomePath) ===
      normalizeRuntimePathForComparison(args.systemCodexHomePath)
  ) {
    return 'real-home'
  }
  if (args.target?.runtime === 'wsl') {
    return parseWslUncPath(args.launchCodexHomePath)?.linuxPath.endsWith('/.codex')
      ? 'real-home'
      : 'wsl-home'
  }
  return 'shared-home'
}
