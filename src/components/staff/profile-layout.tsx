'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { ProfileCard } from './profile-card'
import { InfoCard } from './info-card'
import { StaffStatusToggle } from './status-toggle'
import { updateStaffStatus } from '@/lib/actions/staff'
import type { Staff, Inventory } from '@/payload-types'
import { Card, CardContent } from '../ui/card'
import { SetBreadcrumbLabel } from '@/components/set-breadcrumb-label'
import { InventoryCard } from './inventory-card'
import { EmploymentStatusCard } from './employment-status'

interface ProfileLayoutProps {
  staff: Staff
  inventory?: Inventory[]
}

export function ProfileLayout({ staff, inventory = [] }: ProfileLayoutProps) {
  const handleStatusChange = async (isActive: boolean) => {
    await updateStaffStatus(String(staff.id), isActive)
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <SetBreadcrumbLabel label={staff.fullName} />
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/team">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Staff Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <StaffStatusToggle staff={staff} onStatusChange={handleStatusChange} />
            <Link href={`/team/${staff.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent>
            {/* Profile Cards */}
            <div className="space-y-6">
              {/* Main Profile Card */}
              <ProfileCard staff={staff} />
              {/* Contact Information Card */}
              <InfoCard staff={staff} />
              <EmploymentStatusCard staff={staff} />
              
              <InventoryCard inventory={inventory} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
