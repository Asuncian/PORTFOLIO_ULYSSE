import { describe, expect, it } from 'vitest'
import { buildContactNotificationEmail } from '@/lib/contact-email'

describe('buildContactNotificationEmail', () => {
  it('inclut le message complet en texte brut', () => {
    const message = 'Ligne 1\nLigne 2 avec <html> & "quotes"'
    const { text, html } = buildContactNotificationEmail({
      name: 'Test',
      email: 'test@example.com',
      message,
    })

    expect(text).toContain(message)
    expect(html).toContain('Ligne 1<br>Ligne 2')
    expect(html).not.toContain('<html>')
    expect(html).toContain('&lt;html&gt;')
  })

  it('neutralise le XSS dans le sujet HTML', () => {
    const { html } = buildContactNotificationEmail({
      name: '<script>alert(1)</script>',
      email: 'test@example.com',
      message: 'Message de test suffisamment long.',
    })

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
