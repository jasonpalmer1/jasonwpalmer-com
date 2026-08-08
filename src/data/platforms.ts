// ─────────────────────────────────────────────────────────────
// Platforms — audience & distribution built outside of software.
// Add an object here for every platform/audience you've built.
// ─────────────────────────────────────────────────────────────

export type PlatformStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
};

export type Platform = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  year?: string;
  stats: PlatformStat[];
  // Optional standalone line under the stats (e.g. an acquisition-model callout).
  note?: string;
};

export const platforms: Platform[] = [
  {
    id: "the-league",
    name: "The League Educational",
    tagline: "A financial-education platform, grown from zero — entirely organic",
    description:
      "Founded and grew a financial-education platform to 750+ students around the world, " +
      "with original curriculum spanning equities, options, futures, derivatives, and " +
      "risk management — taught as an hour of video six nights a week for 14 straight months. " +
      "Brand, platform, content, and community — all built from the ground up.",
    icon: "🎓",
    year: "2021 – 2023",
    stats: [
      { label: "Twitter followers", value: 50, suffix: "K" },
      { label: "YouTube subscribers", value: 2000, suffix: "+" },
      { label: "Video content", value: 365, suffix: "+ hrs" },
      { label: "Students taught", value: 750, suffix: "+" },
      { label: "Revenue", value: 800, prefix: "$", suffix: "K+" },
    ],
    note: "100% organic growth — zero paid acquisition, ever.",
  },
  // ── Add new platforms below. Copy the shape above. ──
];
