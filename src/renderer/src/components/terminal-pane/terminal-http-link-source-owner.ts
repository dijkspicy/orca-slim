import type { HttpLinkSourceOwner } from '@/lib/http-link-routing'
import type { PtyTransport } from './pty-transport-types'

type OwnerTransport = Pick<PtyTransport, 'getPtyId' | 'getRuntimeEnvironmentId' | 'getConnectionId'>

export function resolveTerminalHttpLinkSourceOwner(
  transport: OwnerTransport | null | undefined
): HttpLinkSourceOwner {
  const retainedRuntimeEnvironmentId = transport?.getRuntimeEnvironmentId?.()?.trim()
  if (retainedRuntimeEnvironmentId) {
    return { kind: 'runtime', runtimeEnvironmentId: retainedRuntimeEnvironmentId }
  }

  // Why: legacy remote/SSH ptys are gone; a retained transport owner is the only
  // non-local source evidence left, and local ownership is the default.
  return { kind: 'local' }
}
