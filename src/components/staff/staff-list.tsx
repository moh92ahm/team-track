"use client"

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Plus } from 'lucide-react'
import type { Staff } from '@/payload-types'
import { StaffTable } from '@/components/staff/table'

interface StaffListProps {
  data: Staff[]
}

export function StaffList({ data }: StaffListProps) {
  const [query, setQuery] = React.useState('')
  const [debounced, setDebounced] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all')

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const filtered = React.useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return data.filter((s) => {
      if (statusFilter === 'active' && !s.isActive) return false
      if (statusFilter === 'inactive' && s.isActive) return false
      const name = s.fullName?.toLowerCase() || ''
      const dept =
        (typeof s.department === 'object' && s.department && 'name' in s.department
          ? (s.department as any).name
          : '')?.toLowerCase() || ''
      const role =
        (typeof s.role === 'object' && s.role && 'name' in s.role
          ? (s.role as any).name
          : '')?.toLowerCase() || ''
      const email = (s.workEmail || '').toLowerCase()
      if (!q) return true
      return name.includes(q) || dept.includes(q) || role.includes(q) || email.includes(q)
    })
  }, [data, debounced, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Team</h1>
          <div className="text-sm text-muted-foreground">
            {data.length} total · {filtered.length} shown
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ButtonGroup className="hidden sm:flex mr-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </Button>
          </ButtonGroup>
          <Input
            placeholder="Search staff..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56"
          />
          <Link href="/team/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Staff
            </Button>
          </Link>
        </div>
      </div>
      <StaffTable data={filtered} />
    </div>
  )
}
