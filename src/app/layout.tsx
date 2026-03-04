import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accverse - Le Réseau Social de Vos Animaux",
  description: "Le premier réseau social dédié à vos animaux de compagnie. Créez des profils, partagez leurs moments, connectez-vous avec d'autres passionnés à travers le monde.",
  keywords: ["Accverse", "pets", "social network", "animaux", "chiens", "chats", "réseau social animalier", "pet community"],
  authors: [{ name: "Accverse Team" }],
  icons: {
    icon: "/favicon.png",
    apple: "/accverse-logo.png",
  },
  openGraph: {
    title: "Accverse - Le Réseau Social de Vos Animaux",
    description: "Le premier réseau social dédié à vos animaux. Partagez, connectez-vous, célébrez la vie de vos compagnons.",
    type: "website",
    images: ["/accverse-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accverse - Le Réseau Social de Vos Animaux",
    description: "Le premier réseau social dédié à vos animaux.",
    images: ["/accverse-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
