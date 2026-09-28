import { shell, type WebContents } from 'electron'
import { isRendererDocumentNavigation } from './renderer-document-navigation'

// The shared browser-url module went with the browser cull; privileged windows now hand only
// plain http(s) URLs to the OS. Everything else is denied, never opened.
function externalHttpUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

/** Keep remote documents from inheriting an Orca window's privileged preload. */
export function installPrivilegedWindowNavigationPolicy(contents: WebContents): void {
  contents.setWindowOpenHandler(({ url }) => {
    const externalUrl = externalHttpUrl(url)
    if (externalUrl) {
      void shell.openExternal(externalUrl)
    }
    return { action: 'deny' }
  })

  contents.on('will-navigate', (event, url) => {
    // Why: location.reload() is a renderer-initiated navigation, so blocking it here
    // silently kills the lazy-chunk recovery reload with no unload-prevented signal.
    if (isRendererDocumentNavigation(contents.getURL(), url)) {
      return
    }
    const externalUrl = externalHttpUrl(url)
    if (externalUrl) {
      void shell.openExternal(externalUrl)
    }
    event.preventDefault()
  })
}
