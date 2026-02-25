import { headers } from 'next/headers';
import { getSalonData } from '@/sanity/lib/client'; // Your new engine
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import ServicesSection from '@/components/ServicesSection';
import ReviewSectionWrapper from '@/components/ReviewSectionWrapper';
import InfoBarExpandable from '@/components/InfoBarExpandable';
import MobileMenu from '@/components/MobileMenu';
import {
  ChevronDown, ArrowUp, MessageCircle, 
  Instagram, Youtube, Facebook, Music2, Phone
} from 'lucide-react';

// Revalidate every 10 seconds for fast updates
export const revalidate = 10;

export default async function Home() {
  // 1. Get the domain from Middleware headers
  const headersList = headers();
  const domain = (await headersList).get('x-site-domain') || 'localhost:3000';

  // 2. Fetch ALL salon data in one go
  const salon = await getSalonData(domain);

  // 3. Safety Check
  if (!salon) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#112119] text-white font-serif text-2xl">
        Salon profile not found for {domain}
      </div>
    );
  }

  // 4. Setup Dynamic Links & Colors
  const waLink = `https://wa.me/${salon.whatsapp}?text=Hello, I would like to book an appointment.`;
  const primaryColor = salon.primaryColor || '#14b866';

  const buildSocialUrl = (input: string, platform: string) => {
    if (!input || input === '#') return '#';
    if (input.startsWith('http')) return input;
    switch (platform) {
      case 'instagram': return `https://instagram.com/${input}`;
      case 'facebook': return `https://facebook.com/${input}`;
      case 'youtube': return input.startsWith('@') ? `https://youtube.com/${input}` : `https://youtube.com/@${input}`;
      case 'tiktok': return `https://tiktok.com/@${input}`;
      default: return input;
    }
  };

  return (
    <main id="top" className="font-sans bg-[#112119] min-h-screen text-white selection:bg-[var(--primary)] selection:text-black overflow-x-hidden relative">
      
      {/* Dynamic Global Styles for this specific Salon */}
      <style>{`
        :root {
          --primary: ${primaryColor};
        }
        ::-webkit-scrollbar-thumb {
          background: var(--primary);
        }
        .glass-nav {
          background: rgba(17, 33, 25, 0.7);
          backdrop-filter: blur(12px);
        }
      `}</style>

      {/* =======================
          1. HEADER
      ======================= */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {salon.name?.charAt(0) || 'B'}
          </div>
          <span className="font-cormorant font-medium text-xl md:text-2xl text-white tracking-[0.15em] uppercase whitespace-nowrap">
            {salon.name}
          </span>
        </div>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12">
          {['Services', 'Gallery', 'Reviews', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs font-bold text-white/80 hover:text-[var(--primary)] transition-colors uppercase tracking-[0.2em] relative group font-inter"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-[var(--primary)] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={waLink}
            className="hidden md:flex bg-[var(--primary)] hover:opacity-90 text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(20,184,102,0.3)]"
          >
            Book Appointment
          </a>
          <MobileMenu waLink={waLink} />
        </div>
      </header>

      {/* =======================
          2. HERO SECTION
      ======================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {salon.heroImage ? (
            <img src={salon.heroImage} alt={salon.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#162b22]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#112119]/30 to-[#112119]/80 z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 mb-6 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[var(--primary)] border border-[var(--primary)]/30 rounded-full backdrop-blur-sm bg-black/20">
            Premium Experience
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight">
            {salon.tagline || "Redefining Elegance"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={waLink} className="bg-[var(--primary)] text-white px-8 py-3 rounded-full text-base font-medium transition-all shadow-lg hover:shadow-[var(--primary)]/50">
              Reserve Your Seat
            </a>
            <a href="#services" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full text-base font-medium transition-all">
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* =======================
          3. COMPONENT SECTIONS
      ======================= */}
      <InfoBarExpandable
        location={salon.location}
        googleMapsUrl={salon.googleMapsUrl}
        mapQuery={salon.mapQuery}
        whatsapp={salon.whatsapp}
        workingDays={salon.workingHours?.days}
        fallbackHours="Mon - Sat: 8AM - 8PM"
      />

      {salon.about && <AboutSection data={salon.about} />}

      <ServicesSection services={salon.services} waLink={waLink} />

      <GallerySection 
        items={salon.gallery} 
        instagramUrl={buildSocialUrl(salon.socialLinks?.instagram, 'instagram')} 
      />

      <ReviewSectionWrapper reviews={salon.reviews} />

      {/* =======================
          4. FAQ SECTION
      ======================= */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h4 className="text-[var(--primary)] text-sm uppercase tracking-[0.2em] mb-4">Inquiries</h4>
          <h2 className="text-3xl font-light text-white">Frequently Asked</h2>
        </div>
        <div className="space-y-4">
          {salon.faqs?.map((faq: any) => (
            <details key={faq._id} className="group bg-[#162b22] rounded-lg border border-white/5 open:border-[var(--primary)]/30 transition-all">
              <summary className="flex justify-between items-center cursor-pointer p-6 list-none">
                <span className="text-lg text-white font-light group-hover:text-[var(--primary)] transition-colors">{faq.question}</span>
                <ChevronDown size={20} className="transition group-open:rotate-180 text-gray-400" />
              </summary>
              <div className="text-gray-400 px-6 pb-6 pt-0 font-light leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* =======================
          5. FOOTER
      ======================= */}
      <footer className="bg-[#0b1611] pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <h2 className="font-light text-4xl mb-6 tracking-[0.1em] uppercase text-white">{salon.name}</h2>
              <p className="text-gray-500 font-light leading-relaxed">{salon.tagline}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[var(--primary)]">Location</h3>
              <p className="text-gray-400 text-sm mb-4">{salon.location}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-6 text-[var(--primary)]">Connect</h3>
              <div className="flex gap-4">
                {salon.socialLinks?.instagram && (
                  <a href={buildSocialUrl(salon.socialLinks.instagram, 'instagram')} className="text-gray-400 hover:text-[var(--primary)] transition">
                    <Instagram size={20} />
                  </a>
                )}
                {/* Add other social icons here similarly */}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
            <p className="text-white/80">© {new Date().getFullYear()} {salon.name}.</p>
            <p className="text-[#F7E7CE]">Built By <span className="text-[var(--primary)]">LunarCom</span></p>
          </div>
        </div>
      </footer>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a href="#top" className="bg-white/5 backdrop-blur-lg border border-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-all">
          <ArrowUp size={20} />
        </a>
        <a href={waLink} className="bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
          <MessageCircle size={28} />
        </a>
      </div>
    </main>
  );
}