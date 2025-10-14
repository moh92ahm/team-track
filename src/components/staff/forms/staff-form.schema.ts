import { z } from 'zod'

export const StaffFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  photo: z.custom<File | string | null>((v) => v === null || v instanceof File || typeof v === 'string').optional(),
  department: z.string().optional(),
  role: z.string().optional(),
  jobTitle: z.string().optional().default(''),
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((val) => !Number.isNaN(new Date(val).getTime()), 'Invalid date'),
  personalPhone: z.string().min(1, 'Personal phone is required'),
  workPhone: z.string().optional().default(''),
  contactEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')).optional(),
  workEmail: z.string().min(1, 'Work email is required').email('Please enter a valid email address'),
  documents: z.array(z.union([z.string(), z.custom<File>(() => true)])).optional().default([]),
  isActive: z.boolean().default(true),
  joinedAt: z.string().optional(),
})

export type StaffFormValues = z.infer<typeof StaffFormSchema>

