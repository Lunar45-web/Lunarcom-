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
  const [currentDomain, setCurrentDomain] = useState<string>('');

  const isStudio = pathname?.startsWith('/studio');

  useEffect(() => {
    async function checkSalon() {
      if (isStudio) {
        setLoading(false);
        return;
      }
      try {
        // IMPROVED: More robust domain detection
        const host = window.location.host.replace('www.', '');
        setCurrentDomain(host); // Set exactly what the browser sees
        
        const data = await getSalonData(host);
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

  // --- LUXURY SETUP SCREEN (Fixed Visibility) ---
  if (!salon && !isStudio) {
    return (
      <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
        <body className="bg-[#112119] flex h-screen items-center justify-center text-white p-6 antialiased">
          <div className="relative overflow-hidden text-center p-12 border border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl max-w-md shadow-2xl">
            <h1 className="text-4xl font-light mb-6 font-serif tracking-tight text-white">
              Salon <span className="text-[#14b866]">Setup</span>
            </h1>
            
            <p className="text-gray-300 text-sm mb-10 leading-relaxed font-light">
              We couldn't find a profile for: <br/>
              {/* Highlighted the domain so it's never invisible */}
              <span className="text-[#14b866] font-mono font-bold bg-[#14b866]/10 px-3 py-1 rounded-md mt-2 inline-block">
                {currentDomain}
              </span>
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
      <body className="antialiased bg-[#112119]">
        <NextTopLoader color={displaySalon.primaryColor || "#14b866"} />
        {children}
      </body>
    </html>
  );
}