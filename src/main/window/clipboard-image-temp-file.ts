import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { getAppEnvironment } from '../../shared/app-environment'
import { assertClipboardImageByteLengthWithinLimit } from '../../shared/clipboard-image'
import { authorizeExternalPath } from '../ipc/filesystem-auth'

export type SaveClipboardImageAsTempFileArgs = {
  connectionId?: string | null
  runtimeEnvironmentId?: string | null
}

export async function saveClipboardImageBufferAsTempFile(
  buffer: Buffer,
  // Why: kept for call-site compatibility; the remote-target branch went with the SSH cull.
  _args?: SaveClipboardImageAsTempFileArgs
): Promise<string> {
  assertClipboardImageByteLengthWithinLimit(buffer.byteLength)

  const fileName = `orca-paste-${Date.now()}-${randomUUID()}.png`

  const tempPath = path.join(getAppEnvironment().getPath('temp'), fileName)
  await fs.writeFile(tempPath, buffer)
  // Why: the OS temp dir is outside every allowed root, so without this the
  // composer's own thumbnail/preview read of the file it just wrote is denied.
  authorizeExternalPath(tempPath)
  return tempPath
}
