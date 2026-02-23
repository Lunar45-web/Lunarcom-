import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

// Elegant font for salon name and headings
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Clean sans-serif for body text
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://salon45.vercel.app'),
  title: "Premium Salon | Premium Beauty",
  description: "Luxury beauty services and wellness.",
  // 2. EXPLICIT OPEN GRAPH CONFIGURATION
  openGraph: {
    title: "Premium Salon | Premium Beauty",
    description: "Luxury beauty services and wellness.",
    url: '/', // Uses the metadataBase to form the full URL
    siteName: 'Premium Salon',
    locale: 'en_US',
    type: 'website',
  },
};

// --- START OF JSON-LD SCHEMA ---
// Edit these details per client to feed exact data to Google AI
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon", // Tells Google exactly what type of business this is
  "name": "Premium Salon",
  "image": "https://salon45.vercel.app/opengraph-image.png",
  "@id": "https://salon45.vercel.app",
  "url": "https://salon45.vercel.app",
  "telephone": "+254700000000",
  "priceRange": "$$", // $$ means moderate pricing, $$$ is high-end
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dallas Area",
    "addressLocality": "Embu",
    "addressRegion": "Embu County",
    "postalCode": "60100",
    "addressCountry": "KE"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "20:00"
    }
  ]
};
// --- END OF JSON-LD SCHEMA ---

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased">
        {/* Injecting the Schema into the DOM for Google to read */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader
          color="#14b866"
          height={3}
          showSpinner={false}
          shadow="true"
        />
        {children}
      </body>
    </html>
  );
}