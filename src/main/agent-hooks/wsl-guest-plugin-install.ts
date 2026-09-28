// Ships plugin/extension source to the guest WSL relay and reports the OpenCode
// config-overlay dir it materialized. Best-effort: an older guest bundle lacks
// the handler (-32601) and routine teardown races resolve to `unavailable`.
// Mirrors the SSH relay's installPluginsOnRelay swallow list.
import type { SshChannelMultiplexer } from '../hook-relay/ssh-channel-multiplexer'
import { AGENT_HOOK_INSTALL_PLUGINS_METHOD } from '../../shared/agent-hook-relay'

/** Plugin/extension sources shipped to the guest relay so an Orca update needn't
 *  redeploy the relay bundle. Wire payload of AGENT_HOOK_INSTALL_PLUGINS_METHOD. */
export type PluginSources = {
  /** Source body of `orca-opencode-status.js` to drop into <overlay>/plugins/. */
  opencodePluginSource?: string
  /** Source body of OpenCode 2's status plugin. */
  opencode2PluginSource?: string
  /** Source body of Pi's `orca-agent-status.ts` to drop into <overlay>/extensions/. */
  piExtensionSource?: string
  /** Source body of OMP's `orca-agent-status.ts` to drop into <overlay>/extensions/. */
  ompExtensionSource?: string
  /** Source body of Prime Agent's `orca-agent-status.ts` to install in its real agent dir. */
  primeAgentExtensionSource?: string
}

/** Structural, not the deps type itself, so this stays free of the deps module. */
type GuestPluginInstallDeps = {
  pluginSources: () => PluginSources
  warn: (message: string) => void
}

/** `none` (guest answered, but materialization failed) must not be conflated
 *  with `unavailable` (no handler / teardown): only `none` means the previously
 *  recorded dir is now unusable and must stop being advertised to PTYs. */
export type GuestOverlayResult =
  | { kind: 'dir'; dir?: string; dir2?: string; piDir?: string; ompDir?: string }
  | { kind: 'none' }
  | { kind: 'unavailable' }

export async function requestGuestOpenCodeOverlayDir(
  mux: SshChannelMultiplexer,
  deps: GuestPluginInstallDeps,
  distro: string,
  launchKind?: 'pi' | 'omp'
): Promise<GuestOverlayResult> {
  try {
    // oxlint-disable-next-line typescript/consistent-type-assertions -- SAFETY: Runtime validation or the local test fixture establishes the asserted shape.
    const res = (await mux.request(AGENT_HOOK_INSTALL_PLUGINS_METHOD, {
      ...deps.pluginSources(),
      ...(launchKind ? { launchKind } : {})
    })) as {
      overlayDirs?: { opencode?: unknown; opencode2?: unknown; pi?: unknown; omp?: unknown }
    }
    const dir = res?.overlayDirs?.opencode
    const dir2 = res?.overlayDirs?.opencode2
    const piDir = res?.overlayDirs?.pi
    const ompDir = res?.overlayDirs?.omp
    const opencodeDir = typeof dir === 'string' && dir.length > 0 ? dir : undefined
    const opencode2Dir = typeof dir2 === 'string' && dir2.length > 0 ? dir2 : undefined
    const guestPiDir = typeof piDir === 'string' && piDir.length > 0 ? piDir : undefined
    const guestOmpDir = typeof ompDir === 'string' && ompDir.length > 0 ? ompDir : undefined
    return opencodeDir || opencode2Dir || guestPiDir || guestOmpDir
      ? {
          kind: 'dir',
          ...(opencodeDir ? { dir: opencodeDir } : {}),
          ...(opencode2Dir ? { dir2: opencode2Dir } : {}),
          ...(guestPiDir ? { piDir: guestPiDir } : {}),
          ...(guestOmpDir ? { ompDir: guestOmpDir } : {})
        }
      : { kind: 'none' }
  } catch (err) {
    // Why: -32601 = older guest bundle without the handler; CONNECTION_LOST/DISPOSED = routine mid-flight teardown — swallow both.
    // oxlint-disable-next-line typescript/consistent-type-assertions -- SAFETY: Runtime validation or the local test fixture establishes the asserted shape.
    const code = (err as { code?: unknown })?.code
    if (code === -32601 || code === 'CONNECTION_LOST' || code === 'DISPOSED' || mux.isDisposed()) {
      return { kind: 'unavailable' }
    }
    deps.warn(
      `[agent-hooks] WSL installPlugins for '${distro}' failed: ${err instanceof Error ? err.message : String(err)}`
    )
    return { kind: 'unavailable' }
  }
}
