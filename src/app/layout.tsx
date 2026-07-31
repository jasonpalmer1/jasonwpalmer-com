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

// visit-log — first-party visit tracer (Jason's own D1-backed collector, see
// ~/projects/visit-log/CLAUDE.md). Separate from the CF Web Analytics beacon
// below, which is cookieless/aggregate by design and can't show per-visitor
// origin, route trail, or geo/IP — this can. No cookies (sessionStorage
// only), fires on initial load AND every client-side route change (Next's
// router does a real history.pushState under the hood for soft navigation,
// so patching pushState/replaceState + popstate catches it — same technique
// Cloudflare's own beacon.min.js uses for SPA instrumentation). Inline (not
// next/script) so it runs immediately, before hydration. Fire-and-forget;
// never throws into the app.
const VISIT_LOG_SNIPPET = `(function(){try{
var ENDPOINT='https://visit-log.jwpalm99.workers.dev/collect';
var SITE='jasonwpalmer';
var SID_KEY='vl_sid',SEQ_KEY='vl_seq',SRC_KEY='vl_src';
var sid=sessionStorage.getItem(SID_KEY);
if(!sid){sid=crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);sessionStorage.setItem(SID_KEY,sid);sessionStorage.setItem(SEQ_KEY,'0');}
var src=sessionStorage.getItem(SRC_KEY)||'';
var params=new URLSearchParams(location.search);
var urlSrc=params.get('src');
if(urlSrc){
  if(!src){src=urlSrc;sessionStorage.setItem(SRC_KEY,urlSrc);}
  if(window.history&&window.history.replaceState){params.delete('src');var qs=params.toString();window.history.replaceState(history.state,'',location.pathname+(qs?'?'+qs:'')+location.hash);}
}
function send(path){
  var seq=parseInt(sessionStorage.getItem(SEQ_KEY)||'0',10)+1;
  sessionStorage.setItem(SEQ_KEY,String(seq));
  var payload=JSON.stringify({site:SITE,path:path,referrer:document.referrer||'',src:src,sessionId:sid,seq:seq});
  try{
    if(navigator.sendBeacon){navigator.sendBeacon(ENDPOINT,new Blob([payload],{type:'text/plain'}));}
    else{fetch(ENDPOINT,{method:'POST',body:payload,headers:{'Content-Type':'text/plain'},keepalive:true,mode:'cors'}).catch(function(){});}
  }catch(e){}
}
send(location.pathname);
var lastPath=location.pathname;
function onRouteMaybeChanged(){if(location.pathname!==lastPath){lastPath=location.pathname;send(lastPath);}}
['pushState','replaceState'].forEach(function(fn){var orig=history[fn];history[fn]=function(){var ret=orig.apply(this,arguments);onRouteMaybeChanged();return ret;};});
window.addEventListener('popstate',onRouteMaybeChanged);
}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: VISIT_LOG_SNIPPET }} />
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
