import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const ContactPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Show popup after 2 minutes (120000 milliseconds)
    timerRef.current = setTimeout(() => {
      setShowPopup(true)
    }, 1000 * 60) // 1 minute
  }

  useEffect(() => {
    // Start the initial timer
    startTimer()

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowPopup(false)
    // Restart the timer for the next cycle
    startTimer()
  }

  const handleContactClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
    handleDismiss()
  }

  if (!showPopup) {
    return null
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out flex flex-col items-end gap-2"
      style={{
        animation: 'slideUpFadeIn 0.5s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chat-bubble {
          position: relative;
          background: var(--color-ink);
          padding: 12px 16px;
        }
        .chat-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 80px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid var(--color-ink);
        }
      `}</style>

      {/* Chat Bubble */}
      <div className="chat-bubble relative">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-surface border border-line text-ink-muted hover:text-ink transition-colors"
          aria-label="Close popup"
        >
          <X className="w-3 h-3" />
        </button>
        <button
          onClick={handleContactClick}
          className="bg-accent text-white px-4 py-2 font-mono font-medium hover:bg-accent-strong transition-colors text-xs whitespace-nowrap"
        >
          Contact Me
        </button>
      </div>

      {/* Cat Image - Main */}
      <div className="relative">
        <img
          src="/cat.gif"
          alt="Cat"
          className="w-40 h-20 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  )
}

export default ContactPopup
