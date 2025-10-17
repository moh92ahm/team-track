import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
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
      type: 'text',
    },
  ]
}