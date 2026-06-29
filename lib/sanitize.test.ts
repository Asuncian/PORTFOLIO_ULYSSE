import { describe, expect, it } from 'vitest'
import { escapeHtml, isValidEmail, sanitizeText } from '@/lib/sanitize'

describe('sanitizeText', () => {
  it('supprime les caractères de contrôle', () => {
    expect(sanitizeText('hello\x00world', 100)).toBe('helloworld')
  })

  it('applique trim et limite de longueur', () => {
    expect(sanitizeText('  abc  ', 2)).toBe('ab')
  })
})

describe('isValidEmail', () => {
  it('accepte un email valide', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('rejette un email sans domaine', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })

  it('rejette les retours à la ligne (injection en-têtes)', () => {
    expect(isValidEmail('user@example.com\nBcc: evil@hack.com')).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('échappe les caractères HTML dangereux', () => {
    expect(escapeHtml('<script>"\'&</script>')).toBe(
      '&lt;script&gt;&quot;&#39;&amp;&lt;/script&gt;',
    )
  })
})
