"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface BirthDatePickerProps {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  error?: string
}

export function BirthDatePicker({ value, onValueChange, name, error }: BirthDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const parsedDate = React.useMemo(() => {
    if (!value) return undefined
    // Expecting YYYY-MM-DD
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d
    // Fallback: try parsing as ISO
    const iso = new Date(value)
    return !isNaN(iso.getTime()) ? iso : undefined
  }, [value])

  const [date, setDate] = React.useState<Date | undefined>(parsedDate)

  React.useEffect(() => {
    setDate(parsedDate)
  }, [parsedDate])

  const handleSelect = (d?: Date) => {
    setDate(d)
    if (d && onValueChange) {
      // Return as YYYY-MM-DD (date-only)
      onValueChange(d.toISOString().split("T")[0])
    }
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="birthDate" className="px-1">
        Date of birth
      </Label>
      {/* Hidden input for native form submission */}
      <input type="hidden" name={name} value={value ?? ''} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={error ? "destructive" : "outline"}
            id="birthDate"
            className="justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
