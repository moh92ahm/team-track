"use client"

import * as React from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
}

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  error,
}: SelectFieldProps<TFieldValues>) {
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
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

