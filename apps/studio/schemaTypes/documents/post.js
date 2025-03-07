import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'blockContent', // Make sure you have a blockContent schema defined.
      description: 'The main content of the post',
    }),
    defineField({
      name: 'publishedOn',
      title: 'Published On',
      type: 'datetime',
      description: 'Publish date of the post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Images for the post',
      of: [
        {
          type: 'figure',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for the post',
      of: [{type: 'string'}],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedOn',
      media: 'images.0.asset',
    },
    prepare(selection) {
      return {...selection}
    },
  },
})
