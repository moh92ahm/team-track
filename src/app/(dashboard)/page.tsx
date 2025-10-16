import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { StaffOverviewCard } from '@/components/dashboard/staff-overview-card'
import { InventoryOverviewCard } from '@/components/dashboard/inventory-overview-card'
import { getStaffStats, getInventoryStats } from '@/lib/actions/dashboard'
import { getCurrentUser } from '@/lib/auth'

export default async function Page() {
  // Fetch current user and dashboard stats
  const [user, staffStats, inventoryStats] = await Promise.all([
    getCurrentUser(),
    getStaffStats(),
    getInventoryStats(),
  ])

  const userName = user?.email?.split('@')[0] || 'User'

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Welcome Section */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
              <p className="text-muted-foreground">Here's an overview of your team and inventory</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
            <StaffOverviewCard stats={staffStats} />
            <InventoryOverviewCard stats={inventoryStats} />
          </div>

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  )
}
