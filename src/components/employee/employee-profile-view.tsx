'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileCard } from '@/components/user/profile-card'
import { InfoCard } from '@/components/user/info-card'
import { EmploymentStatusCard } from '@/components/user/employment-status'
import { PayrollCard } from '@/components/user/payroll-card'
import { LeavesCard } from '@/components/user/leaves-card'
import { InventoryCard } from '@/components/user/inventory-card'
import { DocumentsCard } from '@/components/user/documents-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { User, Inventory, LeaveDay, Payroll, PayrollSetting } from '@/payload-types'

interface EmployeeProfileViewProps {
  user: User
  inventory?: Inventory[]
  leaves?: LeaveDay[]
  payrollHistory?: Payroll[]
  payrollSettings?: PayrollSetting[]
}

export function EmployeeProfileView({
  user,
  inventory = [],
  leaves = [],
  payrollHistory = [],
  payrollSettings = [],
}: EmployeeProfileViewProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST' })
    router.push('/login')
  }

  const displayName =
    user?.fullName || user?.username || user?.email?.split('@')[0] || 'Unknown User'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header with Logout */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Welcome back, {displayName}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card>
          <CardContent className="pt-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="leaves">Leaves</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-2">
                <ProfileCard user={user} />
                <InfoCard user={user} />
                <EmploymentStatusCard user={user} />
              </TabsContent>

              {/* Payroll Tab */}
              <TabsContent value="payroll" className="space-y-6 mt-2">
                <PayrollCard payrollHistory={payrollHistory} payrollSettings={payrollSettings} />
              </TabsContent>

              {/* Leaves Tab */}
              <TabsContent value="leaves" className="space-y-6 mt-2">
                <LeavesCard leaves={leaves} />
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6 mt-2">
                <InventoryCard inventory={inventory} />
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6 mt-2">
                <DocumentsCard user={user} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
