'use client'

import { CONTACT_LIMITS } from '@/lib/contact'
import { FormEvent, useRef, useState } from 'react'

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const ERROR_FALLBACK = "L'envoi a échoué. Vous pouvez aussi m'écrire directement par email."
const ERROR_UNAVAILABLE = 'Le formulaire est temporairement indisponible. Écrivez-moi directement par email.'

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return

    const form = formRef.current
    if (!form) return

    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const website = String(data.get('website') ?? '').trim()

    if (website) return

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      })

      const payload = await res.json().catch(() => ({})) as { error?: string }

      if (!res.ok) {
        setStatus('error')
        const fallback = res.status === 503 ? ERROR_UNAVAILABLE : ERROR_FALLBACK
        setErrorMsg(typeof payload.error === 'string' ? payload.error : fallback)
        return
      }

      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg('Connexion impossible. Réessayez ou contactez-moi par email.')
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setErrorMsg('')
    formRef.current?.reset()
  }

  return (
    <section id="contact">
      <div className="contact-wrap">

        <div className="section-header reveal-contact" style={{ marginBottom: '3rem' }}>
          <p className="section-tag">Contact</p>
          <h2 className="section-title">On se <em>parle ?</em></h2>
          <p className="section-sub">
            Un projet, une question, ou juste envie d'échanger : écrivez-moi, je réponds vite.
          </p>
        </div>

        <div className="contact-chips">
          <a href="tel:0645003007" className="contact-chip contact-chip--tel">
            <PhoneIcon />
            06 45 00 30 07
          </a>
          <a href="mailto:gomingjobertulysse@gmail.com" className="contact-chip contact-chip--mail">
            <MailIcon />
            gomingjobertulysse@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/ulysse-goming-jobert-256251254"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-chip contact-chip--linkedin"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
        </div>

        <p className="contact-status">
          <span className="contact-status-dot" aria-hidden="true" />
          Disponible pour en discuter. Je lis tout et je réponds sous 24 h.
        </p>

        <div className="contact-form-block reveal-contact-form">
          <div className="contact-form-header">
            <p className="contact-form-tag">Écrivez-moi</p>
            <h3 className="contact-form-title">Parlez-moi de votre projet</h3>
            <p className="contact-form-sub">Quelques lignes suffisent pour démarrer.</p>
          </div>

        <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="ff-hp" aria-hidden="true">
            <label htmlFor="website">Site web</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="ff">
            <input
              id="nom"
              name="name"
              type="text"
              placeholder=" "
              required
              minLength={CONTACT_LIMITS.nameMin}
              maxLength={CONTACT_LIMITS.nameMax}
              autoComplete="name"
              disabled={status === 'sending'}
            />
            <label htmlFor="nom">Votre nom</label>
            <span className="ff-line" aria-hidden />
          </div>

          <div className="ff">
            <input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              required
              maxLength={CONTACT_LIMITS.emailMax}
              autoComplete="email"
              inputMode="email"
              disabled={status === 'sending'}
            />
            <label htmlFor="email">Votre email</label>
            <span className="ff-line" aria-hidden />
          </div>

          <div className="ff ff-area">
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder=" "
              required
              minLength={CONTACT_LIMITS.messageMin}
              maxLength={CONTACT_LIMITS.messageMax}
              disabled={status === 'sending'}
            />
            <label htmlFor="message">Votre message</label>
            <span className="ff-line" aria-hidden />
          </div>

          {status === 'error' && (
            <p className="form-feedback form-feedback-error" role="alert">{errorMsg}</p>
          )}
          {status === 'sent' && (
            <p className="form-feedback form-feedback-ok" role="status">
              Message envoyé. Je vous réponds dès que je peux.
            </p>
          )}

          <div className="form-actions">
            <button type="submit" className="form-submit" disabled={status === 'sending' || status === 'sent'}>
              {status === 'sending' ? 'Envoi en cours' : 'Envoyer'}
              <SendIcon />
            </button>
            {status === 'sent' && (
              <button type="button" className="form-reset" onClick={resetForm}>
                Envoyer un autre message
              </button>
            )}
          </div>
        </form>
        </div>

      </div>
    </section>
  )
}
