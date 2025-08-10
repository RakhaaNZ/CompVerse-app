"use client"
import React, { useState, useEffect } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "../../app/ui/button"
import { Calendar } from "../../app/ui/calendar"
import { Input } from "../../app/ui/input"
import { Label } from "../../app/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../../app/ui/popover"

export function Calendar24({ setFormData }) {
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [time, setTime] = useState("00:00:00")

  // Update formData di parent ketika date/time berubah
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      time: time,
    }))
  }, [startDate, endDate, time, setFormData])

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* Start Date */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-start">Date Start</Label>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-36 justify-between">
              {startDate ? startDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date)
                setOpenStart(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-end">Date End</Label>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-36 justify-between">
              {endDate ? endDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date)
                setOpenEnd(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="time">Time</Label>
        <Input
          type="time"
          id="time"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  )
}
