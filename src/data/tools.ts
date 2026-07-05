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
    tagline: "The mobile ops app that replaced a 24/7 rental company's spreadsheet",
    description:
      "A mobile-first operations app for 4-Horn Industrial, a 24/7 Gulf Coast " +
      "equipment-rental company that was running the whole business on a spreadsheet and paper " +
      "forms. It puts the numbers that matter on one screen — units and dollars on rent, returns " +
      "due, open service — with one-tap reservation and service forms that output the exact text " +
      "they already send, a quote builder off their real catalog, and a revenue-leakage tracker. " +
      "The whole operation, in your pocket.",
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
    tagline: "The entire semiconductor & AI supply chain, mapped as a living graph",
    description:
      "A free, neutral, always-current map of the semiconductor and AI supply chain — 565+ " +
      "companies across the full value chain, from raw materials and equipment through chip " +
      "design, foundries, and memory to the AI and data-center layer. Each is profiled with " +
      "financials, supplier-and-customer dependencies, market share, and chokepoint exposure — " +
      "so you can see exactly where the whole thing could break. Designed, built, and shipped end to end.",
    icon: "🔬",
    status: "live",
    stack: ["Next.js", "Data pipeline", "Graph model", "Cloudflare"],
    liveUrl: "https://wafergraph.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/wafergraph-flow.jpg",
    imageAlt:
      "Two views of wafergraph — the force-directed network graph of the semiconductor & AI supply chain, and the supply-chain Flow view showing companies as pills flowing upstream (suppliers) and downstream (customers) around NVIDIA",
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
      "Offline-first PWA. Zero ads.",
    icon: "🏈",
    status: "live",
    stack: ["Next.js", "Cloudflare Pages", "PWA / offline", "Data pipeline"],
    liveUrl: "https://whosstarting.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    image: "/builds/whosstarting.jpg",
    imageAlt:
      "Four screens of Who's Starting — the WS Power 135 rankings table, a team page with dynasty team-color theming and the 'Why This Rating' transparency panel, the Compare field-view matchup engine (Georgia vs Alabama), and The Wire transfer-portal feed",
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
