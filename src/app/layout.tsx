import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import BootSequence from "@/components/BootSequence";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${profile.domain}`),
  title: `${profile.name} — ${profile.title}`,
  description: profile.blurb,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.blurb,
    url: `https://${profile.domain}`,
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.blurb,
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
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="fx-grid" aria-hidden />
        <div className="fx-glow" aria-hidden />
        <div className="fx-scanlines" aria-hidden />
        <BootSequence name={profile.name} />
        <KonamiEasterEgg />
        {children}
      </body>
    </html>
  );
}
