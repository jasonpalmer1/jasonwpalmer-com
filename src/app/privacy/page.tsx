import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { profile, game } from "@/data/profile";

// Written 2026-09-03, when this site started recording form-field activity via
// the shared visit-log beacon and had no policy at all. Deliberately NOT a copy
// of ironstrikeai.com's policy: that site runs first-party analytics only, and
// this one also runs Google Analytics 4, which is a third party that sets
// cookies. Claiming "no third-party trackers" here would have been false. If a
// tracker is ever added or removed, this page changes in the same commit.
export const metadata: Metadata = {
  title: `Privacy — ${profile.name}`,
  description:
    "Plain English: everything jasonwpalmer.com records about your visit, and everything it deliberately does not.",
  alternates: { canonical: "/privacy/" },
  openGraph: {
    title: `Privacy — ${profile.name}`,
    description:
      "Everything jasonwpalmer.com records about your visit, in plain English.",
    url: `https://${profile.domain}/privacy/`,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy — ${profile.name}`,
    description:
      "Everything jasonwpalmer.com records about your visit, in plain English.",
    images: ["/og.png"],
  },
};

const EFFECTIVE = "September 3, 2026";

function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-8">
      <h2 className="font-display text-lg font-bold tracking-wide text-foreground sm:text-xl">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export default function Privacy() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16 sm:py-24">
        <p className="label">// privacy</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-gradient">
          PRIVACY
        </h1>
        <p className="mt-3 font-mono text-sm text-muted">
          Everything this site records about your visit, and everything it
          deliberately doesn&apos;t. No fine print games.
        </p>
        <p className="mt-2 font-mono text-xs tracking-widest text-muted/60">
          EFFECTIVE {EFFECTIVE.toUpperCase()}
        </p>

        <Section id="short-version" heading="The short version">
          <p>
            I don&apos;t sell your data, to anyone, ever. There are no ad
            networks and no advertising SDKs on this site. Three things measure
            traffic here: a small analytics beacon I built and run myself,
            Google Analytics, and Cloudflare. Two things collect information you
            type on purpose: the contact form and the newsletter signup. That is
            the whole list, and the rest of this page explains each one.
          </p>
        </Section>

        <Section id="beacon" heading="My own analytics beacon">
          <p>
            Loading a page here sends a few things to a collector I own and
            operate: the page you&apos;re on, the page that referred you, roughly
            where you are (country, region and city, worked out from your IP
            address by Cloudflare&apos;s network, never GPS or a device
            permission), your browser and device type, your screen size, and your
            connection speed.
          </p>
          <p>
            It also records how the page gets used: clicks, how far you scroll,
            how long you&apos;re actively reading, whether a link took you off
            site, whether something on the page errored, and how quickly the site
            responded when you tapped. It notes when you copy something, meaning
            the fact that a copy happened on a page, never what was copied.
          </p>
          <p>
            On forms, it records field names and whether you focused or left a
            field. If you start filling in the contact form and leave without
            sending it, the record says which field you stopped on. It does not
            say what you typed there, because it never reads that at all.
          </p>
        </Section>

        <Section id="never" heading="What the beacon never touches">
          <p>
            It never reads the contents of any input, text box or dropdown on
            this site, and it records no keystrokes. There is no code in it that
            reads a field&apos;s value, and the skip happens before anything is
            labelled, so a half typed email address cannot reach the collector
            even by accident.
          </p>
        </Section>

        <Section id="returning" heading="The returning-visitor ID">
          <p>
            Your browser stores a random ID in local storage, not a cookie, so
            the split between new and returning visitors is real rather than
            guessed. Browsers scope local storage to one site, so that ID is
            unreadable on any other site, including my other projects. It carries
            no name and no contact details.
          </p>
          <p>
            If your browser sends a{" "}
            <span className="text-foreground">Do Not Track</span> or{" "}
            <span className="text-foreground">Global Privacy Control</span>{" "}
            signal, the beacon honors it: the visit is still counted, but no
            durable ID is created or read, so you are never tracked as a repeat
            visitor.
          </p>
        </Section>

        <Section id="google-analytics" heading="Google Analytics">
          <p>
            This site also runs Google Analytics 4, which is a third party. It
            sets its own cookies and sends your visit to Google, under{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-foreground"
            >
              Google&apos;s privacy policy
            </a>
            , not mine. I use it for aggregate traffic reporting only. If you
            would rather it didn&apos;t run, Google publishes a{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-foreground"
            >
              browser opt-out add-on
            </a>
            , and most content blockers stop it too. Nothing on this site breaks
            if you block it.
          </p>
        </Section>

        <Section id="cloudflare" heading="Cloudflare">
          <p>
            The site is hosted on Cloudflare, so Cloudflare handles every
            request and keeps its own standard logs. It may also load a
            cookieless performance beacon that measures page speed. Neither
            identifies you personally to me.
          </p>
        </Section>

        <Section id="contact-form" heading="The contact form">
          <p>
            Separate from anything above. If you send me a message, the name,
            email address and message you type are delivered to my inbox by a
            form service so I can reply. That is the only use. I don&apos;t add
            you to the newsletter from it, and I don&apos;t pass it on.
          </p>
        </Section>

        <Section id="newsletter" heading="The dispatch newsletter">
          <p>
            If you subscribe, your email address is stored in a private database
            I control, along with when you signed up and whether you confirmed.
            Nothing else. Every signup has to be confirmed by clicking a link in
            an email, so nobody can add you without your say so, and the
            confirmation email is sent through an email provider on my behalf.
          </p>
          <p>
            Every dispatch carries an unsubscribe link, and unsubscribing takes
            effect immediately. Ask me to delete your address outright and I
            will.
          </p>
        </Section>

        <Section id="who-sees" heading="Who sees any of this">
          <p>
            Nobody but me, apart from the specific services named above doing the
            jobs described. Analytics data lives in a private database I control,
            is never published on a public page, and is never sold or handed to a
            data broker. There is no cross-site tracking here.
          </p>
        </Section>

        <Section id="changes" heading="Changes">
          <p>
            If I add or remove anything that collects data, this page changes in
            the same release, and the effective date above moves with it.
          </p>
        </Section>

        <Section id="questions" heading="Questions">
          <p>
            Use the{" "}
            <a
              href="/#uplink"
              className="text-accent underline underline-offset-2 hover:text-foreground"
            >
              contact form
            </a>{" "}
            and ask me directly. That includes asking what I have on you, or
            asking me to delete it.
          </p>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="pulse-dot" /> SYS.ONLINE · ©{" "}
            {new Date().getFullYear()} {profile.name}
          </span>
          <span className="tracking-widest">
            {game.callsign} // {profile.domain}
          </span>
        </div>
      </footer>
    </>
  );
}
