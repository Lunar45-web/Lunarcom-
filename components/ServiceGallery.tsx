'use client'

import { useState, useEffect } from 'react'
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryItem {
  mediaType: 'image' | 'video'
  imageUrl?: string
  videoUrl?: string
}

interface Props {
  gallery: GalleryItem[]
}

export default function ServiceGallery({ gallery }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle opening specific index
  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  // Next / Prev Logic
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, gallery.length])

  if (!gallery || gallery.length === 0) return null

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-light text-white mb-6">Visuals</h3>
      
      {/* 1. THE GRID (Thumbnails) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item, i) => (
          <div 
            key={i} 
            onClick={() => openLightbox(i)}
            className="group relative aspect-video rounded-xl overflow-hidden bg-[#162b22] border border-white/5 cursor-pointer"
          >
            {item.mediaType === 'video' ? (
              <>
                <video 
                  src={item.videoUrl} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  muted // Muted in thumbnail to avoid chaos
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                     <Play size={16} className="text-white fill-white ml-1" />
                   </div>
                </div>
              </>
            ) : (
              <>
                <img 
                  src={item.imageUrl} 
                  alt="Service detail" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs uppercase tracking-widest">
                     View
                   </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 2. THE LIGHTBOX (Fullscreen Overlay) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} />
          </button>

          {/* Previous Arrow */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-white/50 hover:text-[#14b866] transition-colors p-4 hover:bg-white/5 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Next Arrow */}
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white/50 hover:text-[#14b866] transition-colors p-4 hover:bg-white/5 rounded-full"
          >
            <ChevronRight size={40} />
          </button>

          {/* Main Media Display */}
          <div 
            className="relative w-full max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          >
            {gallery[currentIndex].mediaType === 'video' ? (
              <video 
                src={gallery[currentIndex].videoUrl} 
                className="w-full h-full max-h-[85vh] rounded-lg shadow-2xl"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img 
                src={gallery[currentIndex].imageUrl} 
                alt="Fullscreen view" 
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            )}
            
            {/* Counter (e.g., 1 / 5) */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest font-mono">
              {currentIndex + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}