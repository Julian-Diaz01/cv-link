import groq from 'groq'
import { Language } from '../../types'
import { sanityClient } from './client'

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

interface SanityLanguage {
  name?: string
  description?: string
  customDescription?: string
  chips?: string[]
}

const languagesQuery = groq`*[_type == "language"] | order(_updatedAt asc){
    name,
    description,
    customDescription,
    chips
  }`

const mapLanguageFromSanity = (item: SanityLanguage): Language | null => {
  if (!isNonEmptyString(item.name) || !Array.isArray(item.chips)) {
    return null
  }

  const normalizedDescription =
    item.description === 'other' ? item.customDescription : item.description

  if (!isNonEmptyString(normalizedDescription)) {
    return null
  }

  return {
    name: item.name,
    description:
      normalizedDescription.slice(0, 1).toUpperCase() +
      normalizedDescription.slice(1),
    chips: item.chips,
  }
}

export const getLanguages = async (
  fallback: Language[],
): Promise<Language[]> => {
  try {
    const sanityLanguages =
      await sanityClient.fetch<SanityLanguage[]>(languagesQuery)

    if (!Array.isArray(sanityLanguages) || sanityLanguages.length === 0) {
      return fallback
    }

    const validLanguages = sanityLanguages
      .map(mapLanguageFromSanity)
      .filter((item): item is Language => item !== null)

    return validLanguages.length > 0 ? validLanguages : fallback
  } catch (error) {
    console.warn(
      'Unable to load languages from Sanity, using local fallback.',
      error,
    )
    return fallback
  }
}
