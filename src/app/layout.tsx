// layout.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { DiamondsProvider } from "@/context/DiamondsContext"; 
import { PointsProvider } from "@/context/PointsContext";
import type { Metadata } from "next";
import "./globals.css";
import Footer from "./ui/Footer";
import Navbar from "./ui/navbar";
import { Sorts_Mill_Goudy } from 'next/font/google';
import { Tourney } from "next/font/google";
import { Source_Code_Pro } from 'next/font/google';
import { Sora } from 'next/font/google';
import { Inter } from 'next/font/google'; 
import { Tektur } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";

const tektur = Tektur({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

const sora = Sora({
  weight: "400",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  weight: '300', 
  subsets: ['latin'],
});

const tourney = Tourney({
  weight: "400", 
  subsets: ["latin"],
});

const sortsMillGoudy = Sorts_Mill_Goudy({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <SessionProvider>
          <PointsProvider>
            <DiamondsProvider>
              <Navbar />
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#4CAF50',
                    color: 'white',
                  },
                  className: 'sonner-toast',
                }}
              />
              {children}
              <Footer />
            </DiamondsProvider>
          </PointsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
