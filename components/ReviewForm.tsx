'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'

export default function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    service: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/submit-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, rating })
    })

    if (res.ok) {
      setSubmitted(true)
      setFormData({ name: '', review: '', service: '' })
      setRating(0)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-[#112119] p-8 rounded-xl text-center border border-[#14b866]/30">
        <div className="w-16 h-16 bg-[#14b866]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-2xl font-light text-white mb-2">Thank You!</h3>
        <p className="text-gray-400 mb-4">Your review has been submitted and will appear after approval.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-[#14b866] hover:underline"
        >
          Write another review
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#112119] rounded-xl border border-white/5 p-8">
      <h3 className="text-2xl font-light text-white mb-6">Share Your Experience</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Rating *</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  fill={(hover || rating) >= star ? '#14b866' : 'none'}
                  stroke={(hover || rating) >= star ? '#14b866' : '#4b5563'}
                  className="transition-all"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#14b866] focus:outline-none"
            placeholder="e.g., Sarah Johnson"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Service Received (optional)</label>
          <input
            type="text"
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#14b866] focus:outline-none"
            placeholder="e.g., Haircut, Coloring"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Review *</label>
          <textarea
            required
            rows={4}
            value={formData.review}
            onChange={(e) => setFormData({...formData, review: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#14b866] focus:outline-none"
            placeholder="Tell us about your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={!rating || !formData.name || !formData.review || loading}
          className="w-full bg-[#14b866] text-white py-3 rounded-lg font-medium hover:bg-[#14b866]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? 'Submitting...' : (
            <>
              Submit Review <Send size={16} />
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your review will appear after owner approval
        </p>
      </form>
    </div>
  )
}