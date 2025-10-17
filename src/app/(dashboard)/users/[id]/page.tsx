import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProfileLayout } from '@/components/user/profile-layout'
import type { Inventory } from '@/payload-types'

interface UserProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  const { user: currentUser } = await payload.auth({ headers: await headers() })
  if (!currentUser) redirect('/admin')

  try {
    const user = await payload.findByID({
      collection: 'users',
      id: id,
      depth: 2, // to resolve department and role relationships
      user: currentUser,
    })
    // Fetch inventory items held by this user
    const invRes = await payload.find({
      collection: 'inventory',
      depth: 2,
      limit: 100,
      where: {
        holder: {
          equals: Number(user.id),
        },
      },
      user: currentUser,
    })

    return <ProfileLayout user={user} inventory={invRes.docs as Inventory[]} />
  } catch (error) {
    console.error('Error fetching user:', error)
    notFound()
  }
}
