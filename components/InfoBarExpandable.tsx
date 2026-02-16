'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'

interface DaySchedule {
  _key: string
  day: string // 'monday', 'tuesday', etc.
  closed: boolean
  open?: string // '09:00' format
  close?: string // '17:30' format
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
  const [currentStatus, setCurrentStatus] = useState({ isOpen: false, text: 'Closed' })

  // Sort days in correct order
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const sortedDays = workingDays
    ? [...workingDays].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
    : []

  // Get day display name
  const getDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Format time from "09:30" to "9:30 AM"
  const formatTime = (time?: string) => {
    if (!time) return ''
    const [hour, minute] = time.split(':').map(Number)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
  }

  const formatDayHours = (day: DaySchedule) => {
    if (day.closed) return 'Closed'
    if (day.open && day.close) {
      return `${formatTime(day.open)} – ${formatTime(day.close)}`
    }
    return 'Call for hours'
  }

  // Convert time string "HH:MM" to minutes since midnight for easy comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // REAL-TIME open/closed detection with proper minute handling
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date()
      
      // Get current day in lowercase to match Sanity (monday, tuesday, etc.)
      const currentDayIndex = now.getDay() // 0 = Sunday, 1 = Monday, etc.
      const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const currentDay = dayMap[currentDayIndex]
      
      // Get current time in minutes since midnight
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      // Find today's schedule
      const todaySchedule = sortedDays.find(d => d.day === currentDay)

      if (!todaySchedule) {
        setCurrentStatus({ isOpen: false, text: 'Hours not set' })
        return
      }

      if (todaySchedule.closed) {
        setCurrentStatus({ isOpen: false, text: 'Closed Today' })
        return
      }

      if (todaySchedule.open && todaySchedule.close) {
        const openMinutes = timeToMinutes(todaySchedule.open)
        const closeMinutes = timeToMinutes(todaySchedule.close)
        
        // Handle cases where closing time is after midnight (e.g., open 18:00, close 02:00)
        let isOpenNow
        if (closeMinutes < openMinutes) {
          // Hours cross midnight (e.g., 8pm to 2am)
          isOpenNow = currentMinutes >= openMinutes || currentMinutes < closeMinutes
        } else {
          // Normal hours within same day
          isOpenNow = currentMinutes >= openMinutes && currentMinutes < closeMinutes
        }
        
        setCurrentStatus({ 
          isOpen: isOpenNow, 
          text: isOpenNow ? 'Open Now' : 'Closed Now' 
        })
      } else {
        setCurrentStatus({ isOpen: false, text: 'Call for hours' })
      }
    }

    checkIfOpen()
    
    // Check every minute to update status
    const interval = setInterval(checkIfOpen, 60000)
    return () => clearInterval(interval)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - run once on mount

  return (
    <section className="relative z-30 -mt-8 mx-4 md:mx-auto max-w-6xl">
      <div className="bg-[#162b22]/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/5 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
        
        {/* LOCATION */}
        <div className="flex items-start gap-4 pt-4 md:pt-0">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <MapPin className="text-[#14b866]" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Visit Us</h3>
            <p className="text-gray-400 text-sm mb-2">{location || 'Downtown'}</p>
            
            {/* Map with expand/collapse */}
            {googleMapsUrl ? (
              <>
                <div 
                  className={`overflow-hidden rounded-lg border border-white/10 transition-all duration-500 ease-out cursor-pointer ${
                    expanded ? 'h-48' : 'h-20'
                  }`}
                  onClick={() => setExpanded(!expanded)}
                >
                  <iframe
                    src={googleMapsUrl}
                    className="w-full h-full pointer-events-none"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-[#14b866] text-sm hover:underline flex items-center gap-1 mt-2"
                >
                  {expanded ? 'Show less' : 'View on Map'} 
                  {expanded ? <ChevronUp size={14} /> : <ArrowRight size={14} />}
                </button>
              </>
            ) : (
              <div className="h-20 w-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/30 text-xs">
                Map not available
              </div>
            )}
          </div>
        </div>

        {/* HOURS */}
        <div className="flex items-start gap-4 pt-4 md:pt-0 pl-0 md:pl-8">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 relative">
            <Clock className="text-[#14b866]" size={24} />
            {currentStatus.isOpen && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#14b866] rounded-full border-2 border-[#162b22] animate-pulse"></span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Working Hours</h3>
            <p className="text-gray-400 text-sm">{currentStatus.text}</p>
            
            {sortedDays.length > 0 ? (
              <div className="mt-2 space-y-1">
                {/* Always show first day (Monday) */}
                {sortedDays.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{getDayLabel(sortedDays[0].day)}</span>
                    <span className="text-white/90 font-light">{formatDayHours(sortedDays[0])}</span>
                  </div>
                )}

                {/* Other days (expandable with fade) */}
                <div 
                  className={`space-y-1 overflow-hidden transition-all duration-500 ease-out ${
                    expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {sortedDays.slice(1).map(day => (
                    <div key={day._key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{getDayLabel(day.day)}</span>
                      <span className="text-white/90 font-light">{formatDayHours(day)}</span>
                    </div>
                  ))}
                </div>

                {/* Toggle button */}
                {sortedDays.length > 1 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 flex items-center gap-1 text-xs text-[#14b866] hover:text-white transition-colors"
                  >
                    {expanded ? (
                      <>Show less <ChevronUp size={14} /></>
                    ) : (
                      <>View all hours <ChevronDown size={14} /></>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-xs mt-1">{fallbackHours}</p>
            )}
          </div>
        </div>

        {/* CONTACT */}
        <div className="flex items-start gap-4 pt-4 md:pt-0 pl-0 md:pl-8">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Phone className="text-[#14b866]" size={24} />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Contact</h3>
            <p className="text-gray-400 text-sm mb-2">Priority Booking Line</p>
            <a 
              href={`tel:+${whatsapp}`} 
              className="text-white text-lg font-light tracking-wide hover:text-[#14b866] transition-colors"
            >
              +{whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}