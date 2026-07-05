// ─────────────────────────────────────────────────────────────
// Your tools. Add an object here for every tool you build.
// This list IS your live résumé — keep it current.
// ─────────────────────────────────────────────────────────────

export type ToolStatus = "live" | "active" | "prototype" | "archived";

export type Rarity = "legendary" | "epic" | "rare";

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
  // Optional screenshot/cover shown at the top of the card (path under /public).
  image?: string;
  imageAlt?: string;
  // Optional caption rendered directly under the image (e.g. a data disclaimer).
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
    name: "4-Horn Equipment Log",
    tagline: "A field-ops app for a Gulf Coast rental company — I killed their spreadsheet",
    description:
      "A build for 4-Horn Industrial — a 24/7 Gulf Coast industrial " +
      "equipment-rental company. They had no live picture of what was on rent, what was due " +
      "back, or what was sitting idle. I built them a mobile-first ops app: a live dashboard " +
      "(units and dollars on rent, returns due, open service), one-tap reservation and service " +
      "forms that output the exact text they already send, a quote builder off their real " +
      "catalog, and a revenue-leakage tracker.",
    icon: "🏗️",
    status: "live",
    stack: ["Cloudflare Workers", "D1", "KV", "Vanilla JS", "Mobile-first"],
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/4horn.jpg",
    imageAlt:
      "Three screens of the equipment-rental ops app, shown with sample demo data — the KPI dashboard (units and dollars on rent, returns due, open service), the service-request board, and the rentals list",
    imageCaption:
      "Screens shown use sample data — placeholder company names and figures for illustration only, not 4-Horn's actual customers, jobs, or numbers.",
  },
  {
    id: "wafergraph",
    name: "wafergraph",
    tagline: "The semiconductor & AI supply-chain graph",
    description:
      "A free, current, neutral map of the semiconductor & AI supply chain: 456+ companies " +
      "across the full value chain — materials, equipment, EDA/IP, chip design, foundry, memory, " +
      "packaging, distribution, and AI & data center. Each profiled with financials, supply-chain " +
      "dependencies, market share, and chokepoint exposure. Built and shipped end to end.",
    icon: "🔬",
    status: "live",
    stack: ["Next.js", "Data pipeline", "Graph model", "Cloudflare"],
    liveUrl: "https://wafergraph.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/wafergraph.jpg",
    imageAlt:
      "wafergraph's interactive network graph — a force-directed map of the semiconductor & AI supply chain centered on NVIDIA's neighborhood, with companies as colored nodes by segment and supplier–customer links between them",
  },
  {
    id: "whos-starting",
    name: "Who's Starting",
    tagline: "The ad-free sports app that respects your time and your team",
    description:
      "Started as a fix for a dumb problem: no good way to check college football depth charts " +
      "offline at a game. Grew into something more ambitious — a full Game Center covering CFB and " +
      "MLB, Madden-style OVR player ratings with the math shown, The People's Ratings crowd debate " +
      "engine (vote players over/underrated vs the algorithm), Draft the Country, and shareable " +
      "cards. Offline-first PWA. Zero ads.",
    icon: "🏈",
    status: "live",
    stack: ["Next.js", "Cloudflare Pages", "PWA / offline", "Data pipeline"],
    liveUrl: "https://whosstarting.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/whosstarting.png",
    imageAlt:
      "Four screens of the Who's Starting sports app — the Game Center home, the 135-team browser, The People's Ratings OVR voting card, and Draft the Country",
  },
  {
    id: "the-league",
    name: "The League Educational",
    tagline: "Financial-education platform — 500+ students",
    description:
      "Founded and built a financial-education platform from zero to 500+ international " +
      "students, with 200+ hours of original curriculum spanning equities, options, futures, " +
      "and risk management. Brand, platform, content, and community built from the ground up.",
    icon: "🎓",
    status: "active",
    stack: ["Curriculum design", "Platform", "Community", "Content"],
    year: "2021",
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
