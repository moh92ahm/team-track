import { z } from 'zod'

export const StaffFormSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    photo: z
      .custom<File | string | null>((v) => v === null || v instanceof File || typeof v === 'string')
      .optional(),
    department: z.string().optional(),
    role: z.string().optional(),
    jobTitle: z.string().optional().default(''),
    birthDate: z
      .string()
      .min(1, 'Birth date is required')
      .refine((val) => !Number.isNaN(new Date(val).getTime()), 'Invalid date'),
    personalPhone: z.string().min(1, 'Personal phone is required'),
    workPhone: z.string().optional().default(''),
    contactEmail: z
      .string()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal(''))
      .optional(),
    workEmail: z
      .string()
      .min(1, 'Work email is required')
      .email('Please enter a valid email address'),
    documents: z
      .array(z.union([z.string(), z.custom<File>(() => true)]))
      .optional()
      .default([]),
    isActive: z.boolean().default(true),
    joinedAt: z.string().optional(),
    employmentType: z
      .enum(['citizen', 'workPermit', 'residencePermit', 'other'] as const)
      .default('other'),
    nationality: z.string().optional().default(''),
    identificationNumber: z.string().optional().default(''),
    workPermitExpiry: z.string().optional(),
    address: z.string().optional().default('Write the address here...'),
  })
  .refine(
    (data) => {
      // If employment type is work permit, work permit expiry is required
      if (data.employmentType === 'workPermit') {
        return data.workPermitExpiry && data.workPermitExpiry.length > 0
      }
      return true
    },
    {
      message: 'Work permit expiry date is required for work permit holders',
      path: ['workPermitExpiry'],
    },
  )

export type StaffFormValues = z.infer<typeof StaffFormSchema>
