import { NextRequest, NextResponse } from 'next/server'
import { parseContactBody, CONTACT_LIMITS, CONTACT_RATE } from '@/lib/contact'
import { buildContactNotificationEmail } from '@/lib/contact-email'
import { getFromAddress, getToAddress, getTransporter, formatEmailAddress, resetTransporter } from '@/lib/mail'
import { getClientIp, isSameSiteRequest } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!isSameSiteRequest(req, SITE_URL)) {
    return NextResponse.json({ error: 'Requête non autorisée.' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rlIp = rateLimit(`contact:ip:${ip}`, CONTACT_RATE.ipLimit, CONTACT_RATE.ipWindowMs)

  if (!rlIp.ok) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
      { status: 429, headers: { 'Retry-After': String(rlIp.retryAfter) } },
    )
  }

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 415 })
  }

  let body: unknown
  try {
    const raw = await req.text()
    if (raw.length > CONTACT_LIMITS.bodyMaxBytes) {
      return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const parsed = parseContactBody(record)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }
  if (parsed.isBot) {
    return NextResponse.json({ ok: true })
  }

  const { name, email, message } = parsed.data

  const rlEmail = rateLimit(
    `contact:email:${email}`,
    CONTACT_RATE.emailLimit,
    CONTACT_RATE.emailWindowMs,
  )
  if (!rlEmail.ok) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés avec cette adresse. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(rlEmail.retryAfter) } },
    )
  }

  const transporter = getTransporter()
  if (!transporter) {
    console.error('Contact API: EMAIL_* variables manquantes ou port invalide')
    return NextResponse.json(
      { error: 'Configuration email manquante. Réessayez plus tard.' },
      { status: 503 },
    )
  }

  const smtpFrom = getFromAddress()
  const to = getToAddress()
  if (!smtpFrom || !to) {
    console.error('Contact API: DEFAULT_FROM_EMAIL / EMAIL_HOST_USER manquant ou invalide')
    return NextResponse.json(
      { error: 'Configuration email manquante. Réessayez plus tard.' },
      { status: 503 },
    )
  }

  const submitter = formatEmailAddress({ name, email })
  const { subject, text, html } = buildContactNotificationEmail({ name, email, message })

  try {
    await transporter.sendMail({
      from: formatEmailAddress(smtpFrom),
      to: formatEmailAddress(to),
      replyTo: submitter,
      subject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const e = err as Error & { code?: string; response?: string; responseCode?: number; command?: string }
    console.error('Contact API error:', e?.message ?? String(err))
    if (e?.code) console.error('Contact API error code:', e.code)
    if (e?.responseCode) console.error('Contact API SMTP responseCode:', e.responseCode)
    if (e?.response) console.error('Contact API error response:', e.response)

    resetTransporter()

    const smtpHint =
      process.env.CONTACT_DEBUG === 'true' && e?.response
        ? ` (${String(e.response).slice(0, 120)})`
        : ''

    return NextResponse.json(
      { error: `Erreur lors de l'envoi.${smtpHint}` },
      { status: 500 },
    )
  }
}
