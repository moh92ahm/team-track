'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { ProfileCard } from './profile-card'
import { InfoCard } from './info-card'
import { UserStatusToggle } from './status-toggle'
import { updateUserStatus } from '@/lib/actions/user'
import type { User, Inventory } from '@/payload-types'
import { Card, CardContent } from '../ui/card'
import { SetBreadcrumbLabel } from '@/components/set-breadcrumb-label'
import { InventoryCard } from './inventory-card'
import { EmploymentStatusCard } from './employment-status'

interface ProfileLayoutProps {
  user: User
  inventory?: Inventory[]
}

export function ProfileLayout({ user, inventory = [] }: ProfileLayoutProps) {
  const handleStatusChange = async (isActive: boolean) => {
    await updateUserStatus(String(user.id), isActive)
  }

  // Use fullName as primary, fallback to username, then email
  const displayName =
    user?.fullName || user?.username || user?.email?.split('@')[0] || 'Unknown User'

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <SetBreadcrumbLabel label={displayName} />
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserStatusToggle user={user} onStatusChange={handleStatusChange} />
            <Link href={`/users/${user.id}/edit`}>
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
              <ProfileCard user={user} />
              {/* Contact Information Card */}
              <InfoCard user={user} />
              <EmploymentStatusCard user={user} />

              <InventoryCard inventory={inventory} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
