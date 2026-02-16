import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Customer Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'reviewerName',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5),
      options: {
        list: [
          { title: '⭐', value: 1 },
          { title: '⭐⭐', value: 2 },
          { title: '⭐⭐⭐', value: 3 },
          { title: '⭐⭐⭐⭐', value: 4 },
          { title: '⭐⭐⭐⭐⭐', value: 5 }
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'reviewText',
      title: 'Review',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'serviceReceived',
      title: 'Service Received (optional)',
      type: 'string'
    }),
    defineField({
      name: 'reviewDate',
      title: 'Date Submitted',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Approval', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' }
        ],
        layout: 'radio'
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Website Form', value: 'website' },
          { title: 'In-Person', value: 'inperson' },
          { title: 'WhatsApp', value: 'whatsapp' }
        ]
      },
      initialValue: 'website'
    })
  ],
  preview: {
    select: {
      title: 'reviewerName',
      subtitle: 'rating',
      status: 'status'
    },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: `${subtitle} stars – ${status}`,
      }
    }
  }
})