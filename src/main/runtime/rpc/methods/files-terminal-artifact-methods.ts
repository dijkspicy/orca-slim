import { defineMethod } from '../core'
import {
  TerminalArtifactFile,
  TerminalArtifactFileWrite
} from '../../../../shared/rpc-contract/files-terminal-artifact-params'

export const FILE_TERMINAL_ARTIFACT_METHODS = [
  defineMethod({
    name: 'files.readTerminalArtifact',
    params: TerminalArtifactFile,
    handler: async (params, { runtime, clientId }) =>
      runtime.readTerminalArtifactFile(
        params.worktree,
        params.grantId,
        params.absolutePath,
        clientId
      )
  }),
  defineMethod({
    name: 'files.readTerminalArtifactPreview',
    params: TerminalArtifactFile,
    handler: async (params, { runtime, clientId }) =>
      runtime.readTerminalArtifactPreview(
        params.worktree,
        params.grantId,
        params.absolutePath,
        clientId
      )
  }),
  defineMethod({
    name: 'files.writeTerminalArtifact',
    params: TerminalArtifactFileWrite,
    handler: async (params, { runtime, clientId }) =>
      runtime.writeTerminalArtifactFile(
        params.worktree,
        params.grantId,
        params.absolutePath,
        params.content,
        clientId
      )
  })
]
