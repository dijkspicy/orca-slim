// Why: pty:spawn latency has several very different suspects (startup barrier,
// Claude auth prep, Codex resume/hook prep, account resolution, buildPtyHostEnv
// filesystem work, provider/daemon spawn). A single opt-in log line per spawn
// lets benchmarks attribute the cost without a tracing dependency. Each phase
// must name what it actually spans — `host_env` once covered the whole Codex
// preamble and pinned 2s of hook-install cost on the env builder that ran last.
// Enabled via ORCA_PTY_SPAWN_TIMING=1.

export type PtySpawnTiming = {
  mark(phase: string): void
  log(id: string, extra?: Record<string, string | number | boolean>): void
}

const noopTiming: PtySpawnTiming = {
  mark: () => undefined,
  log: () => undefined
}

export function createPtySpawnTiming(): PtySpawnTiming {
  const flag = process.env.ORCA_PTY_SPAWN_TIMING
  if (!flag || flag === '0' || flag.toLowerCase() === 'false') {
    return noopTiming
  }
  const startedAt = performance.now()
  let lastAt = startedAt
  const phases: string[] = []
  return {
    mark(phase: string): void {
      const now = performance.now()
      const elapsed = now - lastAt
      phases.push(`${phase}=${Math.round(elapsed)}ms`)
      lastAt = now
    },
    log(id: string, extra?: Record<string, string | number | boolean>): void {
      const totalMs = performance.now() - startedAt
      const extras = extra
        ? ` ${Object.entries(extra)
            .map(([key, value]) => `${key}=${value}`)
            .join(' ')}`
        : ''
      console.log(
        `[pty-spawn-timing] id=${id} total=${Math.round(totalMs)}ms ${phases.join(' ')}${extras}`
      )
    }
  }
}
