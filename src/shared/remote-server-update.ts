export const REMOTE_SERVER_UPDATE_CAPABILITY = 'updater.remote-control.v1' as const

export type RemoteServerUpdateInstallMode =
  | 'interactive'
  | 'supervised-headless-serve'
  | 'unsupported-headless-serve'

export type RemoteServerUpdateSupport = {
  installMode: RemoteServerUpdateInstallMode
  automatic: boolean
  reason:
    | 'available'
    | 'manual-service-update-required'
    | 'unpackaged-build'
    | 'updater-unavailable'
}

/** Minimal status a remote host reports for its own self-update; the local desktop updater is gone. */
export type RemoteServerUpdateChangelog = {
  release: { title: string; description: string; mediaUrl?: string; releaseNotesUrl: string }
  releasesBehind: number | null
}

export type RemoteServerUpdaterStatus =
  | { state: 'idle' }
  | { state: 'checking'; userInitiated?: boolean }
  | { state: 'available'; version: string; changelog?: RemoteServerUpdateChangelog | null }
  | { state: 'not-available'; userInitiated?: boolean }
  | { state: 'downloading'; percent: number; version?: string }
  | { state: 'downloaded'; version?: string }
  | { state: 'error'; message: string; version?: string; retryable?: boolean }

export type RemoteServerUpdateCheckOptions = {
  includePrerelease?: boolean
  includePerfPrerelease?: boolean
}

export type RemoteServerUpdaterSnapshot = {
  appVersion: string
  runtimeId: string
  support: RemoteServerUpdateSupport
  status: RemoteServerUpdaterStatus
}

export type RemoteServerUpdateInstallResult = {
  accepted: true
  fromVersion: string
  targetVersion: string
  runtimeId: string
}
