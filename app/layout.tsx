import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { SITE_URL, SITE_NAME, ORG_NAME, ORG_URL } from "../lib/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const aeonik = localFont({
  src: [
    {
      path: "./fonts/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Aeonik-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: `${SITE_NAME} - Screen Recording Tool by Offbeats Labs`,
  description:
    "Screen recording application. Built w Offbeats.",
  keywords: [
    "screen recorder",
    "screen capture",
    "video recording",
    "audio mixing",
    "annotations",
    "cloud storage",
    "recording",
    SITE_NAME,
    "Offbeats",
  ],
  authors: [{ name: ORG_NAME, url: ORG_URL }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} - Screen Recording Tool`,
    description: "Screen recording with advanced features",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Screen Recording Tool`,
    description: "Screen recording with advanced features",
    creator: "@offbeats_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'Next.js',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${aeonik.variable}`}>
      <head>
        <meta httpEquiv="permissions-policy" content="display-capture=(self)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
