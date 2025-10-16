import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProfileLayout } from '@/components/staff/profile-layout'
import type { Inventory } from '@/payload-types'

interface StaffProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StaffProfilePage({ params }: StaffProfilePageProps) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/admin')

  try {
    const staff = await payload.findByID({
      collection: 'staff',
      id: id,
      depth: 2, // to resolve department and role relationships
      user,
    })
    // Fetch inventory items held by this staff member
    const invRes = await payload.find({
      collection: 'inventory',
      depth: 2,
      limit: 100,
      where: {
        holder: {
          equals: Number(staff.id),
        },
      },
      user,
    })

    return <ProfileLayout staff={staff} inventory={invRes.docs as Inventory[]} />
  } catch (error) {
    console.error('Error fetching staff:', error)
    notFound()
  }
}
