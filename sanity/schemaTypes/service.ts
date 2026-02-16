import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: '💇 Services Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name',
      type: 'string',
      validation: Rule => Rule.required().error('Service name is required')
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isActive',
      title: 'Active?',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Hair', 'Nails', 'Spa', 'Treatments']
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description (Card)',
      type: 'text',
      rows: 2,
      description: 'The short summary shown on the home page cards (max 200 chars)',
      validation: Rule => Rule.required().max(200)
    }),
    // NEW: Full Rich Text Description
    defineField({
      name: 'fullDescription',
      title: 'Full Description (Page)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The long, detailed explanation of the service.'
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g., 3500 (Just the number)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., 60 (Minutes) or "2 Hours"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Card Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    // NEW: Service Gallery (Images & Videos)
    defineField({
      name: 'gallery',
      title: 'Service Gallery',
      description: 'Add extra images or videos specifically for this service page',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            {
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' }
                ],
                layout: 'radio'
              },
              initialValue: 'image'
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              hidden: ({ parent }) => parent?.mediaType === 'video'
            },
            {
              name: 'videoUrl',
              title: 'Video URL',
              type: 'url',
              description: 'Link to MP4/WebM video',
              hidden: ({ parent }) => parent?.mediaType === 'image'
            }
          ],
          preview: {
            select: {
              mediaType: 'mediaType',
              image: 'image'
            },
            prepare({ mediaType, image }) {
              return {
                title: mediaType === 'video' ? '🎥 Video' : '📷 Image',
                media: mediaType === 'image' ? image : undefined
              }
            }
          }
        }
      ]
    })
  ]
})