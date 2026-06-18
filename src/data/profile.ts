// ─────────────────────────────────────────────────────────────
// Your profile. Edit these values — the whole site reads from here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Jason Palmer",
  // Short label used in the page <title> / social cards.
  title: "Finance Operator & Systems Builder",
  // Punchy value pitch — the hero's first line. Leads with "why you should care."
  tagline:
    "I do the work of a finance team — then build the AI that does it in minutes.",
  // Supporting line under the pitch (the "what I do" specifics).
  subtagline:
    "I architect AI systems that underwrite deals, analyze portfolios, and automate the work.",
  // One or two sentences. Your elevator pitch (kept public-safe — no employer internals).
  blurb:
    "Finance professional, builder, and educator with 5+ years executing $3B+ in " +
    "transactions across real estate, capital markets, and interest-rate derivatives. " +
    "I build my own software — AI underwriting systems, trading tools, and automation — " +
    "and founded a financial-education platform that grew to 500+ students. This site is a " +
    "live, always-current record of what I've built.",
  location: "Austin, TX",
  domain: "jasonwpalmer.com",
};

// ── Gamified "player" framing for the hero operator card ──
// LEVEL = your current age, XP = days into the current year of life.
// Both are computed live in the browser from birthDate, so they're
// always current and tick up on their own each day.
export const game = {
  callsign: "JPALM",
  playerClass: "Finance Operator × Systems Builder",
  rank: "ARCHITECT",
  birthDate: "1999-08-25", // YYYY-MM-DD
};

export type Stat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

// Animated counters in the stat HUD.
export const stats: Stat[] = [
  { label: "Transacted", value: 3, prefix: "$", suffix: "B+" },
  { label: "Faster underwriting", value: 20, suffix: "×" },
  { label: "Students taught", value: 500, suffix: "+" },
  { label: "Years experience", value: 5, suffix: "+" },
];

export type SocialLink = {
  label: string;
  href: string;
};

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jasonwpalmer" },
  { label: "GitHub", href: "https://github.com/jasonpalmer1" },
];

export type SkillGroup = {
  category: string;
  // 0–100, rendered as a skill-tree progress bar.
  level: number;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Finance & Markets",
    level: 95,
    items: [
      "Financial modeling",
      "Valuation",
      "Underwriting",
      "Capital markets",
      "Interest-rate derivatives",
      "Risk management",
    ],
  },
  {
    category: "Building & AI",
    level: 90,
    items: [
      "Claude Code",
      "AI agents",
      "Workflow automation",
      "Process automation",
      "Data architecture",
    ],
  },
  {
    category: "Engineering",
    level: 78,
    items: ["Python", "DuckDB", "SQL", "Next.js", "REST / OAuth APIs"],
  },
  {
    category: "Platforms",
    level: 84,
    items: ["Bloomberg Terminal", "S&P Capital IQ Pro", "Advanced Excel"],
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  summary: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Analyst, Strategic Investments",
    org: "HPI Real Estate Services & Investments",
    period: "Mar 2025 – Present",
    summary:
      "Architected and built the HPI Command Center on personal initiative — a proprietary " +
      "in-house AI system (Claude Code) that underwrites deals end-to-end in minutes and runs a " +
      "live operating picture of the firm's portfolio. Closed 7+ acquisitions and dispositions " +
      "($90M+), ran two dispositions end-to-end (modeling, valuation, diligence, negotiation), " +
      "executed interest-rate swaps, and led monthly performance reviews with partners.",
  },
  {
    role: "Real Estate & Financial Analyst",
    org: "Summit Hotel Properties, Inc.",
    period: "Jan 2022 – Mar 2025",
    summary:
      "At a publicly traded REIT: executed $100M+ in interest-rate swaps (a $20M asset position " +
      "since inception), was part of the team that closed $1B+ in acquisitions and dispositions, " +
      "and managed a ~$100M transaction pipeline. Authored public earnings releases, hosted " +
      "earnings calls, and contributed to Board materials.",
  },
  {
    role: "Founder",
    org: "The League Educational",
    period: "Nov 2021 – Present",
    summary:
      "Founded and scaled a financial-education platform from zero to 500+ international students, " +
      "building 200+ hours of original curriculum across equities, options, futures, derivatives, " +
      "and risk management — brand, platform, and content from the ground up.",
  },
  {
    role: "Finance Intern",
    org: "Summit Hotel Properties, Inc.",
    period: "Jun 2019 – Aug 2021",
    summary:
      "Supported $1.7B+ in capital-markets transactions, including a $287.5M convertible senior " +
      "notes offering, a $100M preferred-stock offering, and $950M in credit-facility amendments; " +
      "helped underwrite an $822M, 27-hotel portfolio acquisition.",
  },
];

// ── "Lore" / personnel file — collapsed texture below the career facts. ──
export type LoreEntry = {
  code: string;
  tag: string;
  title: string;
  body: string;
};

export const lore = {
  epigraph: {
    quote: "Anything's possible.",
    author: "Kevin Garnett",
  },
  principle:
    "Operating principle: I don't just follow the things I love — I model them.",
  entries: [
    {
      code: "LOG-01",
      tag: "OBSESSION",
      title: "Semiconductors",
      body:
        "A years-long fixation on the most important industry on earth — now an actual build: " +
        "an interactive map of the entire value chain. Curiosity that compounded until it shipped.",
    },
    {
      code: "LOG-02",
      tag: "THROUGHLINE",
      title: "Builder, by default",
      body:
        "I see a gap and build into it — and have since before AI made it easy. The League, the " +
        "deal agents, the map, a trail of sketched concepts. AI didn't make me a builder; it just " +
        "removed my last excuse.",
    },
    {
      code: "LOG-03",
      tag: "AUSTIN-NATIVE",
      title: "Longhorns & college football",
      body:
        "Systems-level fandom — recruiting boards, depth charts, the machinery most fans skip. Hook 'em.",
    },
    {
      code: "LOG-04",
      tag: "RISK INSTINCT",
      title: "Forecasting as a discipline",
      body:
        "Making calibrated probability estimates and scoring myself honestly over time — a " +
        "risk-management instinct, applied to everything.",
    },
  ] as LoreEntry[],
};

export type EducationItem = {
  school: string;
  degree: string;
  detail?: string;
  year: string;
};

export const education: EducationItem[] = [
  {
    school: "The University of Texas at Austin",
    degree: "BBA, Finance",
    detail: "Investment Management & Risk Management Certificate",
    year: "2021",
  },
];

export type Credential = {
  name: string;
  detail?: string;
};

export const credentials: Credential[] = [
  {
    name: "FINRA Series 65",
    detail:
      "Uniform Investment Adviser Law Exam — passed (self-studied in 17 days, no prior FINRA exams)",
  },
];
