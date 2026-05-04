import groq from 'groq'
import {
  ArtifactKind,
  ArtifactStatus,
  ProjectArtifactsGroup,
} from '../../src/types'
import { sanityClient } from './client'

interface SanityArtifacts {
  _id: string
  projectName: string
  shortTitle: string
  description: string
  artifacts: Artifact[]
}

interface Artifact {
  title: string
  description: string
  thumbnailAlt: string
  thumbnailSrc: string
  href?: string
  kind: ArtifactKind
  status: ArtifactStatus
}

const artifactsQuery = groq`*[_type == "projectArtifacts"] | order(_updatedAt desc){
  _id,
  projectName,
  shortTitle,
  description,
  artifacts[]{
    title,
    description,
    thumbnailAlt,
    "thumbnailSrc": thumbnailImage.asset->url,
    href,
    kind,
    status
  }
}`

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const mapArtifactsFromSanity = (
  data: SanityArtifacts[] | null,
): ProjectArtifactsGroup[] | null => {
  if (!data || !Array.isArray(data) || data.length === 0) return null

  const mapped = data
    .filter(
      (item) =>
        isNonEmptyString(item.projectName) &&
        isNonEmptyString(item.shortTitle) &&
        isNonEmptyString(item.description) &&
        Array.isArray(item.artifacts) &&
        item.artifacts.length > 0,
    )
    .map((item) => ({
      id: item._id,
      projectName: item.projectName,
      shortTitle: item.shortTitle,
      description: item.description,
      artifacts: item.artifacts,
    }))

  return mapped.length > 0 ? mapped : null
}

export const getArtifactsFromCms = async (): Promise<
  ProjectArtifactsGroup[] | null
> => {
  try {
    const sanityArtifacts = await sanityClient.fetch<SanityArtifacts[] | null>(
      artifactsQuery,
    )
    return mapArtifactsFromSanity(sanityArtifacts)
  } catch (error) {
    console.warn('Unable to load artifacts from Sanity.', error)
    return null
  }
}
