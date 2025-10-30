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
import { Plus, FileSpreadsheet, Search } from 'lucide-react'
import type { Payroll, User } from '@/payload-types'
import { PayrollTable } from '@/components/payroll/table'

interface PayrollListProps {
  data: Payroll[]
}

export function PayrollList({ data }: PayrollListProps) {
  const [query, setQuery] = React.useState('')

  // Single-select filter: 'all' or one specific status
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'generated' | 'approved' | 'paid' | 'cancelled'
  >('all')

  // Dynamic period filter with separate month and year
  const currentDate = new Date()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
  const currentYear = currentDate.getFullYear()

  const [selectedMonth, setSelectedMonth] = React.useState<string>(currentMonth)
  const [selectedYear, setSelectedYear] = React.useState<number>(currentYear)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const employee =
        typeof item.employee === 'object' && item.employee && 'fullName' in item.employee
          ? ((item.employee as User).fullName || '').toLowerCase()
          : String(item.employee || '').toLowerCase()

      const itemStatus = String((item as unknown as { status?: string }).status || '').toLowerCase()

      // Get payment type from first payroll item
      const items = item.payrollItems
      const paymentType =
        items && Array.isArray(items) && items.length > 0
          ? String((items[0] as any)?.paymentType || '').toLowerCase()
          : ''

      // Convert payment type to readable format for search
      const paymentTypeLabel =
        paymentType === 'banktransfer'
          ? 'bank transfer'
          : paymentType === 'cash'
            ? 'cash'
            : paymentType === 'cheque'
              ? 'cheque'
              : ''

      // Check if it's an additional payment
      const isAdditional = (item as any).isAdditionalPayment
      const additionalText = isAdditional ? 'additional' : ''

      // Apply period filter (month and year)
      if (item.period?.month !== selectedMonth || item.period?.year !== selectedYear) {
        return false
      }

      // Apply single-select status filter
      if (statusFilter !== 'all' && itemStatus !== statusFilter) return false

      if (!q) return true

      return (
        itemStatus.includes(q) ||
        employee.includes(q) ||
        paymentType.includes(q) ||
        paymentTypeLabel.includes(q) ||
        additionalText.includes(q)
      )
    })
  }, [data, query, statusFilter, selectedMonth, selectedYear])

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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Records</h1>
          <div className="text-sm text-muted-foreground">{filtered.length} Items</div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link href="/payroll/generate">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Generate Payrolls
            </Button>
          </Link>
          <Link href="/payroll/additional/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search - Responsive Grid Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] xl:grid-cols-[auto_auto]">
        {/* Left: Period & Status Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {/* Period Filter (Month + Year) */}
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[140px]">
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
              <SelectTrigger className="w-full sm:w-[100px]">
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
          </div>

          {/* Status Filter */}
          <ButtonGroup className="overflow-x-auto">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="flex-shrink-0"
            >
              All Status
            </Button>
            {(
              [
                { label: 'Generated', value: 'generated' },
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
                className="capitalize flex-shrink-0"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Right: Search Input */}
        <div className="flex items-top">
          <div className="relative w-full lg:w-64 xl:w-80">
            <Input
              placeholder="Search employee, status, or type..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <PayrollTable data={filtered} />
    </div>
  )
}
