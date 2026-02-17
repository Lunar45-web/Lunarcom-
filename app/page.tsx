import { client } from '@/sanity/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import AboutSection from '@/components/AboutSection'
import GallerySection from '@/components/GallerySection'
import ServicesSection from '@/components/ServicesSection'
import ReviewSectionWrapper from '@/components/ReviewSectionWrapper'
import InfoBarExpandable from '@/components/InfoBarExpandable';
import MobileMenu from '@/components/MobileMenu';
import {
  MapPin, Clock, Phone, Star, Quote, MessageCircle,
  ChevronDown, ArrowUpRight, ArrowUp, Menu,
  Instagram, Youtube, Facebook, Music2, Camera, ArrowRight
} from 'lucide-react';
import Link from 'next/link';


// REMOVED: import about from '@/sanity/schemaTypes/about'; 
// (This line was the cause of your error!)

type AboutData = {
  title: string;
  heading: string;
  highlightWord: string;
  mainText: string;
  secondaryText: string;
  founderName: string;
  founderTitle: string;
  founderInitial: string;
  mediaType: 'image' | 'video';
  aboutImage?: any;
  aboutVideo?: string;
}

// --- SANITY IMAGE BUILDER ---
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return source ? builder.image(source).url() : "";
}

// --- DATA FETCHING (unchanged) ---
export const revalidate = 10;

async function getData() {
 const about = await client.fetch(`
  *[_type == "about"][0]{
    title,
    heading,
    highlightWord,
    mainText,
    secondaryText,
    founderName,
    founderTitle,
    founderInitial,
    mediaType,
    "aboutImage": aboutImage.asset->url,
    aboutVideo
  }
`);
const approvedReviews = await client.fetch(`
  *[_type == "review" && status == "approved"] | order(reviewDate desc){
    reviewerName,
    rating,
    reviewText,
    serviceReceived
  }
`);


  console.log('Fetched about:', JSON.stringify(about, null, 2));

  const business = await client.fetch(`*[_type == "business"][0]{
    ...,
    "heroImageUrl": heroImage.asset->url
  }`);
  
  const services = await client.fetch(`*[_type == "service" && isActive == true] | order(_createdAt asc) {
    ...,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url
  }`);
  const testimonials = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`);
  const faqs = await client.fetch(`*[_type == "faq"] | order(_createdAt asc)`);
  
  // FIX 1: Updated query to handle null mediaType using coalesce
  const galleryImages = await client.fetch(`
    *[_type == "gallery" && isActive == true] | order(order asc, _createdAt asc) {
      _id,
      "mediaType": coalesce(mediaType, 'image'),
      "image": image.asset->url,
      video,
      description,
      category
    }
  `);

  console.log('Gallery images from Sanity:', JSON.stringify(galleryImages, null, 2));

  return { 
    business, 
    about, 
    services, 
    approvedReviews,
    testimonials, 
    faqs, 
    // FIX 2: Removed .map() so we return the full objects, not just strings
    galleryImages 
  };
}

const buildSocialUrl = (input: string, platform: string) => {
  if (input.startsWith('http')) return input;
  switch (platform) {
    case 'instagram': return `https://instagram.com/${input}`;
    case 'facebook': return `https://facebook.com/${input}`;
    case 'youtube': return input.startsWith('@') ? `https://youtube.com/${input}` : `https://youtube.com/@${input}`;
    case 'tiktok': return `https://tiktok.com/@${input}`;
    default: return input;
  }
};

export default async function Home() {
  // CORRECTED: Added 'about' to destructuring so we use the fetched data, not the schema
  const { business, about, services, approvedReviews, faqs, galleryImages } = await getData();

  if (!business) return <div className="p-20 text-center font-serif text-2xl text-white bg-[#112119] h-screen">Awaiting Sanity Data...</div>;

  const waLink = `https://wa.me/${business.whatsapp}?text=Hello, I would like to book an appointment.`;

  // Color palette from HTML
  const colors = {
    background: '#112119',
    surface: '#162b22',
    primary: '#14b866',
  };

  return (
  <main id="top" className="font-sans bg-[#112119] min-h-screen text-white selection:bg-[#14b866] selection:text-black overflow-x-hidden relative">

      {/* Custom scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #112119;
        }
        ::-webkit-scrollbar-thumb {
          background: #14b866;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #109251;
        }
        .glass-nav {
          background: rgba(17, 33, 25, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

{/* =======================
    1. HEADER
   ======================= */}
<header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
  {/* Logo with B icon and name - left side */}
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#14b866] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
      {business.name?.charAt(0) || 'B'}
    </div>
    {/* Changed from font-black italic to font-cormorant with appropriate weight */}
    <span className="font-cormorant font-medium text-xl md:text-2xl text-white tracking-[0.15em] uppercase whitespace-nowrap">
      {business.name}
    </span>
  </div>

  {/* Rest of your header remains exactly the same */}
  <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12">
    {['Services', 'Gallery', 'Reviews', 'FAQ'].map((item) => (
      <a
        key={item}
        href={`#${item.toLowerCase()}`}
        className="text-xs font-bold text-white/80 hover:text-[#14b866] transition-colors uppercase tracking-[0.2em] relative group font-inter"
      >
        {item}
        <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#14b866] group-hover:w-full transition-all duration-300" />
      </a>
    ))}
  </nav>

  {/* CTA + Mobile Menu - right side */}
  <div className="flex items-center gap-4">
    <a
      href={waLink}
      className="hidden md:flex bg-[#14b866] hover:bg-[#14b866]/90 text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(20,184,102,0.3)] font-inter"
    >
      Book Appointment
    </a>
    
    <MobileMenu waLink={waLink} />
  </div>
</header>

{/* Add this style in your head or global css */}
<style>{`
  .glass-nav {
    background: rgba(17, 33, 25, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
`}</style>

      {/* =======================
          2. MASSIVE HERO (with your dynamic tagline)
         ======================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {business.heroImage ? (

<img
  src={builder.image(business.heroImage).width(1920).auto('format').url()}
  alt="Luxurious salon"
  className="w-full h-full object-cover"
  loading="eager"
  fetchPriority="high"
/>
          ) : (
            <div className="w-full h-full bg-[#162b22]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#112119]/30 to-[#112119]/80 z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          {/* Keep your "Since 2024" badge but restyled */}
          <span className="inline-block px-4 py-2 mb-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#14b866] border border-[#14b866]/30 rounded-full backdrop-blur-sm bg-black/20">
            Since 2024
          </span>
          {/* Your dynamic tagline as main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight">
            {business.tagline || "Redefining Elegance"}
          </h1>
          {/* Static paragraph from HTML (not in Sanity) */}
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience world-class hair artistry in a sanctuary designed for the modern muse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waLink}
              className="bg-[#14b866] hover:bg-[#14b866]/90 text-white px-8 py-3 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-[#14b866]/50"
            >
              Reserve Your Seat
            </a>
            <a
              href="#services"
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full text-base font-medium transition-all"
            >
              Explore Services
            </a>
          </div>
        </div>

        {/* Scroll indicator (kept from original) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="text-white/50 text-3xl" size={32} />
        </div>
      </section>

<InfoBarExpandable
  location={business.location}
  googleMapsUrl={business.googleMapsUrl}
  whatsapp={business.whatsapp}
  workingDays={business.workingHours?.days}
  fallbackHours={business.hoursText || 'Mon - Sat: 8AM - 7PM'}
/>
      

    {/* About Section */}
    {about && <AboutSection data={about} />}

     {/* =======================
        5. SERVICES (NEW COMPONENT)
       ======================= */}
    <ServicesSection services={services} waLink={waLink} />

      {/* =======================
          6. GALLERY – LOOKBOOK (masonry from HTML)
         ======================= */}
    <GallerySection 
      items={galleryImages} 
      instagramUrl={buildSocialUrl(business.socialLinks?.instagram || '#', 'instagram')}
    />

 <ReviewSectionWrapper reviews={approvedReviews} />

      {/* =======================
          8. FAQ – SINGLE COLUMN ACCORDION
         ======================= */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h4 className="text-[#14b866] text-sm uppercase tracking-[0.2em] mb-4">Inquiries</h4>
          <h2 className="text-3xl font-light text-white">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any) => (
            <details key={faq._id} className="group bg-[#162b22] rounded-lg border border-white/5 open:border-[#14b866]/30 transition-all duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6 list-none">
                <span className="text-lg text-white font-light group-hover:text-[#14b866] transition-colors">
                  {faq.question}
                </span>
                <span className="transition group-open:rotate-180 text-gray-400 group-hover:text-white">
                  <ChevronDown size={20} />
                </span>
              </summary>
              <div className="text-gray-400 px-6 pb-6 pt-0 font-light leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* =======================
          9. FOOTER – YOUR ORIGINAL STRUCTURE, NEW GREEN STYLING
         ======================= */}
      <footer className="bg-[#0b1611] pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

            {/* Brand */}
            <div>
              <h2 className="font-light text-4xl mb-6 tracking-[0.1em] uppercase text-white">{business.name}</h2>
              <p className="text-gray-500 font-light leading-relaxed max-w-sm">
                An exclusive destination for those who appreciate the finer details of beauty and wellness.
              </p>
            </div>

            {/* Location (with map iframe) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#14b866]">Location</h3>
              <p className="text-gray-400 text-sm mb-4">{business.location || 'Downtown'}</p>
              {business.googleMapsUrl && (
                <div className="h-32 w-full overflow-hidden rounded-lg border border-white/10">
                  <iframe
                    src={business.googleMapsUrl}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#14b866]">Connect</h3>
              <div className="space-y-3 text-gray-400 font-light text-sm">
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#14b866] transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:+${business.whatsapp}`}
                  className="flex items-center gap-2 hover:text-[#14b866] transition-colors"
                >
                  <Phone size={18} />
                  <span>Call us</span>
                </a>
                <div className="flex gap-4 pt-3">
                  {business.socialLinks?.instagram && (
                    <a href={buildSocialUrl(business.socialLinks.instagram, 'instagram')} className="text-gray-400 hover:text-[#14b866] transition">
                      <Instagram size={20} />
                    </a>
                  )}
                  {business.socialLinks?.facebook && (
                    <a href={buildSocialUrl(business.socialLinks.facebook, 'facebook')} className="text-gray-400 hover:text-[#14b866] transition">
                      <Facebook size={20} />
                    </a>
                  )}
                  {business.socialLinks?.youtube && (
                    <a href={buildSocialUrl(business.socialLinks.youtube, 'youtube')} className="text-gray-400 hover:text-[#14b866] transition">
                      <Youtube size={20} />
                    </a>
                  )}
                  {business.socialLinks?.tiktok && (
                    <a href={buildSocialUrl(business.socialLinks.tiktok, 'tiktok')} className="text-gray-400 hover:text-[#14b866] transition">
                      <Music2 size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#14b866]">Explore</h3>
              <div className="flex flex-col gap-3 text-gray-400 font-light text-sm">
                <a href="#services" className="hover:text-white transition-colors">Menu</a>
                <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 tracking-widest uppercase">
            <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Built in Embu — Luxury Edition</p>
          </div>
        </div>
      </footer>

      {/* =======================
          FLOATING ACTIONS (kept from original)
         ======================= */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a
          href="#top"
          className="group bg-white/5 backdrop-blur-lg border border-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#14b866] hover:text-black hover:border-transparent transition-all duration-300 shadow-2xl"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
        </a>
        <a
          href={waLink}
          className="group bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 hover:rotate-12 transition-all duration-300"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    </main>
  );
}