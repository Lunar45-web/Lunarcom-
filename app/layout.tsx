import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers"; 
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

// --- DYNAMIC METADATA ENGINE ---
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  // Fixed: Getting the actual injected domain header
  const domain = headersList.get("x-site-domain") || "localhost:3000";
  const salon = await getSalonData(domain);

  if (!salon) return { title: "Salon Not Found" };

  return {
    title: `${salon.name} | ${salon.tagline || 'Luxury Salon'}`,
    description: salon.description || `Luxury beauty services at ${salon.location}.`,
    openGraph: {
      title: salon.name,
      description: salon.tagline,
      url: `https://${domain}`,
      siteName: salon.name,
      images: salon.heroImage ? [{ url: salon.heroImage }] : [],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the domain and current path from headers
  const headersList = await headers();
  const domain = headersList.get("x-site-domain") || "localhost:3000";
  const currentPath = headersList.get("x-pathname") || "/";
  
  // 2. Fetch salon data
  const salon = await getSalonData(domain);

  // 3. IF NO SALON IS FOUND: 
  // We show the "Setup" screen ONLY if the user isn't already trying to go to the studio.
  if (!salon && !currentPath.startsWith('/studio')) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-[#112119] flex h-screen items-center justify-center text-white`}>
          <div className="text-center p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md max-w-md">
            <h1 className="text-3xl font-light mb-4 font-serif">Salon Setup Required</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              We couldn't find a salon configuration for <span className="text-[#14b866] font-mono">{domain}</span>. 
              Log in to the studio to create your business profile.
            </p>
            <a 
              href="/studio" 
              className="inline-block bg-white text-black px-8 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#14b866] hover:text-white transition-all"
            >
              Open Studio
            </a>
          </div>
        </body>
      </html>
    );
  }

  // 4. PREPARE DISPLAY DATA:
  // If we are in the studio, salon might be null, so we use fallbacks to prevent crashes.
  const displaySalon = salon || {
    name: "Salon Studio",
    primaryColor: "#14b866",
    secondaryColor: "#000000",
    whatsapp: "",
    location: ""
  };

  // 5. BUILD JSON-LD
  const jsonLd = salon ? {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": displaySalon.name,
    "url": `https://${domain}`,
    "telephone": displaySalon.whatsapp,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": displaySalon.location,
      "addressCountry": "KE"
    },
    "openingHoursSpecification": displaySalon.workingHours?.days?.map((d: any) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": d.day.charAt(0).toUpperCase() + d.day.slice(1),
      "opens": d.open || "08:00",
      "closes": d.close || "20:00"
    }))
  } : null;

  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${inter.variable}`}
      // Injecting brand colors as CSS variables
      style={{
        // @ts-ignore
        "--primary": displaySalon.primaryColor || "#14b866",
        // @ts-ignore
        "--secondary": displaySalon.secondaryColor || "#000000",
      }}
    >
      <body className="antialiased bg-[#112119]">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        
        <NextTopLoader
          color={displaySalon.primaryColor || "#14b866"}
          height={3}
          showSpinner={false}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />

        {children}
      </body>
    </html>
  );
}