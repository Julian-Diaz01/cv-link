import groq from 'groq'
import { Profile, SocialLink } from '../../types'
import { sanityClient } from './client'

interface SanityProfile {
  firstName?: string
  lastName?: string
  title?: string
  greeting?: string
  bio?: string
  bioImpersonal?: string
  location?: string
  email?: string
  website?: string
  yearsOfExperience?: number
  socialLinks?: SocialLink[]
}

const profileQuery = groq`*[_type == "profile"] | order(_updatedAt desc)[0]{
  firstName,
  lastName,
  title,
  greeting,
  bio,
  bioImpersonal,
  location,
  email,
  website,
  yearsOfExperience,
  socialLinks[]{
    name,
    url,
    icon
  }
}`

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isValidSocialLink = (
  value: Partial<SocialLink> | undefined | null,
): value is SocialLink =>
  Boolean(
    value &&
      isNonEmptyString(value.name) &&
      isNonEmptyString(value.url) &&
      isNonEmptyString(value.icon),
  )

const mapProfileFromSanity = (
  data: SanityProfile | null,
  fallback: Profile,
): Profile | null => {
  if (!data) return null
  if (
    !isNonEmptyString(data.firstName) ||
    !isNonEmptyString(data.lastName) ||
    !isNonEmptyString(data.title) ||
    !isNonEmptyString(data.greeting) ||
    !isNonEmptyString(data.bio) ||
    !isNonEmptyString(data.bioImpersonal) ||
    !isNonEmptyString(data.location) ||
    !isNonEmptyString(data.email) ||
    !isNonEmptyString(data.website) ||
    typeof data.yearsOfExperience !== 'number'
  ) {
    return null
  }

  return {
    ...fallback,
    firstName: data.firstName,
    lastName: data.lastName,
    title: data.title,
    greeting: data.greeting,
    bio: data.bio,
    bioImpersonal: data.bioImpersonal,
    location: data.location,
    email: data.email,
    website: data.website,
    yearsOfExperience: data.yearsOfExperience,
    socialLinks: Array.isArray(data.socialLinks)
      ? data.socialLinks.filter((item): item is SocialLink =>
          isValidSocialLink(item),
        )
      : fallback.socialLinks,
  }
}

export const getProfile = async (fallback: Profile): Promise<Profile> => {
  try {
    const sanityProfile = await sanityClient.fetch<SanityProfile | null>(
      profileQuery,
    )
    return mapProfileFromSanity(sanityProfile, fallback) ?? fallback
  } catch (error) {
    console.warn(
      'Unable to load profile from Sanity, using local fallback.',
      error,
    )
    return fallback
  }
}
