'use client'

import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/sanity'

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return source ? builder.image(source).url() : ''
}

interface AboutProps {
  data: {
    title: string
    heading: string
    highlightWord: string
    mainText: string
    secondaryText: string
    founderName: string
    founderTitle: string
    founderInitial: string
    mediaType: 'image' | 'video'
    aboutImage?: string
    aboutVideo?: string
  }
}

export default function AboutSection({ data }: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Image/Video side */}
        <div className="order-2 md:order-1">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#14b866]/50 rounded-tl-3xl z-0"></div>
            
            {data.mediaType === 'video' && data.aboutVideo ? (
              <video
                src={data.aboutVideo}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-xl shadow-2xl relative z-10 w-full aspect-[4/5] object-cover"
              />
            ) : (
              <img
               src={data.aboutImage || '/placeholder.jpg'}
                alt="About us"
                className="rounded-xl shadow-2xl relative z-10 w-full aspect-[4/5] object-cover transition-all duration-700"
              />
            )}
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#14b866]/50 rounded-br-3xl z-0"></div>
          </div>
        </div>

        {/* Content side */}
        <div className="order-1 md:order-2">
          <h4 className="text-[#14b866] text-sm uppercase tracking-[0.2em] mb-4 font-medium">
            {data.title}
          </h4>
          
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
            {data.heading}{' '}
            <span className="italic text-[#14b866]">{data.highlightWord}</span>
          </h2>
          
          <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
            <p>{data.mainText}</p>
            <p>{data.secondaryText}</p>
          </div>

          {/* Founder info */}
          <div className="mt-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#14b866]/20 border-2 border-[#14b866]/30 flex items-center justify-center text-white font-serif text-xl">
              {data.founderInitial}
            </div>
            <div>
              <p className="text-white font-medium">{data.founderName}</p>
              <p className="text-[#14b866] text-sm">{data.founderTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}