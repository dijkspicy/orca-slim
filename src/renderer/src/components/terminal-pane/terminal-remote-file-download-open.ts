import { toast } from 'sonner'
import { translate } from '@/i18n/i18n'
import { extractIpcErrorMessage } from '@/lib/ipc-error'
import { basename } from '@/lib/path'

/** Structural subset of the file-operation context this download reads. */
type RemoteFileDownloadContext = {
  connectionId?: string
}

/**
 * Remote counterpart of "Open with default app": the OS can only launch a local
 * file, so the workspace copy is downloaded to a user-chosen path first. Files
 * without a paired connection are local and open in place.
 */
export async function downloadAndOpenRemoteTerminalFile(
  fileContext: RemoteFileDownloadContext,
  filePath: string
): Promise<void> {
  const name = basename(filePath) || filePath
  try {
    const result = fileContext.connectionId
      ? await window.api.fs.downloadFile({ filePath, connectionId: fileContext.connectionId })
      : { canceled: false, destinationPath: filePath }
    // Why: cancelling the native save dialog is a deliberate no-op, not a failure.
    if (result.canceled) {
      return
    }
    await window.api.shell.openFilePath(result.destinationPath)
  } catch (error) {
    toast.error(
      extractIpcErrorMessage(
        error,
        translate(
          'auto.components.terminal.pane.TerminalLinkActionPopover.downloadOpenFailed',
          "Failed to download '{{value0}}'.",
          { value0: name }
        )
      )
    )
  }
}
