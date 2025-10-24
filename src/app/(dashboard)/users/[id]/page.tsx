import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProfileLayout } from '@/components/user/profile-layout'
import type { Inventory, LeaveDay, Payroll, PayrollSetting } from '@/payload-types'

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

    // Fetch leave records for this user
    const leavesRes = await payload.find({
      collection: 'leave-days',
      depth: 2,
      limit: 100,
      where: {
        user: {
          equals: Number(user.id),
        },
      },
      sort: '-createdAt', // Show most recent first
      user: currentUser,
    })

    // Fetch payroll records for this user
    const payrollRes = await payload.find({
      collection: 'payroll',
      depth: 2,
      limit: 100,
      where: {
        employee: {
          equals: Number(user.id),
        },
      },
      sort: '-createdAt', // Show most recent first
      user: currentUser,
    })

    // Fetch payroll settings for this user
    const payrollSettingsRes = await payload.find({
      collection: 'payroll-settings',
      depth: 2,
      limit: 100,
      where: {
        employee: {
          equals: Number(user.id),
        },
      },
      sort: '-createdAt', // Show most recent first
      user: currentUser,
    })

    return (
      <ProfileLayout
        user={user}
        inventory={invRes.docs as Inventory[]}
        leaves={leavesRes.docs as LeaveDay[]}
        payrollHistory={payrollRes.docs as Payroll[]}
        payrollSettings={payrollSettingsRes.docs as PayrollSetting[]}
      />
    )
  } catch (error) {
    console.error('Error fetching user:', error)
    notFound()
  }
}
