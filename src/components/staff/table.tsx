'use client'

import { Staff } from '@/payload-types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DataTable } from '../data-table'
import { formatDate } from '@/lib/date-utils'

interface StaffTableProps {
  data: Staff[]
}

const labelMap: Record<string, string> = {
  citizen: 'Citizen',
  workPermit: 'Work Permit',
  residencePermit: 'Residence Permit',
  other: 'Other',
}

export function StaffTable({ data }: StaffTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const columns = [
    {
      key: 'photo' as keyof Staff,
      header: 'Image',
      render: (photo: unknown, staff: Staff) => {
        const photoUrl =
          typeof photo === 'object' && photo && 'url' in photo ? (photo as { url: string }).url : ''
        return (
          <Avatar className="h-12 w-12">
            <AvatarImage src={photoUrl} alt={staff.fullName} className="object-cover" />
            <AvatarFallback className="text-md">{getInitials(staff.fullName)}</AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      key: 'fullName' as keyof Staff,
      header: 'Full Name',
    },
    {
      key: 'department' as keyof Staff,
      header: 'Department',
      render: (dept: unknown) =>
        typeof dept === 'object' && dept && 'name' in dept
          ? (dept as { name: string }).name
          : (dept as string) || '-',
    },
    {
      key: 'role' as keyof Staff,
      header: 'Role',
      render: (role: unknown) =>
        typeof role === 'object' && role && 'name' in role
          ? (role as { name: string }).name
          : String(role || '-'),
    },
    {
      key: 'joinedAt' as keyof Staff,
      header: 'Joined At',
      render: (date: unknown) => {
        const isValidDate = date === null || typeof date === 'string' || date instanceof Date
        return isValidDate ? formatDate(date as string | Date | null) : '-'
      },
    },
    {
      key: 'employmentType' as keyof Staff,
      header: 'Employment Type',
      render: (type: unknown) => (
        <Badge>{type ? labelMap[String(type)] || String(type) : '-'}</Badge>
      ),
    },
    {
      key: 'isActive' as keyof Staff,
      header: 'Status',
      render: (isActive: unknown) => (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  const actionColumn = (staff: Staff) => (
    <Link href={`/team/${staff.id}`}>
      <Button variant="outline" size="sm">
        View
      </Button>
    </Link>
  )

  return <DataTable data={data} columns={columns} actionColumn={actionColumn} />
}
