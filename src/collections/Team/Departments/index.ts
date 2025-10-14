import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Departments: CollectionConfig = {
  slug: 'departments',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'manager'],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'manager',
      type: 'relationship',
      relationTo: 'staff',
    },

  ]
}