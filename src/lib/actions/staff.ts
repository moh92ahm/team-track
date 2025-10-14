'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function updateStaffStatus(staffId: string, isActive: boolean) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
      throw new Error('Unauthorized')
    }

    await payload.update({
      collection: 'staff',
      id: staffId,
      data: {
        isActive,
      },
      user,
    })

    // Revalidate the team pages to show updated status
    revalidatePath('/team')
    revalidatePath(`/team/${staffId}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating staff status:', error)
    throw new Error('Failed to update staff status')
  }
}
