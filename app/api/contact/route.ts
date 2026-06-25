import { NextRequest, NextResponse } from 'next/server'
import { parseContactBody, CONTACT_LIMITS } from '@/lib/contact'
import { buildContactNotificationEmail } from '@/lib/contact-email'
import { getFromAddress, getToAddress, getTransporter, formatEmailAddress } from '@/lib/mail'
import { getClientIp } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const LIMIT = 5
const WINDOW_MS = 60_000

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rl = rateLimit(`contact:${ip}`, LIMIT, WINDOW_MS)

  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
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

  const parsed = parseContactBody(body as Record<string, unknown>)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }
  if (parsed.isBot) {
    return NextResponse.json({ ok: true })
  }

  const { name, email, message } = parsed.data

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
      from: submitter,
      to: formatEmailAddress(to),
      replyTo: submitter,
      sender: formatEmailAddress(smtpFrom),
      envelope: {
        from: smtpFrom.email,
        to: to.email,
      },
      subject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const e = err as Error & { code?: string; response?: string; command?: string }
    console.error('Contact API error:', e?.message ?? String(err))
    if (e?.code) console.error('Contact API error code:', e.code)
    if (e?.response) console.error('Contact API error response:', e.response)

    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 })
  }
}
