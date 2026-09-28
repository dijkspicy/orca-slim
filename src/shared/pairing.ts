import { z } from 'zod'

// ─── Inlined pairing offer + protocol limits ────────────────────────────────
// Verbatim content formerly supplied by `mobile-relay-pairing-offer.ts` and
// `mobile-pairing-protocol-limits.ts` (culled with the mobile relay); the
// pairing wire contract is unchanged.

export const PAIRING_CODE_MAX_CHARACTERS = 128 * 1024
export const PAIRING_INPUT_MAX_CHARACTERS = PAIRING_CODE_MAX_CHARACTERS + 1024
export const PAIRING_ENDPOINT_MAX_CHARACTERS = 16 * 1024
export const PAIRING_DEVICE_TOKEN_MAX_CHARACTERS = 64 * 1024
export const PAIRING_PUBLIC_KEY_MAX_CHARACTERS = 4 * 1024
export const PAIRING_RELAY_URL_MAX_CHARACTERS = 2048

const PairingScopeSchema = z.enum(['mobile', 'runtime'])
const BASE64URL_16_PATTERN = /^[A-Za-z0-9_-]{16}$/
const BASE64URL_43_PATTERN = /^[A-Za-z0-9_-]{43}$/
const MAX_INVITE_TTL_MS = 10 * 60 * 1000
// The cell stamps expiry from its own clock; without leeway, a cell clock
// even slightly ahead of this machine makes every invite fail validation
// (same class as the host-proof freshness incident).
const INVITE_EXPIRY_CLOCK_SKEW_MS = 30 * 1000

function isCanonicalHttpsOrigin(value: string): boolean {
  if (
    value.length > PAIRING_RELAY_URL_MAX_CHARACTERS ||
    new TextEncoder().encode(value).length > PAIRING_RELAY_URL_MAX_CHARACTERS
  ) {
    return false
  }
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' && value === parsed.origin
  } catch {
    return false
  }
}

function isCanonicalBase64Key(value: string): boolean {
  if (!/^[A-Za-z0-9+/]{43}=$/.test(value)) {
    return false
  }
  try {
    const decoded = atob(value)
    return decoded.length === 32 && btoa(decoded) === value
  } catch {
    return false
  }
}

export function createPairingOfferSchema(now: () => number = () => Date.now()) {
  const relaySchema = z.object({
    v: z.literal(1),
    directorUrl: z
      .string()
      .min(1)
      .refine(isCanonicalHttpsOrigin, 'Expected canonical HTTPS origin'),
    cellUrl: z.string().min(1).refine(isCanonicalHttpsOrigin, 'Expected canonical HTTPS origin'),
    assignmentEpoch: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    relayHostId: z.string().regex(BASE64URL_16_PATTERN),
    inviteToken: z.string().regex(BASE64URL_43_PATTERN),
    inviteExpiresAt: z
      .number()
      .int()
      .refine((value) => {
        const currentTime = now()
        return (
          value > currentTime &&
          value <= currentTime + MAX_INVITE_TTL_MS + INVITE_EXPIRY_CLOCK_SKEW_MS
        )
      }, 'Expected a future invite expiry no more than 10 minutes away'),
    e2eeFraming: z.literal(2)
  })

  return z
    .object({
      v: z.literal(PAIRING_OFFER_VERSION),
      endpoint: z.string().min(1).max(PAIRING_ENDPOINT_MAX_CHARACTERS),
      deviceToken: z.string().min(1).max(PAIRING_DEVICE_TOKEN_MAX_CHARACTERS),
      // Why: the desktop's Curve25519 public key is pinned by the pairing
      // offer, while relayHostId is verified from its decoded bytes later.
      publicKeyB64: z.string().min(1).max(PAIRING_PUBLIC_KEY_MAX_CHARACTERS),
      pairedDeviceId: z.string().min(1).max(128).optional(),
      scope: PairingScopeSchema.optional(),
      relay: relaySchema.optional()
    })
    .superRefine((offer, ctx) => {
      if (offer.relay && offer.scope === 'runtime') {
        // Why: relay v1 is mobile-only; accepting it on runtime offers would
        // imply routing and credential support that client does not have.
        ctx.addIssue({
          code: 'custom',
          path: ['relay'],
          message: 'Relay is invalid for runtime scope'
        })
      }
      if (offer.relay && !isCanonicalBase64Key(offer.publicKeyB64)) {
        // Why: relayHostId is derived from the decoded key bytes, so relay
        // offers cannot tolerate the permissive legacy base64 aliases.
        ctx.addIssue({
          code: 'custom',
          path: ['publicKeyB64'],
          message: 'Relay offers require a canonical 32-byte public key'
        })
      }
    })
}

export const PairingOfferSchema = createPairingOfferSchema()
export type PairingOffer = z.infer<typeof PairingOfferSchema>
export type PairingRelay = NonNullable<PairingOffer['relay']>

export { PAIRING_OFFER_VERSION, PairingOfferSchema }
export type { PairingOffer }

export function encodePairingOffer(offer: PairingOffer): string {
  const json = JSON.stringify(PairingOfferSchema.parse(offer))
  const base64url = Buffer.from(json, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  if (base64url.length > PAIRING_CODE_MAX_CHARACTERS) {
    throw new Error('Pairing offer exceeds safe size')
  }
  // Why: Android camera intents and Expo Router preserve query params more
  // reliably than URL fragments when launching a custom-scheme app.
  return `orca://pair?code=${base64url}`
}

export function decodePairingOffer(url: string): PairingOffer {
  if (url.length > PAIRING_INPUT_MAX_CHARACTERS) {
    throw new Error('Invalid pairing URL: pairing code exceeds safe size')
  }
  const code = extractPairingCodeFromUrl(url)
  if (!code) {
    throw new Error('Invalid pairing URL: must start with orca://pair and include a pairing code')
  }
  return decodePairingBase64(code)
}

function extractPairingCodeFromUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  // Why: prefix checks accepted routes like `orca://pairing?...`; only the
  // pairing deep-link host may carry runtime auth material.
  if (parsed.protocol !== 'orca:' || parsed.hostname !== 'pair') {
    return null
  }
  if (parsed.pathname !== '' && parsed.pathname !== '/') {
    return null
  }
  const code = parsed.searchParams.get('code')
  if (code) {
    return code
  }
  return parsed.hash ? parsed.hash.slice(1) || null : null
}

// Why: accept either an `orca://pair?...` URL or the bare base64
// string so the mobile paste-pair flow can take whichever the user
// actually copied from desktop.
export function parsePairingCode(input: string): PairingOffer | null {
  if (input.length > PAIRING_INPUT_MAX_CHARACTERS) {
    return null
  }
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }
  try {
    if (trimmed.toLowerCase().startsWith('orca://')) {
      return decodePairingOffer(trimmed)
    }
    return decodePairingBase64(trimmed)
  } catch {
    return null
  }
}

function decodePairingBase64(base64url: string): PairingOffer {
  if (
    base64url.length === 0 ||
    base64url.length > PAIRING_CODE_MAX_CHARACTERS ||
    !/^[A-Za-z0-9+/_-]+={0,2}$/.test(base64url)
  ) {
    throw new Error('Invalid pairing code')
  }
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const json =
    typeof Buffer === 'undefined'
      ? new TextDecoder().decode(
          Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))
        )
      : Buffer.from(base64, 'base64').toString('utf-8')
  return PairingOfferSchema.parse(JSON.parse(json))
}
