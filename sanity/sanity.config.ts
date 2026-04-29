import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'tpqkk0f3'
const dataset = process.env.VITE_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID. Add it to your .env.local before running Sanity Studio.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing VITE_SANITY_DATASET. Add it to your .env.local before running Sanity Studio.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'G-Link CMS',
  projectId,
  dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
