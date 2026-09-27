import type { RemoteServerUpdateCheckOptions } from '../../../shared/remote-server-update'
import { getShortcutPlatform } from './shortcut-platform'

type UpdateCheckClickEvent = Pick<MouseEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>

function isMacShortcutPlatform(): boolean {
  return getShortcutPlatform() === 'darwin'
}

export function getUpdateCheckHint(isMac = isMacShortcutPlatform()): string {
  const rcClickLabel = isMac ? '⇧+click' : 'Shift+click'
  const perfClickLabel = isMac ? '⌘+click' : 'Ctrl+click'
  return `${rcClickLabel} checks the latest RC; ${perfClickLabel} checks the latest perf build.`
}

export function getUpdateCheckClickOptions(
  event: UpdateCheckClickEvent,
  isMac = isMacShortcutPlatform()
): RemoteServerUpdateCheckOptions {
  return {
    includePrerelease: event.shiftKey,
    includePerfPrerelease: isMac ? event.metaKey : event.ctrlKey
  }
}
