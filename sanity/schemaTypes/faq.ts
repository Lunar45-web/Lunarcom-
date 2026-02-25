import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: '❓ FAQs',
  type: 'document',
  fields: [
    // --- MULTI-TENANT LINK ---
    defineField({
      name: 'salon',
      title: 'Belongs to Salon',
      type: 'reference',
      to: [{ type: 'salon' }],
      validation: Rule => Rule.required(),
    }),

    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3 })
  ]
})