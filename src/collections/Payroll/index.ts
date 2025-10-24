import { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Payroll: CollectionConfig = {
  slug: 'payroll',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'employee',
    defaultColumns: ['employee', 'period', 'totalAmount', 'status'],
    group: 'Payroll Management',
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'period',
      type: 'group',
      fields: [
        {
          name: 'month',
          type: 'select',
          required: true,
          options: [
            { label: 'January', value: '01' },
            { label: 'February', value: '02' },
            { label: 'March', value: '03' },
            { label: 'April', value: '04' },
            { label: 'May', value: '05' },
            { label: 'June', value: '06' },
            { label: 'July', value: '07' },
            { label: 'August', value: '08' },
            { label: 'September', value: '09' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
          ],
        },
        {
          name: 'year',
          type: 'number',
          required: true,
          defaultValue: new Date().getFullYear(),
        },
      ],
    },

    // Generated from PayrollSettings
    {
      name: 'payrollItems',
      type: 'array',
      label: 'Payroll Items',
      fields: [
        {
          name: 'payrollSetting',
          type: 'relationship',
          relationTo: 'payroll-settings',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'payrollType',
          type: 'select',
          options: [
            { label: 'Primary Salary', value: 'primary' },
            { label: 'Bonus Payment', value: 'bonus' },
            { label: 'Overtime Pay', value: 'overtime' },
            { label: 'Commission', value: 'commission' },
            { label: 'Allowance', value: 'allowance' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'paymentType',
          type: 'select',
          options: [
            { label: 'Bank Transfer', value: 'bankTransfer' },
            { label: 'Cash', value: 'cash' },
            { label: 'Cheque', value: 'cheque' },
          ],
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Manual adjustments (for this specific payroll period)
    {
      name: 'adjustments',
      type: 'group',
      label: 'Manual Adjustments',
      fields: [
        {
          name: 'bonusAmount',
          type: 'number',
          defaultValue: 0,
          label: 'One-time Bonus',
        },
        {
          name: 'deductionAmount',
          type: 'number',
          defaultValue: 0,
          label: 'Additional Deduction',
        },
        {
          name: 'adjustmentNote',
          type: 'textarea',
          label: 'Reason for Adjustment',
        },
      ],
    },

    // Calculated totals (auto-calculated)
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Total amount calculated from payroll items + adjustments',
      },
    },

    // Payment tracking
    {
      name: 'paymentDetails',
      type: 'group',
      label: 'Payment Tracking',
      fields: [
        {
          name: 'paymentDate',
          type: 'date',
          admin: {
            condition: (data) => data?.status === 'paid',
          },
        },
        {
          name: 'paymentReference',
          type: 'text',
          admin: {
            condition: (data) => data?.status === 'paid',
            description: 'Transaction ID, cheque number, or other payment reference',
          },
        },
        {
          name: 'paymentNotes',
          type: 'textarea',
          admin: {
            condition: (data) => ['paid', 'cancelled'].includes(data?.status),
          },
        },
      ],
    },

    // Status tracking
    {
      name: 'status',
      type: 'select',
      defaultValue: 'generated',
      options: [
        { label: 'Generated', value: 'generated' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Approved', value: 'approved' },
        { label: 'Paid', value: 'paid' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // Processing timestamps
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        condition: (data) => ['paid', 'cancelled'].includes(data?.status),
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (data) => ['paid', 'cancelled'].includes(data?.status),
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // Calculate total amount from payroll items and adjustments
          let totalFromItems = 0

          if (data.payrollItems && Array.isArray(data.payrollItems)) {
            totalFromItems = data.payrollItems.reduce((sum, item) => {
              return sum + (item.amount || 0)
            }, 0)
          }

          // Add manual adjustments
          const bonusAmount = data.adjustments?.bonusAmount || 0
          const deductionAmount = data.adjustments?.deductionAmount || 0

          // Calculate final total
          const totalAmount = totalFromItems + bonusAmount - deductionAmount

          // Update the total amount field
          data.totalAmount = Math.round(totalAmount * 100) / 100

          // Auto-set processedAt and processedBy when status changes to paid/cancelled
          if (['paid', 'cancelled'].includes(data.status) && !data.processedAt) {
            data.processedAt = new Date()
            // Note: processedBy would typically be set from the authenticated user context
            // data.processedBy = req.user?.id
          }
        }

        return data
      },
    ],

    // Hook to auto-generate payroll items from PayrollSettings
    afterChange: [
      async ({ doc, operation, req }) => {
        // Auto-populate payroll items when creating a new payroll record
        if (
          operation === 'create' &&
          doc.employee &&
          (!doc.payrollItems || doc.payrollItems.length === 0)
        ) {
          try {
            // Find active payroll settings for this employee
            const payrollSettings = await req.payload.find({
              collection: 'payroll-settings',
              where: {
                and: [
                  { employee: { equals: doc.employee } },
                  { isActive: { equals: true } },
                  {
                    or: [
                      { 'effectiveDate.endDate': { exists: false } },
                      { 'effectiveDate.endDate': { greater_than: new Date() } },
                    ],
                  },
                ],
              },
              depth: 1,
            })

            if (payrollSettings.docs.length > 0) {
              const payrollItems = payrollSettings.docs.map((setting) => ({
                payrollSetting: setting.id,
                description: setting.description || `${setting.payrollType} payment`,
                payrollType: setting.payrollType,
                amount: setting.paymentDetails?.amount || 0,
                paymentType: setting.paymentDetails?.paymentType || 'bankTransfer',
              }))

              // Update the payroll record with generated items
              await req.payload.update({
                collection: 'payroll',
                id: doc.id,
                data: {
                  payrollItems,
                },
                user: req.user,
              })
            }
          } catch (error) {
            console.error('Error auto-generating payroll items:', error)
          }
        }
      },
    ],
  },
}
