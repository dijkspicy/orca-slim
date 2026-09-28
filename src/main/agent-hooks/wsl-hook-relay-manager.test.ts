// WSL hook relay host side: the SFTP-shaped fs adapter over the relay's fs
// bridge (including a full run of the unchanged remote hook installers), and
// the per-distro relay manager state machine with fault injection.
import { EventEmitter } from 'node:events'
import { existsSync, mkdtempSync, promises as fs, readFileSync, rmSync } from 'node:fs'
import { join, posix } from 'node:path'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FrameDecoder, type DecodedFrame } from '../../shared/relay-frame-decoder'
import {
  MessageType,
  encodeJsonRpcFrame,
  parseJsonRpcMessage,
  type JsonRpcRequest
} from '../hook-relay/relay-protocol'
import {
  SshChannelMultiplexer,
  type MultiplexerTransport
} from '../hook-relay/ssh-channel-multiplexer'
import { createWslHookSftpAdapter } from './wsl-hook-fs-adapter'
import {
  installRemoteManagedAgentHooks,
  REMOTE_MANAGED_HOOK_INSTALLER_AGENTS
} from './remote-managed-hook-installers'
import { WslHookRelayManager } from './wsl-hook-relay-manager'
import { awaitExplicitPiOmpGuestReadiness } from './wsl-pi-omp-guest-readiness'
import { FAILURE_COOLDOWN_BASE_MS, type WslHookRelayManagerDeps } from './wsl-hook-relay-deps'
import { WSL_HOOK_FS_METHODS, type WslFsFailure } from '../../shared/wsl-hook-relay-contract'
import {
  AGENT_HOOK_INSTALL_PLUGINS_METHOD,
  AGENT_HOOK_NOTIFICATION_METHOD,
  AGENT_HOOK_REQUEST_REPLAY_METHOD
} from '../../shared/agent-hook-relay'

type GuestRequestHandler = (params: Record<string, unknown>) => Promise<unknown>

/** Minimal guest peer speaking the relay wire protocol: request routing and
 *  notification send over the mux transport. Test stand-in for the deleted
 *  guest bundle's dispatcher. */
class FakeGuestLink {
  private readonly decoder = new FrameDecoder((frame) => void this.handleFrame(frame))
  private readonly requestHandlers = new Map<string, GuestRequestHandler>()
  private nextSeq = 0
  private disposed = false

  constructor(private readonly writeFrame: (frame: Buffer) => void) {}

  onRequest(method: string, handler: GuestRequestHandler): void {
    this.requestHandlers.set(method, handler)
  }

  notify(method: string, params?: Record<string, unknown>): void {
    this.send({ jsonrpc: '2.0', method, ...(params !== undefined ? { params } : {}) })
  }

  feed(data: Buffer): void {
    if (!this.disposed) {
      this.decoder.feed(data)
    }
  }

  dispose(): void {
    this.disposed = true
    this.decoder.reset()
    this.requestHandlers.clear()
  }

  private send(msg: Record<string, unknown>): void {
    this.writeFrame(encodeJsonRpcFrame(msg as never, this.nextSeq, 0))
    this.nextSeq += 1
  }

  private async handleFrame(frame: DecodedFrame): Promise<void> {
    if (frame.type !== MessageType.Regular || this.disposed) {
      return
    }
    const msg = parseJsonRpcMessage(frame.payload)
    if (!('id' in msg) || !('method' in msg)) {
      return
    }
    const request = msg as JsonRpcRequest
    const handler = this.requestHandlers.get(request.method)
    if (!handler) {
      this.send({
        jsonrpc: '2.0',
        id: request.id,
        error: { code: -32601, message: `Method not found: ${request.method}` }
      })
      return
    }
    try {
      const result = await handler(request.params ?? {})
      this.send({ jsonrpc: '2.0', id: request.id, result: result ?? null })
    } catch (err) {
      this.send({
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: (err as { code?: number }).code ?? -32000,
          message: err instanceof Error ? err.message : String(err)
        }
      })
    }
  }
}

function fsBridgeFailure(err: unknown): WslFsFailure {
  const e = err as NodeJS.ErrnoException
  return { ok: false, errno: e?.code ?? 'EUNKNOWN', message: e?.message ?? String(err) }
}

/** Guest fs bridge over the fake guest link: the home-scoped file operations the
 *  remote hook installers need (same contract as the shared wsl-hook-relay-contract). */
function registerFakeGuestFsHandlers(guest: FakeGuestLink, home: string): void {
  const homeRoot = posix.resolve(home)
  const scoped = (rawPath: unknown): string => {
    if (typeof rawPath !== 'string' || rawPath.length === 0) {
      throw Object.assign(new Error('invalid path'), { code: 'EINVAL' })
    }
    const resolved = posix.resolve(rawPath)
    if (resolved !== homeRoot && !resolved.startsWith(`${homeRoot}/`)) {
      throw Object.assign(new Error(`path outside home: ${resolved}`), { code: 'EACCES' })
    }
    return resolved
  }
  guest.onRequest(WSL_HOOK_FS_METHODS.home, async () => ({ ok: true, home: homeRoot }))
  guest.onRequest(WSL_HOOK_FS_METHODS.readFile, async (params) => {
    try {
      return { ok: true, content: await fs.readFile(scoped(params.path), 'utf8') }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.writeFile, async (params) => {
    try {
      const mode = typeof params.mode === 'number' ? params.mode : undefined
      await fs.writeFile(scoped(params.path), String(params.content ?? ''), {
        encoding: 'utf8',
        mode
      })
      return { ok: true }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.stat, async (params) => {
    try {
      return { ok: true, mode: (await fs.stat(scoped(params.path))).mode }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.rename, async (params) => {
    try {
      await fs.rename(scoped(params.src), scoped(params.dst))
      return { ok: true }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.unlink, async (params) => {
    try {
      await fs.unlink(scoped(params.path))
      return { ok: true }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.chmod, async (params) => {
    try {
      await fs.chmod(scoped(params.path), Number(params.mode))
      return { ok: true }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.readdir, async (params) => {
    try {
      const names = await fs.readdir(scoped(params.path))
      return { ok: true, entries: names.map((filename) => ({ filename })) }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
  guest.onRequest(WSL_HOOK_FS_METHODS.mkdir, async (params) => {
    try {
      await fs.mkdir(scoped(params.path))
      return { ok: true }
    } catch (err) {
      return fsBridgeFailure(err)
    }
  })
}

type GuestHarness = {
  transport: MultiplexerTransport
  guest: FakeGuestLink
  mux: SshChannelMultiplexer
}

/** In-memory stdio pair: host mux on one end, fake guest link on the other
 *  (same harness shape as the relay agent-hook integration test). */
function createGuestHarness(): GuestHarness {
  let relayFeed: ((data: Buffer) => void) | undefined
  const clientDataCallbacks: ((data: Buffer) => void)[] = []
  const closeCallbacks: (() => void)[] = []
  const transport: MultiplexerTransport = {
    write: (data, onSettled) => {
      setImmediate(() => {
        relayFeed?.(data)
        onSettled?.({ ok: true })
      })
    },
    supportsWriteSettlement: true,
    onData: (cb) => {
      clientDataCallbacks.push(cb)
    },
    onClose: (cb) => {
      closeCallbacks.push(cb)
    }
  }
  const guest = new FakeGuestLink((frame) => {
    setImmediate(() => {
      for (const cb of clientDataCallbacks) {
        cb(frame)
      }
    })
  })
  relayFeed = (data) => guest.feed(data)
  const mux = new SshChannelMultiplexer(transport)
  return { transport, guest, mux }
}

// Why skipIf: the fs bridge runs inside the Linux guest and is POSIX-only;
// Windows coverage comes from the live rig runs.
describe.skipIf(process.platform === 'win32')(
  'createWslHookSftpAdapter over the guest fs bridge',
  () => {
    let home: string
    let harness: GuestHarness

    beforeEach(() => {
      home = mkdtempSync(join('/tmp', 'wsl-guest-home-'))
      harness = createGuestHarness()
      registerFakeGuestFsHandlers(harness.guest, home)
    })

    afterEach(() => {
      harness.mux.dispose()
      harness.guest.dispose()
      rmSync(home, { recursive: true, force: true })
    })

    it('maps guest ENOENT onto ssh2 status code 2', async () => {
      const adapter = createWslHookSftpAdapter(harness.mux)
      const err = await new Promise<Error & { code?: number }>((resolve) => {
        adapter.readFile(`${home}/missing.json`, 'utf8', ((e: Error) => resolve(e)) as never)
      })
      expect(err).toBeInstanceOf(Error)
      expect(err.code).toBe(2)
    })

    it('round-trips write/read/stat/rename and rejects paths outside home', async () => {
      const adapter = createWslHookSftpAdapter(harness.mux)
      await new Promise<void>((resolve, reject) => {
        adapter.writeFile(
          `${home}/a.txt`,
          'hello',
          { encoding: 'utf8', mode: 0o600 } as never,
          ((e: Error | null) => (e ? reject(e) : resolve())) as never
        )
      })
      const content = await new Promise<string>((resolve, reject) => {
        adapter.readFile(`${home}/a.txt`, 'utf8', ((e: Error | null, value: string) =>
          e ? reject(e) : resolve(value)) as never)
      })
      expect(content).toBe('hello')

      await new Promise<void>((resolve, reject) => {
        adapter.ext_openssh_rename(`${home}/a.txt`, `${home}/b.txt`, ((e: Error | null) =>
          e ? reject(e) : resolve()) as never)
      })
      expect(existsSync(`${home}/b.txt`)).toBe(true)

      const outside = await new Promise<Error & { code?: number }>((resolve) => {
        adapter.readFile('/etc/passwd', 'utf8', ((e: Error) => resolve(e)) as never)
      })
      expect(outside).toBeInstanceOf(Error)
    })

    it('runs the unchanged remote managed hook installers against a WSL guest home', async () => {
      const adapter = createWslHookSftpAdapter(harness.mux)
      const results = await installRemoteManagedAgentHooks(adapter, home, {
        agents: REMOTE_MANAGED_HOOK_INSTALLER_AGENTS
      })

      expect(results.length).toBeGreaterThan(0)
      expect(results.every((r) => r.state !== 'error')).toBe(true)

      const claudeSettings = JSON.parse(
        readFileSync(join(home, '.claude', 'settings.json'), 'utf8')
      )
      expect(claudeSettings.hooks).toBeTruthy()
      const script = readFileSync(join(home, '.orca', 'agent-hooks', 'claude-hook.sh'), 'utf8')
      expect(script).toContain('/hook/claude')
    }, 20_000)
  }
)

describe('WslHookRelayManager', () => {
  // Why: a fixed POSIX guest home keeps this suite runnable on Windows dev
  // hosts — installHooks is mocked here, so the fs bridge only ever serves
  // the wslfs.home request and never touches the real filesystem.
  const home = '/home/wsl-test-user'
  const codexHome =
    '\\\\wsl.localhost\\Ubuntu\\home\\wsl-test-user\\.local\\share\\orca\\codex-runtime-home\\home'
  const opencodeOverlayDir = `${home}/.orca-relay/opencode-overlays/deadbeefcafe`
  const opencode2OverlayDir = `${home}/.orca-relay/opencode2-overlays/deadbeefcafe`
  let harnesses: GuestHarness[]

  beforeEach(() => {
    harnesses = []
  })

  afterEach(() => {
    for (const h of harnesses) {
      h.mux.dispose()
      h.guest.dispose()
    }
  })

  function fakeChild(): ChildProcessWithoutNullStreams & { emitClose: () => void } {
    const child = new EventEmitter() as EventEmitter & {
      stdout: EventEmitter
      stderr: EventEmitter
      stdin: { write: () => boolean; end: () => void; on: () => void }
      kill: () => void
      emitClose: () => void
    }
    child.stdout = new EventEmitter()
    child.stderr = new EventEmitter()
    child.stdin = { write: () => true, end: () => {}, on: () => {} }
    child.kill = () => {}
    child.emitClose = () => child.emit('close', 0)
    return child as unknown as ChildProcessWithoutNullStreams & { emitClose: () => void }
  }

  function guestTransport(
    options: {
      registerInstallPlugins?: boolean
      detectedAgents?: string[]
      claudeVersion?: string
    } = {}
  ): MultiplexerTransport {
    const { registerInstallPlugins = true, detectedAgents = ['codex'], claudeVersion } = options
    const harness = createGuestHarness()
    harnesses.push(harness)
    registerFakeGuestFsHandlers(harness.guest, home)
    harness.guest.onRequest(AGENT_HOOK_REQUEST_REPLAY_METHOD, async () => ({
      replayed: 0
    }))
    harness.guest.onRequest('preflight.detectAgents', async () => ({
      agents: detectedAgents,
      ...(claudeVersion ? { versions: { claude: claudeVersion } } : {})
    }))
    // A guest bundle predating the plugin overlay omits this handler (-32601).
    if (registerInstallPlugins) {
      harness.guest.onRequest(AGENT_HOOK_INSTALL_PLUGINS_METHOD, async () => ({
        installed: { opencode: true, opencode2: true, pi: false, omp: false },
        overlayDirs: {
          opencode: opencodeOverlayDir,
          opencode2: opencode2OverlayDir,
          pi: `${home}/.pi/agent`,
          omp: `${home}/.omp/agent/extensions/orca-agent-status.ts`
        }
      }))
    }
    return harness.transport
  }

  function startupError(code: number | null, stderr = ''): Error {
    return Object.assign(new Error(`exit ${code}`), {
      startup: { kind: 'exit' as const, code, stderr }
    })
  }

  function createManager(overrides: Partial<WslHookRelayManagerDeps>): {
    manager: WslHookRelayManager
    deps: WslHookRelayManagerDeps
  } {
    const deps: WslHookRelayManagerDeps = {
      platform: () => 'win32',
      remoteHooksEnabled: () => true,
      hookCoordsEnv: () => ({
        ORCA_AGENT_HOOK_PORT: '43117',
        ORCA_AGENT_HOOK_TOKEN: 'tok',
        ORCA_AGENT_HOOK_ENV: 'production',
        ORCA_AGENT_HOOK_VERSION: '1'
      }),
      instanceKey: () => 'testinstance',
      resolveBundle: () => ({ jsPath: '/fake/wsl-agent-hook-relay.js', version: '0.1.0+abc' }),
      readBundle: () => Buffer.from('// bundle'),
      listDistros: async () => ['Ubuntu'],
      isDistroRunning: vi.fn(async () => true),
      spawnRelay: vi.fn(() => fakeChild()),
      runInstall: vi.fn(async () => ({ code: 0, stderr: '' })),
      waitForSentinel: vi.fn(async () => guestTransport()),
      ingest: vi.fn(),
      installHooks: vi.fn(async () => []),
      installCodex: vi.fn(async () => ({
        agent: 'codex' as const,
        state: 'installed' as const,
        configPath: `${home}/.local/share/orca/codex-runtime-home/home/hooks.json`,
        managedHooksPresent: true,
        detail: null
      })),
      managedHookSettings: () => null,
      pluginSources: () => ({ opencodePluginSource: '// opencode plugin source' }),
      warn: vi.fn(),
      transientRetryDelayMs: 1,
      ...overrides
    }
    return { manager: new WslHookRelayManager(deps), deps }
  }

  it('starts one relay per distro, installs hooks, exposes the guest endpoint path, and forwards envelopes', async () => {
    const { manager, deps } = createManager({})
    manager.ensureForDistro('Ubuntu', codexHome)
    manager.ensureForDistro('Ubuntu', codexHome)
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))
    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    expect(deps.installCodex).toHaveBeenCalledWith(codexHome, 'Ubuntu')
    // Codex is owned by the canonical runtime-host writer, not the relay adapter.
    expect(deps.installHooks).toHaveBeenCalledWith(expect.anything(), home, {
      agents: []
    })

    expect(manager.getGuestEndpointFilePath('Ubuntu')).toBe(
      `${home}/.orca-wsl/agent-hooks/instance-testinstance/endpoint.env`
    )

    const guest = harnesses[0].guest
    guest.notify(AGENT_HOOK_NOTIFICATION_METHOD, {
      paneKey: 'tab:leaf',
      payload: { state: 'working' }
    })
    await vi.waitFor(() =>
      expect(deps.ingest).toHaveBeenCalledWith(
        expect.objectContaining({ paneKey: 'tab:leaf' }),
        'wsl:Ubuntu'
      )
    )

    guest.notify(AGENT_HOOK_NOTIFICATION_METHOD, { payload: { state: 'working' } })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(deps.ingest).toHaveBeenCalledTimes(1)
    manager.disposeAll()
  })

  it('waits for guest materialization when an explicit Pi or OMP launch needs it', async () => {
    const { manager } = createManager({})
    await expect(
      awaitExplicitPiOmpGuestReadiness({
        isWsl: true,
        distro: 'Ubuntu',
        codexHomePath: codexHome,
        launchAgent: 'pi',
        manager
      })
    ).resolves.toBe(true)
    expect(manager.getOpenCodeOverlayDir('Ubuntu')).toBe(opencodeOverlayDir)
    manager.disposeAll()
  })

  it('does not treat the endpoint as ready before guest install completes', async () => {
    let releaseInstall!: () => void
    const installGate = new Promise<void>((resolve) => {
      releaseInstall = resolve
    })
    const { manager } = createManager({
      installHooks: vi.fn(async () => installGate.then(() => []))
    })
    const readiness = awaitExplicitPiOmpGuestReadiness({
      isWsl: true,
      distro: 'Ubuntu',
      launchAgent: 'pi',
      timeoutMs: 50,
      manager
    })
    await vi.waitFor(() => expect(manager.getGuestEndpointFilePath('Ubuntu')).toBeNull())
    releaseInstall()
    await expect(readiness).resolves.toBe(true)
    manager.disposeAll()
  })

  it('reports relay startup failure without blocking the explicit launch forever', async () => {
    const { manager } = createManager({
      waitForSentinel: vi.fn(async () => {
        throw startupError(17, 'guest unavailable')
      })
    })
    await expect(
      awaitExplicitPiOmpGuestReadiness({
        isWsl: true,
        distro: 'Ubuntu',
        launchAgent: 'omp',
        manager,
        timeoutMs: 50
      })
    ).resolves.toBe(false)
    manager.disposeAll()
  })

  it('times out a relay that never reaches guest materialization', async () => {
    const { manager } = createManager({
      waitForSentinel: vi.fn(() => new Promise<MultiplexerTransport>(() => {}))
    })
    await expect(
      awaitExplicitPiOmpGuestReadiness({
        isWsl: true,
        distro: 'Ubuntu',
        launchAgent: 'pi',
        timeoutMs: 5,
        manager
      })
    ).resolves.toBe(false)
    manager.disposeAll()
  })

  it('does not wait or start a relay for a bare shell', async () => {
    const { manager } = createManager({})
    await expect(
      awaitExplicitPiOmpGuestReadiness({
        isWsl: true,
        distro: 'Ubuntu',
        launchCommand: 'bash',
        manager
      })
    ).resolves.toBe(true)
    expect(manager.getGuestEndpointFilePath('Ubuntu')).toBeNull()
  })

  it('forwards the WSL guest Claude version to the shared remote installer', async () => {
    const waitForSentinel = vi.fn(async () =>
      guestTransport({ detectedAgents: ['claude'], claudeVersion: '2.1.261 (Claude Code)' })
    )
    const { manager, deps } = createManager({ waitForSentinel })

    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))

    expect(deps.installHooks).toHaveBeenCalledWith(expect.anything(), home, {
      agents: ['claude'],
      claudeVersion: '2.1.261'
    })
    manager.disposeAll()
  })

  it('reinstalls into a newly resolved runtime home without restarting the relay', async () => {
    const { manager, deps } = createManager({})
    manager.ensureForDistro('Ubuntu', codexHome)
    await vi.waitFor(() => expect(deps.installCodex).toHaveBeenCalledTimes(1))
    const nextHome = codexHome.replace('codex-runtime-home', 'codex-accounts\\account-2')

    manager.ensureForDistro('ubuntu', nextHome)
    await vi.waitFor(() => expect(deps.installCodex).toHaveBeenCalledTimes(2))

    expect(deps.installCodex).toHaveBeenLastCalledWith(nextHome, 'Ubuntu')
    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    manager.disposeAll()
  })

  it('ships the OpenCode plugin to the guest and exposes the overlay dir', async () => {
    const { manager } = createManager({})
    manager.ensureForDistro('Ubuntu', codexHome)
    await vi.waitFor(() => expect(manager.getOpenCodeOverlayDir('Ubuntu')).toBe(opencodeOverlayDir))
    manager.disposeAll()
  })

  it('keeps the OpenCode 2 guest overlay separate', async () => {
    const { manager } = createManager({})
    manager.ensureForDistro('Ubuntu', codexHome)
    await vi.waitFor(() =>
      expect(manager.getOpenCodeOverlayDir('Ubuntu', 'opencode2')).toBe(opencode2OverlayDir)
    )
    expect(manager.getOpenCodeOverlayDir('Ubuntu', 'opencode')).toBe(opencodeOverlayDir)
    manager.disposeAll()
  })

  it('leaves the overlay dir null when the guest bundle lacks the installPlugins handler', async () => {
    const waitForSentinel = vi.fn(async () => guestTransport({ registerInstallPlugins: false }))
    const { manager, deps } = createManager({ waitForSentinel })
    manager.ensureForDistro('Ubuntu')
    // Connect still completes (hooks install); the -32601 is swallowed silently.
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(manager.getOpenCodeOverlayDir('Ubuntu')).toBeNull()
    expect(deps.warn).not.toHaveBeenCalledWith(expect.stringContaining('installPlugins'))
    manager.disposeAll()
  })

  it('does not mutate managed agent homes when no WSL agents are detected', async () => {
    const waitForSentinel = vi.fn(async () => guestTransport({ detectedAgents: [] }))
    const { manager, deps } = createManager({ waitForSentinel })

    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(manager.getOpenCodeOverlayDir('Ubuntu')).toBe(opencodeOverlayDir))

    expect(deps.installHooks).not.toHaveBeenCalled()
    manager.disposeAll()
  })

  it('resolves the default distro for null and dedupes it with the explicit name', async () => {
    const { manager, deps } = createManager({})
    manager.ensureForDistro(null)
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))
    manager.ensureForDistro('Ubuntu')
    manager.ensureForDistro(null)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    expect(manager.getGuestEndpointFilePath(null)).toBe(
      `${home}/.orca-wsl/agent-hooks/instance-testinstance/endpoint.env`
    )
    manager.disposeAll()
  })

  it('reinstalls once on a stale-version exit (42) and then connects', async () => {
    const waitForSentinel = vi
      .fn()
      .mockRejectedValueOnce(startupError(42))
      .mockImplementationOnce(async () => guestTransport())
    const { manager, deps } = createManager({ waitForSentinel })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))
    expect(deps.runInstall).toHaveBeenCalledTimes(1)
    expect(deps.spawnRelay).toHaveBeenCalledTimes(2)
    manager.disposeAll()
  })

  it('gives up without installing when the guest has no node (43)', async () => {
    const waitForSentinel = vi.fn().mockRejectedValue(startupError(43))
    const { manager, deps } = createManager({ waitForSentinel })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() =>
      expect(deps.warn).toHaveBeenCalledWith(expect.stringContaining('no node'))
    )
    expect(deps.runInstall).not.toHaveBeenCalled()
    // Cooldown: an immediate re-ensure must not spawn again.
    manager.ensureForDistro('Ubuntu')
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    manager.disposeAll()
  })

  it('retries a bounded number of times on catastrophic wsl.exe failures', async () => {
    const waitForSentinel = vi
      .fn()
      .mockRejectedValueOnce(startupError(1, 'Catastrophic failure (E_UNEXPECTED)'))
      .mockRejectedValueOnce(startupError(1, 'Catastrophic failure (E_UNEXPECTED)'))
      .mockImplementationOnce(async () => guestTransport())
    const { manager, deps } = createManager({ waitForSentinel })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))
    expect(deps.spawnRelay).toHaveBeenCalledTimes(3)
    expect(deps.runInstall).not.toHaveBeenCalled()
    manager.disposeAll()
  })

  it('marks the distro failed when the relay exits and re-ensures only after cooldown', async () => {
    const children: ReturnType<typeof fakeChild>[] = []
    const spawnRelay = vi.fn(() => {
      const child = fakeChild()
      children.push(child)
      return child
    })
    const { manager, deps } = createManager({ spawnRelay })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))

    children[0].emitClose()
    await vi.waitFor(() =>
      expect(deps.warn).toHaveBeenCalledWith(expect.stringContaining('exited'))
    )
    manager.ensureForDistro('Ubuntu')
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(spawnRelay).toHaveBeenCalledTimes(1)
    manager.disposeAll()
  })

  it('is inert off-Windows, when remote hooks are disabled, and when agent status hooks are off', async () => {
    const offPlatform = createManager({ platform: () => 'darwin' })
    offPlatform.manager.ensureForDistro('Ubuntu')
    const disabled = createManager({ remoteHooksEnabled: () => false })
    disabled.manager.ensureForDistro('Ubuntu')
    const hooksOff = createManager({
      managedHookSettings: () => ({ agentStatusHooksEnabled: false })
    })
    hooksOff.manager.ensureForDistro('Ubuntu')
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(offPlatform.deps.spawnRelay).not.toHaveBeenCalled()
    expect(disabled.deps.spawnRelay).not.toHaveBeenCalled()
    expect(hooksOff.deps.spawnRelay).not.toHaveBeenCalled()
  })

  it('stops live relays and refuses to revive them once agent status hooks are switched off', async () => {
    const settings = { agentStatusHooksEnabled: true }
    const { manager, deps } = createManager({ managedHookSettings: () => settings })
    manager.ensureForDistro('Ubuntu', codexHome)
    await vi.waitFor(() => expect(deps.installHooks).toHaveBeenCalledTimes(1))

    settings.agentStatusHooksEnabled = false
    manager.disposeAll({ permanent: false })
    // Reattach and crash recovery both re-enter ensureForDistro; neither may reinstall guest hooks now.
    manager.ensureForDistro('Ubuntu')
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    expect(deps.installHooks).toHaveBeenCalledTimes(1)
    expect(manager.getGuestEndpointFilePath('Ubuntu')).toBeNull()

    // Re-enabling puts the relay back without waiting for the next WSL spawn.
    settings.agentStatusHooksEnabled = true
    manager.resumeStoppedRelays()
    await vi.waitFor(() => expect(deps.spawnRelay).toHaveBeenCalledTimes(2))
    await vi.waitFor(() => expect(deps.installCodex).toHaveBeenCalledTimes(2))
    expect(deps.installCodex).toHaveBeenLastCalledWith(codexHome, 'Ubuntu')
    manager.disposeAll()
  })

  it('does not resume a relay whose distro the user shut down while hooks were off', async () => {
    const settings = { agentStatusHooksEnabled: true }
    const isDistroRunning = vi.fn(async () => true)
    const { manager, deps } = createManager({
      isDistroRunning,
      managedHookSettings: () => settings
    })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.spawnRelay).toHaveBeenCalledTimes(1))

    settings.agentStatusHooksEnabled = false
    manager.disposeAll({ permanent: false })
    settings.agentStatusHooksEnabled = true
    // Why: resuming through `wsl -d` would boot the VM the user shut down, and no agent inside it
    // is waiting on status — the next WSL terminal re-ensures anyway.
    isDistroRunning.mockResolvedValue(false)
    manager.resumeStoppedRelays()
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    // A second resume must not retry a distro already consumed by the first.
    isDistroRunning.mockResolvedValue(true)
    manager.resumeStoppedRelays()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
  })

  it('abandons a launch that was still in flight when hooks were switched off', async () => {
    let failSentinel: ((error: unknown) => void) | undefined
    const { manager, deps } = createManager({
      waitForSentinel: vi.fn(
        () =>
          new Promise<MultiplexerTransport>((_resolve, reject) => {
            failSentinel = reject
          })
      )
    })
    manager.ensureForDistro('Ubuntu')
    await vi.waitFor(() => expect(deps.spawnRelay).toHaveBeenCalledTimes(1))

    manager.disposeAll({ permanent: false })
    // The teardown's child kill reaches the in-flight launch as a startup failure; its retry and
    // guest-install paths must not run, or the user would get an untracked relay after opting out.
    failSentinel?.(startupError(1))
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(deps.spawnRelay).toHaveBeenCalledTimes(1)
    expect(deps.runInstall).not.toHaveBeenCalled()
  })

  it('requires WSL fs-bridge home coordinates before exposing an endpoint path', () => {
    const { manager } = createManager({})
    expect(manager.getGuestEndpointFilePath('Ubuntu')).toBeNull()
    expect(manager.getGuestEndpointFilePath(null)).toBeNull()
  })

  it('keeps a fresh state that replaced a failed one while its restart probe was in flight', async () => {
    // Drain microtasks under fake timers (queueMicrotask is not a faked timer).
    const flush = async (): Promise<void> => {
      for (let i = 0; i < 25; i++) {
        await Promise.resolve()
      }
    }
    let resolveProbe: ((running: boolean) => void) | undefined
    const isDistroRunning = vi.fn(() => new Promise<boolean>((resolve) => (resolveProbe = resolve)))
    const spawnRelay = vi.fn(() => fakeChild())
    // First launch fails outright; the replacement launch never reaches the
    // sentinel, so its state stays 'starting' with no live mux to clean up.
    const waitForSentinel = vi
      .fn()
      .mockRejectedValueOnce(new Error('relay died before sentinel'))
      .mockReturnValueOnce(new Promise<never>(() => {}))
    const { manager, deps } = createManager({ isDistroRunning, spawnRelay, waitForSentinel })

    vi.useFakeTimers()
    try {
      manager.ensureForDistro('Ubuntu')
      await flush()
      expect(spawnRelay).toHaveBeenCalledTimes(1)
      expect(deps.warn).toHaveBeenCalledWith(expect.stringContaining('relay died before sentinel'))

      // Fire the restart timer; recovery blocks awaiting the distro-running probe.
      await vi.advanceTimersByTimeAsync(FAILURE_COOLDOWN_BASE_MS + 300)
      expect(isDistroRunning).toHaveBeenCalledTimes(1)

      // A new WSL PTY spawn re-ensures past the elapsed cooldown, replacing the
      // failed state in the map while the old state's probe is still pending.
      manager.ensureForDistro('Ubuntu')
      await flush()
      expect(spawnRelay).toHaveBeenCalledTimes(2)

      // Probe resolves 'not running' after the swap: the drop must be skipped so
      // the replacement's live relay is not orphaned.
      resolveProbe?.(false)
      await flush()
      expect(deps.warn).not.toHaveBeenCalledWith(expect.stringContaining('distro not running'))

      // Fresh state survived: a further ensure dedupes instead of spawning again.
      manager.ensureForDistro('Ubuntu')
      await flush()
      expect(spawnRelay).toHaveBeenCalledTimes(2)
    } finally {
      manager.disposeAll()
      vi.useRealTimers()
    }
  })
})
