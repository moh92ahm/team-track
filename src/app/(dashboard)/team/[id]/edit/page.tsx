import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { StaffForm } from '@/components/staff/forms/staff-form'
import { SetBreadcrumbLabel } from '@/components/set-breadcrumb-label'

interface EditStaffPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditStaffPage({ params }: EditStaffPageProps) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin')

  try {
    // Fetch the staff member to edit
    const staff = await payload.findByID({
      collection: 'staff',
      id: id,
      depth: 2, // to resolve relationships
      user,
    })

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

    const handleUpdateStaff = async (formData: FormData) => {
      'use server'

      const payload = await getPayload({ config: configPromise })
      const { user } = await payload.auth({ headers: await headers() })

      if (!user) {
        throw new Error('Unauthorized')
      }

      // Handle photo upload if file is provided
      let photoId: number | string | null = null
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
        photoId = uploadResult.id
      } else {
        // Keep existing if present via initial data (not sent by form)
        photoId = null
      }

      // Normalize optionals; email field must not receive empty string
      const jobTitle = String(formData.get('jobTitle') || '')
      const workPhone = String(formData.get('workPhone') || '')
      const contactEmail = String(formData.get('contactEmail') || '')

      // Update the staff member
      const staffData: any = {
        fullName,
        ...(photoId && { photo: photoId }),
        birthDate: String(formData.get('birthDate') || ''),
        personalPhone: String(formData.get('personalPhone') || ''),
        workEmail: String(formData.get('workEmail') || ''),
        joinedAt: String(formData.get('joinedAt') || ''),
      }

      // Optional fields
      staffData.jobTitle = jobTitle || null
      staffData.workPhone = workPhone || null
      staffData.contactEmail = contactEmail || null

      // Convert string IDs to numbers if they have values
      const department = String(formData.get('department') || '')
      if (department) staffData.department = parseInt(department)
      const role = String(formData.get('role') || '')
      if (role) staffData.role = parseInt(role)

      await payload.update({
        collection: 'staff',
        id: id,
        data: staffData as any,
        user,
      })

      // Redirect back to the staff profile
      redirect(`/team/${id}`)
    }

    return (
      <>
        <SetBreadcrumbLabel label={staff.fullName} />
        <StaffForm
        mode="edit"
        initialData={staff}
        formAction={handleUpdateStaff}
        departments={departmentsResult.docs.map((dept) => ({ value: String(dept.id), label: dept.name }))}
        roles={rolesResult.docs.map((role) => ({ value: String(role.id), label: role.name }))}
        />
      </>
    )
  } catch (error) {
    console.error('Error fetching staff:', error)
    notFound()
  }
}
