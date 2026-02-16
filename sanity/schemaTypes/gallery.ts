import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gallery',
  title: '📸 Gallery / Lookbook',
  type: 'document',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: '📷 Image', value: 'image' },
          { title: '🎥 Video', value: 'video' }
        ],
        layout: 'radio'
      },
      initialValue: 'image',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility'
        }
      ]
    }),
    defineField({
      name: 'video',
      title: 'Video URL',
      type: 'url',
      description: 'MP4 or WebM video URL (will loop automatically)',
      hidden: ({ parent }) => parent?.mediaType === 'image',
      validation: Rule => Rule.uri({ scheme: ['http', 'https'] })
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'A brief caption (e.g., "Balayage Masterpiece")',
      validation: Rule => Rule.max(60)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Hair', 'Nails', 'Spa', 'Makeup', 'Treatments', 'Styling']
      }
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: Rule => Rule.min(0).integer()
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'description',
      mediaType: 'mediaType',
      image: 'image',
      category: 'category'
    },
    prepare({ title, mediaType, image, category }) {
      return {
        title: title || 'Untitled',
        subtitle: `${mediaType === 'video' ? '🎥' : '📷'} ${category || 'No category'}`,
        media: mediaType === 'image' ? image : undefined
      }
    }
  }
})