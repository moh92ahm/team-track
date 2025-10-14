'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// Inputs via InputField wrapper
// Select handled via SelectField wrapper
import { ProfilePhotoUpload } from '@/components/ui/profile-photo-upload'
import { ArrowLeft, Save, X } from 'lucide-react'
import type { Staff } from '@/payload-types'
import { BirthDatePicker } from '@/components/birthdate-picker'
import { JoinedAtDate } from '@/components/joined-at-date'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StaffFormSchema, type StaffFormValues } from './staff-form.schema'
import { SelectField } from '@/components/form/select-field'
import { InputField } from '@/components/form/input-field'
import { Spinner } from '@/components/ui/spinner'

interface StaffFormProps {
  initialData?: Partial<Staff>
  onSubmit?: (data: StaffFormValues) => Promise<any>
  formAction?: (formData: FormData) => Promise<void>
  mode: 'create' | 'edit'
  isSubmitting?: boolean
  departments?: Array<{ value: string; label: string }>
  roles?: Array<{ value: string; label: string }>
}

export function StaffForm({
  initialData,
  onSubmit,
  formAction,
  mode,
  isSubmitting = false,
  departments = [],
  roles = [],
}: StaffFormProps) {
  const defaultValues: StaffFormValues = {
    fullName: initialData?.fullName || '',
    photo:
      typeof initialData?.photo === 'object' && initialData.photo && 'url' in initialData.photo
        ? (initialData.photo as { url: string }).url || null
        : typeof initialData?.photo === 'string'
          ? initialData.photo
          : null,
    department:
      typeof initialData?.department === 'object' && initialData.department && 'id' in initialData.department
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
    birthDate: initialData?.birthDate
      ? new Date(initialData.birthDate).toISOString().split('T')[0]
      : '',
    personalPhone: Array.isArray(initialData?.personalPhone)
      ? initialData.personalPhone.join(', ')
      : initialData?.personalPhone || '',
    workPhone: initialData?.workPhone || '',
    contactEmail: initialData?.contactEmail || '',
    workEmail: initialData?.workEmail || '',
    documents: [],
    isActive: initialData?.isActive ?? true,
    joinedAt: initialData?.joinedAt
      ? new Date(initialData.joinedAt).toISOString()
      : mode === 'create'
        ? new Date().toISOString()
        : undefined,
  }

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    trigger,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema) as any,
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const onValidSubmit: SubmitHandler<StaffFormValues> = React.useCallback(
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
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={mode === 'edit' ? `/team/${initialData?.id}` : '/team'}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Add New Staff Member' : 'Edit Staff Profile'}
            </h1>
          </div>
        </div>

        <form
          ref={formRef}
          action={formAction as any}
          onSubmit={!formAction ? rhfHandleSubmit(onValidSubmit) : undefined}
          className="space-y-6"
        >
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  label="Full Name *"
                  name={"fullName"}
                  register={register}
                  error={errors.fullName?.message as string | undefined}
                />

                <InputField label="Job Title" name={"jobTitle"} register={register} />

                <SelectField
                  control={control}
                  name={"department"}
                  label="Department"
                  placeholder="Select department"
                  options={departments}
                  error={errors.department?.message as string | undefined}
                />

                <SelectField
                  control={control}
                  name={"role"}
                  label="Role"
                  placeholder="Select role"
                  options={roles}
                  error={errors.role?.message as string | undefined}
                />

                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <BirthDatePicker
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
                    <JoinedAtDate value={field.value} onValueChange={field.onChange} name="joinedAt" />
                  )}
                />
              </div>

              {/* Contact Information Section */}
              <CardTitle>Contact Information</CardTitle>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Work Email *"
                    name={"workEmail"}
                    register={register}
                    type="email"
                    error={errors.workEmail?.message as string | undefined}
                  />

                  <InputField
                    label="Contact Email"
                    name={"contactEmail"}
                    register={register}
                    type="email"
                    error={errors.contactEmail?.message as string | undefined}
                  />

                  <InputField
                    label="Personal Phone *"
                    name={"personalPhone"}
                    register={register}
                    type="tel"
                    error={errors.personalPhone?.message as string | undefined}
                  />

                  <InputField label="Work Phone" name={"workPhone"} register={register} type="tel" />
                </div>

                <div className="space-y-4 mt-10">
                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4">
                    <Link href={mode === 'edit' ? `/team/${initialData?.id}` : '/team'}>
                      <Button type="button" variant="outline" className="cursor-pointer">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type={formAction ? 'button' : 'submit'}
                      disabled={isSubmitting || isFormSubmitting || nativeSubmitting}
                      className="cursor-pointer disabled:cursor-not-allowed"
                      onClick={async () => {
                        if (!formAction) return
                        const valid = await trigger()
                        if (valid) {
                          setNativeSubmitting(true)
                          formRef.current?.requestSubmit()
                        }
                      }}
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
                          ? 'Create Staff Member'
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
