import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const DarkModeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  const handleToggle = (): void => {
    toggleTheme()
  }

  return (
    <button
      onClick={handleToggle}
      className="relative w-14 h-7 rounded-full bg-line dark:bg-line transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-surface rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-ink-muted" />
        ) : (
          <Sun className="w-4 h-4 text-accent" />
        )}
      </div>
    </button>
  )
}

export default DarkModeToggle
