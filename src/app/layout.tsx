import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// AI chatbot temporarily disabled
// import ChatbotLazy from "@/components/layout/ChatbotLazy";
import { SITE_URL } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Innovera | Empowering Talent, Shaping the Future",
    template: "%s | Innovera",
  },
  description:
    "Innovera - Empowering Talent, Shaping the Future. Leading software development and digital transformation company in Egypt, Saudi Arabia, and Oman.",
  keywords: [
    "Innovera",
    "Software Development",
    "Cybersecurity",
    "AI",
    "Machine Learning",
    "Digital Transformation",
    "Outsourcing",
  ],
  authors: [{ name: "Innovera Corp" }],
  openGraph: {
    title: "Innovera | Empowering Talent, Shaping the Future",
    description:
      "Leading software development and digital transformation company in Egypt, Saudi Arabia, and Oman.",
    type: "website",
    url: "https://innoveracorp.com",
    images: [
      {
        url: "https://lh3.googleusercontent.com/d/1pfHsxu1Xi9eNEA5j7K9EwH5tw7HBfbh9",
      },
    ],
  },
  icons: {
    icon: "https://lh3.googleusercontent.com/d/1moiYwgQckTcOX5OgD2RWnBHX7WX9VO7L",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* <ChatbotLazy /> */}
        </Providers>
      </body>
    </html>
  );
}
