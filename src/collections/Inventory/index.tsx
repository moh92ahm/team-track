import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
    access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
    },
  admin: {
    useAsTitle: 'itemType',
    defaultColumns: ['itemType', 'holder', 'model', 'status'],
  },
  fields: [
    {
      name: 'itemType',
      type: 'text',
      required: true,
    },
    {
      name: 'holder',
      type: 'relationship',
      relationTo: 'staff',
    },
    {
      name: 'model',
      type: 'text',
      required: true,
    },
    {
      name: 'serialNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'In Use',
          value: 'inUse',
        },
        {
          label: 'In Stock',
          value: 'inStock',
        },
        {
          label: 'Needs Repair',
          value: 'needsRepair',
        },
        {
          label: 'Under Repair',
          value: 'underRepair', 
        },
      ],
      defaultValue: 'inStock',
      required: true,
    },
    {
      name: 'purchaseDate',
      type: 'date',
    },
    {
      name: 'warrantyExpiry',
      type: 'date',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,  
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
    