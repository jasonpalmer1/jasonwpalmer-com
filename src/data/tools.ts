// ─────────────────────────────────────────────────────────────
// Your tools. Add an object here for every tool you build.
// This list IS your live résumé — keep it current.
// ─────────────────────────────────────────────────────────────

export type ToolStatus = "live" | "active" | "prototype" | "archived";

export type Rarity = "legendary" | "epic" | "rare";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type Tool = {
  // Stable id, used for anchors/keys. kebab-case.
  id: string;
  name: string;
  // One-line pitch.
  tagline: string;
  // 1–3 sentence description.
  description: string;
  // Emoji or short symbol shown on the card.
  icon: string;
  status: ToolStatus;
  // Tech used — shown as chips.
  stack: string[];
  // Optional tap-through gallery of screenshots (path under /public). One full-size
  // shot per feature reads far better than a squeezed composite — prefer several
  // images over one collage.
  images?: GalleryImage[];
  // Optional caption rendered directly under the gallery (e.g. a data disclaimer).
  imageCaption?: string;
  // Optional links.
  liveUrl?: string;
  sourceUrl?: string;
  // Optional year/date for sorting and display.
  year?: string;
  // Mark the standout projects to feature them larger.
  featured?: boolean;
  // Game rarity tier shown on the card.
  rarity?: Rarity;
};

export const tools: Tool[] = [
  {
    id: "command-center",
    name: "Command Center — CRE Underwriting AI",
    tagline: "AI that underwrites CRE deals, monitors the portfolio, and surfaces new opportunities",
    description:
      "A proprietary AI system I architected in-house (Claude Code, on personal " +
      "initiative) that underwrites a commercial real estate deal end-to-end, runs a live " +
      "operating picture of the portfolio, and proactively identifies new investment " +
      "opportunities. It compresses a ~60-minute manual underwrite " +
      "to ~3 minutes by standardizing the data layer and automating document intake, modeling, " +
      "valuation, and market analysis. Speed isn't the point — fast and right is: every output " +
      "is grounded in real portfolio data, relentlessly tested, and backed by as much data as " +
      "possible before it informs a decision.",
    icon: "🏢",
    status: "active",
    stack: ["Claude Code", "AI agents", "DuckDB", "Data architecture", "Python", "Automation"],
    year: "2026",
    featured: true,
    rarity: "legendary",
  },
  {
    id: "four-horn-equipment-log",
    name: "4-Horn Field Ops",
    tagline: "The field-ops suite that runs a 24/7 rental company from a phone",
    description:
      "What began as a spreadsheet-and-paper replacement for 4-Horn Industrial — a 24/7 Gulf " +
      "Coast equipment-rental company — is now their whole operation in one mobile app. A live " +
      "KPI dashboard (units and dollars on rent, returns due, open service), one-tap reservation " +
      "and service boards that output the exact text they already send, and a quote builder that " +
      "generates a branded PDF off their real 200-plus-item catalog. Add searchable logging with " +
      "photos, plus a sales-intel layer that surfaces new construction projects in their region " +
      "worth chasing. The whole business, in your pocket.",
    icon: "🏗️",
    status: "live",
    stack: ["Cloudflare Workers", "D1", "KV", "Vanilla JS", "Mobile-first"],
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/4horn-home.jpg",
        alt: "The Home dashboard — units and dollars on rent, returns due, open service, at a glance",
      },
      {
        src: "/builds/4horn-rentals.jpg",
        alt: "The Rentals board — one-tap reservation status from Reserved through On Rent",
      },
      {
        src: "/builds/4horn-service.jpg",
        alt: "The Service board — open, in-progress, and done service requests, grouped for the field",
      },
      {
        src: "/builds/4horn-quote.jpg",
        alt: "The Quote builder — a branded quote assembled from the real equipment catalog",
      },
      {
        src: "/builds/4horn-log.jpg",
        alt: "The searchable Log — missed-rent and re-rent history with dollar impact called out",
      },
      {
        src: "/builds/4horn-targets.jpg",
        alt: "The Targets sales-intel layer — construction leads and subcontractors worth calling",
      },
    ],
    imageCaption:
      "Screens shown use sample data — placeholder company names and figures for illustration only, not 4-Horn's actual customers, jobs, or numbers.",
  },
  {
    id: "wafergraph",
    name: "wafergraph",
    tagline: "The entire semiconductor & AI supply chain, mapped — and now queryable by AI",
    description:
      "A free, neutral, always-current map of the semiconductor and AI supply chain — 615 " +
      "companies across the full value chain, from raw materials and equipment through chip " +
      "design, foundries, and memory to the AI data-center layer, linked by 3,400+ real supplier " +
      "and customer relationships. Each company is profiled with financials, dependencies, market " +
      "share, and chokepoint exposure, and the graph tracks M&A activity as it happens. It's not " +
      "just a website — wafergraph also runs a live, public MCP server, so an AI assistant like " +
      "Claude can query the whole graph directly: find single points of failure, simulate what " +
      "happens if a company or country goes offline, trace a company's full supplier chain, or " +
      "spot where an industry is consolidating. Dataset, API, and MCP — designed, built, and " +
      "shipped end to end.",
    icon: "🔬",
    status: "live",
    stack: ["Next.js", "Data pipeline", "Graph model", "MCP server", "Cloudflare"],
    liveUrl: "https://wafergraph.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/wafergraph-network.jpg",
        alt: "The force-directed Network view, centered on NVIDIA — 120 connected companies, 497 links, glowing by segment",
      },
      {
        src: "/builds/wafergraph-flow-view.jpg",
        alt: "The Flow view tracing TSMC's supply chain — real suppliers upstream and customers downstream, with single-source dependency warnings flagged",
      },
    ],
  },
  {
    id: "whos-starting",
    name: "Who's Starting",
    tagline: "The ad-free sports app that respects your time and your team",
    description:
      "Started as a fix for a dumb problem — no good way to check college-football depth charts " +
      "offline at a game — and grew into a full broadcast-style Game Center. It runs on WS Power, a " +
      "transparent model that rates all 135 FBS teams with the math shown; team pages that re-skin to " +
      "your team's colors and explain exactly why they rank where they do; a Compare mode that lines " +
      "up any two rosters on a real field; and The Wire, a nightly transfer-portal and injury feed. " +
      "The newest piece is the one I'm proudest of: Dynasty Mode, a full season-long coaching game — " +
      "call every play, manage recruiting and the transfer portal, and run an offseason that rebuilds " +
      "your roster year after year, all against a living 133-team league that plays out around you. " +
      "Draft the Country turns the app's own player ratings into a season-long fantasy draft. " +
      "Offline-first PWA. Zero ads.",
    icon: "🏈",
    status: "live",
    stack: ["Next.js", "Cloudflare Pages", "PWA / offline", "Season simulation", "Data pipeline"],
    liveUrl: "https://whosstarting.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/whosstarting-power.jpg",
        alt: "WS Power — every FBS team rated on one number, sortable by conference and tier",
      },
      {
        src: "/builds/whosstarting-dynasty.jpg",
        alt: "Dynasty Mode's intro screen — 'You're the coach. Call every play.' — pick a school and start a season",
      },
      {
        src: "/builds/whosstarting-draft.jpg",
        alt: "Draft the Country — building a 13-slot fantasy roster from the app's own player ratings",
      },
      {
        src: "/builds/whosstarting-wire.jpg",
        alt: "The Wire — nightly transfer-portal adds and depth-chart moves across college football",
      },
    ],
  },
  {
    id: "our-place",
    name: "Our Place",
    tagline: "A private world for two, built as a birthday gift",
    description:
      "A private, just-for-us app I built for my girlfriend as a birthday gift, for staying close " +
      "across a long distance. Real-time chat and voice notes, a YouTube-synced Listening Room so " +
      "we can watch or listen together from two cities, a photo keepsake wall, a celestial " +
      "milestone timeline, open-when letters that unlock on the recipient's terms, and a trip " +
      "tracker with its own constellation map for places we've been together. A quiet presence " +
      "indicator and a countdown to the next visit round it out. Under the hood: Supabase " +
      "real-time sync and row-level security scope every record to the two of us, and nothing " +
      "here is public — this one's just ours.",
    icon: "🌌",
    status: "live",
    stack: ["React", "Supabase", "Realtime sync", "Cloudflare Pages"],
    year: "2025 – 2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/our-place-listening.jpg",
        alt: "The Listening Room — a YouTube-synced now-playing screen for watching or listening together from two cities",
      },
      {
        src: "/builds/our-place-letters.jpg",
        alt: "Open-When Letters — sealed messages that stay closed until the moment they're written for",
      },
      {
        src: "/builds/our-place-tour.jpg",
        alt: "Quantum Love Tour — a constellation map tracking every city visited together",
      },
      {
        src: "/builds/our-place-story.jpg",
        alt: "Our Story — a celestial milestone timeline marking the relationship's key dates",
      },
      {
        src: "/builds/our-place-keepsakes.jpg",
        alt: "The Note Wall — a polaroid-style keepsake grid for pinning photos and captions",
      },
    ],
    imageCaption:
      "Screens shown are a fabricated demo — placeholder names, photos, dates, and locations, not real content from the actual app. Built and rendered separately for this page; never pulled from the live private app or its real data.",
  },
  {
    id: "mission-hq",
    name: "Mission HQ",
    tagline: "A private mission-control system for running my own work like an operator",
    description:
      "A personal command center I built and use daily to run everything else here — a single " +
      "password-gated dashboard that keeps me systemized instead of scattered across tabs. A live " +
      "traffic panel tracks real visitor sessions across my sites — origins, page trails, rough " +
      "geography — off a first-party tracker I built instead of a third-party analytics vendor, " +
      "and a token-spend panel tracks my own AI usage like a P&L, so building with AI agents has a " +
      "real cost line instead of a surprise bill. Underneath it all sits a persistent memory " +
      "system: a typed, linked graph of everything I've learned running this operation, which " +
      "every AI session reads before it starts and writes back to when it's done, so nothing has " +
      "to be re-explained twice. A Fleet panel shows every AI session I have running right now in " +
      "one place, with a live status on each — working, waiting on me, or done. And a feature " +
      "called Mirror keeps a running self-model — strengths, weaknesses, hard truths, a growth " +
      "log — the closest thing I have to a coach that never forgets. It's the control room behind " +
      "the rest of this page.",
    icon: "🛰️",
    status: "live",
    stack: ["Cloudflare Workers", "D1", "Real-time analytics", "AI agents", "Automation"],
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/mission-hq-visitors.jpg",
        alt: "Visitor-traffic panel — real sessions across my sites, where they came from, the pages they moved through",
      },
      {
        src: "/builds/mission-hq-spend.jpg",
        alt: "AI token-spend panel — daily spend and a model-by-model breakdown, tracked like a P&L",
      },
      {
        src: "/builds/mission-hq-memory.jpg",
        alt: "Memory panel — the persistent, linked memory graph every AI session reads and writes to, so nothing has to be re-explained",
      },
      {
        src: "/builds/mission-hq-fleet.jpg",
        alt: "Fleet panel — every AI session running right now in one place, with a live busy / waiting / idle status on each",
      },
    ],
    imageCaption:
      "Screens shown use sanitized sample data — placeholder sessions, figures, and names for illustration only, not real visitors, spend, or personal content.",
  },
  {
    id: "sous",
    name: "Sous",
    tagline: "An AI project about what to eat — confidential for now",
    description:
      "In development: an AI project about what to eat. Confidential for now — more when it's " +
      "ready to show.",
    icon: "🍳",
    status: "prototype",
    stack: ["AI agents"],
    year: "2026",
    rarity: "rare",
  },
  {
    id: "the-league",
    name: "The League Educational",
    tagline: "From zero to 500+ students — a financial-education platform built end to end",
    description:
      "A financial-education platform I founded and grew from zero to 500+ students around the " +
      "world, built on 200+ hours of original curriculum spanning equities, options, futures, " +
      "and risk management. Brand, platform, content, and community — all built from the ground up.",
    icon: "🎓",
    status: "archived",
    stack: ["Curriculum design", "Platform", "Community", "Content"],
    year: "2021 – 2023",
    rarity: "rare",
  },
  {
    id: "classified-fantasy-tracker",
    name: "[ CLASSIFIED — In Development ]",
    tagline: "A real-time, game-tracking fantasy sports app — not ready to name yet",
    description:
      "Currently in development: a proprietary, real-time tracker for a competitive gaming scene, " +
      "paired with its own fantasy layer — live event scoring, power rankings built from a custom " +
      "formula (not just raw stats), and a free-to-play fantasy draft on top of it. Confidential " +
      "until it's ready to show. More soon.",
    icon: "🔒",
    status: "prototype",
    stack: ["Cloudflare Workers", "D1", "Real-time data", "Automation"],
    year: "2026",
    rarity: "rare",
  },
  // ── Add new tools below. Copy the shape above. ──
  // {
  //   id: "my-next-tool",
  //   name: "My Next Tool",
  //   tagline: "...",
  //   description: "...",
  //   icon: "🛠️",
  //   status: "prototype",
  //   stack: ["..."],
  //   liveUrl: "https://...",
  //   sourceUrl: "https://github.com/...",
  //   year: "2026",
  // },
];

export const statusLabels: Record<ToolStatus, string> = {
  live: "Live",
  active: "Active",
  prototype: "Prototype",
  archived: "Archived",
};
