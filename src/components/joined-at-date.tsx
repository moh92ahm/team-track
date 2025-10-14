'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface JoinedAtDateProps {
  value?: string
  onValueChange?: (date: string) => void
  name?: string
}

export function JoinedAtDate({ value, onValueChange, name }: JoinedAtDateProps) {
  const [open, setOpen] = React.useState(false)

  // Parse the date from the value or use current date
  const currentDate = React.useMemo(() => {
    if (value) {
      const parsed = new Date(value)
      return isNaN(parsed.getTime()) ? new Date() : parsed
    }
    return new Date()
  }, [value])

  const [selectedDate, setSelectedDate] = React.useState<Date>(currentDate)

  // Simple date formatting function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      onValueChange?.(date.toISOString())
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="joinedAtDate" className="px-1">
        Joined At Date
      </Label>
      {/* Hidden input for native form submission */}
      <input type="hidden" name={name} value={selectedDate.toISOString()} />
      <div className="relative flex gap-2">
        <Input
          id="joinedAtDate"
          value={formatDate(selectedDate)}
          placeholder="Select joined date"
          className="bg-background pr-10"
          readOnly
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
