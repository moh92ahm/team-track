'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/payload-types'
import { DollarSign, Clock, TrendingUp, TrendingDown, TurkishLira } from 'lucide-react'

interface PayrollCardProps {
  user: User
}

export function PayrollCard({ user }: PayrollCardProps) {
  // Extract employment data from user
  const employment = (user as any)?.employment || {}
  const { baseSalary, workType, defaultAllowances = {}, defaultDeductions = {} } = employment

  // Calculate total allowances
  const totalAllowances =
    (defaultAllowances.transport || 0) +
    (defaultAllowances.meal || 0) +
    (defaultAllowances.housing || 0) +
    (defaultAllowances.other || 0)

  // Calculate total deductions
  const totalDeductions =
    (defaultDeductions.insurance || 0) +
    (defaultDeductions.pension || 0) +
    (defaultDeductions.loan || 0) +
    (defaultDeductions.other || 0)

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

  // Format work type for display
  const formatWorkType = (type: string | undefined) => {
    if (!type) return 'Not specified'
    switch (type) {
      case 'fulltime':
        return 'Full-time'
      case 'parttime':
        return 'Part-time'
      case 'contract':
        return 'Contract'
      default:
        return type
    }
  }

  // Get work type color
  const getWorkTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'fulltime':
        return 'default'
      case 'parttime':
        return 'secondary'
      case 'contract':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TurkishLira className="h-5 w-5" />
          Payroll Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Salary and Work Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Base Salary</p>
            <p className="text-xl font-semibold">{formatCurrency(baseSalary)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Work Type</p>
            <Badge
              variant={getWorkTypeColor(workType) as any}
              className="flex items-center gap-1 w-fit"
            >
              <Clock className="h-3 w-3" />
              {formatWorkType(workType)}
            </Badge>
          </div>
        </div>

        {/* Allowances and Deductions Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium">Total Monthly Allowances</p>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(totalAllowances)}
            </p>
            {totalAllowances > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                {defaultAllowances.transport > 0 && (
                  <div>Transport: {formatCurrency(defaultAllowances.transport)}</div>
                )}
                {defaultAllowances.meal > 0 && (
                  <div>Meal: {formatCurrency(defaultAllowances.meal)}</div>
                )}
                {defaultAllowances.housing > 0 && (
                  <div>Housing: {formatCurrency(defaultAllowances.housing)}</div>
                )}
                {defaultAllowances.other > 0 && (
                  <div>Other: {formatCurrency(defaultAllowances.other)}</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium">Total Monthly Deductions</p>
            </div>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totalDeductions)}</p>
            {(totalDeductions > 0 || defaultDeductions.taxRate) && (
              <div className="text-xs text-muted-foreground space-y-1">
                {defaultDeductions.taxRate && <div>Tax Rate: {defaultDeductions.taxRate}%</div>}
                {defaultDeductions.insurance > 0 && (
                  <div>Insurance: {formatCurrency(defaultDeductions.insurance)}</div>
                )}
                {defaultDeductions.pension > 0 && (
                  <div>Pension: {formatCurrency(defaultDeductions.pension)}</div>
                )}
                {defaultDeductions.loan > 0 && (
                  <div>Loan: {formatCurrency(defaultDeductions.loan)}</div>
                )}
                {defaultDeductions.other > 0 && (
                  <div>Other: {formatCurrency(defaultDeductions.other)}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Net Salary Estimate */}
        {baseSalary && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Estimated Net Monthly Salary</p>
              <p className="text-xl font-bold">
                {formatCurrency(baseSalary + totalAllowances - totalDeductions)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Base salary + allowances - deductions (excluding tax calculations)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
