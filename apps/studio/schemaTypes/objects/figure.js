import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'figure',
  title: 'Figure',
  type: 'image',
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternate text',
      description: 'Important for SEO and accessiblity.',
      validation: (Rule) => Rule.error('You have to fill out the alternative text.').required(),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'asset',
      status: 'featured',
    },
    prepare: ({title, media, status}) => {
      const EMOJIS = {
        true: '✅',
        false: '🚫',
      }
      return {
        title: title,
        subtitle: `Featured : ${EMOJIS[status]} `,
        media: media,
      }
    },
  },
})
