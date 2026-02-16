'use client'

import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'

interface GalleryItem {
  _id: string
  mediaType: 'image' | 'video'
  image?: string
  video?: string
  description?: string
  category?: string
}

interface Props {
  items: GalleryItem[]
  initialIndex: number
  onClose: () => void
}

export default function GalleryLightbox({ items, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const currentItem = items[currentIndex]

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white z-50 bg-black/50 rounded-full p-3 transition-all hover:scale-110"
      >
        <X size={24} />
      </button>

      {/* Navigation */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Media container */}
      <div 
        className="max-w-7xl max-h-[90vh] px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.mediaType === 'video' ? (
          <video
            src={currentItem.video}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
          />
        ) : (
          <img
            src={currentItem.image}
            alt={currentItem.description || 'Gallery image'}
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
          />
        )}

        {/* Caption */}
        <div className="text-center mt-4">
          <p className="text-[#14b866] text-sm uppercase tracking-wider">{currentItem.category}</p>
          <p className="text-white text-lg">{currentItem.description}</p>
        </div>
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  )
}