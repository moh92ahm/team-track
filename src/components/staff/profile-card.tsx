'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import type { Staff } from '@/payload-types'

interface ProfileCardProps {
  staff: Staff
}

export function ProfileCard({ staff }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const department =
    typeof staff.department === 'object' && staff.department && 'name' in staff.department
      ? (staff.department as { name: string }).name
      : staff.department || 'No department'

  const role =
    typeof staff.role === 'object' && staff.role && 'name' in staff.role
      ? (staff.role as { name: string }).name
      : staff.role || 'No role'

  const photo =
    typeof staff.photo === 'object' && staff.photo && 'url' in staff.photo
      ? (staff.photo as { url: string }).url
      : ''

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={photo} alt={staff.fullName} className="object-cover" />
            <AvatarFallback className="text-xl">{getInitials(staff.fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{staff.fullName}</h2>
            <p className="text-lg text-muted-foreground">{staff.jobTitle || ''}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-muted-foreground">{String(role)}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{String(department)}</span>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Joined: </span>
                <span className="font-medium">
                  {staff.joinedAt
                    ? new Date(staff.joinedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not specified'}
                </span>
              </div>
              <Badge variant={staff.isActive ? 'default' : 'secondary'}>
                {staff.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
