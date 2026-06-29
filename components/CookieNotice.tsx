'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-cookie-notice'

export default function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-notice" role="dialog" aria-labelledby="cookie-notice-title">
      <div className="cookie-notice-inner">
        <p id="cookie-notice-title" className="cookie-notice-text">
          Ce site charge la police Inter via Google Fonts.{' '}
          <Link href="/politique-confidentialite">J&apos;en parle ici</Link>.
        </p>
        <button type="button" className="cookie-notice-btn" onClick={dismiss}>
          Compris
        </button>
      </div>
    </div>
  )
}
