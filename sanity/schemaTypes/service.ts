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
      validation: Rule => Rule.required().error('Please select a category')
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required().max(200).error('Keep it short and descriptive')
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'e.g., KES 3,500',
      validation: Rule => Rule.required().error('Price is required')
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., 2 Hours',
      validation: Rule => Rule.required().error('Duration is required')
    }),
    defineField({
      name: 'mainImage',
      title: 'Service Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required().error('Main image is required')
    })
  ]
})