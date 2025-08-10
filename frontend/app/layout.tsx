import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from "./context/authProvider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BidBay - Online Auction Marketplace",
  description: "Discover, bid, and win on unique items in our trusted online marketplace",
  
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
