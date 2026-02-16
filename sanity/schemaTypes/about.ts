import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: '📖 About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'The Philosophy',
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'Where Artistry Meets Prestige',
    }),
    defineField({
      name: 'highlightWord',
      title: 'Highlight Word (green italic)',
      type: 'string',
      initialValue: 'Prestige',
    }),
    defineField({
      name: 'mainText',
      title: 'Main Description',
      type: 'text',
      rows: 4,
      initialValue: 'WE ARE DELIGHTED TO GIVE YOU THE BEST SERVICES',
    }),
    defineField({
      name: 'secondaryText',
      title: 'Secondary Description',
      type: 'text',
      rows: 3,
      initialValue: 'Our master stylists are artisans, trained in the world\'s fashion capitals. From precision cuts to transformative color, every service is a bespoke experience tailored to your unique identity and lifestyle.',
    }),
    
    // Founder/Owner info
    defineField({
      name: 'founderName',
      title: 'Founder/Owner Name',
      type: 'string',
      initialValue: 'Elena Voss',
    }),
    defineField({
      name: 'founderTitle',
      title: 'Founder Title',
      type: 'string',
      initialValue: 'Founder & Creative Director',
    }),
    defineField({
      name: 'founderInitial',
      title: 'Founder Initial (for circle)',
      type: 'string',
      description: 'Usually the first letter of founder name',
      initialValue: 'E',
    }),

    // Media (image or video)
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'aboutVideo',
      title: 'About Video URL',
      type: 'url',
      description: 'MP4 video URL (will loop automatically)',
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),
  ],
})