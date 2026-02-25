'use client';

import { Cormorant_Garamond, Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSalonData } from "@/sanity/lib/client"; 
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>('');

  const isStudio = pathname?.startsWith('/studio');

  useEffect(() => {
    async function checkSalon() {
      if (isStudio) {
        setLoading(false);
        return;
      }
      try {
        const domainValue = window.location.host.replace('www.', '');
        setDomain(domainValue);
        const data = await getSalonData(domainValue);
        setSalon(data);
      } catch (error) {
        console.error("Error fetching salon:", error);
      } finally {
        setLoading(false);
      }
    }
    checkSalon();
  }, [pathname, isStudio]);

  if (loading) {
    return (
      <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
        <body className="bg-[#112119]" />
      </html>
    );
  }

  // --- REFINED SETUP SCREEN (Luxury Aesthetic) ---
  if (!salon && !isStudio) {
    return (
      <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
        <body className="bg-[#112119] flex h-screen items-center justify-center text-white p-6 antialiased">
          <div className="relative group overflow-hidden text-center p-12 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl max-w-md shadow-2xl">
            {/* Soft Glow Effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#14b866]/20 rounded-full blur-[80px]" />
            
            <h1 className="text-4xl font-light mb-6 font-serif tracking-tight">
              Salon <span className="text-[#14b866]">Setup</span>
            </h1>
            
            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-light">
              We couldn't find a configuration for <span className="text-white font-mono">{domain}</span>. 
              Please log in to the studio to initialize your business profile.
            </p>
            
            <a 
              href="/studio" 
              className="inline-block bg-white text-black px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#14b866] hover:text-white transition-all duration-500 shadow-xl"
            >
              Enter Studio
            </a>
          </div>
        </body>
      </html>
    );
  }

  const displaySalon = salon || { name: "Studio", primaryColor: "#14b866" };

  // --- DYNAMIC SEO & JSON-LD (Your Pinned Data) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": salon?.name || "Premium Salon",
    "image": salon?.heroImage || "https://salon45.vercel.app/opengraph-image.png",
    "@id": `https://${domain}`,
    "url": `https://${domain}`,
    "telephone": salon?.whatsapp || "+254700000000",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": salon?.location || "Dallas Area",
      "addressLocality": "Embu",
      "addressRegion": "Embu County",
      "postalCode": "60100",
      "addressCountry": "KE"
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "20:00"
    }]
  };

  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${inter.variable}`}
      style={{
        // @ts-ignore
        "--primary": displaySalon.primaryColor || "#14b866",
        // @ts-ignore
        "--secondary": displaySalon.secondaryColor || "#000000",
      }}
    >
      <head>
        <title>{salon ? `${salon.name} | ${salon.tagline || 'Luxury Salon'}` : "Premium Salon | Premium Beauty"}</title>
        <meta name="description" content={salon?.description || "Luxury beauty services and wellness."} />
        <meta property="og:title" content={salon?.name || "Premium Salon"} />
        <meta property="og:image" content={salon?.heroImage || "https://salon45.vercel.app/opengraph-image.png"} />
      </head>
      <body className="antialiased bg-[#112119]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <NextTopLoader color={displaySalon.primaryColor || "#14b866"} />
        
        {children}
      </body>
    </html>
  );
}