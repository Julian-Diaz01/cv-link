import React from 'react'

interface SectionHeadingProps {
  label: string
  id?: string
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label, id }) => (
  <div className="mb-8 flex items-center gap-4">
    <h2
      id={id}
      className="font-mono text-xs uppercase tracking-widest text-ink-subtle shrink-0"
    >
      {label}
    </h2>
    <div className="flex-1 border-t border-line" />
  </div>
)

export default SectionHeading
