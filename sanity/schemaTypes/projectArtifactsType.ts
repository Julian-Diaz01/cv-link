import { defineArrayMember, defineField, defineType } from 'sanity'

const artifactFields = [
  defineField({
    name: 'title',
    title: 'Artifact Title',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Artifact Description',
    type: 'text',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'thumbnailAlt',
    title: 'Artifact Thumbnail Alt',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'thumbnailImage',
    title: 'Artifact Thumbnail Image',
    type: 'image',
    description: 'Upload and store the artifact image in Sanity.',
    options: { hotspot: true },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'kind',
    title: 'Type',
    type: 'string',
    options: {
      list: [
        { title: 'External', value: 'external' },
        { title: 'YAML Dialog', value: 'yamlDialog' },
        { title: 'Image Dialog', value: 'imageDialog' },
      ],
      layout: 'dropdown',
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'href',
    title: 'Artifact Link/Path',
    type: 'string',
    hidden: ({ parent }) => parent?.kind !== 'external',
    validation: (rule) =>
      rule.custom((value, context) => {
        const parent = context.parent as { kind?: string } | undefined
        if (parent?.kind === 'external' && !value) {
          return 'Href is required when kind is external.'
        }
        return true
      }),
  }),
  defineField({
    name: 'status',
    title: 'Status',
    type: 'string',
    options: {
      list: [
        { title: 'Planned', value: 'planned' },
        { title: 'In Progress', value: 'inProgress' },
        { title: 'Ready', value: 'ready' },
      ],
      layout: 'dropdown',
    },
    validation: (rule) => rule.required(),
  }),
]

export const projectArtifactsType = defineType({
  name: 'projectArtifacts',
  title: 'Project Artifacts',
  type: 'document',
  fields: [
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artifacts',
      title: 'Artifacts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: artifactFields,
          preview: {
            select: { title: 'title', subtitle: 'status' },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})
