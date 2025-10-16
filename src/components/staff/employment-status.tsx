'use client'
import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Staff } from '@/payload-types'
import { formatDate } from '@/lib/date-utils'

interface EmploymentStatusCardProps {
  staff: Staff
}

const labelMap: Record<string, string> = {
  citizen: 'Citizen',
  workPermit: 'Work Permit',
  residencePermit: 'Residence Permit',
  other: 'Other',
}

export function EmploymentStatusCard({ staff }: EmploymentStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Status</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium">Nationality</div>
          <div className="text-muted-foreground">{staff.nationality || 'Not specified'}</div>
        </div>
        <div>
          <div className="font-medium">Identification No.</div>
          <div className="text-muted-foreground">
            {staff.identificationNumber || 'Not specified'}
          </div>
        </div>
        <div>
          <div className="font-medium">Employment Type</div>
          <div className="text-muted-foreground">
            {staff.employmentType
              ? (labelMap[staff.employmentType] ?? staff.employmentType)
              : 'Not specified'}
          </div>
        </div>
        {/* Only show Work Permit Expiry if employment type is workPermit */}
        {staff.employmentType === 'workPermit' && (
          <div>
            <div className="font-medium">Work Permit Expiry</div>
            <div className="text-muted-foreground">{formatDate(staff.workPermitExpiry)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
