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

export interface ArtifactLink {
  href: string
  label: string
  kind?: 'external' | 'yamlDialog' | 'imageDialog'
}

export interface Artifact {
  id: string
  projectName: string
  title: string
  description: string
  thumbnailAlt: string
  thumbnailSrc: string
  links: ArtifactLink[]
  status?: ArtifactStatus
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
