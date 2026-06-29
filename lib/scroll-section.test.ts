import { describe, expect, it } from 'vitest'
import { sectionHref } from '@/lib/scroll-section'

describe('sectionHref', () => {
  it('renvoie un hash local sur la page d\'accueil', () => {
    expect(sectionHref('contact', true)).toBe('#contact')
  })

  it('renvoie un hash vers l\'accueil depuis une sous-page', () => {
    expect(sectionHref('contact', false)).toBe('/#contact')
  })
})
