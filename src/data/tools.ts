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
    id: "hpi-command-center",
    name: "HPI Command Center",
    tagline: "AI that underwrites CRE deals and monitors a portfolio in minutes",
    description:
      "A proprietary AI system I architected and built in-house (Claude Code, on personal " +
      "initiative) that underwrites a commercial real estate deal end-to-end and runs a live " +
      "operating picture of the firm's portfolio. It compresses a ~60-minute manual underwrite " +
      "to ~3 minutes by standardizing the data layer and automating document intake, modeling, " +
      "valuation, and market analysis. Speed isn't the point — fast and right is: every output " +
      "is grounded in the firm's own data, relentlessly tested, and backed by as much data as " +
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
    tagline: "My first paying client — I killed the rental-ops spreadsheet",
    description:
      "First paid client build, for 4-Horn Industrial — a 24/7 Gulf Coast industrial " +
      "equipment-rental company. Their rental operation ran on a shared spreadsheet and " +
      "hand-typed text messages, with no live picture of what was on rent, what was due back, " +
      "or what was idle. I replaced it with a mobile-first ops app: a live dashboard (units and " +
      "dollars on rent, returns due, open service), one-tap reservation and service forms that " +
      "output the exact text they already send, a quote builder off their real catalog, and a " +
      "revenue-leakage tracker. Built and shipped in an afternoon.",
    icon: "🏗️",
    status: "live",
    stack: ["Cloudflare Workers", "D1", "KV", "Vanilla JS", "Mobile-first"],
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/4horn.png",
    imageAlt:
      "Four screens of the 4-Horn Equipment Log app — the live dashboard (units and dollars on rent, returns due, open service), the rentals list, the service-request board, and the revenue-leakage tracker",
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
    rarity: "epic",
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
