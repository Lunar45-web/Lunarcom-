'use client'

import { useState } from 'react'
import { MapPin, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface DaySchedule {
  day: string
  label: string
  closed: boolean
  open?: string
  close?: string
}

interface Props {
  location: string
  googleMapsUrl?: string
  whatsapp: string
  workingDays?: DaySchedule[]
  fallbackHours: string
}

export default function InfoBarExpandable({
  location,
  googleMapsUrl,
  whatsapp,
  workingDays,
  fallbackHours,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  // Sort days in correct order
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedDays = workingDays
    ? [...workingDays].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
    : []

  const monday = sortedDays.find(d => d.day === 'monday')

  // Format time from "08:00" to "8:00 AM"
  const formatTime = (time?: string) => {
    if (!time) return ''
    const [hour, minute] = time.split(':').map(Number)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
  }

  const formatDay = (day: DaySchedule) => {
    if (day.closed) return 'Closed'
    if (day.open && day.close) {
      return `${formatTime(day.open)} – ${formatTime(day.close)}`
    }
    return 'Call for hours'
  }

  // Champagne colors
  const champagneBg = 'bg-gradient-to-r from-amber-50/5 to-amber-100/5'
  const goldIcon = '#C49A6C' // soft rose gold

  return (
    <section className={`relative z-20 border-y border-white/10 ${champagneBg} backdrop-blur-md py-6 transition-all duration-300 ease-out`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-start">
        
        {/* LOCATION */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <MapPin style={{ color: goldIcon }} size={24} strokeWidth={1.5} />
            <h3 className="text-white/90 font-medium tracking-wide text-sm uppercase">Location</h3>
          </div>
          <p className="text-white/80 text-sm pl-9">{location || 'Downtown'}</p>
          {googleMapsUrl ? (
            <div className={`overflow-hidden rounded-lg border border-white/10 transition-all duration-300 ease-out ${
              expanded ? 'h-48' : 'h-20'
            }`}>
              <iframe
                src={googleMapsUrl}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="h-20 w-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/30 text-xs">
              Map not available
            </div>
          )}
        </div>

        {/* HOURS */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Clock style={{ color: goldIcon }} size={24} strokeWidth={1.5} />
            <h3 className="text-white/90 font-medium tracking-wide text-sm uppercase">Working Hours</h3>
          </div>

          {sortedDays.length > 0 ? (
            <div className="pl-9 space-y-1">
              {/* Always show Monday */}
              {monday && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">{monday.label}</span>
                  <span className="text-white/90 font-light">{formatDay(monday)}</span>
                </div>
              )}

              {/* Other days (expandable) */}
              <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-out ${
                expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {sortedDays
                  .filter(d => d.day !== 'monday')
                  .map(day => (
                    <div key={day.day} className="flex justify-between text-sm">
                      <span className="text-white/60">{day.label}</span>
                      <span className="text-white/90 font-light">{formatDay(day)}</span>
                    </div>
                  ))}
              </div>

              {/* Toggle button */}
              {sortedDays.length > 1 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 flex items-center gap-1 text-xs text-[#C49A6C] hover:text-white transition-colors"
                >
                  {expanded ? (
                    <>See less <ChevronUp size={14} /></>
                  ) : (
                    <>See more <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-white/60 text-sm pl-9">{fallbackHours}</p>
          )}
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Phone style={{ color: goldIcon }} size={24} strokeWidth={1.5} />
            <h3 className="text-white/90 font-medium tracking-wide text-sm uppercase">Contact</h3>
          </div>
          <a
            href={`tel:+${whatsapp}`}
            className="text-white/80 text-sm pl-9 hover:text-[#C49A6C] transition-colors"
          >
            +{whatsapp}
          </a>
        </div>
      </div>
    </section>
  )
}