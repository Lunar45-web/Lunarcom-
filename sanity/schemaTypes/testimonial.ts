import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: '⭐ Client Reviews',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', title: 'Client Name', type: 'string' }),
    defineField({ name: 'quote', title: 'Review Quote', type: 'text', rows: 3 }),
    defineField({ name: 'serviceTaken', title: 'Service Booked', type: 'string' }),
    defineField({ name: 'rating', title: 'Stars (1-5)', type: 'number', initialValue: 5 })
  ]
})