'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Plus } from 'lucide-react'
import type { LeaveDay, User } from '@/payload-types'
import { LeaveDayTable } from '@/components/leaves/table'

interface LeaveDayProps {
  data: LeaveDay[]
}

export function LeaveDayList({ data }: LeaveDayProps) {
  const [query, setQuery] = React.useState('')
  // Single-select filter: 'all' or one specific status
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'requested' | 'approved' | 'rejected' | 'cancelled'
  >('all')

  // Single-select type filter: 'all' or one specific type
  const [typeFilter, setTypeFilter] = React.useState<
    'all' | 'annual' | 'sick' | 'unpaid' | 'other'
  >('all')

  // React.useEffect(() => {
  //   const t = setTimeout()
  //   return () => clearTimeout(t)
  // }, [query])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const user =
        typeof item.user === 'object' && item.user && 'fullName' in item.user
          ? ((item.user as User).fullName || '').toLowerCase()
          : String(item.user || '').toLowerCase()

      const itemStatus = String((item as any).status || '').toLowerCase()
      const itemType = String((item as any).type || '').toLowerCase()

      // Apply single-select status filter (skip items that don't match when a specific status is selected)
      if (statusFilter !== 'all' && itemStatus !== statusFilter) return false

      // Apply single-select type filter (skip items that don't match when a specific type is selected)
      if (typeFilter !== 'all' && itemType !== typeFilter) return false

      if (!q) return true

      return itemStatus.includes(q) || itemType.includes(q) || user.includes(q)
    })
  }, [data, query, statusFilter, typeFilter])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Leaves</h1>
        </div>
        <div className="flex gap-2 md:flex-row md:items-center">
          <div className="flex gap-2">
            {/* Type Filter */}
            <ButtonGroup className="hidden md:flex">
              <Button
                type="button"
                size="sm"
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
              >
                All
              </Button>
              {(
                [
                  { label: 'Annual', value: 'annual' },
                  { label: 'Sick', value: 'sick' },
                  { label: 'Unpaid', value: 'unpaid' },
                  { label: 'Other', value: 'other' },
                ] as const
              ).map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={typeFilter === value ? 'default' : 'outline'}
                  onClick={() => setTypeFilter(value)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>

            {/* Status Filter */}
            <ButtonGroup className="hidden md:flex">
              <Button
                type="button"
                size="sm"
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              {(
                [
                  { label: 'Requested', value: 'requested' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                  { label: 'Cancelled', value: 'cancelled' },
                ] as const
              ).map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={statusFilter === value ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(value)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <Input
              placeholder="Search ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-56"
            />
            <Link href="/leaves/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Leave Request
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <LeaveDayTable data={filtered} />
    </div>
  )
}
