import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'quote', title: 'Comment', type: 'text', rows: 3 }),
    defineField({ name: 'rating', title: 'Rating (1–5)', type: 'number' }),
    defineField({ name: 'projectId', title: 'Project ID', type: 'string', description: 'Slug of the app/product this review is for. Leave empty for global reviews.' }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['pending', 'approved', 'rejected'] }, initialValue: 'pending' }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote' },
  },
})
