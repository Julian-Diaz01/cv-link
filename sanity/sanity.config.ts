/// <reference types="vite/client" />

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemaTypes'

const env = import.meta.env as Record<string, string | undefined>
const projectId = env.SANITY_STUDIO_PROJECT_ID ?? env.VITE_SANITY_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET ?? env.VITE_SANITY_DATASET

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID (or VITE_SANITY_PROJECT_ID',
  )
}

if (!dataset) {
  throw new Error(
    'Missing SANITY_STUDIO_DATASET (or VITE_SANITY_DATASET)',
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
