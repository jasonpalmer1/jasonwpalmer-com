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
      "A proprietary AI system I built in-house that underwrites a commercial real estate deal " +
      "end-to-end, runs a live portfolio picture, and surfaces new opportunities. Compresses a " +
      "~60-minute manual underwrite to ~3 minutes. Fast and right: every output is grounded in " +
      "real portfolio data and relentlessly tested.",
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
      "What began as a spreadsheet replacement for a 24/7 equipment-rental company is now their " +
      "whole operation in one phone app. A live KPI dashboard, one-tap reservation and service " +
      "boards, a quote builder off a real 200-item catalog, searchable logging with photos, and a " +
      "sales-intel layer surfacing local leads. The whole business, in your pocket.",
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
      "A free, always-current map of the semiconductor and AI supply chain — 615 companies, " +
      "3,400+ real supplier and customer links. It also runs a live, public MCP server, so an AI " +
      "like Claude can query it directly: find single points of failure, trace a supply chain, " +
      "simulate a company going offline. Dataset, API, MCP — built end to end.",
    icon: "🔬",
    status: "live",
    stack: ["Next.js", "Data pipeline", "Graph model", "MCP server", "Cloudflare"],
    liveUrl: "https://wafergraph.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/wafergraph-network-r3.jpg",
        alt: "The Network view's live graph, centered on NVIDIA — a dense, glowing cluster of 120 connected companies",
      },
      {
        src: "/builds/wafergraph-flow-r3.jpg",
        alt: "The Flow view tracing NVIDIA's real suppliers and customers, with single-source dependency risk flagged",
      },
    ],
  },
  {
    id: "whos-starting",
    name: "Who's Starting",
    tagline: "The ad-free sports app that respects your time and your team",
    description:
      "Started as a fix for checking depth charts offline at a game, and grew into a full sports " +
      "app. WS Power rates all 135 FBS teams, math shown. Dynasty Mode: a season-long coaching " +
      "game — call every play, manage recruiting, rebuild your roster every year. Draft the " +
      "Country turns real ratings into a fantasy draft. Zero ads.",
    icon: "🏈",
    status: "live",
    stack: ["Next.js", "Cloudflare Pages", "PWA / offline", "Season simulation", "Data pipeline"],
    liveUrl: "https://whosstarting.com",
    year: "2026",
    featured: true,
    rarity: "epic",
    images: [
      {
        src: "/builds/whosstarting-power-r3.jpg",
        alt: "The WS Power ranked table — Ohio State, Georgia, Notre Dame and more, rated 0-99",
      },
      {
        src: "/builds/whosstarting-dynasty-r3.jpg",
        alt: "A live Dynasty Mode game in progress — scoreboard, win probability, and the on-field formation",
      },
      {
        src: "/builds/whosstarting-draft-r3.jpg",
        alt: "Draft the Country — building a 13-slot fantasy roster from the app's own player ratings",
      },
      {
        src: "/builds/whosstarting-wire-r3.jpg",
        alt: "The Wire — real transfer-portal moves, ranked by player rating",
      },
    ],
  },
  {
    id: "our-place",
    name: "Our Place",
    tagline: "A private world for two, built as a birthday gift",
    description:
      "A private app I built for my girlfriend as a birthday gift, for staying close across a " +
      "long distance. Real-time chat and voice notes, a synced Listening Room, a photo keepsake " +
      "wall, a milestone timeline, open-when letters, and a trip tracker with its own " +
      "constellation map. Nothing here is public — this one's just ours.",
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
      "A personal command center I built and use daily — one password-gated dashboard instead of " +
      "scattered tabs. A live traffic panel tracks real visitor sessions off a first-party " +
      "tracker I built; a spend panel tracks my AI usage like a P&L. A persistent memory graph " +
      "and a Fleet status view keep it all running. And Mirror keeps a running self-model — " +
      "strengths, weaknesses, hard truths — a coach that never forgets.",
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
    tagline: "Proprietary & Confidential — an AI project about what to eat",
    description:
      "Actively in development: an AI project about what to eat. Proprietary and confidential, " +
      "so no further details yet — more when it's ready to show.",
    icon: "🍳",
    status: "prototype",
    stack: ["AI"],
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
