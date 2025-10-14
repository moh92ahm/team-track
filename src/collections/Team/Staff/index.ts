import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Staff: CollectionConfig = {
  slug: 'staff',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'role', 'joinedAt', 'isActive'],
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles'
    },
    {
      name: 'jobTitle',
      type: 'text',
    },
    {
      name: 'birthDate',
      type: 'date',
      required: true,
    },
    {
      name: 'personalPhone',
      type: 'text',
      required: true,
      // hasMany: true,
    },
    {
      name: 'workPhone',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'email',
      unique: true,
    },
    {
      name: 'workEmail',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'workStatus',
      type: 'select',
      options: [
        {
          label: 'Insurance',
          value: 'insurance',
        },
        {
          label: 'Work Permit',
          value: 'workPermit',
        },
        {
          label: 'Retired',
          value: 'retired',
        },
        {
          label: 'None',
          value: 'none',
        }
      ],
      defaultValue: 'none',
      required: true,
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'joinedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
}
