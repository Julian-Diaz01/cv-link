import React, { useEffect, useRef, useState } from 'react'
import { Project } from '../../types'

interface ProjectRailProps {
  projects: Project[]
}

const ProjectRail: React.FC<ProjectRailProps> = ({ projects }) => {
  const [activeId, setActiveId] = useState<string>(projects[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace('project-', ''))
            break
          }
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )

    const targets = projects.map((p) =>
      document.getElementById(`project-${p.id}`),
    )
    for (const target of targets) {
      if (target) observerRef.current.observe(target)
    }

    return () => observerRef.current?.disconnect()
  }, [projects])

  return (
    <aside className="hidden xl:flex flex-col gap-0.5 sticky top-24 self-start w-40 shrink-0 pt-4">
      <span className="font-mono text-[10px] text-ink-subtle mb-4 uppercase tracking-widest">
        Drawings
      </span>
      {projects.map((project, i) => (
        <a
          key={project.id}
          href={`#project-${project.id}`}
          className={`flex items-center gap-2 font-mono text-xs py-2 border-l-2 pl-3 transition-colors ${
            activeId === project.id
              ? 'border-accent text-accent'
              : 'border-line text-ink-subtle hover:text-ink hover:border-ink-subtle'
          }`}
        >
          <span className="text-[10px] shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          {project.shortTitle}
        </a>
      ))}
    </aside>
  )
}

export default ProjectRail
