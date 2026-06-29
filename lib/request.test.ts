import { describe, expect, it } from 'vitest'
import { isSameSiteRequest } from '@/lib/request'

function mockRequest(headers: Record<string, string>) {
  return {
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  } as Parameters<typeof isSameSiteRequest>[0]
}

describe('isSameSiteRequest', () => {
  const siteUrl = 'https://ulysse-goming-jobert.dev'

  it('autorise sans Origin ni Referer', () => {
    expect(isSameSiteRequest(mockRequest({}), siteUrl)).toBe(true)
  })

  it('autorise un Origin correspondant', () => {
    expect(
      isSameSiteRequest(
        mockRequest({ origin: 'https://ulysse-goming-jobert.dev' }),
        siteUrl,
      ),
    ).toBe(true)
  })

  it('bloque un Origin externe', () => {
    expect(
      isSameSiteRequest(mockRequest({ origin: 'https://evil.example' }), siteUrl),
    ).toBe(false)
  })

  it('bloque un Referer externe', () => {
    expect(
      isSameSiteRequest(
        mockRequest({ referer: 'https://evil.example/phishing' }),
        siteUrl,
      ),
    ).toBe(false)
  })
})
