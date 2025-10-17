import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { UserForm } from '@/components/user/forms/user-form'
import { SetBreadcrumbLabel } from '@/components/set-breadcrumb-label'

interface EditUserPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login')

  try {
    // Fetch the user to edit
    const userToEdit = await payload.findByID({
      collection: 'users',
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

    const handleUpdateUser = async (formData: FormData) => {
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
      const secondaryPhone = String(formData.get('secondaryPhone') || '')
      const secondaryEmail = String(formData.get('secondaryEmail') || '')
      const email = String(formData.get('email') || '')
      const username = String(formData.get('username') || '')

      // Update the user
      const userData: any = {
        fullName,
        ...(photoId && { photo: photoId }),
        birthDate: String(formData.get('birthDate') || ''),
        primaryPhone: String(formData.get('primaryPhone') || ''),
        ...(email ? { email } : {}),
        ...(username ? { username } : {}),
        joinedAt: String(formData.get('joinedAt') || ''),
        employmentType: String(formData.get('employmentType') || 'other'),
        nationality: String(formData.get('nationality') || ''),
        identificationNumber: String(formData.get('identificationNumber') || ''),
        address: String(formData.get('address') || ''),
      }

      // Optional date fields: set to value if provided, otherwise null to clear
      const workPermitExpiry = String(formData.get('workPermitExpiry') || '')
      userData.workPermitExpiry = workPermitExpiry || null
      // remove unrelated insurance/contact expiry fields

      // Optional fields
      userData.jobTitle = jobTitle || null
      userData.secondaryPhone = secondaryPhone || null
      userData.secondaryEmail = secondaryEmail || null

      // Convert string IDs to numbers if they have values
      const department = String(formData.get('department') || '')
      if (department) userData.department = parseInt(department)
      const role = String(formData.get('role') || '')
      if (role) userData.role = parseInt(role)

      await payload.update({
        collection: 'users',
        id: id,
        data: userData as any,
        user,
      })

      // Redirect back to the user profile
      redirect(`/users/${user.id}`)
    }

    return (
      <>
        <SetBreadcrumbLabel label={userToEdit.fullName} />
        <UserForm
        mode="edit"
        initialData={userToEdit}
        formAction={handleUpdateUser}
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
