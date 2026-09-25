import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/inter";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AOYOMI",
    template: "%s | AOYOMI",
  },
  description: "AOYOMI adalah platform baca manga dengan tampilan modern, minimalis, dan nyaman untuk menemani perjalanan membaca manga favoritmu.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AOYOMI",
    title: "AOYOMI",
    description: "AOYOMI adalah platform baca manga dengan tampilan modern, minimalis, dan nyaman untuk menemani perjalanan membaca manga favoritmu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1117",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="icon" href="/logo.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://www.sankavollerei.web.id" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}