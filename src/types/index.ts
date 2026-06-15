export interface Link {
  title: string
  url: string
}

export interface Job {
  monthYearRange: string
  title: string
  subTitle: string
  cardLink: string
  description: string
  chips: string[]
  links?: Link[]
  projectId?: string
}

export interface ProjectLink {
  title: string
  url: string
  kind?: 'live' | 'repo' | 'figma' | 'store' | 'other'
}

export interface ProjectImage {
  src: string
  alt: string
}

export interface Project {
  id: string
  name: string
  shortTitle: string
  tagline: string
  narrative: string[]
  role: string
  company: string
  companyUrl: string
  period: string
  techStack: string[]
  links: ProjectLink[]
  heroImage: ProjectImage
  artifacts: Artifact[]
  jobRef?: string
}

export interface Education {
  monthYearRange: string
  title: string
  subTitle: string
  cardLink: string
  description: string
  chips: string[]
  links?: Link[]
}

export interface Language {
  name: string
  description: string
  chips: string[]
}

export interface Service {
  icon: string
  title: string
  description: string
  chips: string[]
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export type ArtifactStatus = 'planned' | 'inProgress' | 'ready'

export type ArtifactKind = 'external' | 'yamlDialog' | 'imageDialog'

export interface Artifact {
  title: string
  description: string
  thumbnailAlt: string
  thumbnailSrc: string
  href?: string
  kind: ArtifactKind
  status: ArtifactStatus
}

export interface Profile {
  firstName: string
  lastName: string
  title: string
  greeting: string
  bio: string
  bioImpersonal: string
  location: string
  email: string
  website: string
  yearsOfExperience: number
  projectsCompleted: number
  socialLinks: SocialLink[]
}
