import { isValidEmail, sanitizeText } from '@/lib/sanitize'

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 120,
  emailMax: 254,
  messageMin: 10,
  messageMax: 5000,
  bodyMaxBytes: 32_768,
} as const

export const CONTACT_RATE = {
  ipLimit: 5,
  ipWindowMs: 60_000,
  emailLimit: 3,
  emailWindowMs: 3_600_000,
} as const

export type ContactFields = {
  name: string
  email: string
  message: string
}

type ParseResult =
  | { ok: true; data: ContactFields; isBot: boolean }
  | { ok: false; error: string; status: number }

export function parseContactBody(body: Record<string, unknown>): ParseResult {
  const website = typeof body.website === 'string' ? body.website.trim() : ''
  if (website) {
    return { ok: true, data: { name: '', email: '', message: '' }, isBot: true }
  }

  if (body.consent !== true) {
    return {
      ok: false,
      error: 'Cochez la case confidentialité pour envoyer votre message.',
      status: 400,
    }
  }

  const name = typeof body.name === 'string' ? body.name : ''
  const email = typeof body.email === 'string' ? body.email : ''
  const message = typeof body.message === 'string' ? body.message : ''

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { ok: false, error: 'Nom, email et message sont requis.', status: 400 }
  }

  const cleanName = sanitizeText(name, CONTACT_LIMITS.nameMax)
  const cleanEmail = sanitizeText(email, CONTACT_LIMITS.emailMax).toLowerCase()
  const cleanMessage = sanitizeText(message, CONTACT_LIMITS.messageMax)

  if (cleanName.length < CONTACT_LIMITS.nameMin) {
    return { ok: false, error: 'Nom trop court.', status: 400 }
  }
  if (/[\r\n]/.test(cleanName) || /[\r\n]/.test(cleanEmail)) {
    return { ok: false, error: 'Requête invalide.', status: 400 }
  }
  if (!isValidEmail(cleanEmail)) {
    return { ok: false, error: 'Adresse email invalide.', status: 400 }
  }
  if (cleanMessage.length < CONTACT_LIMITS.messageMin) {
    return { ok: false, error: 'Message trop court.', status: 400 }
  }

  return {
    ok: true,
    isBot: false,
    data: { name: cleanName, email: cleanEmail, message: cleanMessage },
  }
}
