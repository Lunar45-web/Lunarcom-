import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'business',
  title: '⚙️ Business Settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Salon Name', type: 'string', initialValue: 'Brenda Salon' }),
    defineField({ name: 'tagline', title: 'Hero Tagline', type: 'string', description: 'e.g., Elegance in Every Strand' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp Number (No +)', type: 'string' }),
    defineField({ name: 'location', title: 'Location Name', type: 'string' }),
    defineField({ name: 'googleMapsUrl', title: 'Google Maps Embed Link', type: 'url' }),
    defineField({ name: 'heroImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroVideo', title: 'Hero Video URL (Optional mp4)', type: 'url' }),

 // --- FIXED WORKING HOURS with 15-minute intervals ---
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
                // Morning times
                { title: '6:00 AM', value: '06:00' },
                { title: '6:30 AM', value: '06:30' },
                { title: '7:00 AM', value: '07:00' },
                { title: '7:30 AM', value: '07:30' },
                { title: '8:00 AM', value: '08:00' },
                { title: '8:30 AM', value: '08:30' },
                { title: '9:00 AM', value: '09:00' },
                { title: '9:30 AM', value: '09:30' },
                { title: '10:00 AM', value: '10:00' },
                { title: '10:30 AM', value: '10:30' },
                { title: '11:00 AM', value: '11:00' },
                { title: '11:30 AM', value: '11:30' },
                // Afternoon times
                { title: '12:00 PM', value: '12:00' },
                { title: '12:30 PM', value: '12:30' },
                { title: '1:00 PM', value: '13:00' },
                { title: '1:30 PM', value: '13:30' },
                { title: '2:00 PM', value: '14:00' },
                { title: '2:30 PM', value: '14:30' },
                { title: '3:00 PM', value: '15:00' },
                { title: '3:30 PM', value: '15:30' },
                { title: '4:00 PM', value: '16:00' },
                { title: '4:30 PM', value: '16:30' },
                { title: '5:00 PM', value: '17:00' },
                { title: '5:30 PM', value: '17:30' },
                // Evening times
                { title: '6:00 PM', value: '18:00' },
                { title: '6:30 PM', value: '18:30' },
                { title: '7:00 PM', value: '19:00' },
                { title: '7:30 PM', value: '19:30' },
                { title: '8:00 PM', value: '20:00' },
                { title: '8:30 PM', value: '20:30' },
                { title: '9:00 PM', value: '21:00' },
                { title: '9:30 PM', value: '21:30' },
                { title: '10:00 PM', value: '22:00' },
                { title: '10:30 PM', value: '22:30' },
                { title: '11:00 PM', value: '23:00' },
                { title: '11:30 PM', value: '23:30' },
                // After midnight
                { title: '12:00 AM', value: '00:00' },
                { title: '12:30 AM', value: '00:30' },
                { title: '1:00 AM', value: '01:00' },
                { title: '1:30 AM', value: '01:30' },
                { title: '2:00 AM', value: '02:00' },
                { title: '2:30 AM', value: '02:30' },
                { title: '3:00 AM', value: '03:00' },
                { title: '3:30 AM', value: '03:30' },
                { title: '4:00 AM', value: '04:00' },
                { title: '4:30 AM', value: '04:30' },
                { title: '5:00 AM', value: '05:00' },
                { title: '5:30 AM', value: '05:30' },
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
                // Morning times
                { title: '6:00 AM', value: '06:00' },
                { title: '6:30 AM', value: '06:30' },
                { title: '7:00 AM', value: '07:00' },
                { title: '7:30 AM', value: '07:30' },
                { title: '8:00 AM', value: '08:00' },
                { title: '8:30 AM', value: '08:30' },
                { title: '9:00 AM', value: '09:00' },
                { title: '9:30 AM', value: '09:30' },
                { title: '10:00 AM', value: '10:00' },
                { title: '10:30 AM', value: '10:30' },
                { title: '11:00 AM', value: '11:00' },
                { title: '11:30 AM', value: '11:30' },
                // Afternoon times
                { title: '12:00 PM', value: '12:00' },
                { title: '12:30 PM', value: '12:30' },
                { title: '1:00 PM', value: '13:00' },
                { title: '1:30 PM', value: '13:30' },
                { title: '2:00 PM', value: '14:00' },
                { title: '2:30 PM', value: '14:30' },
                { title: '3:00 PM', value: '15:00' },
                { title: '3:30 PM', value: '15:30' },
                { title: '4:00 PM', value: '16:00' },
                { title: '4:30 PM', value: '16:30' },
                { title: '5:00 PM', value: '17:00' },
                { title: '5:30 PM', value: '17:30' },
                // Evening times
                { title: '6:00 PM', value: '18:00' },
                { title: '6:30 PM', value: '18:30' },
                { title: '7:00 PM', value: '19:00' },
                { title: '7:30 PM', value: '19:30' },
                { title: '8:00 PM', value: '20:00' },
                { title: '8:30 PM', value: '20:30' },
                { title: '9:00 PM', value: '21:00' },
                { title: '9:30 PM', value: '21:30' },
                { title: '10:00 PM', value: '22:00' },
                { title: '10:30 PM', value: '22:30' },
                { title: '11:00 PM', value: '23:00' },
                { title: '11:30 PM', value: '23:30' },
                // After midnight
                { title: '12:00 AM', value: '00:00' },
                { title: '12:30 AM', value: '00:30' },
                { title: '1:00 AM', value: '01:00' },
                { title: '1:30 AM', value: '01:30' },
                { title: '2:00 AM', value: '02:00' },
                { title: '2:30 AM', value: '02:30' },
                { title: '3:00 AM', value: '03:00' },
                { title: '3:30 AM', value: '03:30' },
                { title: '4:00 AM', value: '04:00' },
                { title: '4:30 AM', value: '04:30' },
                { title: '5:00 AM', value: '05:00' },
                { title: '5:30 AM', value: '05:30' },
              ]
            }
          },
        ],
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