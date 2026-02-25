import { client, urlFor } from '@/sanity/lib/sanity'; // Adjust path if needed
import { getSalonData } from '@/sanity/lib/client'; // Import our engine
import { headers } from 'next/headers';
import { PortableText } from '@portabletext/react'; 
import { Clock, ArrowLeft, MessageCircle, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ServiceGallery from '@/components/ServiceGallery';

// --- HELPERS ---
const formatPrice = (price: string | number) => {
  if (!price) return 'Contact for price';
  const strPrice = String(price).replace(/\D/g, ''); 
  return `Ksh ${new Intl.NumberFormat('en-KE').format(Number(strPrice))}`;
};

const formatDuration = (input: string | number) => {
  if (!input) return '';
  const strInput = String(input);
  if (strInput.toLowerCase().includes('hour')) return strInput;
  const minutes = parseInt(strInput);
  if (isNaN(minutes)) return strInput;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return hours > 0 ? `${hours} hr ${remainingMins > 0 ? remainingMins + 'm' : ''}` : `${remainingMins} mins`;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60; 

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  
  // 1. Get Domain context
  const headersList = headers();
  const domain = (await headersList).get('x-site-domain') || 'localhost:3000';

  // 2. Fetch the specific Salon for this domain
  const salon = await getSalonData(domain);

  if (!salon) return <div className="p-20 text-white">Salon not found</div>;

  // 3. Fetch the specific Service AND ensure it belongs to THIS salon
  const serviceQuery = `*[_type == "service" && slug.current == $slug && salon._ref == $salonId][0] {
    ...,
    "imageUrl": mainImage.asset->url,
    gallery[] {
      mediaType,
      "imageUrl": image.asset->url,
      videoUrl
    }
  }`;

  const service = await client.fetch(serviceQuery, { slug, salonId: salon._id });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112119] text-white">
        <Link href="/" className="text-[var(--primary)] underline">Return to {salon.name}</Link>
      </div>
    );
  }

  const waLink = `https://wa.me/${salon.whatsapp}?text=Hi ${salon.name}, I'm interested in booking ${service.title}.`;

  return (
    // Notice the use of var(--primary) in the style and selection
    <div className="min-h-screen bg-[#112119] text-white font-sans selection:bg-[var(--primary)] selection:text-black">
      <style>{`
        :root { --primary: ${salon.primaryColor || '#14b866'}; }
      `}</style>
      
      {/* HERO SECTION */}
      <div className="relative h-[60vh] w-full">
        {service.imageUrl && (
          <img src={service.imageUrl} className="w-full h-full object-cover" alt={service.title} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#112119]/60 via-[#112119]/40 to-[#112119]" />
        
        <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2">
           <Link href="/" className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[var(--primary)] transition-all">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
             <div className="bg-[#162b22]/90 backdrop-blur-xl border border-white/5 p-8 rounded-2xl mb-8 shadow-2xl">
                <span className="text-[var(--primary)] font-bold tracking-[0.2em] uppercase text-xs">
                  {service.category || "Premium Treatment"}
                </span>
                <h1 className="text-4xl md:text-5xl font-light text-white mt-4">{service.title}</h1>
                <p className="text-xl text-gray-300 font-light mt-6 border-l-2 border-[var(--primary)] pl-6 italic">
                  {service.shortDescription}
                </p>
             </div>

             {service.fullDescription && (
               <div className="bg-[#162b22]/50 border border-white/5 p-8 rounded-2xl mb-8">
                 <div className="prose prose-invert max-w-none prose-a:text-[var(--primary)]">
                   <PortableText value={service.fullDescription} />
                 </div>
               </div>
             )}

             <ServiceGallery gallery={service.gallery} />
          </div>

          {/* RIGHT COLUMN: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#162b22] border border-[var(--primary)]/20 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8 pb-8 border-b border-white/5">
                  <p className="text-gray-400 text-sm mb-2 uppercase">Investment</p>
                  <p className="text-4xl font-light text-white">{formatPrice(service.price)}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-gray-300"><Clock size={18} className="text-[var(--primary)]" /> Duration</span>
                    <span className="text-white">{formatDuration(service.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2 text-gray-300"><Check size={18} className="text-[var(--primary)]" /> Products</span>
                    <span className="text-white">Premium</span>
                  </div>
                </div>

                <a href={waLink} className="w-full bg-[var(--primary)] hover:opacity-90 text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all">
                  <MessageCircle size={20} />
                  Book with {salon.name}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}