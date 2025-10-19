'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputField } from '@/components/form/input-field'
import { SelectField } from '@/components/form/select-field'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

const PayrollSchemaBase = z.object({
  employee: z.string().min(1, 'Employee is required'),
  month: z.enum(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const, {
    error: 'Month is required',
  }),
  year: z.coerce.number().min(2020).max(2030, 'Year must be between 2020 and 2030'),
  totalWorkingDays: z.coerce.number().min(1).max(31, 'Total working days must be between 1 and 31'),
  daysWorked: z.coerce.number().min(0).max(31, 'Days worked must be between 0 and 31'),
  leaveDays: z.coerce.number().min(0).max(31, 'Leave days must be between 0 and 31'),
  bonusAmount: z.coerce.number().min(0, 'Bonus amount cannot be negative').optional(),
  deductionAmount: z.coerce.number().min(0, 'Deduction amount cannot be negative').optional(),
  overtimePay: z.coerce.number().min(0, 'Overtime pay cannot be negative').optional(),
  adjustmentNote: z.string().optional(),
  status: z.enum(['generated', 'reviewed', 'approved', 'paid'] as const),
})

const PayrollSchema = PayrollSchemaBase.superRefine((val, ctx) => {
  // Validate that days worked + leave days doesn't exceed total working days
  if (val.daysWorked + val.leaveDays > val.totalWorkingDays) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['daysWorked'],
      message: 'Days worked + leave days cannot exceed total working days',
    })
  }
})

export type PayrollFormValues = z.infer<typeof PayrollSchema>

interface Option {
  value: string
  label: string
}

interface PayrollFormProps {
  mode: 'create' | 'edit'
  onSubmit?: (data: PayrollFormValues) => Promise<any>
  formAction?: (formData: FormData) => Promise<void>
  employees: Option[]
  initialData?: Partial<import('@/payload-types').Payroll>
}

export function PayrollForm({
  mode,
  onSubmit,
  formAction,
  employees,
  initialData,
}: PayrollFormProps) {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PayrollFormValues>({
    resolver: zodResolver(PayrollSchema) as any,
    defaultValues: {
      employee: initialData
        ? typeof initialData.employee === 'object' && initialData.employee
          ? String((initialData.employee as any).id)
          : initialData.employee
            ? String(initialData.employee)
            : ''
        : '',
      month: (initialData?.period?.month as any) || '01',
      year: initialData?.period?.year || new Date().getFullYear(),
      totalWorkingDays: initialData?.workDays?.totalWorkingDays || 22,
      daysWorked: initialData?.workDays?.daysWorked || 22,
      leaveDays: initialData?.workDays?.leaveDays || 0,
      bonusAmount: initialData?.adjustments?.bonusAmount || 0,
      deductionAmount: initialData?.adjustments?.deductionAmount || 0,
      overtimePay: initialData?.adjustments?.overtimePay || 0,
      adjustmentNote: initialData?.adjustments?.adjustmentNote || '',
      status: (initialData?.status as any) || 'generated',
    },
  })

  const formRef = React.useRef<HTMLFormElement>(null)
  const [nativeSubmitting, setNativeSubmitting] = React.useState(false)

  // Watch values for calculations
  const totalWorkingDays = watch('totalWorkingDays')
  const daysWorked = watch('daysWorked')
  const leaveDays = watch('leaveDays')

  // Auto-calculate days worked when leave days change
  React.useEffect(() => {
    if (totalWorkingDays && leaveDays !== undefined) {
      const calculatedDaysWorked = totalWorkingDays - leaveDays
      if (calculatedDaysWorked >= 0) {
        setValue('daysWorked', calculatedDaysWorked)
      }
    }
  }, [totalWorkingDays, leaveDays, setValue])

  const statusOptions: Option[] = [
    { label: 'Generated', value: 'generated' },
    { label: 'Reviewed', value: 'reviewed' },
    { label: 'Approved', value: 'approved' },
    { label: 'Paid', value: 'paid' },
  ]

  const monthOptions: Option[] = [
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
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/payroll">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Add Payroll Record' : 'Edit Payroll Record'}
            </h1>
          </div>
        </div>

        <form
          ref={formRef}
          action={formAction as any}
          onSubmit={!formAction ? handleSubmit(async (values) => onSubmit?.(values)) : undefined}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SelectField
                  control={control}
                  name={'employee'}
                  label="Employee *"
                  placeholder="Select employee"
                  options={employees}
                  error={errors.employee?.message as string | undefined}
                />

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    control={control}
                    name={'month'}
                    label="Month *"
                    placeholder="Select month"
                    options={monthOptions}
                    error={errors.month?.message as string | undefined}
                  />

                  <div>
                    <label htmlFor="year" className="px-1 text-sm font-medium text-foreground">
                      Year *
                    </label>
                    <input
                      id="year"
                      type="number"
                      className="mt-2 w-full rounded-md border bg-background p-2"
                      {...register('year', { valueAsNumber: true })}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                    )}
                  </div>
                </div>

                <SelectField
                  control={control}
                  name={'status'}
                  label="Status *"
                  placeholder="Select status"
                  options={statusOptions}
                  error={errors.status?.message as string | undefined}
                />
              </CardContent>
            </Card>

            {/* Work Days */}
            <Card>
              <CardHeader>
                <CardTitle>Work Days</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="totalWorkingDays"
                    className="px-1 text-sm font-medium text-foreground"
                  >
                    Total Working Days *
                  </label>
                  <input
                    id="totalWorkingDays"
                    type="number"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('totalWorkingDays', { valueAsNumber: true })}
                  />
                  {errors.totalWorkingDays && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalWorkingDays.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="leaveDays" className="px-1 text-sm font-medium text-foreground">
                    Leave Days Taken
                  </label>
                  <input
                    id="leaveDays"
                    type="number"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('leaveDays', { valueAsNumber: true })}
                  />
                  {errors.leaveDays && (
                    <p className="text-red-500 text-sm mt-1">{errors.leaveDays.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="daysWorked" className="px-1 text-sm font-medium text-foreground">
                    Days Worked *
                  </label>
                  <input
                    id="daysWorked"
                    type="number"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('daysWorked', { valueAsNumber: true })}
                  />
                  {errors.daysWorked && (
                    <p className="text-red-500 text-sm mt-1">{errors.daysWorked.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Adjustments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bonusAmount" className="px-1 text-sm font-medium text-foreground">
                    Bonus Amount
                  </label>
                  <input
                    id="bonusAmount"
                    type="number"
                    step="0.01"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('bonusAmount', { valueAsNumber: true })}
                  />
                  {errors.bonusAmount && (
                    <p className="text-red-500 text-sm mt-1">{errors.bonusAmount.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="overtimePay" className="px-1 text-sm font-medium text-foreground">
                    Overtime Pay
                  </label>
                  <input
                    id="overtimePay"
                    type="number"
                    step="0.01"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('overtimePay', { valueAsNumber: true })}
                  />
                  {errors.overtimePay && (
                    <p className="text-red-500 text-sm mt-1">{errors.overtimePay.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="deductionAmount"
                    className="px-1 text-sm font-medium text-foreground"
                  >
                    Additional Deduction
                  </label>
                  <input
                    id="deductionAmount"
                    type="number"
                    step="0.01"
                    className="mt-2 w-full rounded-md border bg-background p-2"
                    {...register('deductionAmount', { valueAsNumber: true })}
                  />
                  {errors.deductionAmount && (
                    <p className="text-red-500 text-sm mt-1">{errors.deductionAmount.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="adjustmentNote"
                  className="px-1 text-sm font-medium text-foreground"
                >
                  Adjustment Notes
                </label>
                <textarea
                  id="adjustmentNote"
                  className="mt-2 w-full rounded-md border bg-background p-2"
                  rows={3}
                  {...register('adjustmentNote')}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 pt-4">
            <Link href="/payroll">
              <Button type="button" variant="outline" className="cursor-pointer">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </Link>
            <Button
              type={formAction ? 'button' : 'submit'}
              className="cursor-pointer disabled:cursor-not-allowed"
              disabled={isSubmitting || nativeSubmitting}
              onClick={async () => {
                if (!formAction) return
                const isValid = await trigger()
                if (isValid) {
                  setNativeSubmitting(true)
                  formRef.current?.requestSubmit()
                }
              }}
            >
              {isSubmitting || nativeSubmitting ? (
                <Spinner className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSubmitting || nativeSubmitting
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create Payroll'
                  : 'Update Payroll'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
