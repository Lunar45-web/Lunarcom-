import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react'; 
import { Clock, ArrowLeft, MessageCircle, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ServiceGallery from '@/components/ServiceGallery'; // IMPORT NEW COMPONENT

// --- HELPER FUNCTIONS ---
const formatPrice = (price: string | number) => {
  if (!price) return '';
  const strPrice = String(price).replace(/\D/g, ''); 
  const formatted = new Intl.NumberFormat('en-KE').format(Number(strPrice));
  return `Ksh ${formatted}`;
};

const formatDuration = (input: string | number) => {
  if (!input) return '';
  const strInput = String(input);
  if (strInput.toLowerCase().includes('hour') || strInput.toLowerCase().includes('hr')) return strInput;
  const minutes = parseInt(strInput);
  if (isNaN(minutes)) return strInput;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours === 0) return `${remainingMins} mins`;
  if (hours > 0 && remainingMins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${remainingMins} mins`;
};

// --- MAIN PAGE ---

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; 

export default async function ServicePage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const query = `*[_type == "service" && slug.current == $slug][0] {
    ...,
    "imageUrl": mainImage.asset->url,
    fullDescription,
    gallery[] {
      mediaType,
      "imageUrl": image.asset->url,
      videoUrl
    }
  }`;

  const service = await client.fetch(query, { slug });
  const business = await client.fetch(`*[_type == "business"][0]`);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112119] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-light text-[#14b866] mb-4">Service Not Found</h1>
          <Link href="/" className="text-white underline hover:text-[#14b866] transition-colors">Return Home</Link>
        </div>
      </div>
    );
  }

  const waLink = `https://wa.me/${business?.whatsapp}?text=Hi, I would like to book the ${service.title} service.`;

  return (
    <div className="min-h-screen bg-[#112119] text-white font-sans selection:bg-[#14b866] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[60vh] w-full">
        {service.imageUrl ? (
          <img src={service.imageUrl} className="w-full h-full object-cover" alt={service.title} />
        ) : (
          <div className="w-full h-full bg-[#162b22]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112119]/60 via-[#112119]/40 to-[#112119]" />
        
        <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2">
           <Link 
            href="/" 
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#14b866] hover:border-[#14b866] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm text-white/60 font-medium backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-[#14b866]">Service Details</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
             
             {/* Header Card */}
             <div className="bg-[#162b22]/90 backdrop-blur-xl border border-white/5 p-8 rounded-2xl mb-8 shadow-2xl">
                <div className="flex flex-col gap-4">
                  <span className="text-[#14b866] font-bold tracking-[0.2em] uppercase text-xs">
                    {service.category || "Premium Treatment"}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-light text-white leading-tight">
                    {service.title}
                  </h1>
                  <p className="text-xl text-gray-300 font-light leading-relaxed border-l-2 border-[#14b866] pl-6 italic">
                    {service.shortDescription}
                  </p>
                </div>
             </div>

             {/* Full Description */}
             {service.fullDescription && (
               <div className="bg-[#162b22]/50 border border-white/5 p-8 rounded-2xl mb-8">
                 <h3 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                   About This Service
                 </h3>
                 <div className="prose prose-invert prose-lg max-w-none text-gray-400 font-light prose-headings:text-white prose-a:text-[#14b866] prose-strong:text-white">
                   <PortableText value={service.fullDescription} />
                 </div>
               </div>
             )}

             {/* VISUALS / GALLERY (Replaced with new Component) */}
             <ServiceGallery gallery={service.gallery} />

          </div>

          {/* RIGHT COLUMN: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#162b22] border border-[#14b866]/20 p-8 rounded-2xl shadow-[0_0_50px_-10px_rgba(20,184,102,0.1)]">
                
                <div className="text-center mb-8 pb-8 border-b border-white/5">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Investment</p>
                  <p className="text-4xl font-light text-white">
                    {formatPrice(service.price)}
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="text-[#14b866]" size={20} />
                        <span>Duration</span>
                     </div>
                     <span className="font-medium text-white">{formatDuration(service.duration)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-gray-300">
                        <Check className="text-[#14b866]" size={20} />
                        <span>Consultation</span>
                     </div>
                     <span className="font-medium text-white">Included</span>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-gray-300">
                        <Check className="text-[#14b866]" size={20} />
                        <span>Premium Products</span>
                     </div>
                     <span className="font-medium text-white">Yes</span>
                  </div>
                </div>

                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#14b866] hover:bg-[#12a35a] text-white py-4 rounded-xl font-medium text-lg shadow-lg shadow-[#14b866]/20 hover:shadow-[#14b866]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                >
                  <MessageCircle size={20} className="group-hover:animate-pulse" />
                  Book Now
                </a>
                
                <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
                  Bookings are confirmed upon deposit. <br/>Cancellation policy applies.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}