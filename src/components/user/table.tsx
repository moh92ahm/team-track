'use client'

import { User } from '@/payload-types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DataTable } from '../data-table'
import { formatDate } from '@/lib/date-utils'

interface UserTableProps {
  data: User[]
}

const labelMap: Record<string, string> = {
  citizen: 'Citizen',
  workPermit: 'Work Permit',
  residencePermit: 'Residence Permit',
  other: 'Other',
}

export function UserTable({ data }: UserTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const columns = [
    {
      key: 'photo' as keyof User,
      header: 'Image',
      render: (photo: unknown, user: User) => {
        const photoUrl =
          typeof photo === 'object' && photo && 'url' in photo ? (photo as { url: string }).url : ''
        return (
          <Avatar className="h-12 w-12">
            <AvatarImage src={photoUrl} alt={user.fullName} className="object-cover" />
            <AvatarFallback className="text-md">{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      key: 'fullName' as keyof User,
      header: 'Full Name',
    },
    {
      key: 'department' as keyof User,
      header: 'Department',
      render: (dept: unknown) =>
        typeof dept === 'object' && dept && 'name' in dept
          ? (dept as { name: string }).name
          : (dept as string) || '-',
    },
    {
      key: 'role' as keyof User,
      header: 'Role',
      render: (role: unknown) =>
        typeof role === 'object' && role && 'name' in role
          ? (role as { name: string }).name
          : String(role || '-'),
    },
    {
      key: 'joinedAt' as keyof User,
      header: 'Joined At',
      render: (date: unknown) => {
        const isValidDate = date === null || typeof date === 'string' || date instanceof Date
        return isValidDate ? formatDate(date as string | Date | null) : '-'
      },
    },
    {
      key: 'employmentType' as keyof User,
      header: 'Employment Type',
      render: (type: unknown) => (
        <Badge>{type ? labelMap[String(type)] || String(type) : '-'}</Badge>
      ),
    },
    {
      key: 'isActive' as keyof User,
      header: 'Status',
      render: (isActive: unknown) => (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  const actionColumn = (user: User) => (
    <Link href={`/users/${user.id}`}>
      <Button variant="outline" size="sm">
        View
      </Button>
    </Link>
  )

  return <DataTable data={data} columns={columns} actionColumn={actionColumn} />
}
