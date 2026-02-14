import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gallery',
  title: '📸 Gallery / Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Image Title',
      type: 'string',
      description: 'Optional – used for captions / alt text',
      validation: Rule => Rule.max(60)
    }),
    defineField({
      name: 'image',
      title: 'Portfolio Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Hair', 'Nails', 'Spa', 'Makeup', 'Treatments']
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
      title: 'title',
      media: 'image',
      category: 'category'
    },
    prepare({ title, media, category }) {
      return {
        title: title || 'Untitled',
        subtitle: category ? `📁 ${category}` : 'No category',
        media
      }
    }
  }
})