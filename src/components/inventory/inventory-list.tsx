"use client"

import * as React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Plus } from 'lucide-react'
import type { Inventory, User as Staff } from '@/payload-types'
import { InventoryTable } from '@/components/inventory/table'

interface InventoryListProps {
  data: Inventory[]
}

export function InventoryList({ data }: InventoryListProps) {
  const [query, setQuery] = React.useState('')
  const [debounced, setDebounced] = React.useState('')
  // Single-select filter: 'all' or one specific status
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'inUse' | 'inStock' | 'needsRepair' | 'underRepair'>('all')
  // Single-select item type filter
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'laptop' | 'phone' | 'accessory' | 'other'>('all')

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const filtered = React.useMemo(() => {
    const q = debounced.trim().toLowerCase()
    return data.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (typeFilter !== 'all' && String(item.itemType) !== typeFilter) return false
      const type = (item.itemType || '').toUpperCase()
      const model = (item.model || '').toUpperCase()
      const serial = (item.serialNumber || '').toUpperCase()
      const status = (item.status || '').toUpperCase()
      const holder =
        typeof item.holder === 'object' && item.holder && 'fullName' in item.holder
          ? ((item.holder as Staff).fullName || '').toUpperCase()
          : (String(item.holder || '').toUpperCase())
      if (!q) return true
      return type.includes(q) || model.includes(q) || serial.includes(q) || status.includes(q) || holder.includes(q)
    })
  }, [data, debounced, statusFilter, typeFilter])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Inventory</h1>
          <div className="text-sm text-muted-foreground">{data.length} total · {filtered.length} shown</div>
        </div>
        <div className="flex items-center gap-2">
          <ButtonGroup className="hidden md:flex mr-2">
            <Button
              type="button"
              size="sm"
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
            >
              All
            </Button>
            {([
              { key: 'laptop', label: 'Laptop' },
              { key: 'phone', label: 'Phone' },
              { key: 'accessory', label: 'Accessory' },
              { key: 'other', label: 'Other' },
            ] as const).map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={typeFilter === key ? 'default' : 'outline'}
                onClick={() => setTypeFilter(key)}
                className="capitalize"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup className="hidden md:flex mr-2">
            <Button
              type="button"
              size="sm"
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            {([
              { key: 'inUse', label: 'In Use' },
              { key: 'inStock', label: 'In Stock' },
              { key: 'needsRepair', label: 'Needs Repair' },
              { key: 'underRepair', label: 'Under Repair' },
            ] as const).map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={statusFilter === key ? 'default' : 'outline'}
                onClick={() => setStatusFilter(key)}
                className="capitalize"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
          <Input
            placeholder="Search inventory..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56"
          />
          <Link href="/inventory/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>
      <InventoryTable data={filtered} />
    </div>
  )
}
