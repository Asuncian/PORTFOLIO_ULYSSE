import type { NextRequest } from 'next/server'

/** Best-effort client IP behind reverse proxies (Netlify, Vercel, etc.). */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
