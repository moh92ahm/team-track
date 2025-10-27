import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['fullName', 'primaryPhone', 'employmentType', 'isActive'],
    useAsTitle: 'fullName',
  },
  auth: {
    loginWithUsername: {
      requireEmail: true,
      allowEmailLogin: true,
    },
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
      name: 'departments',
      type: 'relationship',
      relationTo: 'departments',
      hasMany: true,
      admin: {
        description: 'Assign multiple departments (e.g., Sales + English, or just HR)',
      },
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
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
      name: 'primaryPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'secondaryPhone',
      type: 'text',
    },
    {
      name: 'secondaryEmail',
      type: 'email',
      unique: true,
    },
    {
      name: 'employmentType',
      type: 'select',
      options: [
        {
          label: 'Citizen',
          value: 'citizen',
        },
        {
          label: 'Work Permit',
          value: 'workPermit',
        },
        {
          label: 'Residence Permit',
          value: 'residencePermit',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'other',
      required: true,
    },
    {
      name: 'nationality',
      type: 'text',
    },
    {
      name: 'identificationNumber',
      type: 'text',
    },
    {
      name: 'workPermitExpiry',
      type: 'date',
    },
    {
      name: 'address',
      type: 'textarea',
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
      name: 'isSystemUser',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'System users are hidden from regular user listings',
        readOnly: true,
      },
      access: {
        // Only super admins can see this field
        read: ({ req: { user } }) => {
          return user?.email === 'admin@teamtrack.local'
        },
        update: () => false, // Can't be changed via UI
      },
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
  timestamps: true,
}
