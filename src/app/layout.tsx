import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idiot Games - The Dumbest Games on Earth",
  description: "Simple, addictive, viral mini-games. Vote for your team, send a ball to the moon, find the hidden meme. The stupidest games you'll ever love.",
  keywords: ["idiot games", "mini games", "viral games", "fun games", "team vote", "casual games"],
  authors: [{ name: "Idiot Games" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Idiot Games - The Dumbest Games on Earth",
    description: "Simple, addictive, viral mini-games. The stupidest games you'll ever love.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Idiot Games - The Dumbest Games on Earth",
    description: "Simple, addictive, viral mini-games.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
