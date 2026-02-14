import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'business',
  title: '⚙️ Business Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Salon Name', type: 'string', initialValue: 'Brenda Salon' }),
    defineField({ name: 'tagline', title: 'Hero Tagline', type: 'string', description: 'e.g., Elegance in Every Strand' }),
    defineField({ name: 'aboutText', title: 'About Us Text', type: 'text', rows: 4 }),
    defineField({ name: 'whatsapp', title: 'WhatsApp Number (No +)', type: 'string' }),
    defineField({ name: 'location', title: 'Location Name', type: 'string' }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps Embed Link', type: 'url' }),
    defineField({ name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroVideo', title: 'Hero Video URL (Optional mp4)', type: 'url' }),

    // --- SIMPLIFIED WORKING HOURS ---
    defineField({
      name: 'workingHours',
      title: 'Working Hours',
      type: 'object',
      fields: [
        {
          name: 'days',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'day', title: 'Day (monday, tuesday, etc.)', type: 'string' },
              { name: 'label', title: 'Display Label (e.g. Monday)', type: 'string' },
              { name: 'closed', title: 'Closed All Day?', type: 'boolean', initialValue: false },
              { name: 'open', title: 'Opening Time', type: 'string', hidden: ({ parent }) => parent?.closed },
              { name: 'close', title: 'Closing Time', type: 'string', hidden: ({ parent }) => parent?.closed },
            ],
            preview: {
              select: { label: 'label', closed: 'closed', open: 'open', close: 'close' },
              prepare({ label, closed, open, close }) {
                return {
                  title: label,
                  subtitle: closed ? 'Closed' : `${open} – ${close}`
                }
              }
            }
          }]
        }
      ]
    }),

  // --- SOCIAL LINKS (store just username) ---
defineField({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'object',
  fields: [
    {
      name: 'instagram',
      title: 'Instagram',
      type: 'string',
      description: 'Enter your Instagram username (e.g., brendasalon)',
      placeholder: 'brendasalon',
    },
    {
      name: 'tiktok',
      title: 'TikTok',
      type: 'string',
      description: 'Enter your TikTok username (e.g., brendasalon)',
      placeholder: 'brendasalon',
    },
    {
      name: 'youtube',
      title: 'YouTube',
      type: 'string',
      description: 'Enter your YouTube channel ID or handle (e.g., @brendasalon)',
      placeholder: '@brendasalon',
    },
    {
      name: 'facebook',
      title: 'Facebook',
      type: 'string',
      description: 'Enter your Facebook page name (e.g., brendasalon)',
      placeholder: 'brendasalon',
    },
  ],
  options: { collapsible: true }
})
  ]
})