// Renderer-side SSH host state contracts, migrated out of the deleted remote-host
// domain's shared `ssh-types` / `ssh-pty-id` / `ssh-target-generation` modules so the
// surviving store slices keep compiling without them.
import { parseExecutionHostId } from '../../../../shared/execution-host'

export type SshConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'auth-failed'
  | 'deploying-relay'
  | 'connected'
  | 'reconnecting'
  | 'reconnection-failed'
  | 'error'

export type SshRemotePlatform = 'linux' | 'darwin' | 'win32'

export type SshProviderEpoch = string & { readonly __sshProviderEpoch: unique symbol }

export type DirectSshAuthority = {
  targetId: string
  providerEpoch: SshProviderEpoch
  connectionGeneration: number
}

export type SshConnectionState = {
  targetId: string
  status: SshConnectionStatus
  error: string | null
  /** Number of reconnection attempts since last disconnect. */
  reconnectAttempt: number
  /** Opaque provider-incarnation token issued by main. */
  providerEpoch?: SshProviderEpoch | null
  /** Non-secret owner token used to reject mutations captured for an obsolete SSH session. */
  connectionGeneration?: number
  /** Folder downloads require ssh2 SFTP and are unavailable on system SSH. */
  supportsFolderDownload?: boolean
  /** Remote OS detected by the SSH relay once available. */
  remotePlatform?: SshRemotePlatform
}

/** Target identity + label pair the slice label maps are keyed on. */
export type SshTargetRef = {
  id: string
  label: string
}

/** Public target identity and observed host metadata safe to mirror to a paired client. */
export type SshTargetSummary = SshTargetRef & {
  /** Durable registration incarnation; absent for targets that never had one. */
  generation?: number
  /** The SSH host's OS, when it has connected and the relay has detected it. */
  remotePlatform?: SshRemotePlatform
  /** Whether the target currently has a host-owned connected SSH lifecycle. */
  connected?: boolean
  /** Current SSH lifecycle state, when the desktop has one for this target. */
  connectionStatus?: SshConnectionStatus
}

/** Exact repo ownership changes made while re-adopting a removed SSH host. */
export type SshRepoReadoption = {
  oldTargetId: string
  newTargetId: string
  repoIds: string[]
}

export type PortForwardEntry = {
  id: string
  connectionId: string
  localPort: number
  remoteHost: string
  remotePort: number
  label?: string
  /** Origin captured from terminal output for this remote port (e.g. a Vite
   *  banner printed inside an SSH-hosted PTY). The renderer rewrites the port
   *  to the local forward and trusts the user has DNS for the custom host. */
  advertisedUrl?: string
  /** Protocol parsed from the advertised URL — used to upgrade HTTP guesses
   *  to HTTPS even when the advertised host can't be reused locally. */
  advertisedProtocol?: 'http' | 'https'
}

/** A listening port detected on the remote host by the relay. */
export type DetectedPort = {
  port: number
  host: string
  pid?: number
  processName?: string
}

/** A detected SSH port after the main process has mapped terminal-advertised
 *  URLs onto the raw relay scan row for IPC/UI consumption. */
export type EnrichedDetectedPort = DetectedPort & {
  advertisedUrl?: string
  advertisedProtocol?: 'http' | 'https'
}

const SSH_PTY_ID_PREFIX = 'ssh:'
const SSH_PTY_ID_SEPARATOR = '@@'

// Why: reconnect/restore paths sometimes hand these routers the execution-host
// id form ("ssh:<targetId>", from a workspace `hostId`) instead of the bare SSH
// target id that app PTY ids embed. Both name the same connection, so collapse
// to the bare id before comparing/encoding.
function normalizeConnectionId(connectionId: string): string {
  const parsed = parseExecutionHostId(connectionId)
  return parsed?.kind === 'ssh' ? parsed.targetId : connectionId
}

export type ParsedSshPtyId = {
  connectionId: string
  relayPtyId: string
}

export function parseAppSshPtyId(ptyId: string): ParsedSshPtyId | null {
  if (!ptyId.startsWith(SSH_PTY_ID_PREFIX)) {
    return null
  }
  const separatorIndex = ptyId.indexOf(SSH_PTY_ID_SEPARATOR, SSH_PTY_ID_PREFIX.length)
  if (separatorIndex === -1) {
    return null
  }
  const encodedConnectionId = ptyId.slice(SSH_PTY_ID_PREFIX.length, separatorIndex)
  const relayPtyId = ptyId.slice(separatorIndex + SSH_PTY_ID_SEPARATOR.length)
  if (!encodedConnectionId || !relayPtyId) {
    return null
  }
  try {
    return {
      connectionId: decodeURIComponent(encodedConnectionId),
      relayPtyId
    }
  } catch {
    return null
  }
}

export function toAppSshPtyId(connectionId: string, relayPtyId: string): string {
  const normalizedConnectionId = normalizeConnectionId(connectionId)
  const parsed = parseAppSshPtyId(relayPtyId)
  if (parsed) {
    if (parsed.connectionId !== normalizedConnectionId) {
      throw new Error(`PTY ${relayPtyId} belongs to SSH connection "${parsed.connectionId}"`)
    }
    return relayPtyId
  }
  return `${SSH_PTY_ID_PREFIX}${encodeURIComponent(normalizedConnectionId)}${SSH_PTY_ID_SEPARATOR}${relayPtyId}`
}

export const FIRST_SSH_TARGET_GENERATION = 1

/** Accept only values that could have been issued; anything else is treated as absent. */
export function sanitizeSshTargetGeneration(value: unknown): number | undefined {
  return typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= FIRST_SSH_TARGET_GENERATION
    ? value
    : undefined
}
