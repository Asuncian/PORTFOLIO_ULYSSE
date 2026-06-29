import { describe, expect, it } from 'vitest'
import { CONTACT_LIMITS, parseContactBody } from '@/lib/contact'

const validPayload = {
  name: 'Jean Dupont',
  email: 'jean@example.com',
  message: 'Bonjour, je souhaite un devis pour un site vitrine.',
  consent: true,
  website: '',
}

describe('parseContactBody', () => {
  it('accepte une requête valide', () => {
    const result = parseContactBody(validPayload)
    expect(result.ok).toBe(true)
    if (result.ok && !result.isBot) {
      expect(result.data.email).toBe('jean@example.com')
    }
  })

  it('rejette sans consentement RGPD', () => {
    const result = parseContactBody({ ...validPayload, consent: false })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(400)
      expect(result.error).toMatch(/confidentialité/i)
    }
  })

  it('ignore silencieusement les bots (honeypot)', () => {
    const result = parseContactBody({ ...validPayload, website: 'http://spam.bot' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.isBot).toBe(true)
  })

  it('rejette les injections CRLF dans le nom', () => {
    const result = parseContactBody({
      ...validPayload,
      name: 'Evil\r\nBcc: spam@evil.com',
    })
    expect(result.ok).toBe(false)
  })

  it('tronque au-delà de messageMax', () => {
    const longMessage = 'a'.repeat(CONTACT_LIMITS.messageMax + 50)
    const result = parseContactBody({ ...validPayload, message: longMessage })
    expect(result.ok).toBe(true)
    if (result.ok && !result.isBot) {
      expect(result.data.message.length).toBe(CONTACT_LIMITS.messageMax)
    }
  })

  it('rejette un message trop court', () => {
    const result = parseContactBody({ ...validPayload, message: 'court' })
    expect(result.ok).toBe(false)
  })
})
