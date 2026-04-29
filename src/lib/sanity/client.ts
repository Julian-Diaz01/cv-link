import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-04-23'

console.log('projectId', projectId)
console.log('dataset', dataset)
console.log('apiVersion', apiVersion)

if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID. Add it to your .env.local before starting the app.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing VITE_SANITY_DATASET. Add it to your .env.local before starting the app.',
  )
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
