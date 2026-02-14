import { client } from '@/sanity/lib/sanity'; 
import imageUrlBuilder from '@sanity/image-url';
import InfoBarExpandable from '@/components/InfoBarExpandable'
import { Playfair_Display, Inter } from 'next/font/google';
import { MapPin, Phone, Clock, Star, Quote, MessageCircle, 
  ChevronDown, ArrowUpRight, ArrowUp, Menu, 
  Instagram, Youtube, Facebook, Music2 } from 'lucide-react';
import Link from 'next/link';

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- SANITY IMAGE BUILDER ---
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return source ? builder.image(source).url() : "";
}

// --- DATA FETCHING ---
export const revalidate = 10; 

async function getData() {
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
  const galleryImages = await client.fetch(`
    *[_type == "gallery" && isActive == true] | order(order asc, _createdAt asc) {
      "imageUrl": image.asset->url
    }
  `);

  return { 
    business, 
    services, 
    testimonials, 
    faqs, 
    galleryImages: galleryImages.map((g: any) => g.imageUrl)
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
  const { business, services, testimonials, faqs, galleryImages } = await getData();

  if (!business) return <div className="p-20 text-center font-serif text-2xl text-white bg-black h-screen">Awaiting Sanity Data...</div>;

  const waLink = `https://wa.me/${business.whatsapp}?text=Hello, I would like to book an appointment.`;

  return (
    <main id="top" className={`${playfair.variable} ${inter.variable} font-sans bg-[#0A0A0A] min-h-screen text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative`}>
      
      {/* Subtle noise overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wNCIgLz48L3N2Zz4=')] pointer-events-none z-50 opacity-20 mix-blend-overlay" />

      {/* =======================
          1. HEADER
         ======================= */}
      <header className="absolute top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex items-center justify-between backdrop-blur-md bg-black/10 border-b border-white/5">
        {/* Logo */}
        <span className="font-serif font-black text-2xl text-white tracking-[0.2em] uppercase">
          {business.name}
        </span>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {['Services', 'Gallery', 'Reviews', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-bold text-white/80 hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em] relative group"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href={waLink}
            className="hidden md:flex bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            Book Now
          </a>
          <details className="md:hidden relative group">
            <summary className="list-none cursor-pointer text-white p-2">
              <Menu size={28} />
            </summary>
            <div className="absolute top-full right-0 mt-4 w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col gap-3 z-50">
              {['Services', 'Gallery', 'Reviews', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-white/80 hover:text-[#D4AF37] uppercase tracking-wider border-b border-white/5 pb-2 transition-colors"
                >
                  {item}
                </a>
              ))}
              <a
                href={waLink}
                className="mt-2 bg-[#D4AF37] text-black px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-center"
              >
                Book Now
              </a>
            </div>
          </details>
        </div>
      </header>

      {/* =======================
          2. HERO
         ======================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background media */}
        <div className="absolute inset-0 z-0">
          {business.heroVideo ? (
            <video src={business.heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 opacity-60" />
          ) : (
            <img
              src={business.heroImage ? urlFor(business.heroImage) : "/placeholder.jpg"}
              className="w-full h-full object-cover scale-105 opacity-60 transition-transform duration-[20s] hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mt-20">
          <span className="inline-block px-4 py-2 mb-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/30 rounded-full backdrop-blur-sm bg-black/20">
            Since 2024
          </span>
          <h1 className="font-serif text-7xl md:text-[8rem] text-white mb-6 leading-none tracking-tight">
            {business.tagline || "Elegance Redefined."}
          </h1>
          <p className="text-white/70 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto mb-12 drop-shadow-lg">
            Premium beauty services curated for the modern aesthetic.
          </p>
          <a
            href="#services"
            className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/30 text-white hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-500 animate-pulse"
          >
            <ChevronDown size={24} />
          </a>
        </div>
      </section>

<InfoBarExpandable
  location={business.location}
  googleMapsUrl={business.googleMapsUrl}
  whatsapp={business.whatsapp}
  workingDays={business.workingHours?.days}
  fallbackHours={business.hoursText || 'Mon - Sat: 8AM - 7PM'}
/>
      {/* =======================
          4. ABOUT – FINE ART DIPTYCH
         ======================= */}
      <section id="about" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-6 block relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-12 after:h-px after:bg-[#D4AF37]/50">
              Our Story
            </span>
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-8 leading-[1.1]">
              Mastery in <br />every detail.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10 font-light">
              {business.aboutText || "We believe beauty is an art form. Our studio provides an escape from the ordinary, offering highly personalized services in an environment of absolute luxury."}
            </p>
            <div className="flex gap-6">
              <a
                href="#services"
                className="group relative px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-[0_10px_30px_-5px_rgba(212,175,55,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Menu <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={business.heroImage ? urlFor(business.heroImage) : "/placeholder.jpg"}
                className="w-full h-full object-cover grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-1000 scale-100 hover:scale-110"
              />
            </div>
            {/* Decorative gold frame accent */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-[3rem] pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-[3rem] pointer-events-none" />
          </div>
        </div>
      </section>
{/* =======================
    5. SERVICES – LUXURY CARD COLLECTION
   ======================= */}
<section id="services" className="relative py-28 md:py-40 px-6">
  <div className="max-w-7xl mx-auto">
    {/* Section header */}
    <div className="text-center mb-24">
      <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
        The Experience
      </span>
      <h2 className="font-serif text-6xl md:text-8xl text-white leading-none">
        The Menu
      </h2>
      <div className="w-24 h-px bg-[#D4AF37]/50 mx-auto mt-6" />
    </div>

    {/* Service cards – beautiful, contained, alternating */}
    <div className="flex flex-col gap-20 md:gap-28">
      {services.map((service: any, index: number) => (
        <div
          key={service._id}
          className="group relative w-full max-w-6xl mx-auto"
        >
          {/* Card container – refined, floating, with subtle depth */}
          <div
            className={`
              relative flex flex-col 
              ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} 
              items-stretch gap-0 lg:gap-8 xl:gap-12
              bg-gradient-to-br from-[#111] to-black
              rounded-3xl lg:rounded-[2rem]
              border border-white/5
              shadow-2xl shadow-black/50
              overflow-hidden
              transition-all duration-700
              hover:border-[#D4AF37]/20 hover:shadow-[0_30px_50px_-15px_rgba(212,175,55,0.2)]
            `}
          >
            {/* Image side – refined, not full‑bleed inside card */}
            <div className="relative w-full lg:w-[48%] h-[350px] md:h-[500px] lg:h-[550px] overflow-hidden">
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              {service.imageUrl && (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-all duration-[1.8s] group-hover:scale-110"
                />
              )}
              {/* Elegant corner accent – gold, refined */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/40 z-20 rounded-tl-2xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/40 z-20 rounded-br-2xl" />
            </div>

            {/* Content side – perfectly balanced */}
            <div className="relative w-full lg:w-[52%] flex items-center p-8 md:p-12 lg:p-16">
              <div className="relative z-30">
                {/* Category badge – refined */}
                <span className="inline-block px-5 py-2 mb-6 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full">
                  {service.category || "Signature Service"}
                </span>

                {/* Title – elegant serif */}
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                  {service.title}
                </h3>

                {/* Description – light, airy */}
                <p className="text-white/60 text-base md:text-lg font-light mb-8 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Price & Duration – luxurious details */}
                <div className="flex items-center gap-6 md:gap-10 mb-10 pb-8 border-b border-white/10">
                  <div>
                    <span className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                      Investment
                    </span>
                    <span className="text-2xl md:text-3xl font-serif text-[#D4AF37]">
                      {service.price}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <span className="block text-xs text-white/40 uppercase tracking-wider mb-1">
                      Duration
                    </span>
                    <span className="text-white/80 font-light text-base md:text-lg">
                      {service.duration}
                    </span>
                  </div>
                </div>

                {/* Actions – refined, confident */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group/btn relative px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-[0_10px_30px_-5px_rgba(212,175,55,0.5)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Discover <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </span>
                  </Link>
                  <a
                    href={`${waLink}&text=I would like to book the ${service.title} service.`}
                    className="flex items-center gap-2 text-white/70 hover:text-[#D4AF37] uppercase tracking-widest text-xs font-medium transition-colors border-b border-white/20 pb-0.5"
                  >
                    Book via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

     {/* =======================
          6. GALLERY – CURATED COLLAGE
         ======================= */}
      <section id="gallery" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Portfolio</span>
            <h2 className="font-serif text-5xl md:text-7xl text-white">Our Work</h2>
            <div className="w-20 h-px bg-[#D4AF37]/40 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-[200px] md:auto-rows-[280px]">
            {galleryImages.slice(0, 8).map((img: string, i: number) => {
              let span = '';
              if (i === 0) span = 'md:col-span-2 md:row-span-2';
              if (i === 2) span = 'md:col-span-1 md:row-span-2';
              if (i === 4) span = 'md:col-span-2';
              if (i === 6) span = 'md:col-span-1 md:row-span-2';
              if (i === 7) span = 'md:col-span-2';

              // FIX: Clean className interpolation to prevent trailing whitespace hydration errors
              const containerClasses = span 
                ? `relative group overflow-hidden rounded-2xl h-full ${span}`
                : "relative group overflow-hidden rounded-2xl h-full";

              return (
                <div key={i} className={containerClasses}>
                  <img
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-white text-sm font-medium uppercase tracking-wider border-b border-[#D4AF37] pb-1">
                      View Project
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37]/70 transition-all duration-500" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF37]/0 group-hover:border-[#D4AF37]/70 transition-all duration-500" />
                </div>
              );
            })}
          </div>
          {galleryImages.length === 0 && (
            <p className="text-center text-white/40 mt-20">No gallery images available.</p>
          )}
        </div>
      </section>

      {/* =======================
          7. REVIEWS – PRESTIGE TESTIMONIALS
         ======================= */}
      <section id="reviews" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-12 after:h-px after:bg-[#D4AF37]/50">
                Clientele
              </span>
              <h2 className="font-serif text-5xl md:text-7xl text-white">Words of Praise</h2>
            </div>
            <span className="hidden md:block text-white/20 text-sm uppercase tracking-[0.3em]">Since 2024</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t: any, i: number) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-[#111] to-black p-10 rounded-3xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] hover:-translate-y-2"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-700" />
                <Quote className="text-[#D4AF37] opacity-30 w-10 h-10 mb-6" />
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#D4AF37" stroke="#D4AF37" />
                  ))}
                </div>
                <p className="text-white/70 text-lg italic mb-10 leading-relaxed font-light">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
                    <span className="text-[#D4AF37] font-serif text-xl">{t.clientName?.charAt(0) || 'C'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase tracking-widest text-sm">{t.clientName}</p>
                    <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{t.serviceTaken}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          8. FAQ – TWO‑COLUMN ACCORDION
         ======================= */}
      <section id="faq" className="py-32 px-6 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Inquiries</span>
            <h2 className="font-serif text-5xl md:text-7xl text-white">Common Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-4">
            {faqs?.map((faq: any, i: number) => (
              <details key={i} className="group border-b border-white/10 py-6 open:border-[#D4AF37]/30 transition-colors">
                <summary className="flex items-center justify-between cursor-pointer list-none text-lg md:text-xl font-serif text-white/90 hover:text-[#D4AF37] transition-colors">
                  <span>{faq.question}</span>
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <span className="absolute w-5 h-px bg-current transition-transform duration-300 group-open:rotate-180" />
                    <span className="absolute w-px h-5 bg-current transition-transform duration-300 group-open:rotate-180 group-open:opacity-0" />
                  </div>
                </summary>
                <div className="pt-6 pr-8 text-white/50 font-light leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

    {/* =======================
    9. FOOTER – SIGNATURE (with dynamic social URLs)
   ======================= */}
<footer className="relative bg-[#050505] text-white pt-32 pb-12 border-t border-white/10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
      
      {/* Brand */}
      <div>
        <h2 className="font-serif text-4xl mb-6 tracking-[0.1em] uppercase text-white">{business.name}</h2>
        <p className="text-white/40 font-light leading-relaxed max-w-sm">
          An exclusive destination for those who appreciate the finer details of beauty and wellness.
        </p>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#D4AF37]">Location</h3>
        <p className="text-white/60 text-sm mb-4">{business.location || 'Downtown'}</p>
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

      {/* Connect – WhatsApp, Call, Socials */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#D4AF37]">Connect</h3>
        <div className="space-y-3 text-white/60 font-light text-sm">
          {/* WhatsApp link */}
          <a
            href={`https://wa.me/${business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
          {/* Call link */}
          <a
            href={`tel:+${business.whatsapp}`}
            className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
          >
            <Phone size={18} />
            <span>Call us</span>
          </a>
          {/* Social icons – build URLs from usernames */}
          <div className="flex gap-4 pt-3">
            {business.socialLinks?.instagram && (
              <a
                href={buildSocialUrl(business.socialLinks.instagram, 'instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition"
              >
                <Instagram size={20} />
              </a>
            )}
            {business.socialLinks?.facebook && (
              <a
                href={buildSocialUrl(business.socialLinks.facebook, 'facebook')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition"
              >
                <Facebook size={20} />
              </a>
            )}
            {business.socialLinks?.youtube && (
              <a
                href={buildSocialUrl(business.socialLinks.youtube, 'youtube')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition"
              >
                <Youtube size={20} />
              </a>
            )}
            {business.socialLinks?.tiktok && (
              <a
                href={buildSocialUrl(business.socialLinks.tiktok, 'tiktok')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4AF37] transition"
              >
                <Music2 size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Explore */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[#D4AF37]">Explore</h3>
        <div className="flex flex-col gap-3 text-white/60 font-light text-sm">
          <a href="#services" className="hover:text-white transition-colors">Menu</a>
          <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/30 tracking-widest uppercase">
      <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
      <p className="mt-4 md:mt-0">Built in Embu — Luxury Edition</p>
    </div>
  </div>
</footer>
      {/* =======================
          FLOATING ACTIONS – GLASS MORPHISM
         ======================= */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a
          href="#top"
          className="group bg-white/5 backdrop-blur-lg border border-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-black hover:border-transparent transition-all duration-300 shadow-2xl"
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