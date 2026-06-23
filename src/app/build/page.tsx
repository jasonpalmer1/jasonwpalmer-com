import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ConsultingForm from "@/components/ConsultingForm";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Work With Me — ${profile.name}`,
  description:
    "Jason Palmer builds AI decision systems for PE/CRE funds, REITs, and fintech operators. Finance operator who ships the software himself.",
  alternates: { canonical: "/build/" },
};

const caseStudies = [
  {
    rarity: "LEGENDARY" as const,
    rarityClass: "text-gold",
    glowClass: "glow-border-legendary",
    meta: "// CASE-01 · INTERNAL · LIVE",
    title: "CRE Underwriting AI — HPI Command Center",
    problem:
      "A real estate fund with a live acquisition pipeline was spending ~60 minutes per manual underwrite. Every deal meant hours of document intake, model population, market pulls, and valuation — before a single decision could be made.",
    built:
      "A proprietary AI system (built on personal initiative) that standardizes the data layer, automates document intake, runs the financial model, pulls market comps, and delivers a complete underwrite — grounded in the firm's own data and relentlessly tested before it informs a decision.",
    outcome:
      "Underwrites that took ~60 minutes now complete in ~3 minutes. The fund team now has a live operating picture of the portfolio alongside the deal pipeline. Used on real acquisitions and dispositions.",
    tags: ["Claude Code", "AI agents", "DuckDB", "Python", "Data architecture"],
    link: null,
  },
  {
    rarity: "EPIC" as const,
    rarityClass: "text-accent-3",
    glowClass: "glow-border-epic",
    meta: "// CASE-02 · PUBLIC · LIVE",
    title: "Supply-Chain Decision Tool — wafergraph.com",
    problem:
      "No free, neutral, current map of the semiconductor & AI supply chain existed — just scattered analyst reports and paywalled databases. Investors and operators couldn't quickly understand dependencies, chokepoints, and market share across the full value chain.",
    built:
      "An interactive decision tool covering 456+ companies across the full semiconductor value chain — materials, equipment, EDA/IP, chip design, foundry, memory, packaging, and AI/data center. Each company profiled with financials, supply-chain dependencies, market share, and chokepoint exposure.",
    outcome: "Shipped and live at wafergraph.com. A working product with real data — built and deployed end to end.",
    outcomeLink: { href: "https://wafergraph.com", label: "→ wafergraph.com" },
    tags: ["Next.js", "Data pipeline", "Graph model", "Cloudflare"],
    link: "https://wafergraph.com",
  },
  {
    rarity: "EPIC" as const,
    rarityClass: "text-accent-3",
    glowClass: "glow-border-epic",
    meta: "// CASE-03 · PUBLIC · LIVE",
    title: "Full Product, Shipped in ~2 Days — whosstarting.com",
    problem:
      "No good way to check college football depth charts offline at a game. Every existing option was ad-heavy, slow, or required a signal. The problem was simple but no one had solved it cleanly.",
    built:
      "A full offline-first PWA covering CFB and MLB depth charts — with player OVR ratings, crowd-debate mechanics, and shareable cards. Zero ads. Built from concept to deployed product.",
    outcome:
      "Live at whosstarting.com. Shipped in approximately two days. Demonstrates build velocity that most development shops quote in months.",
    outcomeLink: { href: "https://whosstarting.com", label: "→ whosstarting.com" },
    tags: ["Next.js", "Cloudflare Pages", "PWA / offline", "Data pipeline"],
    link: "https://whosstarting.com",
  },
];

export default function BuildPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ── 1. Hero ── */}
        <section className="relative">
          <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
            <p className="label">// consulting // build</p>
            <div className="mt-6 hud rounded-2xl p-6 sm:p-10">
              {/* Status badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                <span className="pulse-dot" /> ACCEPTING ENGAGEMENTS
              </span>

              {/* Headline */}
              <h1 className="mt-6 font-display text-4xl font-black tracking-tight sm:text-6xl">
                <span className="text-glow">The finance operator</span>
                <br />
                <span className="text-gradient">who builds the AI himself.</span>
              </h1>

              {/* Subhead */}
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-snug text-foreground sm:text-xl">
                Most &ldquo;AI consultants&rdquo; haven&apos;t underwritten a deal. Most operators
                can&apos;t ship software. I&apos;ve done both — $3B+ in transactions closed, and a
                live AI system that compresses hours of underwriting to minutes.
              </p>

              {/* Supporting copy */}
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                I work with PE/CRE fund operators, REITs, and fintech/proptech founders who need
                real AI systems — not slide decks. If you&apos;re sitting on messy deal data,
                bloated analyst workflows, or a blank screen where your decision tools should be,
                let&apos;s talk.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#consult"
                  className="rounded-md border border-accent bg-accent/10 px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background"
                >
                  [ OPEN A CHANNEL ]
                </a>
                <a
                  href="#services"
                  className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/90 transition-colors hover:border-accent/60 hover:text-accent"
                >
                  [ SEE WHAT I BUILD ]
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Services ── */}
        <section id="services" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// what i build</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              SERVICES
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Four types of engagements. All anchored to real finance and operations problems.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {/* Card 1 — Decision & scoring systems */}
              <div className="hud rounded-xl p-6 glow-border-legendary">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <span className="font-mono text-[0.65rem] tracking-widest text-gold">
                      CORE OFFERING
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                      Decision &amp; Scoring Systems
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Turn messy deal data into structured, automated decisions. Underwriting tools,
                      market-screening dashboards, risk-scoring pipelines — built on your data, tuned
                      to your criteria. The same type of system I built in-house at a live CRE fund.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 — Command center dashboards */}
              <div className="hud rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🖥️</span>
                  <div>
                    <h3 className="mt-0 font-display text-lg font-bold text-foreground">
                      AI Command-Center Dashboards
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Live operating picture of your portfolio, fund, or pipeline. Pulls from your
                      existing data sources, surfaces what matters, and gives your team a single pane
                      of glass instead of seventeen spreadsheets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 — Fast product/MVP builds */}
              <div className="hud rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="mt-0 font-display text-lg font-bold text-foreground">
                      Fast Product &amp; MVP Builds
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      I ship. Full products in days, not months. If you have an idea stuck in a Notion
                      doc or a feature your team keeps pushing, I can take it from concept to working
                      software at a pace most agencies can&apos;t match.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 — AI workflow automation */}
              <div className="hud rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="mt-0 font-display text-lg font-bold text-foreground">
                      AI Workflow &amp; Agent Automation
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Automate the analyst-hours: document intake, data extraction, report drafting,
                      pipeline triage. AI agents that do the repetitive cognitive work so your team
                      focuses on judgment calls, not copy-paste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Proof / case studies ── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// real builds</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              PROOF OF WORK
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              No invented client names. No fabricated outcomes. These are real systems I built.
            </p>

            <div className="mt-10 space-y-6">
              {caseStudies.map((cs) => (
                <div
                  key={cs.title}
                  className={`hud rounded-xl p-6 sm:p-8 ${cs.glowClass}`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className={`font-mono text-[0.65rem] tracking-widest ${cs.rarityClass}`}>
                      {cs.rarity}
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-widest text-muted">
                      {cs.meta}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{cs.title}</h3>
                  <div className="mt-4 grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">PROBLEM</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{cs.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">
                        WHAT I BUILT
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{cs.built}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">OUTCOME</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                        {cs.outcome}{" "}
                        {cs.outcomeLink && (
                          <a
                            href={cs.outcomeLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent transition-colors hover:text-accent-2"
                          >
                            {cs.outcomeLink.label}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[0.6rem] text-accent/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. How we work ── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// engagement models</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              HOW WE WORK
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Three ways to engage. All scoped to your problem — no retainer traps, no vague
              &ldquo;AI strategy&rdquo; theater.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {/* Strategy Sprint */}
              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  01 // STRATEGY SPRINT
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Strategy Sprint
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  A focused engagement to diagnose your current workflow, identify the highest-value
                  AI intervention, and produce a concrete build plan. Walk away with a clear spec —
                  not a deck full of buzzwords.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Scoped per engagement · let&apos;s talk
                </p>
              </div>

              {/* Fixed-scope build */}
              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  02 // FIXED-SCOPE BUILD
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Fixed-Scope Build
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  You have a defined problem; I build the solution. Scoped, priced, and delivered —
                  no scope creep, no surprise invoices. Best for underwriting tools, dashboards, and
                  MVP products.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Fixed price · scoped per project
                </p>
              </div>

              {/* Fractional AI builder */}
              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  03 // FRACTIONAL
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Fractional AI Builder in Residence
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Embedded on a part-time basis — your AI systems builder without the full-time
                  headcount. Ongoing builds, iterations, and ops support. Best for funds and operators
                  who need continuous leverage.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Monthly engagement · let&apos;s talk
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Consulting contact form ── */}
        <section id="consult" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="hud mx-auto max-w-2xl rounded-2xl p-8 sm:p-12">
              <p className="label text-center">// open a channel</p>
              <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-glow">
                LET&apos;S TALK
              </h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
                Tell me what you&apos;re trying to build. I&apos;ll respond within 48 hours.
              </p>
              <ConsultingForm />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="pulse-dot" /> SYS.ONLINE · © {profile.name}
          </span>
          <div className="flex gap-4">
            <a href="/" className="tracking-widest transition-colors hover:text-accent">
              HOME
            </a>
            <a href="/build/" className="tracking-widest transition-colors hover:text-accent">
              BUILD
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
