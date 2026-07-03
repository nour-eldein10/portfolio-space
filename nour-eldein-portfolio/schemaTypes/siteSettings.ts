import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Nour Eldein Portfolio',
    }),
    defineField({
      name: 'lightTheme',
      title: 'Light Theme Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Soft Cream (Classic Light)', value: 'theme-soft-cream' },
          { title: 'Cool Porcelain', value: 'theme-cool-porcelain' },
          { title: 'Warm Parchment', value: 'theme-warm-parchment' },
          { title: 'Sage Linen', value: 'theme-sage-linen' },
        ],
      },
      initialValue: 'theme-soft-cream',
    }),
    defineField({
      name: 'darkTheme',
      title: 'Dark Theme Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Original Dark', value: 'theme-dark-original' },
          { title: 'Midnight Cyan', value: 'theme-midnight-cyan' },
        ],
      },
      initialValue: 'theme-dark-original',
    }),
  ],
})
