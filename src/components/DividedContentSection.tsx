import React from 'react'

interface DividedContentSectionProps {
  title: string
  children: React.ReactNode
  description?: string
  className?: string
}

const DividedContentSection: React.FC<DividedContentSectionProps> = ({
  title,
  children,
  description,
  className = '',
}) => {
  return (
    <section
      aria-label={title}
      className={`border-t border-slate-200 pt-8 first:border-t-0 first:pt-0 dark:border-slate-700 ${className}`}
    >
      <header className="mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  )
}

export default DividedContentSection
