import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/query-provider";
import { Toaster } from "@/components/ui/Toaster";
import GlobalCanvas from "@/components/canvas/GlobalCanvas";
import HelloCard from "@/components/ui/HelloCard";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://greenhopperevents.com"),
  title: {
    default: "Green Hopper Events | Premium Event Production",
    template: "%s | Green Hopper Events",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  description: "Kerala's premier cinematic event management company and luxury production house. Specializing in luxury weddings, staging, sound, and lighting.",
  keywords: ["event management", "luxury weddings Kerala", "event production", "stage decoration", "Green Hopper Events"],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Green Hopper Events",
    description: "Kerala's premier cinematic event management company and luxury production house.",
    url: "https://greenhopperevents.com",
    siteName: "Green Hopper Events",
    locale: "en_US",
    type: "website",
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
  verification: {
    google: "X2X-kZ3n2UP4ud25QAuFNeqUKVzyWsr022svVEMZguw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-brand/30 selection:text-brand-light">
        <GlobalCanvas />
        <QueryProvider>
          {children}
          <Toaster />
          <HelloCard />
        </QueryProvider>
      </body>
    </html>
  );
}

