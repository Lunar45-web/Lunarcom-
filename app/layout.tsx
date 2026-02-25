import type { Metadata, ResolvingMetadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers"; // 👈 New import
import { getSalonData } from "@/sanity/lib/client"; // 👈 Your new engine
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
// This replaces your static export const metadata
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const domain = headersList.get("x-site-domain") || "localhost:3000";
  const salon = await getSalonData(domain);

  if (!salon) return { title: "Salon Not Found" };

  return {
    title: `${salon.name} | ${salon.tagline}`,
    description: `Luxury beauty services at ${salon.location}.`,
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
  // 1. Get the domain and salon data
  const headersList = await headers();
  const domain = headersList.get("x-site-domain") || "localhost:3000";
  const salon = await getSalonData(domain);

  // Fallback if salon isn't found (prevents crash)
  if (!salon) {
    return (
      <html lang="en">
        <body><div className="flex h-screen items-center justify-center">Salon Setup Pending...</div></body>
      </html>
    );
  }

  // 2. Build the Dynamic JSON-LD (Schema.org)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": salon.name,
    "url": `https://${domain}`,
    "telephone": salon.whatsapp,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": salon.location,
      "addressCountry": "KE"
    },
    // We map your dynamic working hours from Sanity to Google's format
    "openingHoursSpecification": salon.workingHours?.days?.map((d: any) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": d.day.charAt(0).toUpperCase() + d.day.slice(1),
      "opens": d.open || "08:00",
      "closes": d.close || "20:00"
    }))
  };

  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${inter.variable}`}
      // 3. THE BRANDING ENGINE: Inject CSS variables globally
      style={{
        // @ts-ignore
        "--primary": salon.primaryColor || "#D4AF37",
        "--secondary": salon.secondaryColor || "#000000",
      }}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <NextTopLoader
          // 4. Use the dynamic primary color for the progress bar
          color={salon.primaryColor || "#14b866"}
          height={3}
          showSpinner={false}
          shadow="true"
        />

        {/* Now, every component inside {children} can use 
           className="text-[var(--primary)]" or "bg-[var(--primary)]"
        */}
        {children}
      </body>
    </html>
  );
}