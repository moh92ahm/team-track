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
    defaultColumns: ['employee', 'period', 'status'],
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'users',
      required: true,
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
    // Override fields (for exceptions only)
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
          name: 'overtimePay',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'adjustmentNote',
          type: 'textarea',
          label: 'Reason for Adjustment',
        },
      ],
    },
    // Auto-calculated totals
    {
      name: 'calculations',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        { name: 'grossPay', type: 'number' },
        { name: 'totalDeductions', type: 'number' },
        { name: 'netPay', type: 'number' },
      ],
    },
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
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          // Get employee data for salary calculation
          if (data.employee) {
            const employee = await req.payload.findByID({
              collection: 'users',
              id: data.employee,
              depth: 1,
            })

            if (employee && employee.employment) {
              // employment may have optional fields; provide defaults and a type assertion
              const {
                baseSalary,
                defaultAllowances = {},
                defaultDeductions = {},
              } = employee.employment as {
                baseSalary?: number | null
                defaultAllowances?: {
                  transport?: number
                  meal?: number
                  housing?: number
                  other?: number
                }
                defaultDeductions?: {
                  insurance?: number
                  pension?: number
                  loan?: number
                  other?: number
                  taxRate?: number
                }
              }
              const { workDays, adjustments } = data

              if (baseSalary && workDays) {
                // Calculate proportional salary based on days worked
                const dailySalary = baseSalary / workDays.totalWorkingDays
                const earnedSalary = dailySalary * workDays.daysWorked

                // Calculate total allowances (default + adjustments)
                const totalAllowances =
                  (defaultAllowances?.transport || 0) +
                  (defaultAllowances?.meal || 0) +
                  (defaultAllowances?.housing || 0) +
                  (defaultAllowances?.other || 0) +
                  (adjustments?.bonusAmount || 0) +
                  (adjustments?.overtimePay || 0)

                // Calculate gross pay
                const grossPay = earnedSalary + totalAllowances

                // Calculate total deductions (default + adjustments)
                const totalDeductions =
                  (defaultDeductions?.insurance || 0) +
                  (defaultDeductions?.pension || 0) +
                  (defaultDeductions?.loan || 0) +
                  (defaultDeductions?.other || 0) +
                  (adjustments?.deductionAmount || 0) +
                  (grossPay * (defaultDeductions?.taxRate || 0)) / 100 // Tax calculation

                // Calculate net pay
                const netPay = grossPay - totalDeductions

                // Update calculated fields
                data.calculations = {
                  grossPay: Math.round(grossPay * 100) / 100,
                  totalDeductions: Math.round(totalDeductions * 100) / 100,
                  netPay: Math.round(netPay * 100) / 100,
                }
              }
            }
          }
        }

        return data
      },
    ],
  },
}
