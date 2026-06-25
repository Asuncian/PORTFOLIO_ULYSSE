import { NextRequest, NextResponse } from 'next/server'
import { parseContactBody } from '@/lib/contact'
import { getFromAddress, getToAddress, getTransporter, formatEmailAddress, singleLine } from '@/lib/mail'
import { getClientIp } from '@/lib/request'
import { rateLimit } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/sanitize'

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
    body = await req.json()
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

  const from = getFromAddress()
  const to = getToAddress()
  if (!from || !to) {
    console.error('Contact API: DEFAULT_FROM_EMAIL / EMAIL_HOST_USER manquant ou invalide')
    return NextResponse.json(
      { error: 'Configuration email manquante. Réessayez plus tard.' },
      { status: 503 },
    )
  }

  const text = [
    `Nom : ${name}`,
    `Email : ${email}`,
    '',
    'Message :',
    message,
  ].join('\n')

  const html = [
    '<p><strong>Nom :</strong> ' + escapeHtml(name) + '</p>',
    '<p><strong>Email :</strong> ' + escapeHtml(email) + '</p>',
    '<p><strong>Message :</strong></p><pre>' + escapeHtml(message) + '</pre>',
  ].join('\n')

  const subject = singleLine(`[Portfolio] ${name}`)

  try {
    await transporter.sendMail({
      from: formatEmailAddress({
        name: from.name ?? 'Portfolio Ulysse',
        email: from.email,
      }),
      to: formatEmailAddress(to),
      replyTo: email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const e = err as Error & { code?: string; response?: string; command?: string }
    const detail = e?.message ?? String(err)
    console.error('Contact API error:', detail)
    if (e?.code) console.error('Contact API error code:', e.code)
    if (e?.response) console.error('Contact API error response:', e.response)
    if (e?.command) console.error('Contact API error command:', e.command)

    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 })
  }
}
