/**
 * `getIntlLocale()` guards against passing `undefined` to `Intl`, which silently
 * falls back to the OS locale rather than the language the user selected.
 *
 * The branch assertions stub `supportedLocalesOf` so they describe the helper's
 * logic rather than whichever locales the runtime's ICU build happens to carry.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getIntlLocale, i18n } from './i18n'
import { DEFAULT_LOCALE } from './supported-languages'

async function activate(language: string): Promise<void> {
  await i18n.changeLanguage(language)
}

/** Stubs ICU lookup so a locale counts as supported only when listed. */
function withSupportedLocales(supported: readonly string[]): void {
  vi.spyOn(Intl.DateTimeFormat, 'supportedLocalesOf').mockImplementation((requested) => {
    const tags = Array.isArray(requested) ? requested : [requested as string]
    return tags.filter((tag) => supported.includes(tag)) as string[]
  })
}

afterEach(async () => {
  vi.restoreAllMocks()
  await i18n.changeLanguage(DEFAULT_LOCALE)
})

describe('getIntlLocale', () => {
  it('passes a supported built-in locale straight through', async () => {
    withSupportedLocales(['es'])
    await activate('es')
    expect(getIntlLocale()).toBe('es')
  })

  it('falls back to the default locale when ICU has no data for the tag', async () => {
    withSupportedLocales([])
    await activate('es')
    // Returning the tag here would let Intl silently format with the runtime locale.
    expect(getIntlLocale()).toBe(DEFAULT_LOCALE)
  })

  it('falls back to the default locale when Intl rejects the tag', async () => {
    vi.spyOn(Intl.DateTimeFormat, 'supportedLocalesOf').mockImplementation(() => {
      throw new RangeError('invalid language tag')
    })
    await activate('es')
    expect(getIntlLocale()).toBe(DEFAULT_LOCALE)
  })
})
