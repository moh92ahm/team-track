'use client'

import * as React from 'react'
import Link from 'next/link'
import { PayrollSetting, User } from '@/payload-types'
import { Badge } from '../../ui/badge'
import { DataTable } from '../../data-table'
import { Button } from '../../ui/button'

interface PayrollSettingsTableProps {
  data: PayrollSetting[]
  enablePagination?: boolean
}

export function PayrollSettingsTable({ data, enablePagination = true }: PayrollSettingsTableProps) {
  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (!amount && amount !== 0) return '-'
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Format payment type
  const formatPaymentType = (type: string | undefined) => {
    switch (type) {
      case 'bankTransfer':
        return 'Bank Transfer'
      case 'cash':
        return 'Cash'
      case 'cheque':
        return 'Cheque'
      default:
        return type || '-'
    }
  }

  // Get type variant
  const getTypeVariant = (
    type: string | undefined,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (type) {
      case 'primary':
        return 'default'
      case 'bonus':
        return 'secondary'
      case 'overtime':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const columns = [
    {
      key: 'employee' as keyof PayrollSetting,
      header: 'Employee',
      render: (value: unknown) => {
        const user = value as User
        return typeof user === 'object' && user !== null && 'fullName' in user
          ? user.fullName || '-'
          : String(value) || '-'
      },
    },
    {
      key: 'payrollType' as keyof PayrollSetting,
      header: 'Type',
      render: (value: unknown) => (
        <Badge variant={getTypeVariant(String(value))} className="capitalize">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'description' as keyof PayrollSetting,
      header: 'Description',
      render: (value: unknown) => {
        const desc = String(value || '')
        return desc.length > 40 ? `${desc.substring(0, 40)}...` : desc || '-'
      },
    },
    {
      key: 'amount' as keyof PayrollSetting,
      header: 'Amount',
      render: (value: unknown, item: PayrollSetting) => {
        return formatCurrency(item.paymentDetails?.amount)
      },
    },
    {
      key: 'paymentType' as keyof PayrollSetting,
      header: 'Payment Method',
      render: (value: unknown, item: PayrollSetting) => {
        return formatPaymentType(item.paymentDetails?.paymentType)
      },
    },
    {
      key: 'isActive' as keyof PayrollSetting,
      header: 'Status',
      render: (value: unknown) => {
        const isActive = Boolean(value)
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
  ]

  const actionColumn = (item: PayrollSetting) => (
    <Link href={`/payroll/settings/${item.id}/edit`} className="flex-1">
      <Button variant="outline" className="w-full">
        Edit Setting
      </Button>
    </Link>
  )

  return (
    <div className="space-y-4">
      <DataTable<PayrollSetting>
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
