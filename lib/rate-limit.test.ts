import { afterEach, describe, expect, it } from 'vitest'
import { clearRateLimitBuckets, rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  afterEach(() => {
    clearRateLimitBuckets()
  })

  it('autorise les requêtes sous la limite', () => {
    const key = 'test:ip:1'
    expect(rateLimit(key, 3, 60_000).ok).toBe(true)
    expect(rateLimit(key, 3, 60_000).ok).toBe(true)
    expect(rateLimit(key, 3, 60_000).ok).toBe(true)
  })

  it('bloque au-delà de la limite', () => {
    const key = 'test:ip:2'
    rateLimit(key, 2, 60_000)
    rateLimit(key, 2, 60_000)
    const blocked = rateLimit(key, 2, 60_000)
    expect(blocked.ok).toBe(false)
    if (!blocked.ok) {
      expect(blocked.retryAfter).toBeGreaterThan(0)
    }
  })

  it('isole les clés (IP vs email)', () => {
    rateLimit('contact:ip:1.2.3.4', 1, 60_000)
    const ipBlocked = rateLimit('contact:ip:1.2.3.4', 1, 60_000)
    const emailOk = rateLimit('contact:email:a@b.com', 1, 60_000)

    expect(ipBlocked.ok).toBe(false)
    expect(emailOk.ok).toBe(true)
  })
})
