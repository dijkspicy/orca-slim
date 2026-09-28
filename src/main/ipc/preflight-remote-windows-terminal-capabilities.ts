export type RemoteWindowsTerminalCapabilities = {
  wslAvailable: boolean
  wslDistros: string[]
  pwshAvailable: boolean
  gitBashAvailable: boolean
  hostPlatform: NodeJS.Platform | null
}

const EMPTY_REMOTE_WINDOWS_TERMINAL_CAPABILITIES: RemoteWindowsTerminalCapabilities = {
  wslAvailable: false,
  wslDistros: [],
  pwshAvailable: false,
  gitBashAvailable: false,
  hostPlatform: null
}

/**
 * Kept for the renderer's `preflight:detectRemoteWindowsTerminalCapabilities`
 * contract, but the remote multiplexer it probed was removed with the
 * remote-host domain, so there is no host left to detect capabilities on.
 */
export async function detectRemoteWindowsTerminalCapabilities(_args: {
  connectionId: string
}): Promise<RemoteWindowsTerminalCapabilities> {
  return EMPTY_REMOTE_WINDOWS_TERMINAL_CAPABILITIES
}
