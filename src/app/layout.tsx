import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { profile, socials, skills, experience, education } from "@/data/profile";
import BootSequence from "@/components/BootSequence";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import FloatingActions from "@/components/FloatingActions";

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
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: `${profile.tagline} ${profile.subtagline}`,
    url: `https://${profile.domain}`,
    siteName: profile.name,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: `${profile.tagline} ${profile.subtagline}`,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data so search engines can show a rich "Person" result.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `https://${profile.domain}`,
    jobTitle: profile.title,
    description: profile.subtagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Austin",
      addressRegion: "TX",
      addressCountry: "US",
    },
    worksFor: { "@type": "Organization", name: experience[0]?.org },
    alumniOf: { "@type": "CollegeOrUniversity", name: education[0]?.school },
    knowsAbout: skills.flatMap((s) => s.items),
    sameAs: socials
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <FloatingActions />
        {/* Cloudflare Web Analytics — inert when token is unset */}
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_BEACON_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
