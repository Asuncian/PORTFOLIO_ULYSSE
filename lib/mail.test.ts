import { describe, expect, it } from 'vitest'
import { formatEmailAddress, parseEmailAddress, singleLine } from '@/lib/mail'

describe('parseEmailAddress', () => {
  it('parse une adresse seule', () => {
    expect(parseEmailAddress('user@example.com')).toEqual({ email: 'user@example.com' })
  })

  it('parse un format Nom <email>', () => {
    expect(parseEmailAddress('Jean <user@example.com>')).toEqual({
      name: 'Jean',
      email: 'user@example.com',
    })
  })

  it('rejette une adresse invalide', () => {
    expect(parseEmailAddress('not-valid')).toBeNull()
  })
})

describe('formatEmailAddress', () => {
  it('supprime les retours à la ligne du nom (anti-injection)', () => {
    const formatted = formatEmailAddress({
      name: 'Evil\r\nBcc: spam@evil.com',
      email: 'user@example.com',
    })
    expect(formatted).not.toMatch(/\r|\n/)
    expect(formatted).toContain('user@example.com')
  })
})

describe('singleLine', () => {
  it('supprime les sauts de ligne du sujet email', () => {
    expect(singleLine('Hello\nWorld\r\nTest')).toBe('Hello World Test')
  })
})
