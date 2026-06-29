import BrandName from '@/components/BrandName'

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">
        <BrandName variant="footer" />
      </div>
      <div className="footer-contacts">
        <a href="mailto:gomingjobertulysse@gmail.com" className="footer-contact footer-contact--mail">
          <MailIcon />
          gomingjobertulysse@gmail.com
        </a>
        <a href="tel:0645003007" className="footer-contact footer-contact--tel">
          <PhoneIcon />
          06 45 00 30 07
        </a>
        <a
          href="https://linkedin.com/in/ulysse-goming-jobert-256251254"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-contact footer-contact--linkedin"
        >
          <LinkedInIcon />
          LinkedIn
        </a>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Ulysse Goming-Jobert
        {' · '}
        <a href="/mentions-legales" className="footer-legal-link">Mentions légales</a>
        {' · '}
        <a href="/politique-confidentialite" className="footer-legal-link">Confidentialité</a>
      </p>
    </footer>
  )
}
