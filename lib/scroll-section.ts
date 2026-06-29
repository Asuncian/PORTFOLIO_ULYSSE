/** Lien vers une section de la page d'accueil (depuis / ou une sous-page). */
export function sectionHref(sectionId: string, onHome: boolean): string {
  return onHome ? `#${sectionId}` : `/#${sectionId}`
}

/** Scroll fiable vers une section (contourne les soucis de hash avec Next.js). */
export function navigateToSection(sectionId: string, onHome: boolean): void {
  if (!onHome) {
    window.location.assign(`/#${sectionId}`)
    return
  }

  if (sectionId === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.history.pushState(null, '', '#hero')
    return
  }

  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${sectionId}`)
    return
  }

  requestAnimationFrame(() => {
    const retry = document.getElementById(sectionId)
    if (retry) {
      retry.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `#${sectionId}`)
    }
  })
}

/** Au chargement, scroll vers le hash présent dans l'URL. */
export function scrollToInitialHash(): void {
  const id = window.location.hash.replace(/^#/, '')
  if (!id) return

  const run = () => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  run()
  requestAnimationFrame(run)
  window.setTimeout(run, 120)
}
