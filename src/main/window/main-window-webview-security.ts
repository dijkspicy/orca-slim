import type { BrowserWindow } from 'electron'
import { installPrivilegedWindowNavigationPolicy } from './privileged-window-navigation'

/**
 * With the browser, browser-route and doc-preview surfaces culled, no webview attach is
 * admissible. The handler fails closed: every attach is denied, so the hardened guest
 * preferences below could never be bypassed by a renderer bug either way.
 */
export function installMainWindowWebviewSecurity(mainWindow: BrowserWindow): void {
  installPrivilegedWindowNavigationPolicy(mainWindow.webContents)
  mainWindow.webContents.on('will-attach-webview', (event) => {
    event.preventDefault()
  })
}
