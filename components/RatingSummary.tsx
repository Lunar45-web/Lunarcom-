'use client'

import { Star } from 'lucide-react'

interface Props {
  reviews: { rating: number }[]
}

export default function RatingSummary({ reviews }: Props) {
  if (reviews.length === 0) return null

  // Calculate average
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  
  // Count ratings per star
  const ratingCounts = [5,4,3,2,1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
  }))

  return (
    <div className="bg-[#112119] rounded-xl border border-white/5 p-6 mb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Average Score */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-light text-white">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mt-2 justify-center md:justify-start">
            {[1,2,3,4,5].map(star => (
              <Star
                key={star}
                size={20}
                fill={star <= Math.round(averageRating) ? '#14b866' : 'none'}
                stroke={star <= Math.round(averageRating) ? '#14b866' : '#4b5563'}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-1">{reviews.length} reviews</p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 w-full">
          {ratingCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-2 text-sm mb-2">
              <span className="text-gray-400 w-12">{stars} stars</span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#14b866] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-gray-400 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}