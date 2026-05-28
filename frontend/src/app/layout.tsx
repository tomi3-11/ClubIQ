import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./app.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubIQ",
  description: "ClubIQ is a comprehensive club management platform designed to streamline operations, enhance member engagement, and drive growth for clubs of all sizes. With features like event management, membership tracking, communication tools, and analytics, ClubIQ empowers club administrators to efficiently manage their organizations while providing an exceptional experience for members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors />
        <AppProvider>
          <ClerkProvider>{children}</ClerkProvider>
        </AppProvider>
      </body>
    </html>
  );
}
