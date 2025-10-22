'use client'

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    'all' | 'generated' | 'reviewed' | 'approved' | 'paid' | 'cancelled'
  >('all')

  // Dynamic period filter with separate month and year
  const currentDate = new Date()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const currentYear = currentDate.getFullYear()

  const [selectedMonth, setSelectedMonth] = React.useState<string>(currentMonth)
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear)
  const [showAllPeriods, setShowAllPeriods] = React.useState<boolean>(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const employee =
        typeof item.employee === 'object' && item.employee && 'fullName' in item.employee
          ? ((item.employee as User).fullName || '').toLowerCase()
          : String(item.employee || '').toLowerCase()

      const itemStatus = String((item as unknown as { status?: string }).status || '').toLowerCase()

      // Apply single-select status filter
      if (statusFilter !== 'all' && itemStatus !== statusFilter) return false

      // Apply dynamic period filter (unless showing all periods)
      if (!showAllPeriods) {
        const itemMonth = item.period?.month
        const itemYear = item.period?.year
        if (itemMonth !== selectedMonth || itemYear !== selectedYear) return false
      }

      if (!q) return true

      return itemStatus.includes(q) || employee.includes(q)
    })
  }, [data, query, statusFilter, showAllPeriods, selectedMonth, selectedYear])

  // Get unique months and years from data
  const { availableMonths, availableYears } = React.useMemo(() => {
    const months = new Set<string>()
    const years = new Set<number>()

    // Always include current month and year
    months.add(currentMonth)
    years.add(currentYear)

    data.forEach((item) => {
      if (item.period?.month) months.add(item.period.month)
      if (item.period?.year) years.add(item.period.year)
    })

    return {
      availableMonths: Array.from(months).sort(),
      availableYears: Array.from(years).sort((a, b) => b - a), // Most recent first
    }
  }, [data, currentMonth, currentYear])

  // Month names for display
  const monthNames = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  }

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

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Period Filter */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={showAllPeriods ? 'default' : 'outline'}
              onClick={() => setShowAllPeriods(!showAllPeriods)}
            >
              {showAllPeriods ? 'All Periods' : 'Current Period'}
            </Button>

            {!showAllPeriods && (
              <>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {monthNames[month as keyof typeof monthNames]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={String(selectedYear)}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
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
