import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}