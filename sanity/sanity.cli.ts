import { defineCliConfig } from 'sanity/cli'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { config as loadEnv } from 'dotenv'

const envLocalPath = path.resolve(process.cwd(), '.env.local')
const envPath = path.resolve(process.cwd(), '.env')

if (existsSync(envLocalPath)) {
  loadEnv({ path: envLocalPath })
}

if (existsSync(envPath)) {
  loadEnv({ path: envPath, override: false })
}

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'tpqkk0f3'
const dataset = process.env.VITE_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID. Add it to your .env.local before using Sanity CLI commands.',
  )
}

if (!dataset) {
  throw new Error(
    'Missing VITE_SANITY_DATASET. Add it to your .env.local before using Sanity CLI commands.',
  )
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
