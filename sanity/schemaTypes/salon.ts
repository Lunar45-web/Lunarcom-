import { defineField, defineType } from 'sanity'
import { Store } from 'lucide-react'

export default defineType({
  name: 'salon',
  title: 'Salons',
  type: 'document',
  icon: Store,
  fields: [
    // --- 1. MULTI-TENANT IDENTITY ---
    defineField({ name: 'name', title: 'Salon Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 } }),
    defineField({ name: 'domain', title: 'Domain', type: 'string', description: 'e.g., emma.co.ke' }),
    defineField({ name: 'premium', title: 'Premium Plan Active', type: 'boolean', initialValue: false }),

    // --- 2. BRANDING & DESIGN ---
    defineField({ name: 'tagline', title: 'Hero Tagline', type: 'string', description: 'e.g., Elegance in Every Strand' }),
    defineField({ name: 'primaryColor', title: 'Primary Color (Hex)', type: 'string', initialValue: '#D4AF37' }),
    defineField({ name: 'secondaryColor', title: 'Secondary Color (Hex)', type: 'string', initialValue: '#000000' }),
    defineField({ name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroVideo', title: 'Hero Video URL (Optional mp4)', type: 'url' }),

    // --- 3. CONTACT & LOCATION ---
    defineField({ name: 'whatsapp', title: 'WhatsApp Number (No +)', type: 'string' }),
    defineField({ name: 'location', title: 'Location Name (Display)', type: 'string', description: 'What users see (e.g. Embu Town)' }),
    defineField({
      name: 'mapQuery',
      title: 'Map Search Query',
      type: 'string',
      description: 'The exact name for Google Maps search (e.g., Wanjau Technical Institute). If left empty, it uses Location Name.'
    }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps Embed Link', type: 'url' }),

    // --- 4. EXACT WORKING HOURS ---
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
              { 
                name: 'day', 
                title: 'Day of Week', 
                type: 'string',
                options: {
                  list: [
                    { title: 'Monday', value: 'monday' },
                    { title: 'Tuesday', value: 'tuesday' },
                    { title: 'Wednesday', value: 'wednesday' },
                    { title: 'Thursday', value: 'thursday' },
                    { title: 'Friday', value: 'friday' },
                    { title: 'Saturday', value: 'saturday' },
                    { title: 'Sunday', value: 'sunday' },
                  ]
                },
                validation: Rule => Rule.required()
              },
              { 
                name: 'closed', 
                title: 'Closed All Day?', 
                type: 'boolean', 
                initialValue: false 
              },
              { 
                name: 'open', 
                title: 'Opening Time', 
                type: 'string',
                hidden: ({ parent }) => parent?.closed,
                options: {
                  list: [
                    { title: '6:00 AM', value: '06:00' }, { title: '6:30 AM', value: '06:30' },
                    { title: '7:00 AM', value: '07:00' }, { title: '7:30 AM', value: '07:30' },
                    { title: '8:00 AM', value: '08:00' }, { title: '8:30 AM', value: '08:30' },
                    { title: '9:00 AM', value: '09:00' }, { title: '9:30 AM', value: '09:30' },
                    { title: '10:00 AM', value: '10:00' }, { title: '10:30 AM', value: '10:30' },
                    { title: '11:00 AM', value: '11:00' }, { title: '11:30 AM', value: '11:30' },
                    { title: '12:00 PM', value: '12:00' }, { title: '12:30 PM', value: '12:30' },
                    { title: '1:00 PM', value: '13:00' }, { title: '1:30 PM', value: '13:30' },
                    { title: '2:00 PM', value: '14:00' }, { title: '2:30 PM', value: '14:30' },
                    { title: '3:00 PM', value: '15:00' }, { title: '3:30 PM', value: '15:30' },
                    { title: '4:00 PM', value: '16:00' }, { title: '4:30 PM', value: '16:30' },
                    { title: '5:00 PM', value: '17:00' }, { title: '5:30 PM', value: '17:30' },
                    { title: '6:00 PM', value: '18:00' }, { title: '6:30 PM', value: '18:30' },
                    { title: '7:00 PM', value: '19:00' }, { title: '7:30 PM', value: '19:30' },
                    { title: '8:00 PM', value: '20:00' }, { title: '8:30 PM', value: '20:30' },
                    { title: '9:00 PM', value: '21:00' }, { title: '9:30 PM', value: '21:30' },
                    { title: '10:00 PM', value: '22:00' }, { title: '10:30 PM', value: '22:30' },
                    { title: '11:00 PM', value: '23:00' }, { title: '11:30 PM', value: '23:30' },
                    { title: '12:00 AM', value: '00:00' }, { title: '12:30 AM', value: '00:30' },
                    { title: '1:00 AM', value: '01:00' }, { title: '1:30 AM', value: '01:30' },
                    { title: '2:00 AM', value: '02:00' }, { title: '2:30 AM', value: '02:30' },
                    { title: '3:00 AM', value: '03:00' }, { title: '3:30 AM', value: '03:30' },
                    { title: '4:00 AM', value: '04:00' }, { title: '4:30 AM', value: '04:30' },
                    { title: '5:00 AM', value: '05:00' }, { title: '5:30 AM', value: '05:30' },
                  ]
                }
              },
              { 
                name: 'close', 
                title: 'Closing Time', 
                type: 'string',
                hidden: ({ parent }) => parent?.closed,
                options: {
                  list: [
                    { title: '6:00 AM', value: '06:00' }, { title: '6:30 AM', value: '06:30' },
                    { title: '7:00 AM', value: '07:00' }, { title: '7:30 AM', value: '07:30' },
                    { title: '8:00 AM', value: '08:00' }, { title: '8:30 AM', value: '08:30' },
                    { title: '9:00 AM', value: '09:00' }, { title: '9:30 AM', value: '09:30' },
                    { title: '10:00 AM', value: '10:00' }, { title: '10:30 AM', value: '10:30' },
                    { title: '11:00 AM', value: '11:00' }, { title: '11:30 AM', value: '11:30' },
                    { title: '12:00 PM', value: '12:00' }, { title: '12:30 PM', value: '12:30' },
                    { title: '1:00 PM', value: '13:00' }, { title: '1:30 PM', value: '13:30' },
                    { title: '2:00 PM', value: '14:00' }, { title: '2:30 PM', value: '14:30' },
                    { title: '3:00 PM', value: '15:00' }, { title: '3:30 PM', value: '15:30' },
                    { title: '4:00 PM', value: '16:00' }, { title: '4:30 PM', value: '16:30' },
                    { title: '5:00 PM', value: '17:00' }, { title: '5:30 PM', value: '17:30' },
                    { title: '6:00 PM', value: '18:00' }, { title: '6:30 PM', value: '18:30' },
                    { title: '7:00 PM', value: '19:00' }, { title: '7:30 PM', value: '19:30' },
                    { title: '8:00 PM', value: '20:00' }, { title: '8:30 PM', value: '20:30' },
                    { title: '9:00 PM', value: '21:00' }, { title: '9:30 PM', value: '21:30' },
                    { title: '10:00 PM', value: '22:00' }, { title: '10:30 PM', value: '22:30' },
                    { title: '11:00 PM', value: '23:00' }, { title: '11:30 PM', value: '23:30' },
                    { title: '12:00 AM', value: '00:00' }, { title: '12:30 AM', value: '00:30' },
                    { title: '1:00 AM', value: '01:00' }, { title: '1:30 AM', value: '01:30' },
                    { title: '2:00 AM', value: '02:00' }, { title: '2:30 AM', value: '02:30' },
                    { title: '3:00 AM', value: '03:00' }, { title: '3:30 AM', value: '03:30' },
                    { title: '4:00 AM', value: '04:00' }, { title: '4:30 AM', value: '04:30' },
                    { title: '5:00 AM', value: '05:00' }, { title: '5:30 AM', value: '05:30' },
                  ]
                }
              },
            ],
            // The exact preview configuration you had
            preview: {
              select: { 
                day: 'day', 
                closed: 'closed', 
                open: 'open', 
                close: 'close' 
              },
              prepare({ day, closed, open, close }) {
                const dayName = day ? day.charAt(0).toUpperCase() + day.slice(1) : ''
                return {
                  title: dayName,
                  subtitle: closed ? 'Closed' : `${open?.replace(':', ':')} – ${close?.replace(':', ':')}`
                }
              }
            }
          }],
          validation: Rule => Rule.unique()
        }
      ]
    }),

    // --- 5. SOCIAL LINKS ---
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'string', placeholder: 'brendasalon' },
        { name: 'tiktok', title: 'TikTok', type: 'string', placeholder: 'brendasalon' },
        { name: 'youtube', title: 'YouTube', type: 'string', placeholder: '@brendasalon' },
        { name: 'facebook', title: 'Facebook', type: 'string', placeholder: 'brendasalon' },
      ],
      options: { collapsible: true }
    })
  ]
})