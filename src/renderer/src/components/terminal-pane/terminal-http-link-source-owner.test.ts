import { describe, expect, it } from 'vitest'
import { resolveTerminalHttpLinkSourceOwner } from './terminal-http-link-source-owner'

function transport(
  ptyId: string | null,
  runtimeEnvironmentId?: string | null,
  connectionId?: string | null
) {
  return {
    getPtyId: () => ptyId,
    getRuntimeEnvironmentId: () => runtimeEnvironmentId ?? null,
    getConnectionId: () => connectionId ?? null
  }
}

describe('resolveTerminalHttpLinkSourceOwner', () => {
  it('keeps ordinary local PTYs local', () => {
    expect(resolveTerminalHttpLinkSourceOwner(transport('local-pty'))).toEqual({ kind: 'local' })
  })

  it('prefers the transport runtime owner while its recovery PTY id is null', () => {
    expect(resolveTerminalHttpLinkSourceOwner(transport(null, 'env-recovering'))).toEqual({
      kind: 'runtime',
      runtimeEnvironmentId: 'env-recovering'
    })
  })
})
