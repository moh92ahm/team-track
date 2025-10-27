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
import { Plus } from 'lucide-react'
import type { PayrollSetting, User } from '@/payload-types'
import { PayrollSettingsTable } from '@/components/payroll/settings/table'

interface PayrollSettingsListProps {
  data: PayrollSetting[]
}

export function PayrollSettingsList({ data }: PayrollSettingsListProps) {
  const [query, setQuery] = React.useState('')

  // Filter by payroll type
  const [typeFilter, setTypeFilter] = React.useState<
    'all' | 'primary' | 'bonus' | 'overtime' | 'commission' | 'allowance' | 'other'
  >('all')

  // Filter by status (active/inactive)
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('active')

  // Filter by employee
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>('all')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const employee =
        typeof item.employee === 'object' && item.employee && 'fullName' in item.employee
          ? ((item.employee as User).fullName || '').toLowerCase()
          : String(item.employee || '').toLowerCase()

      const description = (item.description || '').toLowerCase()
      const payrollType = String(item.payrollType || '').toLowerCase()
      const paymentType = String(item.paymentDetails?.paymentType || '').toLowerCase()

      // Apply type filter
      if (typeFilter !== 'all' && payrollType !== typeFilter) return false

      // Apply status filter
      if (statusFilter === 'active' && !item.isActive) return false
      if (statusFilter === 'inactive' && item.isActive) return false

      // Apply employee filter
      if (selectedEmployee !== 'all') {
        const employeeId =
          typeof item.employee === 'object' && item.employee && 'id' in item.employee
            ? String(item.employee.id)
            : String(item.employee)
        if (employeeId !== selectedEmployee) return false
      }

      if (!q) return true

      return employee.includes(q) || description.includes(q) || paymentType.includes(q)
    })
  }, [data, query, typeFilter, statusFilter, selectedEmployee])

  // Get unique employees for filter
  const employees = React.useMemo(() => {
    const uniqueEmployees = new Map<string, string>()
    data.forEach((item) => {
      if (typeof item.employee === 'object' && item.employee && 'id' in item.employee) {
        const emp = item.employee as User
        uniqueEmployees.set(String(emp.id), emp.fullName || 'Unknown')
      }
    })
    return Array.from(uniqueEmployees.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [data])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage employee payroll configurations</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/payroll/settings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Payroll Setting
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Employee Filter */}
        <div className="flex items-center gap-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </Button>
          </ButtonGroup>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col gap-2">
          <ButtonGroup className="hidden lg:flex">
            <Button
              type="button"
              size="sm"
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
            >
              All Types
            </Button>
            {(
              [
                { label: 'Primary', value: 'primary' },
                { label: 'Bonus', value: 'bonus' },
                { label: 'Overtime', value: 'overtime' },
                { label: 'Commission', value: 'commission' },
                { label: 'Allowance', value: 'allowance' },
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
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          <Input
            placeholder="Search employee or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <PayrollSettingsTable data={filtered} />
    </div>
  )
}
