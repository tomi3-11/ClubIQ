// app/layout.jsx
import "./globals.css"          // Global styles
import "./app.css"
import { Inter } from "next/font/google"  // Example Google font
import { Metadata } from "next"           

// Import any shared UI components if you have them
// import Header from "@/components/Header"
// import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "ClubIQ",
    template: "%s | ClubIQ",
  },
  description: "ClubIQ — Streamlined club management and member engagement platform.",
  keywords: ["ClubIQ", "clubs", "management", "members", "dashboard"],
  authors: [{ name: "ClubIQ Team" }],
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        {/* <Header /> */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
