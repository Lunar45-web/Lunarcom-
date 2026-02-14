import { client, urlFor } from '@/sanity/lib/client';  // ensuring correct import path
import { PortableText } from '@portabletext/react'; 
import { Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// TYPE DEFINITION: Params is now a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: Props) {
  // 1. AWAIT THE PARAMS (The Fix)
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const query = `*[_type == "service" && slug.current == $slug][0] {
    ...,
    "imageUrl": mainImage.asset->url,
    "galleryUrls": gallery[].asset->url
  }`;

  // 2. PASS THE RESOLVED SLUG
  const service = await client.fetch(query, { slug });
  
  // Fetch business info for WhatsApp number
  const business = await client.fetch(`*[_type == "business"][0]`);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#2D2D2D] mb-4">Service Not Found</h1>
          <Link href="/" className="text-[#D4AF37] underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const waLink = `https://wa.me/${business?.whatsapp}?text=Hi, I want to book ${service.title}`;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2D2D2D] font-sans">
      
      {/* 1. HERO IMAGE */}
      <div className="relative h-[50vh] w-full bg-gray-200">
        {service.imageUrl && (
          <img src={service.imageUrl} className="w-full h-full object-cover" alt={service.title} />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <Link href="/" className="absolute top-8 left-8 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-all z-20">
          <ArrowLeft size={24} />
        </Link>
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto -mt-20 relative z-10 px-6 pb-20">
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/50">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
               <span className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">Premium Service</span>
               <h1 className="font-serif text-4xl md:text-5xl mt-2 text-[#2D2D2D]">{service.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#2D2D2D]">{service.price}</p>
              <div className="flex items-center gap-2 text-gray-500 justify-end mt-1 font-medium">
                <Clock size={16} /> {service.duration}
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 3. DESCRIPTION */}
          <div className="prose prose-lg text-gray-600 mb-12 max-w-none">
            <p className="text-xl leading-relaxed">{service.shortDescription}</p>
            {/* Render Full Description if it exists */}
            {service.fullDescription && (
              <div className="mt-6">
                <PortableText value={service.fullDescription} />
              </div>
            )}
          </div>

          {/* 4. GALLERY */}
          {service.galleryUrls && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {service.galleryUrls.map((url: string, i: number) => (
                <img key={i} src={url} className="rounded-xl h-40 w-full object-cover hover:scale-105 transition duration-500 cursor-pointer shadow-sm" alt="Gallery" />
              ))}
            </div>
          )}

          {/* 5. STICKY BOOKING ACTION */}
          <div className="flex gap-4">
             <a href={waLink} target="_blank" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
               <MessageCircle size={24} /> Book via WhatsApp
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}