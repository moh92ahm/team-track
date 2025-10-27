'use client'

import * as React from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export interface Option {
  value: string
  label: string
}

interface SelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  placeholder?: string
  options: Option[]
  error?: string
  searchable?: boolean
}

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  error,
  searchable = false,
}: SelectFieldProps<TFieldValues>) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options

    const query = searchQuery.toLowerCase()
    return options.filter(
      (opt) => opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query),
    )
  }, [options, searchQuery, searchable])

  return (
    <div>
      {label && <Label htmlFor={String(name)}>{label}</Label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <>
            {/* Hidden input to include value in native form submission */}
            <input type="hidden" name={String(name)} value={field.value ?? ''} />
            <Select value={field.value ?? ''} onValueChange={field.onChange}>
              <SelectTrigger id={String(name)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {searchable && (
                  <div className="flex items-center border-b px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 w-full border-0 bg-transparent p-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                      onKeyDown={(e) => {
                        // Prevent select from closing when typing
                        e.stopPropagation()
                      }}
                    />
                  </div>
                )}
                <div className={searchable ? 'max-h-[200px] overflow-auto' : ''}>
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No results found.
                    </div>
                  ) : (
                    filteredOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
