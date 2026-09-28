// Verbatim platform list formerly supplied by `relay-artifacts.ts` (culled with the relay).
export const BUNDLED_RIPGREP_PLATFORMS = [
  'linux-x64',
  'linux-arm64',
  'darwin-x64',
  'darwin-arm64',
  'win32-x64',
  'win32-arm64'
] as const
export type BundledRipgrepPlatform = (typeof BUNDLED_RIPGREP_PLATFORMS)[number]

/**
 * Orca ships its own ripgrep for every supported platform (from @vscode/ripgrep-universal), so
 * local, WSL, and SSH searches never depend on the user having installed `rg`.
 */
/** Directory under the packaged resources root holding `<platform>/rg[.exe]`. */
export const BUNDLED_RIPGREP_RESOURCE_DIR = 'ripgrep'
/** Package directory holding the same layout in development checkouts. */
export const BUNDLED_RIPGREP_PACKAGE_BIN_DIR = 'node_modules/@vscode/ripgrep-universal/bin'

/** Accepts any `<os>-<arch>` label, so an unbundled platform can still name where rg would live. */
export function bundledRipgrepBinaryName(platform: string): string {
  return platform.startsWith('win32-') ? 'rg.exe' : 'rg'
}

export function toBundledRipgrepPlatform(
  platform: string,
  arch: string
): BundledRipgrepPlatform | null {
  const candidate = `${platform}-${arch}`
  return BUNDLED_RIPGREP_PLATFORMS.find((entry) => entry === candidate) ?? null
}
