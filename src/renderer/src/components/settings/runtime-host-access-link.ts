// Host access-link parsing, re-homed from the deleted shared
// remote-pairing modules for the runtime-environments pairing form.

import { parsePairingCode, type PairingOffer } from '../../../../shared/pairing'

export type RemotePairingFailureKind =
  | 'host-unreachable'
  | 'host-identity-mismatch'
  | 'access-link-invalid'
  | 'protocol-incompatible'
  | 'connection-interrupted'
  | 'environment-save-failed'

// ── Transplanted from the deleted shared remote-pairing modules ──────

type RemotePairingEndpointKind = 'loopback' | 'tailscale' | 'lan' | 'public' | 'custom'

export type ParsedHostAccessLink = {
  pairing: PairingOffer
  displayEndpoint: string
  endpointKind: RemotePairingEndpointKind
}

export type ParseHostAccessLinkResult =
  | { ok: true; value: ParsedHostAccessLink }
  | {
      ok: false
      kind:
        | 'invalid-input'
        | 'mobile-only'
        | 'invalid-destination'
        | 'unsupported-destination'
        | 'non-connectable-destination'
      message: string
    }

const LOOPBACK_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'localhost6',
  'localhost6.localdomain6',
  'ip6-localhost',
  'ip6-loopback',
  '127.0.0.1',
  '::1'
])

// Why: Tailnet IPv4 addresses live in 100.64.0.0/10.
function isTailnetIPv4Address(address: string): boolean {
  const parts = address.split('.')
  if (parts.length !== 4) {
    return false
  }
  const octets = parts.map((part) => (/^\d+$/.test(part) ? Number(part) : Number.NaN))
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false
  }
  return octets[0] === 100 && octets[1]! >= 64 && octets[1]! <= 127
}

function isPrivateIPv4Address(hostname: string): boolean {
  const octets = hostname.split('.').map(Number)
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) {
    return false
  }
  return (
    octets[0] === 10 ||
    (octets[0] === 172 && octets[1]! >= 16 && octets[1]! <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  )
}

function isPrivateIPv6Address(hostname: string): boolean {
  const firstHextet = Number.parseInt(hostname.split(':')[0] ?? '', 16)
  return (
    Number.isInteger(firstHextet) &&
    ((firstHextet & 0xfe00) === 0xfc00 || (firstHextet & 0xffc0) === 0xfe80)
  )
}

function getEmbeddedIPv4Address(hostname: string): string | null {
  const match = hostname.match(/^::(?:ffff:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i)
  if (!match) {
    return null
  }
  const high = Number.parseInt(match[1]!, 16)
  const low = Number.parseInt(match[2]!, 16)
  return `${high >> 8}.${high & 0xff}.${low >> 8}.${low & 0xff}`
}

function classifyRemotePairingHostname(hostname: string): RemotePairingEndpointKind {
  const normalized = hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '')
  const embeddedIPv4 = getEmbeddedIPv4Address(normalized)
  if (embeddedIPv4) {
    return classifyRemotePairingHostname(embeddedIPv4)
  }
  if (
    LOOPBACK_HOSTS.has(normalized) ||
    normalized.endsWith('.localhost') ||
    normalized.startsWith('127.')
  ) {
    return 'loopback'
  }
  if (isTailnetIPv4Address(normalized)) {
    return 'tailscale'
  }
  if (isPrivateIPv4Address(normalized) || isPrivateIPv6Address(normalized)) {
    return 'lan'
  }
  return normalized.includes('.') || normalized.includes(':') ? 'public' : 'custom'
}

export function parseHostAccessLink(input: string): ParseHostAccessLinkResult {
  const pairing = parsePairingCode(input)
  if (!pairing) {
    return {
      ok: false,
      kind: 'invalid-input',
      message: 'Enter an Orca access link or bare pairing code.'
    }
  }
  if (pairing.scope === 'mobile') {
    return {
      ok: false,
      kind: 'mobile-only',
      message: 'This link grants mobile-only access. Generate a link for another Orca client.'
    }
  }
  let endpoint: URL
  try {
    endpoint = new URL(pairing.endpoint)
  } catch {
    return {
      ok: false,
      kind: 'invalid-destination',
      message: 'This access link contains an invalid destination.'
    }
  }
  if (
    (endpoint.protocol !== 'ws:' && endpoint.protocol !== 'wss:') ||
    !endpoint.hostname ||
    endpoint.hash !== ''
  ) {
    return {
      ok: false,
      kind: 'unsupported-destination',
      message: 'This access link contains an unsupported destination.'
    }
  }
  const normalizedHostname = endpoint.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (
    normalizedHostname === '0.0.0.0' ||
    normalizedHostname === '::' ||
    getEmbeddedIPv4Address(normalizedHostname) === '0.0.0.0' ||
    endpoint.port === '0'
  ) {
    return {
      ok: false,
      kind: 'non-connectable-destination',
      message: 'This access link contains a non-connectable destination.'
    }
  }
  return {
    ok: true,
    value: {
      pairing,
      displayEndpoint: endpoint.host,
      endpointKind: classifyRemotePairingHostname(endpoint.hostname)
    }
  }
}
