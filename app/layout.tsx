import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brenda Salon | Premium Beauty",
  description: "Luxury beauty services and wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}