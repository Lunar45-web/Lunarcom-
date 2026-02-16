'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import GalleryLightbox from './GalleryLightbox'

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
  instagramUrl?: string
}

export default function GallerySection({ items, instagramUrl }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  // Responsive masonry layout
  const getGridClasses = (index: number) => {
    // Mobile: simple grid
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'col-span-1 row-span-1'
    }

    // Desktop: artistic masonry
    const pattern = [
      'md:col-span-2 md:row-span-2', // 0 - Hero
      'md:col-span-1 md:row-span-1', // 1
      'md:col-span-1 md:row-span-2', // 2 - Tall
      'md:col-span-1 md:row-span-1', // 3
      'md:col-span-2 md:row-span-1', // 4 - Wide
      'md:col-span-1 md:row-span-1', // 5
      'md:col-span-1 md:row-span-2', // 6 - Tall
      'md:col-span-1 md:row-span-1', // 7
    ]
    return pattern[index % pattern.length] || 'md:col-span-1 md:row-span-1'
  }

  if (items.length === 0) {
    return (
      <section id="gallery" className="py-24 px-6 bg-[#112119]">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-[#14b866] text-sm uppercase tracking-[0.2em] mb-4">The Lookbook</h4>
          <h2 className="text-4xl font-light text-white mb-8">Recent Masterpieces</h2>
          <p className="text-gray-400">Gallery coming soon...</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="gallery" className="py-24 px-6 bg-[#112119]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h4 className="text-[#14b866] text-sm uppercase tracking-[0.2em] mb-4">The Lookbook</h4>
              <h2 className="text-4xl font-light text-white">Recent Masterpieces</h2>
            </div>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-block text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:border-[#14b866]"
              >
                Follow on Instagram
              </a>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
            {items.map((item, index) => {
              const gridClasses = getGridClasses(index)
              
              return (
                <div
                  key={item._id}
                  onClick={() => openLightbox(index)}
                  className={`${gridClasses} group relative overflow-hidden rounded-lg cursor-pointer`}
                >
                  {/* Media */}
                  {item.mediaType === 'video' ? (
                    <div className="absolute inset-0">
                      <video
                        src={item.video}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#14b866]/80 flex items-center justify-center">
                          <Play size={20} className="text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.description || 'Gallery image'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#112119] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    {item.category && (
                      <p className="text-[#14b866] text-xs uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                    )}
                    {item.description && (
                      <h3 className="text-white text-sm font-medium">{item.description}</h3>
                    )}
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/0 group-hover:border-[#14b866]/70 transition-all duration-500" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/0 group-hover:border-[#14b866]/70 transition-all duration-500" />
                </div>
              )
            })}
          </div>

          {/* Mobile Instagram Link */}
          {instagramUrl && (
            <div className="md:hidden text-center mt-8">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full"
              >
                Follow on Instagram
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <GalleryLightbox
          items={items}
          initialIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}