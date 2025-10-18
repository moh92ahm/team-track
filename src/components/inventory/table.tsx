'use client'

import { Inventory, User } from '@/payload-types'
import { Badge } from '../ui/badge'
import { DataTable } from '../data-table'
import { InventoryItemCell } from './item-cell'
import { Button } from '../ui/button'
import Link from 'next/link'

interface InventoryTableProps {
  data: Inventory[]
  enablePagination?: boolean
}

export function InventoryTable({ data, enablePagination = true }: InventoryTableProps) {
  const columns = [
    {
      key: 'itemType' as keyof Inventory,
      header: 'Item Type',
      render: (value: unknown, item: Inventory) => <InventoryItemCell item={item} />,
    },
    {
      key: 'model' as keyof Inventory,
      header: 'Model',
    },
    {
      key: 'holder' as keyof Inventory,
      header: 'Holder',
      render: (value: unknown, item: Inventory) => {
        const holder = item.holder
        return typeof holder === 'object' && holder !== null && 'fullName' in holder
          ? (holder as User).fullName
          : holder || '-'
      },
    },
    {
      key: 'status' as keyof Inventory,
      header: 'Status',
      render: (value: unknown) => (
        <Badge variant="default" className="capitalize">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'serialNumber' as keyof Inventory,
      header: 'Serial Number',
    },
    {
      key: 'purchaseDate' as keyof Inventory,
      header: 'Purchased at',
      render: (value: unknown) => {
        const date = value as string
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    },
  ]

  const actionColumn = (item: Inventory) => (
    <Link href={`/inventory/${item.id}/edit`} className="flex-1">
      <Button variant="outline" className="w-full">
        Edit Item
      </Button>
    </Link>
  )

  return (
    <div className="space-y-4">
      <DataTable<Inventory>
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
