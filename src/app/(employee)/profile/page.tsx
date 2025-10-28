import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { EmployeeProfileView } from '@/components/employee/employee-profile-view'

export default async function EmployeeProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is basic employee (not super admin, HR, or Manager)
  const isSuperAdmin = user.isSuperAdmin === true
  const hasAdminPermissions = user.role?.permissions?.users?.viewAll === true
  const isBasicEmployee = !isSuperAdmin && !hasAdminPermissions

  // Only basic employees should access this page
  if (!isBasicEmployee) {
    redirect('/')
  }

  const payload = await getPayload({ config: configPromise })

  // Fetch full user data with relations
  const userData = await payload.findByID({
    collection: 'users',
    id: user.id,
    depth: 2,
  })

  // Fetch user's inventory
  const { docs: inventory } = await payload.find({
    collection: 'inventory',
    where: {
      holder: {
        equals: user.id,
      },
    },
    depth: 1,
  })

  // Fetch user's leaves
  const { docs: leaves } = await payload.find({
    collection: 'leave-days',
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 1,
    sort: '-startDate',
  })

  // Fetch user's payroll history
  const { docs: payrollHistory } = await payload.find({
    collection: 'payroll',
    where: {
      employee: {
        equals: user.id,
      },
    },
    depth: 1,
    sort: '-period.year',
  })

  // Fetch payroll settings
  const { docs: payrollSettings } = await payload.find({
    collection: 'payroll-settings',
    limit: 100,
  })

  return (
    <EmployeeProfileView
      user={userData}
      inventory={inventory}
      leaves={leaves}
      payrollHistory={payrollHistory}
      payrollSettings={payrollSettings}
    />
  )
}
