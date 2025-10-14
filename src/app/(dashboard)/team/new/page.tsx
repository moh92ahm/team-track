import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { StaffForm } from '@/components/staff/forms/staff-form'

export default async function NewStaffPage() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin')

  // Fetch departments and roles for dropdowns
  const [departmentsResult, rolesResult] = await Promise.all([
    payload.find({
      collection: 'departments',
      limit: 100,
      sort: 'name',
      user,
    }),
    payload.find({
      collection: 'roles',
      limit: 100,
      sort: 'name',
      user,
    }),
  ])

  const handleCreateStaff = async (formData: FormData) => {
    'use server'

    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Handle photo upload if file is provided
    let photoId: number | null = null
    const photo = formData.get('photo') as File | null
    const fullName = String(formData.get('fullName') || '')
    if (photo && typeof photo === 'object' && 'arrayBuffer' in photo && photo.size > 0) {
      const arrayBuffer = await photo.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadResult = await payload.create({
        collection: 'media',
        data: {
          alt: `${fullName} profile photo`,
        },
        file: {
          data: buffer,
          mimetype: photo.type,
          name: photo.name,
          size: photo.size,
        },
        user,
      })
      photoId = uploadResult.id as number
    }

    // Normalize optional fields to avoid invalid values (e.g., empty string for email)
    const jobTitle = String(formData.get('jobTitle') || '')
    const workPhone = String(formData.get('workPhone') || '')
    const contactEmail = String(formData.get('contactEmail') || '')

    // Create the new staff member
    const staffData: any = {
      fullName,
      ...(photoId && { photo: photoId }),
      birthDate: String(formData.get('birthDate') || ''),
      personalPhone: String(formData.get('personalPhone') || ''),
      workEmail: String(formData.get('workEmail') || ''),
      joinedAt: String(formData.get('joinedAt') || new Date().toISOString()),
    }

    if (jobTitle) staffData.jobTitle = jobTitle
    if (workPhone) staffData.workPhone = workPhone
    if (contactEmail) staffData.contactEmail = contactEmail

    // Convert string IDs to numbers if they have values
    const department = String(formData.get('department') || '')
    if (department) staffData.department = parseInt(department)
    const role = String(formData.get('role') || '')
    if (role) staffData.role = parseInt(role)

    const newStaff = await payload.create({
      collection: 'staff',
      data: staffData,
      user,
    })

    // Redirect to the new staff member's profile
    redirect(`/team/${newStaff.id}`)
  }

  return (
    <>
      <StaffForm
      mode="create"
      formAction={handleCreateStaff}
      departments={departmentsResult.docs.map((dept) => ({ value: String(dept.id), label: dept.name }))}
      roles={rolesResult.docs.map((role) => ({ value: String(role.id), label: role.name }))}
      />
    </>
  )
}
