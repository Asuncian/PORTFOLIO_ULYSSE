import type { NextRequest } from 'next/server'

/**
 * Client IP behind the reverse proxy (Traefik). The proxy appends the real peer
 * address at the END of X-Forwarded-For; earlier entries come from the client
 * and can be spoofed, so only the rightmost one is trusted.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',').map(s => s.trim()).filter(Boolean)
  return forwarded?.at(-1) || req.headers.get('x-real-ip') || 'unknown'
}

/** Bloque les requêtes cross-site lorsque Origin/Referer est présent et ne correspond pas au site. */
export function isSameSiteRequest(req: NextRequest, siteUrl: string): boolean {
  let allowedOrigin: string
  try {
    allowedOrigin = new URL(siteUrl).origin
  } catch {
    return true
  }

  const origin = req.headers.get('origin')
  if (origin && origin !== allowedOrigin) return false

  const referer = req.headers.get('referer')
  if (referer) {
    try {
      if (new URL(referer).origin !== allowedOrigin) return false
    } catch {
      return false
    }
  }

  return true
}
