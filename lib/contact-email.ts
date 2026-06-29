import type { ContactFields } from '@/lib/contact'
import { escapeHtml } from '@/lib/sanitize'
import { singleLine } from '@/lib/mail'

export function buildContactNotificationEmail({ name, email, message }: ContactFields) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const subject = singleLine(`Message portfolio · ${name}`)

  const text = [
    'Nouveau message depuis le portfolio',
    '',
    `Nom : ${name}`,
    `Email : ${email}`,
    '',
    'Message :',
    message,
    '',
    'Répondez directement à cet email pour contacter la personne.',
  ].join('\n')

  const safeSubject = escapeHtml(subject)

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background:#010108;font-family:Inter,Segoe UI,system-ui,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#010108;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:linear-gradient(165deg,#0a1028 0%,#040612 100%);border:1px solid rgba(77,136,255,.18);border-radius:16px;">
          <tr>
            <td style="padding:28px 28px 20px;border-bottom:1px solid rgba(77,136,255,.12);">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#4d88ff;font-weight:600;">Portfolio · Contact</p>
              <h1 style="margin:0;font-size:20px;font-weight:700;color:#f0f4fc;line-height:1.3;">Nouveau message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:rgba(200,216,240,.75);">
                <span style="color:rgba(200,216,240,.45);">De</span><br>
                <strong style="color:#eef4ff;">${safeName}</strong><br>
                <a href="mailto:${safeEmail}" style="color:#4d88ff;text-decoration:none;">${safeEmail}</a>
              </p>
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(147,197,253,.65);">Message</p>
              <div style="padding:16px 18px;border-radius:12px;background:rgba(22,80,240,.06);border:1px solid rgba(77,136,255,.14);font-size:14px;line-height:1.75;color:rgba(215,225,245,.88);word-break:break-word;overflow-wrap:anywhere;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(180,192,218,.45);">
                Répondez à cet email pour joindre ${safeName} directement.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, text, html }
}
