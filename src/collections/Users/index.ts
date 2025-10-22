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
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
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
    // Payroll details
    {
      name: 'employment',
      type: 'group',
      fields: [
        {
          name: 'baseSalary',
          type: 'number',
          label: 'Monthly Base Salary',
        },
        {
          name: 'paymentType',
          type: 'select',
          label: 'Payment Type',
          options: [
            { label: 'Bank Transfer', value: 'bankTransfer' },
            { label: 'Cash', value: 'cash' },
            { label: 'Cheque', value: 'cheque' },
          ],
          defaultValue: 'bankTransfer',
        },
      ],
    },
  ],
  timestamps: true,
}
