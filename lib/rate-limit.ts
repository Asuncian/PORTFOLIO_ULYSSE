type Bucket = { count: number; reset: number }

const buckets = new Map<string, Bucket>()

/** Réinitialise les compteurs (tests uniquement). */
export function clearRateLimitBuckets(): void {
  buckets.clear()
}

/** Simple in-memory sliding-window rate limiter (per server instance). */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)) }
  }

  bucket.count++
  return { ok: true }
}

/** Periodic cleanup so the map does not grow without bound. */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    buckets.forEach((bucket, key) => {
      if (now > bucket.reset) buckets.delete(key)
    })
  }, 60_000).unref?.()
}
