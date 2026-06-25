'use client'

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

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-wrap">

        <div className="section-header reveal" style={{ marginBottom: '3rem' }}>
          <p className="section-tag">Contact</p>
          <h2 className="section-title">On se <em>parle ?</em></h2>
          <p className="section-sub">
            Une proposition d'alternance, une question, ou juste l'envie d'échanger ? Écrivez-moi, je réponds vite.
          </p>
        </div>

        {/* Chips de contact */}
        <div className="contact-chips">
          <a href="tel:0645003007" className="contact-chip">
            <PhoneIcon />
            06 45 00 30 07
          </a>
          <a href="mailto:gomingjobertulysse@gmail.com" className="contact-chip">
            <MailIcon />
            gomingjobertulysse@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/ulysse-goming-jobert-256251254"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-chip"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <span className="contact-chip contact-chip-avail">
            <span className="avail-dot" aria-hidden="true" />
            Disponible en alternance
          </span>
        </div>

        {/* Formulaire épuré, labels flottants */}
        <form className="contact-form" onSubmit={e => e.preventDefault()}>
          <div className="ff">
            <input id="nom" type="text" placeholder=" " required />
            <label htmlFor="nom">Votre nom</label>
            <span className="ff-line" aria-hidden />
          </div>

          <div className="ff">
            <input id="email" type="email" placeholder=" " required />
            <label htmlFor="email">Votre email</label>
            <span className="ff-line" aria-hidden />
          </div>

          <div className="ff ff-area">
            <textarea id="message" rows={4} placeholder=" " required />
            <label htmlFor="message">Votre message</label>
            <span className="ff-line" aria-hidden />
          </div>

          <button type="submit" className="form-submit">
            Envoyer
            <SendIcon />
          </button>
        </form>

      </div>
    </section>
  )
}
