import { describe, expect, it } from 'vitest'
import { getClientIp, isSameSiteRequest } from '@/lib/request'

function mockRequest(headers: Record<string, string>) {
  return {
    headers: {
      get: (key: string) => headers[key.toLowerCase()] ?? null,
    },
  } as Parameters<typeof isSameSiteRequest>[0]
}

describe('getClientIp', () => {
  it("ignore les IP ajoutées par le client et garde celle du proxy", () => {
    expect(
      getClientIp(mockRequest({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' }) as never),
    ).toBe('203.0.113.9')
  })

  it('se rabat sur X-Real-IP puis sur unknown', () => {
    expect(getClientIp(mockRequest({ 'x-real-ip': '198.51.100.7' }) as never)).toBe('198.51.100.7')
    expect(getClientIp(mockRequest({}) as never)).toBe('unknown')
  })
})

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
