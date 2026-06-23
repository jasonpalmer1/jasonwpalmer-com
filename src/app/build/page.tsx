import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ConsultingForm from "@/components/ConsultingForm";
import { profile, socials } from "@/data/profile";

export const metadata: Metadata = {
  title: `Work With Me — ${profile.name}`,
  description:
    "Jason Palmer builds custom software fast — AI tools, workflow automation, and internal systems for any business running a painful manual process. FINRA Series 65, $3B+ transacted. Fixed price. Ships in weeks.",
  alternates: { canonical: "/build/" },
};

// ── Real builds (proof of work) ─────────────────────────────────────────────
const realBuilds = [
  {
    rarity: "LEGENDARY" as const,
    rarityClass: "text-gold",
    glowClass: "glow-border-legendary",
    meta: "// INTERNAL · LIVE",
    title: "CRE Underwriting AI — Command Center",
    problem:
      "~60 minutes per manual underwrite — document intake, model population, market pulls, valuation — before a single decision could be made.",
    built:
      "Proprietary AI system (built on personal initiative) that automates document intake, runs the financial model, pulls market comps, and delivers a complete underwrite grounded in the firm's own data.",
    outcome:
      "~60-minute underwrites now complete in ~3 minutes. Live portfolio picture alongside the deal pipeline. Used on real acquisitions and dispositions. Reference available on request.",
    tags: ["Claude Code", "AI agents", "DuckDB", "Python", "Data architecture"],
    link: null,
  },
  {
    rarity: "EPIC" as const,
    rarityClass: "text-accent-3",
    glowClass: "glow-border-epic",
    meta: "// PUBLIC · LIVE",
    title: "wafergraph.com — Supply-Chain Decision Tool",
    problem:
      "No free, neutral map of the semiconductor & AI supply chain — just scattered analyst reports and paywalled databases.",
    built:
      "Interactive decision tool covering 456+ companies across the full semiconductor value chain — materials to AI/data center. Each company profiled with financials, dependencies, and chokepoint exposure.",
    outcome: "Shipped and live.",
    outcomeLink: { href: "https://wafergraph.com", label: "→ wafergraph.com" },
    tags: ["Next.js", "Data pipeline", "Graph model", "Cloudflare"],
    link: "https://wafergraph.com",
  },
  {
    rarity: "EPIC" as const,
    rarityClass: "text-accent-3",
    glowClass: "glow-border-epic",
    meta: "// PUBLIC · LIVE",
    title: "whosstarting.com — Full Product, Shipped in ~2 Days",
    problem: "No good way to check college football depth charts offline at a game.",
    built:
      "Offline-first PWA covering CFB and MLB depth charts — player OVR ratings, crowd-debate mechanics, shareable cards. Zero ads.",
    outcome:
      "Live. Concept to deployed product in approximately two days.",
    outcomeLink: { href: "https://whosstarting.com", label: "→ whosstarting.com" },
    tags: ["Next.js", "Cloudflare Pages", "PWA / offline", "Data pipeline"],
    link: "https://whosstarting.com",
  },
];

// Pull real LinkedIn URL from profile data
const linkedInUrl =
  socials.find((s) => s.label === "LinkedIn")?.href ?? "https://www.linkedin.com/in/jasonwpalmer";

export default function BuildPage() {
  return (
    <>
      <Nav />
      <main>

        {/* ── 1. Hero / Positioning ────────────────────────────────────────── */}
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
                <span className="text-glow">You have a painful manual process.</span>
                <br />
                <span className="text-gradient">I build the tool that kills it.</span>
              </h1>

              {/* Core line */}
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-snug text-foreground sm:text-xl">
                Fixed price. Ships in 4&ndash;8 weeks. One operator — no committee, no agency markup.
              </p>

              {/* Identity / credibility */}
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                I&apos;m{" "}
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline underline-offset-2 transition-colors hover:text-accent-2"
                >
                  Jason Palmer
                </a>
                {" "}— FINRA Series 65, $3B+ in real transactions, and I&apos;ve run the ops side of businesses myself.
                That means I get how your business works and where the real ROI is — not just what&apos;s technically possible.
                Finance is where I started; any operator with a high-value manual process is who I serve.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#consult"
                  className="rounded-md border border-accent bg-accent/10 px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-accent transition-colors hover:bg-accent hover:text-background"
                >
                  [ WORK WITH ME ]
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

        {/* ── 2. Who It&apos;s For ──────────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// who this is for</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              THE RIGHT FIT
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Any business running a high-value manual process. Industry doesn&apos;t matter — the pain does.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  tag: "OPS",
                  title: "Ops & Services Businesses",
                  body: "Any team where skilled people spend hours on work a machine could handle — intake, routing, reporting, reconciliation.",
                },
                {
                  tag: "LOGISTICS",
                  title: "Logistics & Field Ops",
                  body: "Dispatch, scheduling, exception handling, or status reporting that still runs on spreadsheets and phone calls.",
                },
                {
                  tag: "FINANCE / RE",
                  title: "Real Estate & Finance",
                  body: "Deal underwriting, fund reporting, loan origination, LP communications — the ops surface that breaks at scale.",
                },
                {
                  tag: "COST",
                  title: "Quoted Absurd Agency Prices",
                  body: "If they quoted $200K for what sounds like a 6-week project — you're probably right to look elsewhere.",
                },
                {
                  tag: "SAAS",
                  title: "Can't Make SaaS Fit",
                  body: "Your data is too proprietary, the workflow is too specific, or the off-the-shelf tools won't connect.",
                },
                {
                  tag: "SCALE",
                  title: "High-Repeat, High-Stakes Work",
                  body: "Analyst or ops work that happens weekly — reconciliations, reports, approvals. High error risk, no audit trail.",
                },
              ].map(({ tag, title, body }) => (
                <div key={title} className="hud rounded-xl p-5">
                  <p className="font-mono text-[0.6rem] tracking-widest text-accent/70">// {tag}</p>
                  <h3 className="mt-3 font-display text-base font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Services ─────────────────────────────────────────────────────── */}
        <section id="services" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// what i build</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              SERVICES
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">

              {/* Service 1 — Ship it fast */}
              <div className="hud rounded-xl p-6 glow-border-legendary">
                <p className="font-mono text-[0.65rem] tracking-widest text-gold">CORE OFFERING</p>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  Ship It Fast
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Idea to working internal tool or MVP in 4&ndash;8 weeks. Fixed scope, fixed price — no surprise invoices.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Best for: any operator with a defined problem to solve
                </p>
              </div>

              {/* Service 2 — Automate the grind */}
              <div className="hud rounded-xl p-6">
                <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                  Automate the Grind
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  AI agents for repetitive analyst and ops work — document intake, reconciliation, report drafting. Human-in-the-loop approval gates and audit trails built in.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Best for: document-heavy ops · recurring analyst workflows · high-repeat reporting
                </p>
              </div>

              {/* Service 3 — Wire it together */}
              <div className="hud rounded-xl p-6">
                <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                  Wire It Together
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Connect your tools, models, and data into one coherent workflow. The integrations no SaaS vendor will build because your setup is too specific.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">
                  Best for: data integration · existing-tool orchestration · bespoke pipelines
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Proof — Real Builds, Range ───────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// real builds</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              PROOF OF WORK
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              No invented client names. No fabricated outcomes. Real systems, shown as-is — across domains, at speed.
            </p>

            <div className="mt-10 space-y-6">
              {realBuilds.map((b) => (
                <div
                  key={b.title}
                  className={`hud rounded-xl p-6 sm:p-8 ${b.glowClass}`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className={`font-mono text-[0.65rem] tracking-widest ${b.rarityClass}`}>
                      {b.rarity}
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-widest text-muted">
                      {b.meta}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{b.title}</h3>
                  <div className="mt-4 grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">PROBLEM</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{b.problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">
                        WHAT I BUILT
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{b.built}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-widest text-muted">OUTCOME</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                        {b.outcome}{" "}
                        {"outcomeLink" in b && b.outcomeLink && (
                          <a
                            href={b.outcomeLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent transition-colors hover:text-accent-2"
                          >
                            {b.outcomeLink.label}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.tags.map((tag) => (
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

        {/* ── 5. Cross-Domain Examples ──────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// what a typical engagement looks like</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              EXAMPLE BUILDS
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Representative workflows — the shape of what I build, across domains.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  domain: "OPERATIONS",
                  title: "Vendor Intake & Routing Agent",
                  problem: "New vendor applications processed manually — 2-3 hours each, routed by email.",
                  built: "AI agent ingests submissions, scores completeness, routes to the right approver, logs every step.",
                  result: "Hours of admin per vendor collapsed to minutes. Full audit trail.",
                },
                {
                  domain: "FINANCE / REAL ESTATE",
                  title: "Fund Reconciliation Automation",
                  problem: "Monthly reconciliation across multiple custodians — analyst hours, high error risk.",
                  built: "AI pipeline ingests custodian exports, matches positions, flags discrepancies, drafts the memo. Human approval gate maintained.",
                  result: "Multi-hour reconciliation to minutes. Compliance-ready audit trail.",
                },
                {
                  domain: "LOGISTICS / SERVICES",
                  title: "Ops Exception Dashboard",
                  problem: "Exceptions and escalations scattered across email, Slack, and a shared sheet — nothing triaged automatically.",
                  built: "Unified dashboard that pulls from all sources, auto-scores urgency, and routes to the right person.",
                  result: "Zero missed escalations. Operations team sees one screen instead of three.",
                },
              ].map(({ domain, title, problem, built, result }) => (
                <div key={title} className="hud rounded-xl p-6 glow-border-epic">
                  <p className="font-mono text-[0.65rem] tracking-widest text-accent-3">{domain}</p>
                  <h3 className="mt-2 font-display text-base font-bold text-foreground">{title}</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="font-mono text-[0.6rem] tracking-widest text-muted">PROBLEM</p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/80">{problem}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.6rem] tracking-widest text-muted">BUILT</p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/80">{built}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.6rem] tracking-widest text-muted">RESULT</p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/80">{result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-[0.65rem] tracking-wide text-muted/60">
              // Representative workflow examples — not sold client engagements. References available on request.
            </p>
          </div>
        </section>

        {/* ── 6. How We Work ───────────────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// process</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              HOW WE WORK
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  01 // STRATEGY SPRINT
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Diagnose the Highest-ROI Target
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Map your workflows, identify the highest-value target, produce a concrete spec. A plan — not a slide deck.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">Scoped per engagement — price set before any work begins.</p>
              </div>

              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  02 // FIXED-SCOPE BUILD
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Build It
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Fixed scope, fixed price, delivered in 4&ndash;8 weeks. Human-in-the-loop controls and audit trails from day one.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">Scoped per engagement — price set before any work begins.</p>
              </div>

              <div className="hud rounded-xl p-6">
                <p className="font-mono text-[0.65rem] tracking-widest text-accent">
                  03 // ONGOING RETAINER
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                  Fractional AI Builder in Residence
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Embedded part-time — your AI systems builder without the full-time headcount. Ongoing builds, iterations, ops support.
                </p>
                <p className="mt-4 font-mono text-xs text-muted">Scoped per engagement — price set before any work begins.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Engagement Models ─────────────────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="label">// engagement models</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-gradient">
              ENGAGEMENT MODELS
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Fixed scope. Fixed price. You&apos;re paying for judgment and speed — not headcount or agency overhead.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              {/* Embedded retainer — lead offer */}
              <div className="hud rounded-xl p-6 glow-border-legendary">
                <p className="font-mono text-[0.65rem] tracking-widest text-gold">FEATURED MODEL</p>
                <h3 className="mt-3 font-display text-xl font-bold text-foreground">
                  Embedded Retainer
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">Fractional AI Builder-in-Residence</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Monthly embedded access — ongoing builds, iterations, automation. Continuous leverage without the full-time hire. Best for operators with more than one thing to build.
                </p>
                <p className="mt-5 font-mono text-xs text-muted">
                  Scoped per engagement — price set before any work begins.
                </p>
              </div>

              {/* Fixed-scope build */}
              <div className="hud rounded-xl p-6">
                <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                  Fixed-Scope Build
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">One tool, fully delivered</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Defined problem, scoped and priced before we start. I build it; you own it. Delivered in 4&ndash;8 weeks. No retainer required.
                </p>
                <p className="mt-5 font-mono text-xs text-muted">
                  Scoped per engagement — price set before any work begins.
                </p>
              </div>
            </div>

            <p className="mt-6 font-mono text-[0.65rem] tracking-wide text-muted/60">
              // Final scope and price set before any work begins. No surprise invoices.
            </p>
          </div>
        </section>

        {/* ── 8. Consulting Contact Form ───────────────────────────────────────── */}
        <section id="consult" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="hud mx-auto max-w-2xl rounded-2xl p-8 sm:p-12">
              <p className="label text-center">// open a channel</p>
              <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-glow">
                LET&apos;S TALK
              </h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
                Tell me what you&apos;re trying to solve. No commitment. I respond within 48 hours.
              </p>
              <ConsultingForm />
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="pulse-dot" /> SYS.ONLINE · &copy; {profile.name}
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
