'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Plus, FileSpreadsheet } from 'lucide-react'
import type { Payroll, User } from '@/payload-types'
import { PayrollTable } from '@/components/payroll/table'

interface PayrollListProps {
  data: Payroll[]
}

export function PayrollList({ data }: PayrollListProps) {
  const [query, setQuery] = React.useState('')

  // Single-select filter: 'all' or one specific status
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'generated' | 'reviewed' | 'approved' | 'paid'
  >('all')

  // Single-select period filter: 'all' or one specific month
  const [periodFilter, setPeriodFilter] = React.useState<string>('all')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const employee =
        typeof item.employee === 'object' && item.employee && 'fullName' in item.employee
          ? ((item.employee as User).fullName || '').toLowerCase()
          : String(item.employee || '').toLowerCase()

      const itemStatus = String((item as any).status || '').toLowerCase()
      const itemPeriod = `${item.period?.month}/${item.period?.year}`

      // Apply single-select status filter
      if (statusFilter !== 'all' && itemStatus !== statusFilter) return false

      // Apply single-select period filter
      if (periodFilter !== 'all' && itemPeriod !== periodFilter) return false

      if (!q) return true

      return itemStatus.includes(q) || employee.includes(q) || itemPeriod.includes(q)
    })
  }, [data, query, statusFilter, periodFilter])

  // Get unique periods for filter
  const uniquePeriods = React.useMemo(() => {
    const periods = data.map((item) => `${item.period?.month}/${item.period?.year}`)
    return [...new Set(periods)].sort().reverse() // Most recent first
  }, [data])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Payroll</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/payroll/generate">
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Generate Payrolls
            </Button>
          </Link>
          <Link href="/payroll/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Payroll
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          {/* Period Filter */}
          <ButtonGroup className="hidden md:flex">
            <Button
              type="button"
              size="sm"
              variant={periodFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setPeriodFilter('all')}
            >
              All Periods
            </Button>
            {uniquePeriods.slice(0, 6).map(
              (
                period, // Show last 6 periods
              ) => (
                <Button
                  key={period}
                  type="button"
                  size="sm"
                  variant={periodFilter === period ? 'default' : 'outline'}
                  onClick={() => setPeriodFilter(period)}
                >
                  {period}
                </Button>
              ),
            )}
          </ButtonGroup>

          {/* Status Filter */}
          <ButtonGroup className="hidden md:flex">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All Status
            </Button>
            {(
              [
                { label: 'Generated', value: 'generated' },
                { label: 'Reviewed', value: 'reviewed' },
                { label: 'Approved', value: 'approved' },
                { label: 'Paid', value: 'paid' },
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
            placeholder="Search employee or status..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <PayrollTable data={filtered} />
    </div>
  )
}
