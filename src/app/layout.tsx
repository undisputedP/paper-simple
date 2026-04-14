import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const SITE_URL = "https://papersimple.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PaperSimple — Research Papers, Finally Made Simple",
    template: "%s | PaperSimple",
  },
  description:
    "Upload any research paper and get it explained like you're 15. Visual breakdowns, real-world connections, and zero jargon. Free for students.",
  keywords: [
    "research paper explainer",
    "explain research paper",
    "paper simplifier",
    "academic paper summary",
    "research paper for students",
    "understand research papers",
    "PDF paper explainer",
    "simple paper explanation",
    "research made simple",
    "paper breakdown tool",
  ],
  authors: [{ name: "PaperSimple" }],
  creator: "PaperSimple",
  publisher: "PaperSimple",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PaperSimple",
    title: "PaperSimple — Research Papers, Finally Made Simple",
    description:
      "Upload any research paper and get it explained like you're 15. Visual breakdowns, real-world connections, and zero jargon.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PaperSimple — Research Papers, Finally Made Simple",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperSimple — Research Papers, Finally Made Simple",
    description:
      "Upload any research paper and get it explained like you're 15. Free for students.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
