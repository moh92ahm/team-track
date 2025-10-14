'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Mail, Phone } from 'lucide-react'
import type { Staff } from '@/payload-types'

interface InfoCardProps {
  staff: Staff
}

export function InfoCard({ staff }: InfoCardProps) {
  const formatPhoneNumbers = (phones: string | string[] | undefined) => {
    if (!phones) return 'Not provided'
    if (Array.isArray(phones)) {
      return phones.join(', ')
    }
    return phones
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Birth Date */}
        <div className="flex items-start space-x-3">
          <CalendarDays className="h-4 w-4 mt-1 text-muted-foreground" />
          <div>
            <h4 className="text-sm font-medium">Birth Date</h4>
            <p className="text-sm text-muted-foreground">
              {staff.birthDate
                ? new Date(staff.birthDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Not specified'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Email Addresses */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <h4 className="text-sm font-medium">Work Email</h4>
              <p className="text-sm text-muted-foreground">{staff.workEmail}</p>
            </div>
          </div>

          {staff.contactEmail && (
            <div className="flex items-start space-x-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Contact Email</h4>
                <p className="text-sm text-muted-foreground">{staff.contactEmail}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Phone Numbers */}
        <div className="space-y-4">
          {staff.personalPhone && (
            <div className="flex items-start space-x-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Personal Phone</h4>
                <p className="text-sm text-muted-foreground">
                  {formatPhoneNumbers(staff.personalPhone)}
                </p>
              </div>
            </div>
          )}

          {staff.workPhone && (
            <div className="flex items-start space-x-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">Work Phone</h4>
                <p className="text-sm text-muted-foreground">{staff.workPhone}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Address - Commented out until address field is added to Staff collection */}
        {/* 
        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
          <div className="flex-1">
            <h4 className="text-sm font-medium">Address</h4>
            <p className="text-sm text-muted-foreground">
              {staff.address || 'Not specified'}
            </p>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  )
}
