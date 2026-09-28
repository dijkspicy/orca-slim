import type { WindowsTerminalCapabilities } from './windows-terminal-capabilities'

export type WindowsTerminalCapabilityLoadTarget =
  | { kind: 'local' }
  | { kind: 'environment'; environmentId: string }

async function reconcileWslAvailability(
  available: boolean,
  distros: string[],
  probe: () => Promise<boolean>
): Promise<boolean> {
  // A non-empty list can invalidate the negative cache after the parallel probe read it.
  if (available || distros.length === 0) {
    return available
  }
  return probe().catch(() => false)
}

export async function readWindowsTerminalCapabilities(
  target: WindowsTerminalCapabilityLoadTarget,
  sshConnectionId?: string | null
): Promise<WindowsTerminalCapabilities> {
  // Remote probes went with the SSH/runtime-host cull; only the local host can answer now.
  if (target.kind !== 'local' || sshConnectionId) {
    return {
      wslAvailable: false,
      wslDistros: [],
      pwshAvailable: false,
      gitBashAvailable: false,
      hostPlatform: null,
      isLoading: false
    }
  }

  const [wslAvailable, wslDistros, pwshAvailable, gitBashAvailable, runtimeStatus] =
    await Promise.all([
      window.api.wsl.isAvailable().catch(() => false),
      window.api.wsl.listDistros().catch(() => []),
      window.api.pwsh.isAvailable().catch(() => false),
      window.api.gitBash.isAvailable().catch(() => false),
      window.api.runtime.getStatus().catch(() => null)
    ])
  const reconciledWslAvailable = await reconcileWslAvailability(wslAvailable, wslDistros, () =>
    window.api.wsl.isAvailable()
  )
  return {
    wslAvailable: reconciledWslAvailable,
    wslDistros,
    pwshAvailable,
    gitBashAvailable,
    hostPlatform: runtimeStatus?.hostPlatform ?? null,
    ...(runtimeStatus?.windowsProcessStartTimeAvailable !== undefined
      ? { windowsProcessStartTimeAvailable: runtimeStatus.windowsProcessStartTimeAvailable }
      : {}),
    isLoading: false
  }
}
