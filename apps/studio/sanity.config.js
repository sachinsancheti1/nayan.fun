import {defineConfig} from 'sanity'
import {deskStructure} from './deskStructure'
import {dashboardConfig} from './dashboardConfig'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export const projectId = process.env.VITE_SANITY_PROJECT_ID || 'j0ml5s7u'
console.log('Project ID:', projectId)

export default defineConfig({
  name: 'default',
  title: 'nayan-fun-studio',
  projectId,
  dataset: 'production',
  plugins: [dashboardConfig, deskStructure, visionTool()],
  schema: {
    types: schemaTypes,
  },
})
