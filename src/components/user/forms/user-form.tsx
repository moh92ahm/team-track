'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Inputs via InputField wrapper
// Select handled via SelectField wrapper
import { ProfilePhotoUpload } from '@/components/ui/profile-photo-upload'
import { ArrowLeft, Save, X } from 'lucide-react'
import type { User } from '@/payload-types'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserFormSchema, type UserFormValues } from './user-form.schema'
import { SelectField } from '@/components/form/select-field'
import { InputField } from '@/components/form/input-field'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { BirthdatePicker } from '@/components/date-pickers/birthdate-picker'
import { JoinedDatePicker } from '@/components/date-pickers/joined-date-picker'
import { WorkPermitExpiryPicker } from '@/components/date-pickers/work-permit-expiry-picker'
import { formatDateForInput } from '@/lib/date-utils'

interface UserFormProps {
  initialData?: Partial<User>
  onSubmit?: (data: UserFormValues) => Promise<any>
  formAction?: (formData: FormData) => Promise<void>
  mode: 'create' | 'edit'
  isSubmitting?: boolean
  departments?: Array<{ value: string; label: string }>
  roles?: Array<{ value: string; label: string }>
}

export function UserForm({
  initialData,
  onSubmit,
  formAction,
  mode,
  isSubmitting = false,
  departments = [],
  roles = [],
}: UserFormProps) {
  const defaultValues: UserFormValues = {
    fullName: initialData?.fullName || '',
    username: initialData?.username || '',
    email: initialData?.email || '',
    password: '',
    confirmPassword: '',
    photo:
      typeof initialData?.photo === 'object' && initialData.photo && 'url' in initialData.photo
        ? (initialData.photo as { url: string }).url || null
        : typeof initialData?.photo === 'string'
          ? initialData.photo
          : null,
    department:
      typeof initialData?.department === 'object' &&
      initialData.department &&
      'id' in initialData.department
        ? String((initialData.department as any).id)
        : initialData?.department
          ? String(initialData.department)
          : undefined,
    role:
      typeof initialData?.role === 'object' && initialData.role && 'id' in initialData.role
        ? String((initialData.role as any).id)
        : initialData?.role
          ? String(initialData.role)
          : undefined,
    jobTitle: initialData?.jobTitle || '',
    birthDate: initialData?.birthDate ? formatDateForInput(initialData.birthDate) : '',
    primaryPhone: initialData?.primaryPhone || '',
    secondaryPhone: initialData?.secondaryPhone || '',
    secondaryEmail: initialData?.secondaryEmail || '',
    employmentType: (initialData as any)?.employmentType || 'other',
    nationality: (initialData as any)?.nationality || '',
    identificationNumber: (initialData as any)?.identificationNumber || '',
    workPermitExpiry: (initialData as any)?.workPermitExpiry
      ? formatDateForInput((initialData as any).workPermitExpiry)
      : undefined,
    address: (initialData as any)?.address || '',
    documents: [],
    isActive: initialData?.isActive ?? true,
    joinedAt: initialData?.joinedAt
      ? formatDateForInput(initialData.joinedAt)
      : mode === 'create'
        ? formatDateForInput(new Date())
        : undefined,
    // Employment fields
    baseSalary: (initialData as any)?.employment?.baseSalary || undefined,
    workType: (initialData as any)?.employment?.workType || undefined,
    // Default Allowances
    transportAllowance: (initialData as any)?.employment?.defaultAllowances?.transport || 0,
    mealAllowance: (initialData as any)?.employment?.defaultAllowances?.meal || 0,
    housingAllowance: (initialData as any)?.employment?.defaultAllowances?.housing || 0,
    otherAllowance: (initialData as any)?.employment?.defaultAllowances?.other || 0,
    // Default Deductions
    taxRate: (initialData as any)?.employment?.defaultDeductions?.taxRate || undefined,
    insuranceDeduction: (initialData as any)?.employment?.defaultDeductions?.insurance || 0,
    pensionDeduction: (initialData as any)?.employment?.defaultDeductions?.pension || 0,
    loanDeduction: (initialData as any)?.employment?.defaultDeductions?.loan || 0,
    otherDeduction: (initialData as any)?.employment?.defaultDeductions?.other || 0,
  }

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema) as any,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  // Watch employment type to conditionally show work permit expiry
  const employmentType = watch('employmentType')

  const onValidSubmit: SubmitHandler<UserFormValues> = React.useCallback(
    async (values) => {
      if (!onSubmit) return
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      }
    },
    [onSubmit],
  )

  const formRef = React.useRef<HTMLFormElement>(null)
  const [nativeSubmitting, setNativeSubmitting] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={mode === 'edit' ? `/users/${initialData?.id}` : '/users'}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Add New User' : 'Edit User Profile'}
            </h1>
          </div>
        </div>

        <form
          ref={formRef}
          action={formAction as any}
          onSubmit={async (e) => {
            if (!formAction) return
            // For server-action mode, do client-side checks first
            if (mode === 'create') {
              e.preventDefault()
              const ok = await trigger()
              if (!ok) return
              // Enforce password presence and match on create
              const pwd = (watch('password') as string) || ''
              const cpwd = (watch('confirmPassword') as string) || ''
              if (!pwd) {
                // eslint-disable-next-line no-alert
                alert('Password is required')
                return
              }
              if (!cpwd) {
                // eslint-disable-next-line no-alert
                alert('Confirm password is required')
                return
              }
              if (pwd !== cpwd) {
                // eslint-disable-next-line no-alert
                alert('Passwords do not match')
                return
              }
              setNativeSubmitting(true)
              // Use native submit to invoke the server action
              formRef.current?.submit()
              return
            }
            // In edit mode, allow native submission without blocking
          }}
          className="space-y-6"
        >
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>User Profile Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="flex justify-center">
                <Controller
                  control={control}
                  name="photo"
                  render={({ field: { value, onChange } }) => (
                    <ProfilePhotoUpload
                      value={value ?? null}
                      onChange={(file) => onChange(file)}
                      name="photo"
                      placeholder="Profile Photo"
                      size="xl"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Email *"
                  name={'email'}
                  register={register}
                  error={errors.email?.message as string | undefined}
                />
                <InputField
                  label="Username *"
                  name={'username'}
                  register={register}
                  error={errors.username?.message as string | undefined}
                />
                {mode === 'create' && (
                  <>
                    <InputField
                      label="Password *"
                      name={'password'}
                      register={register}
                      type="password"
                      error={errors.password?.message as string | undefined}
                    />
                    <InputField
                      label="Confirm Password *"
                      name={'confirmPassword'}
                      register={register}
                      type="password"
                      error={errors.confirmPassword?.message as string | undefined}
                    />
                  </>
                )}

                <InputField
                  label="Full Name *"
                  name={'fullName'}
                  register={register}
                  error={errors.fullName?.message as string | undefined}
                />

                <InputField label="Job Title" name={'jobTitle'} register={register} />

                <SelectField
                  control={control}
                  name={'department'}
                  label="Department"
                  placeholder="Select department"
                  options={departments}
                  error={errors.department?.message as string | undefined}
                />

                <SelectField
                  control={control}
                  name={'role'}
                  label="Role"
                  placeholder="Select role"
                  options={roles}
                  error={errors.role?.message as string | undefined}
                />

                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <BirthdatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      name="birthDate"
                      error={errors.birthDate?.message as string | undefined}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="joinedAt"
                  render={({ field }) => (
                    <JoinedDatePicker
                      label="Joined At Date"
                      value={field.value}
                      onValueChange={field.onChange}
                      name="joinedAt"
                    />
                  )}
                />
              </div>

              <Separator />

              {/* Employment Status */}
              <CardTitle className="text-lg font-semibold">Employment Status</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nationality" name={'nationality'} register={register} />
                <InputField
                  label="Identification Number"
                  name={'identificationNumber'}
                  register={register}
                />

                <SelectField
                  control={control}
                  name={'employmentType'}
                  label="Employment Type *"
                  placeholder="Select employment type"
                  options={[
                    { label: 'Citizen', value: 'citizen' },
                    { label: 'Work Permit', value: 'workPermit' },
                    { label: 'Residence Permit', value: 'residencePermit' },
                    { label: 'Other', value: 'other' },
                  ]}
                />

                {/* Conditionally show Work Permit Expiry only when Work Permit is selected */}
                {employmentType === 'workPermit' && (
                  <Controller
                    control={control}
                    name="workPermitExpiry"
                    render={({ field }) => (
                      <WorkPermitExpiryPicker
                        value={field.value}
                        onValueChange={field.onChange}
                        name="workPermitExpiry"
                        error={errors.workPermitExpiry?.message as string | undefined}
                      />
                    )}
                  />
                )}
              </div>

              <Separator />

              {/* Contact Information Section */}
              <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Primary Phone *"
                    name={'primaryPhone'}
                    register={register}
                    type="tel"
                    error={errors.primaryPhone?.message as string | undefined}
                  />
                  <InputField
                    label="Secondary Phone"
                    name={'secondaryPhone'}
                    register={register}
                    type="tel"
                  />
                  <InputField
                    label="Secondary Email"
                    name={'secondaryEmail'}
                    register={register}
                    type="email"
                    error={errors.secondaryEmail?.message as string | undefined}
                  />

                  <div className="md:col-span-2">
                    <label className="px-1 text-sm font-medium" htmlFor="address">
                      Address
                    </label>
                    <textarea
                      id="address"
                      className="mt-2 w-full rounded-md border bg-background p-2"
                      rows={4}
                      {...register('address')}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payroll Information Section */}
                <CardTitle className="text-lg font-bold">Payroll Information</CardTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Monthly Base Salary"
                      name={'baseSalary'}
                      register={register}
                      type="number"
                      inputProps={{ step: '0.01', min: '0' }}
                      error={errors.baseSalary?.message as string | undefined}
                    />
                    <SelectField
                      control={control}
                      name={'workType'}
                      label="Work Type"
                      placeholder="Select work type"
                      options={[
                        { label: 'Full-time', value: 'fulltime' },
                        { label: 'Part-time', value: 'parttime' },
                        { label: 'Contract', value: 'contract' },
                      ]}
                    />
                  </div>

                  {/* Default Allowances */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Default Allowances</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InputField
                        label="Transport Allowance"
                        name={'transportAllowance'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.transportAllowance?.message as string | undefined}
                      />
                      <InputField
                        label="Meal Allowance"
                        name={'mealAllowance'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.mealAllowance?.message as string | undefined}
                      />
                      <InputField
                        label="Housing Allowance"
                        name={'housingAllowance'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.housingAllowance?.message as string | undefined}
                      />
                      <InputField
                        label="Other Allowance"
                        name={'otherAllowance'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.otherAllowance?.message as string | undefined}
                      />
                    </div>
                  </div>

                  {/* Default Deductions */}
                  <div>
                    <h4 className="text-md font-semibold mb-3">Default Deductions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <InputField
                        label="Tax Rate (%)"
                        name={'taxRate'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0', max: '100' }}
                        error={errors.taxRate?.message as string | undefined}
                      />
                      <InputField
                        label="Insurance Deduction"
                        name={'insuranceDeduction'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.insuranceDeduction?.message as string | undefined}
                      />
                      <InputField
                        label="Pension Deduction"
                        name={'pensionDeduction'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.pensionDeduction?.message as string | undefined}
                      />
                      <InputField
                        label="Loan Deduction"
                        name={'loanDeduction'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.loanDeduction?.message as string | undefined}
                      />
                      <InputField
                        label="Other Deduction"
                        name={'otherDeduction'}
                        register={register}
                        type="number"
                        inputProps={{ step: '0.01', min: '0' }}
                        error={errors.otherDeduction?.message as string | undefined}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-10">
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4">
                    <Link href={mode === 'edit' ? `/users/${initialData?.id}` : '/users'}>
                      <Button type="button" variant="outline" className="cursor-pointer">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type={formAction ? 'submit' : 'submit'}
                      disabled={isSubmitting || isFormSubmitting || nativeSubmitting}
                      className="cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isFormSubmitting || nativeSubmitting ? (
                        <Spinner className="h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isSubmitting || isFormSubmitting || nativeSubmitting
                        ? mode === 'create'
                          ? 'Creating...'
                          : 'Saving...'
                        : mode === 'create'
                          ? 'Create User'
                          : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
