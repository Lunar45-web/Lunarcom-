'use client'; // We move to client-side briefly to ensure path detection works 100%

import { Cormorant_Garamond, Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSalonData } from "@/sanity/lib/client"; 
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We check for "studio" immediately
  const isStudio = pathname.startsWith('/studio');

  useEffect(() => {
    async function checkSalon() {
      if (isStudio) {
        setLoading(false);
        return;
      }
      
      const domain = window.location.host.replace('www.', '');
      const data = await getSalonData(domain);
      setSalon(data);
      setLoading(false);
    }
    checkSalon();
  }, [pathname, isStudio]);

  if (loading) return <html lang="en"><body className="bg-[#112119]" /></html>;

  // IF NO SALON AND NOT STUDIO -> SHOW SETUP
  if (!salon && !isStudio) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-[#112119] flex h-screen items-center justify-center text-white`}>
          <div className="text-center p-8 border border-white/10 rounded-3xl bg-white/5 max-w-md">
            <h1 className="text-2xl font-serif text-[#14b866] mb-4">Setup Required</h1>
            <p className="text-gray-400 mb-8">Link this domain in Sanity Studio.</p>
            <a href="/studio" className="bg-[#14b866] text-white px-8 py-3 rounded-full font-bold">Open Studio</a>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#112119]">
        <NextTopLoader color={salon?.primaryColor || "#14b866"} />
        {children}
      </body>
    </html>
  );
}