'use client'

import { useState } from 'react'
import RatingSummary from './RatingSummary'
import ReviewSlider from './ReviewSlider'
import ReviewForm from './ReviewForm'

interface Review {
  reviewerName: string
  rating: number
  reviewText: string
  serviceReceived?: string
}

export default function ReviewSectionWrapper({ reviews }: { reviews: Review[] }) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <section className="py-24 bg-[#162b22]">
      <div className="max-w-7xl mx-auto px-6">
        {reviews.length > 0 && <RatingSummary reviews={reviews} />}
        <ReviewSlider reviews={reviews} />
        
        <div className="text-center mt-12">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#14b866] text-white px-8 py-3 rounded-full hover:bg-[#14b866]/90 transition-colors"
            >
              Write a Review
            </button>
          ) : (
            <div className="max-w-2xl mx-auto">
              <ReviewForm />
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 text-sm mt-4 hover:text-white"
              >
                ← Hide form
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}