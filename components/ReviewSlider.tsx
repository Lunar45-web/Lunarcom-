'use client'

import { useState, useRef, useEffect } from 'react'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Review {
  reviewerName: string
  rating: number
  reviewText: string
  serviceReceived?: string
}

interface Props {
  reviews: Review[]
}

export default function ReviewSlider({ reviews }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Auto-hide navigation if only one review
  const hasMultipleReviews = reviews.length > 1

  const goToNext = () => {
    if (isAnimating || !hasMultipleReviews) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrev = () => {
    if (isAnimating || !hasMultipleReviews) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Calculate visible reviews with peek effect
  const getVisibleReviews = () => {
    if (reviews.length === 0) return []
    if (reviews.length === 1) return [reviews[0]]
    
    const prev = (currentIndex - 1 + reviews.length) % reviews.length
    const next = (currentIndex + 1) % reviews.length
    
    return [reviews[prev], reviews[currentIndex], reviews[next]]
  }

  const visibleReviews = getVisibleReviews()

  if (reviews.length === 0) {
    return (
      <section className="py-24 bg-[#162b22] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Quote className="text-[#14b866] text-4xl mb-4 opacity-50 mx-auto" size={40} />
          <h2 className="text-3xl font-light text-white mb-2">Client Love</h2>
          <p className="text-gray-400">No reviews yet. Be the first to leave one!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-[#162b22] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Quote className="text-[#14b866] text-4xl mb-4 opacity-50 mx-auto" size={40} />
          <h2 className="text-3xl font-light text-white mb-2">Client Love</h2>
        </div>

        {/* Carousel Container */}
        <div className="relative px-4 md:px-12">
          {/* Navigation Buttons - Only show if multiple reviews */}
          {hasMultipleReviews && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#112119] border border-white/10 rounded-full p-3 text-white hover:bg-[#14b866] transition-all hover:scale-110"
                aria-label="Previous review"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#112119] border border-white/10 rounded-full p-3 text-white hover:bg-[#14b866] transition-all hover:scale-110"
                aria-label="Next review"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Reviews Row with Peek Effect */}
          <div 
            ref={sliderRef}
            className="flex justify-center items-center gap-4 md:gap-8 transition-transform duration-500 ease-in-out"
          >
            {visibleReviews.map((review, idx) => {
              // Determine card styling based on position
              let cardStyle = ""
              let scale = "scale-100"
              let opacity = "opacity-100"
              
              if (idx === 0) { // Previous review (left side)
                cardStyle = "hidden md:block"
                scale = "scale-90"
                opacity = "opacity-50"
              } else if (idx === 1) { // Current review (center)
                cardStyle = "block"
                scale = "scale-100"
                opacity = "opacity-100"
              } else { // Next review (right side)
                cardStyle = "hidden md:block"
                scale = "scale-90"
                opacity = "opacity-50"
              }

              return (
                <div
                  key={`${review.reviewerName}-${idx}`}
                  className={`${cardStyle} transition-all duration-500 ease-in-out ${scale} ${opacity} w-full md:w-[450px] flex-shrink-0`}
                >
                  <div className="bg-[#112119] p-8 md:p-10 rounded-2xl shadow-xl border border-white/5">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      {/* Avatar Circle */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#14b866]/20 flex-shrink-0 bg-[#14b866]/10 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl text-[#14b866] font-light">
                          {review.reviewerName?.charAt(0) || 'C'}
                        </span>
                      </div>

                      <div className="text-center md:text-left flex-1">
                        {/* Stars */}
                        <div className="flex justify-center md:justify-start gap-1 mb-3">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              size={16}
                              fill={starIdx < review.rating ? '#14b866' : 'none'}
                              stroke={starIdx < review.rating ? '#14b866' : '#4b5563'}
                            />
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="text-gray-200 font-light italic leading-relaxed mb-4 line-clamp-3">
                          "{review.reviewText}"
                        </p>

                        {/* Name and service */}
                        <div>
                          <h4 className="text-white font-medium">{review.reviewerName}</h4>
                          <p className="text-gray-500 text-sm">{review.serviceReceived || 'Regular Client'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Dots Indicator */}
          {hasMultipleReviews && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'bg-[#14b866] w-6' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}