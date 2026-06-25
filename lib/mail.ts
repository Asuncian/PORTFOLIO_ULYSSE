import nodemailer, { type Transporter } from 'nodemailer'
import { isValidEmail } from '@/lib/sanitize'

let cachedTransporter: Transporter | null | undefined

export type ParsedEmail = { name?: string; email: string }

/** Accepte "Nom <email@domaine>" ou une adresse seule. */
export function parseEmailAddress(raw: string): ParsedEmail | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const named = trimmed.match(/^(.+?)\s*<([^>]+)>$/)
  if (named) {
    const email = named[2].trim()
    const name = named[1].trim().replace(/^["']|["']$/g, '')
    if (!isValidEmail(email)) return null
    return { name: name || undefined, email }
  }

  if (isValidEmail(trimmed)) return { email: trimmed }
  return null
}

export function formatEmailAddress({ name, email }: ParsedEmail): string {
  if (name) return `"${name.replace(/"/g, '')}" <${email}>`
  return email
}

export function singleLine(s: string): string {
  return s.replace(/[\r\n]+/g, ' ').trim()
}

function buildTransporter(): Transporter | null {
  const host = process.env.EMAIL_HOST?.trim()
  const portRaw = process.env.EMAIL_PORT?.trim()
  const user = process.env.EMAIL_HOST_USER?.trim()
  const pass = process.env.EMAIL_HOST_PASSWORD?.trim()

  if (!host || !portRaw || !user || !pass) {
    return null
  }

  const portNum = Number(portRaw)
  if (!Number.isFinite(portNum) || portNum < 1 || portNum > 65535) {
    console.error('Contact API: EMAIL_PORT invalide:', portRaw)
    return null
  }

  const isGmail =
    /^smtp\.gmail\.com$/i.test(host) || /^smtp\.googlemail\.com$/i.test(host)

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      pool: false,
    } as nodemailer.TransportOptions)
  }

  const isSecure = portRaw === '465'
  return nodemailer.createTransport({
    host,
    port: portNum,
    secure: isSecure,
    auth: { user, pass },
    tls: { rejectUnauthorized: true },
    ...(isSecure ? {} : { requireTLS: true }),
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    pool: false,
  } as nodemailer.TransportOptions)
}

export function getTransporter(): Transporter | null {
  if (cachedTransporter !== undefined) {
    return cachedTransporter
  }
  cachedTransporter = buildTransporter()
  return cachedTransporter
}

export function getFromAddress(): ParsedEmail | null {
  const raw = (process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_HOST_USER)?.trim()
  if (!raw) return null
  return parseEmailAddress(raw)
}

export function getToAddress(): ParsedEmail | null {
  const raw = process.env.CONTACT_TO_EMAIL?.trim()
  if (raw) return parseEmailAddress(raw)
  return getFromAddress()
}
