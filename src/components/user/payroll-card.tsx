'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import type { User, Payroll } from '@/payload-types'
import { TurkishLira, CreditCard } from 'lucide-react'

interface PayrollCardProps {
  user: User
  payrollHistory?: Payroll[]
}

export function PayrollCard({ user, payrollHistory = [] }: PayrollCardProps) {
  // Extract employment data from user
  const employment = (user as any)?.employment || {}
  const { baseSalary, paymentType } = employment

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (!amount && amount !== 0) return 'Not set'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Format payment type for display
  const formatPaymentType = (type: string | undefined) => {
    if (!type) return 'Not specified'
    switch (type) {
      case 'bankTransfer':
        return 'Bank Transfer'
      case 'cash':
        return 'Cash'
      case 'cheque':
        return 'Cheque'
      default:
        return type
    }
  }

  // Get payment type color
  const getPaymentTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'bankTransfer':
        return 'default'
      case 'cash':
        return 'secondary'
      case 'cheque':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // Get status variant
  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'approved':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Payment history table columns
  const columns = [
    {
      key: 'period' as keyof Payroll,
      header: 'Period',
      render: (value: unknown) => {
        const period = value as { month: string; year: number }
        if (!period) return '-'
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
      },
    },
    {
      key: 'grossPay' as keyof Payroll,
      header: 'Gross Pay',
      render: (value: unknown, item: Payroll) => {
        const calc = item.calculations as { grossPay: number }
        return calc?.grossPay ? formatCurrency(calc.grossPay) : '-'
      },
    },
    {
      key: 'netPay' as keyof Payroll,
      header: 'Net Pay',
      render: (value: unknown, item: Payroll) => {
        const calc = item.calculations as { netPay: number }
        return calc?.netPay ? formatCurrency(calc.netPay) : '-'
      },
    },
    {
      key: 'status' as keyof Payroll,
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant={getStatusVariant(String(value))} className="capitalize">
          {String(value)}
        </Badge>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TurkishLira className="h-5 w-5" />
            Payroll Information
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Salary and Payment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Base Salary</p>
            <p className="text-xl font-semibold">{formatCurrency(baseSalary)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Payment Type</p>
            <Badge
              variant={getPaymentTypeColor(paymentType) as 'default' | 'secondary' | 'outline'}
              className="flex items-center gap-1 w-fit"
            >
              <CreditCard className="h-3 w-3" />
              {formatPaymentType(paymentType)}
            </Badge>
          </div>
        </div>

        {/* Payment History Table */}
        <div>
          <h3 className="text-md font-semibold mb-3">Payment History</h3>
          {payrollHistory.length > 0 ? (
            <div className="w-full overflow-auto">
              <DataTable<Payroll>
                data={payrollHistory.map((item) => ({
                  ...item,
                  id: Number(item.id),
                }))}
                columns={columns}
                enablePagination={false}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment records found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
