'use client'

import { useState } from 'react';
import { MessageCircle, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Helper function to format Price (Adds Ksh and commas)
const formatPrice = (price: string | number) => {
  if (!price) return '';
  // Force convert to string first, then remove non-digits
  const numericPrice = String(price).replace(/\D/g, '');
  // Format with commas (e.g., 5000 -> 5,000)
  const formatted = new Intl.NumberFormat('en-KE').format(Number(numericPrice));
  return `Ksh ${formatted}`;
};

// Helper function to format Duration (Minutes -> Hours/Mins)
const formatDuration = (input: string | number) => {
  if (!input) return '';
  
  // FIX: Force convert to string so .toLowerCase() never crashes
  const strInput = String(input);
  
  // If user typed "2 Hours" manually, just return it
  if (strInput.toLowerCase().includes('hour') || strInput.toLowerCase().includes('hr')) {
    return strInput;
  }

  // If user typed just numbers (minutes), convert it
  const minutes = parseInt(strInput);
  if (isNaN(minutes)) return strInput;

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;

  if (hours === 0) return `${remainingMins} mins`;
  if (hours > 0 && remainingMins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${remainingMins} mins`;
};

interface ServiceProps {
  services: any[];
  waLink: string;
}

export default function ServicesSection({ services, waLink }: ServiceProps) {
  const [showAll, setShowAll] = useState(false);

  // Toggle between showing 3 or All
  const displayedServices = showAll ? services : services.slice(0, 3);

  return (
    <section id="services" className="py-24 bg-[#162b22] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#14b866]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h4 className="text-[#14b866] text-sm uppercase tracking-[0.2em] mb-4">Our Menu</h4>
          <h2 className="text-4xl font-light text-white">Curated Treatments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedServices.map((service: any) => (
            <div key={service._id} className="group bg-[#112119] rounded-xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(20,184,102,0.15)] transition-all duration-500 border border-white/5">
              
              {/* IMAGE SECTION */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={service.imageUrl || "/placeholder.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                {/* Price Badge on Image */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded text-white text-sm font-medium border border-white/10">
                  {formatPrice(service.price)}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-8">
                
                {/* 2-Column Grid for Details */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                  
                  {/* LEFT COLUMN: Service Name & Category */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <h5 className="text-[#14b866] text-xs uppercase tracking-widest border-b border-[#14b866]/30 inline-block pb-1 mb-2">
                        Service Name
                      </h5>
                      <p className="text-white font-medium text-lg leading-tight">
                        {service.title}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[#14b866] text-xs uppercase tracking-widest border-b border-[#14b866]/30 inline-block pb-1 mb-2">
                        Category
                      </h5>
                      <p className="text-gray-300 text-sm">
                        {service.category}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Pricing & Duration */}
                  <div className="flex flex-col gap-6 text-right">
                    <div>
                      <h5 className="text-[#14b866] text-xs uppercase tracking-widest border-b border-[#14b866]/30 inline-block pb-1 mb-2">
                        Pricing
                      </h5>
                      <p className="text-white font-medium text-lg">
                        {formatPrice(service.price)}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[#14b866] text-xs uppercase tracking-widest border-b border-[#14b866]/30 inline-block pb-1 mb-2">
                        Duration
                      </h5>
                      <p className="text-gray-300 text-sm">
                        {formatDuration(service.duration)}
                      </p>
                    </div>
                  </div>

                </div>

                {/* CENTERED: Description Header */}
                <div className="mb-8">
                  <div className="text-center mb-2">
                    <h5 className="text-[#14b866] text-xs uppercase tracking-widest border-b border-[#14b866]/30 inline-block pb-1">
                      Description
                    </h5>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed text-left line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-4">
                  <a
                    href={`${waLink}&text=I would like to book the ${service.title} service.`}
                    className="flex-1 bg-[#14b866]/10 hover:bg-[#14b866] text-[#14b866] hover:text-white border border-[#14b866]/20 hover:border-transparent py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Book via WhatsApp
                  </a>
                  <Link
                    href={`/services/${service.slug}`}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXPAND / COLLAPSE BUTTON */}
        {services.length > 3 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 text-white border-b border-[#14b866] pb-1 hover:text-[#14b866] transition-colors uppercase tracking-widest text-sm"
            >
              {showAll ? 'View Less' : 'View Full Service Menu'} 
              <ArrowRight size={14} className={`transition-transform duration-300 ${showAll ? '-rotate-90' : 'rotate-0'}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}