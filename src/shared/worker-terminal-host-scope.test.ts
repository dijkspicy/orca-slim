import { describe, expect, it } from 'vitest'
import {
  parseWorkerTerminalHostScope,
  readWorkerTerminalHostScope
} from './worker-terminal-host-scope'

/**
 * One durable column, one classification. The scope parser is the single
 * authority every consumer reads `host_scope` through.
 */
type HostScopeCase = {
  label: string
  hostScope: string | null
  host: 'local' | 'remote'
}

const CASES: readonly HostScopeCase[] = [
  {
    label: 'absent scope is legacy local authority',
    hostScope: null,
    host: 'local'
  },
  {
    label: 'local scope',
    hostScope: '{"kind":"local","hostId":"local"}',
    host: 'local'
  },
  {
    label: 'wsl on local',
    hostScope: '{"kind":"wsl","hostId":"local"}',
    host: 'local'
  },
  {
    label: 'wsl on local with a distro',
    hostScope: '{"kind":"wsl","hostId":"local","distro":"Ubuntu"}',
    host: 'local'
  },
  {
    label: 'wsl on local carrying a stray target id',
    hostScope: '{"kind":"wsl","hostId":"local","distro":"Ubuntu","targetId":"host-9"}',
    host: 'local'
  },
  {
    label: 'ssh target',
    hostScope: '{"kind":"ssh","targetId":"host-1"}',
    host: 'remote'
  },
  {
    label: 'unknown remote kind',
    hostScope: '{"kind":"podman","hostId":"box"}',
    host: 'remote'
  },
  {
    label: 'malformed scope is not local',
    hostScope: '{not json',
    host: 'remote'
  },
  {
    label: 'ssh scope with an empty target id names no host',
    hostScope: '{"kind":"ssh","targetId":""}',
    host: 'remote'
  },
  {
    label: 'local scope naming another host id',
    hostScope: '{"kind":"local","hostId":"other"}',
    host: 'local'
  },
  {
    label: 'legacy local prefix',
    hostScope: 'local:workspace-1',
    host: 'local'
  }
]

describe('worker terminal host scope', () => {
  for (const testCase of CASES) {
    it(`classifies ${testCase.label}`, () => {
      const read = readWorkerTerminalHostScope(testCase.hostScope)

      expect(read.kind === 'local' || read.kind === 'absent' ? 'local' : 'remote').toBe(
        testCase.host
      )
    })
  }

  it('keeps the strict scope contract the process-liveness path depends on', () => {
    expect(parseWorkerTerminalHostScope('{"kind":"ssh","targetId":"host-1"}')).toEqual({
      kind: 'ssh',
      targetId: 'host-1'
    })
    expect(
      parseWorkerTerminalHostScope('{"kind":"wsl","hostId":"local","distro":"Ubuntu"}')
    ).toEqual({ kind: 'wsl', hostId: 'local', distro: 'Ubuntu' })
    expect(parseWorkerTerminalHostScope('{"kind":"local","hostId":"local"}')).toEqual({
      kind: 'local',
      hostId: 'local'
    })
    // A scope missing the facts its kind requires is not a scope.
    expect(parseWorkerTerminalHostScope('{"kind":"wsl","hostId":"local"}')).toBeNull()
    expect(parseWorkerTerminalHostScope('{"kind":"ssh"}')).toBeNull()
    expect(parseWorkerTerminalHostScope('local:workspace-1')).toBeNull()
    expect(parseWorkerTerminalHostScope(null)).toBeNull()
  })
})
