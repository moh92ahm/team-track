import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Leaves: CollectionConfig = {
  slug: 'leaves',
  access: {
    admin: authenticated,
    read: authenticated,
    delete: authenticated,
    create: authenticated,
    update: authenticated,  
  },
  admin: {
    useAsTitle: 'staff',
    defaultColumns: ['staff', 'status'],
  },
  fields: [
    {
      name: 'staff',
      type: 'relationship',
      relationTo: 'staff',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Annual', value: 'annual'},
        { label: 'Sick', value: 'sick'},
        { label: 'Unpaid', value: 'unpaid'},
        { label: 'Other', value: 'other'},
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'totalDays',
      type: 'number',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.startDate && data?.endDate) {
              const start = new Date(data.startDate)
              const end = new Date(data.endDate)
              const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
              data.totalDays = diff
            }
            return data
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Requested', value: 'requested'},
        { label: 'Approved', value: 'approved'},
        { label: 'Rejected', value: 'rejected'},
        { label: 'Cancelled', value: 'cancelled'},
      ],
      defaultValue: 'requested',
    },
    {
      name: 'reason',
      type: 'textarea',
      required: true,
    },
    {
      name: 'note',
      type: 'textarea',
    }
  ],
  timestamps: true,
}