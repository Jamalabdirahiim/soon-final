"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CalendarProps = {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

function Calendar({ value, onChange, className }: CalendarProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2",
        className
      )}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
