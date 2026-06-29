import type { NextRequest } from 'next/server'

/** Best-effort client IP behind reverse proxies (Netlify, Vercel, etc.). */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
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
