// layout.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { DiamondsProvider } from "@/context/DiamondsContext"; 
import { PointsProvider } from "@/context/PointsContext";
// import type { Metadata } from "next"; // Removed unused import
import "./globals.css";
import Footer from "./ui/Footer";
import Navbar from "./ui/navbar";

// import { Tektur } from 'next/font/google';
// import { Inter } from 'next/font/google'; 
// import { Sora } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";

// const tektur = Tektur({ // Removed unused variable
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
// });

// const inter = Inter({ // Removed unused variable
//   weight: "400",
//   subsets: ["latin"],
// });

// const sora = Sora({ // Removed unused variable
//   weight: "400",
//   subsets: ["latin"],
// });

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
