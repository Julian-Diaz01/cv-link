import { defineArrayMember, defineField, defineType } from 'sanity'

export const languageType = defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Language Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Language level Description',
      type: 'string',
      description: 'e.g. "Native", "Fluent", "B1 certified", etc.',
      options: {
        list: [
          { title: 'Native', value: 'native' },
          { title: 'Fluent', value: 'fluent' },
          { title: 'B2', value: 'b2' },
          { title: 'B1', value: 'b1' },
          { title: 'A2', value: 'a2' },
          { title: 'A1', value: 'a1' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customDescription',
      title: 'Custom Description (other)',
      type: 'string',
      hidden: ({ parent }) => parent?.description !== 'other',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { description?: string } | undefined
          return parent?.description === 'other' && !value
            ? 'Custom description is required when description is "other".'
            : true
        }),
    }),
    defineField({
      name: 'chips',
      title: 'Language Chips',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
})
