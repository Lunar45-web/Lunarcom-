'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapPin, Phone, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface DaySchedule {
  _key: string
  day: string
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
  const [currentStatus, setCurrentStatus] = useState({ isOpen: false, text: 'Closed' })

  // --- FIX: USE MEMO TO PREVENT INFINITE LOOP ---
  const sortedDays = useMemo(() => {
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    return workingDays
      ? [...workingDays].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
      : []
  }, [workingDays])

  const getDayLabel = (day: string) => day.charAt(0).toUpperCase() + day.slice(1)

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

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Real-time open/closed checker
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date()
      const currentDayIndex = now.getDay()
      const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const currentDay = dayMap[currentDayIndex]
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      const todaySchedule = sortedDays.find(d => d.day === currentDay)

      if (!todaySchedule) {
        // Only update if state actually changes to avoid unnecessary renders
        setCurrentStatus(prev => prev.text === 'Hours not set' ? prev : { isOpen: false, text: 'Hours not set' })
        return
      }

      if (todaySchedule.closed) {
        setCurrentStatus(prev => prev.text === 'Closed Today' ? prev : { isOpen: false, text: 'Closed Today' })
        return
      }

      if (todaySchedule.open && todaySchedule.close) {
        const openMinutes = timeToMinutes(todaySchedule.open)
        const closeMinutes = timeToMinutes(todaySchedule.close)
        
        let isOpenNow
        if (closeMinutes < openMinutes) {
          isOpenNow = currentMinutes >= openMinutes || currentMinutes < closeMinutes
        } else {
          isOpenNow = currentMinutes >= openMinutes && currentMinutes < closeMinutes
        }
        
        const newText = isOpenNow ? 'Open Now' : 'Closed Now'
        
        // Only update if changed
        setCurrentStatus(prev => prev.text === newText ? prev : { isOpen: isOpenNow, text: newText })
      } else {
        setCurrentStatus(prev => prev.text === 'Call for hours' ? prev : { isOpen: false, text: 'Call for hours' })
      }
    }

    checkIfOpen()
    const interval = setInterval(checkIfOpen, 60000)
    return () => clearInterval(interval)
  }, [sortedDays]) // Now safe because sortedDays is memoized

  return (
    <section className="relative z-30 -mt-8 mx-4 md:mx-auto max-w-6xl">
      <div className="bg-[#162b22]/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/5 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
        
      {/* =======================
    1. LOCATION
   ======================= */}
<div className="flex items-start gap-4 pt-4 md:pt-0">
  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
    <MapPin className="text-[#14b866]" size={24} />
  </div>
  <div className="flex-1 flex flex-col h-full">
    <h3 className="text-white font-medium mb-1">Visit Us</h3>
    <p className="text-gray-400 text-sm mb-4">{location || 'Downtown'}</p>
    
    {googleMapsUrl ? (
      <div className="flex-grow flex flex-col">
        <div className="relative w-full flex-grow min-h-[100px] rounded-lg overflow-hidden border border-white/10 group">
          {/* IFRAME: Uses the Embed URL (Keep this as is) */}
          <iframe
            src={googleMapsUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
          {/* LINK: Uses a Search Query based on your Location Name */}
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 bg-black/10 group-hover:bg-transparent transition-colors cursor-pointer"
            aria-label="Open in Google Maps"
          />
        </div>
        
        {/* TEXT LINK: Same Search Query */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#14b866] text-sm hover:text-white transition-colors flex items-center gap-2 mt-3 font-medium w-fit"
        >
          View on Google Maps <ExternalLink size={14} />
        </a>
      </div>
    ) : (
      <div className="h-24 w-full bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/30 text-xs">
        Map not available
      </div>
    )}
  </div>
</div>

        {/* =======================
            2. HOURS
           ======================= */}
        <div className="flex items-start gap-4 pt-4 md:pt-0 pl-0 md:pl-8">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 relative">
            <Clock className="text-[#14b866]" size={24} />
            {currentStatus.isOpen && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#14b866] rounded-full border-2 border-[#162b22] animate-pulse"></span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">Working Hours</h3>
            <p className={`text-sm font-medium ${currentStatus.isOpen ? 'text-[#14b866]' : 'text-red-400'}`}>
              {currentStatus.text}
            </p>
            
            {sortedDays.length > 0 ? (
              <div className="mt-3">
                <div className="flex justify-between text-sm border-b border-white/5 pb-2 mb-2">
                  <span className="text-gray-400">{getDayLabel(sortedDays[0].day)}</span>
                  <span className="text-white">{formatDayHours(sortedDays[0])}</span>
                </div>

                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-2 pb-2">
                      {sortedDays.slice(1).map(day => (
                        <div key={day._key} className="flex justify-between text-sm">
                          <span className="text-gray-500">{getDayLabel(day.day)}</span>
                          <span className="text-gray-300">{formatDayHours(day)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {sortedDays.length > 1 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs text-[#14b866] hover:text-white transition-colors uppercase tracking-wider font-medium mt-1"
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

        {/* =======================
            3. CONTACT
           ======================= */}
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
            <div className="mt-4">
              <a 
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-xs border border-[#14b866]/50 text-[#14b866] px-4 py-2 rounded-full hover:bg-[#14b866] hover:text-white transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}