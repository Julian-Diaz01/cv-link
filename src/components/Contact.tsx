import React, { useState, useCallback } from 'react'
import { Github, Linkedin, Mail, LucideIcon } from 'lucide-react'
import { Profile } from '../types'
import { trackMetric } from '../utils/sentry'

interface ContactProps {
  profile: Profile
}

// Email obfuscation utilities
const encodeEmail = (email: string): string => {
  return btoa(email).split('').reverse().join('')
}

const decodeEmail = (encoded: string): string => {
  return atob(encoded.split('').reverse().join(''))
}

const obfuscateEmailDisplay = (email: string): string => {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  const maskedLocal =
    localPart.length > 2
      ? `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`
      : localPart
  return `${maskedLocal}@${domain}`
}

const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
}

const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [showFullEmail, setShowFullEmail] = useState(false)

  // Encode email for storage (not directly in HTML)
  const encodedEmail = encodeEmail(profile.email)

  const handleEmailClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      trackMetric('contact_button_click', { type: 'email' })
      const decodedEmail = decodeEmail(encodedEmail)
      window.location.href = `mailto:${decodedEmail}`
    },
    [encodedEmail],
  )

  const handleEmailDisplayClick = useCallback(() => {
    setShowFullEmail(true)
  }, [])

  const displayedEmail = showFullEmail
    ? profile.email
    : obfuscateEmailDisplay(profile.email)

  return (
    <section id="contact" className="py-section bg-ink text-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="font-display font-black uppercase leading-none mb-4 sm:mb-6"
          style={{
            fontStretch: '125%',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
          }}
        >
          Let's Work Together
        </h2>
        <p className="font-body text-lg mb-6 sm:mb-8 opacity-70">
          Have a project in mind? Let's create something.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
          <a
            href="#"
            onClick={handleEmailClick}
            className="font-mono text-sm bg-accent text-white px-6 py-3 border border-accent hover:bg-accent-strong transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </a>
          <a
            href="/julian_diaz_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm border border-surface/40 text-surface px-6 py-3 hover:border-surface transition-colors flex items-center justify-center gap-2"
            onClick={() =>
              trackMetric('cv_button_click', { location: 'contact_section' })
            }
          >
            CV.PDF
          </a>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
          <a
            href="#"
            onClick={handleEmailClick}
            className="font-mono text-xs flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            onMouseEnter={handleEmailDisplayClick}
          >
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="break-all">{displayedEmail}</span>
          </a>
        </div>

        <div className="flex gap-4 sm:gap-6 justify-center mt-8 sm:mt-10">
          {profile.socialLinks.map((social, index) => {
            const IconComponent = iconMap[social.icon] || Github

            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-surface/30 flex items-center justify-center hover:border-surface opacity-60 hover:opacity-100 transition"
                aria-label={social.name}
              >
                <IconComponent className="w-4 h-4" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Contact
