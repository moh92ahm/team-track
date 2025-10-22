'use client'

import * as React from 'react'
import { Payroll, User } from '@/payload-types'
import { Badge } from '../ui/badge'
import { DataTable } from '../data-table'
import { Button } from '../ui/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface PayrollTableProps {
  data: Payroll[]
  enablePagination?: boolean
}

type PayrollStatus = 'generated' | 'reviewed' | 'approved' | 'paid' | 'cancelled'

const statusOptions: { value: PayrollStatus; label: string }[] = [
  { value: 'generated', label: 'Generated' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'approved', label: 'Approved' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function PayrollTable({ data, enablePagination = true }: PayrollTableProps) {
  const [updatingStatus, setUpdatingStatus] = React.useState<number | null>(null)

  const updatePayrollStatus = async (payrollId: number, newStatus: PayrollStatus) => {
    setUpdatingStatus(payrollId)
    try {
      const response = await fetch(`/api/payroll/${payrollId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating payroll status:', error)
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'default'
      case 'paid':
        return 'secondary'
      case 'reviewed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '₺0.00'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount)
  }

  const formatPeriod = (period: { month?: string; year?: number }) => {
    if (!period?.month || !period?.year) return '-'
    const monthNames = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    }
    return `${monthNames[period.month as keyof typeof monthNames]} ${period.year}`
  }

  const columns = [
    {
      key: 'employee' as keyof Payroll,
      header: 'Employee',
      render: (value: unknown, item: Payroll) => {
        const employee = item.employee
        return typeof employee === 'object' && employee !== null && 'fullName' in employee
          ? (employee as User).fullName
          : employee || '-'
      },
    },
    {
      key: 'period' as keyof Payroll,
      header: 'Period',
      render: (value: unknown, item: Payroll) => formatPeriod(item.period || {}),
    },
    {
      key: 'workDays' as keyof Payroll,
      header: 'Work Days',
      render: (value: unknown, item: Payroll) => {
        const workDays = item.workDays
        if (!workDays) return '-'
        return `${workDays.daysWorked || 0}/${workDays.totalWorkingDays || 0}`
      },
    },
    {
      key: 'grossPay' as keyof Payroll,
      header: 'Gross Pay',
      render: (value: unknown, item: Payroll) => {
        return formatCurrency(item.calculations?.grossPay)
      },
    },
    {
      key: 'netPay' as keyof Payroll,
      header: 'Net Pay',
      render: (value: unknown, item: Payroll) => {
        return formatCurrency(item.calculations?.netPay)
      },
    },
    {
      key: 'status' as keyof Payroll,
      header: 'Status',
      render: (value: unknown, item: Payroll) => {
        const currentStatus = String(value) as PayrollStatus
        const isUpdating = updatingStatus === Number(item.id)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                disabled={isUpdating}
              >
                <Badge
                  variant={getStatusVariant(currentStatus)}
                  className="capitalize cursor-pointer hover:opacity-80 flex items-center gap-1"
                >
                  {currentStatus}
                  <ChevronDown className="h-3 w-3" />
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updatePayrollStatus(Number(item.id), option.value)}
                  className={`cursor-pointer capitalize ${option.value === currentStatus ? 'bg-accent' : ''}`}
                  disabled={option.value === currentStatus || isUpdating}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const actionColumn = (item: Payroll) => (
    <Link href={`/payroll/${item.id}/edit`} className="flex-1">
      <Button variant="outline" className="w-full">
        Edit Payroll
      </Button>
    </Link>
  )

  return (
    <div className="space-y-4">
      <DataTable<Payroll>
        data={data.map((item) => ({
          ...item,
          id: Number(item.id),
        }))}
        columns={columns}
        actionColumn={actionColumn}
        enablePagination={enablePagination}
      />
    </div>
  )
}
