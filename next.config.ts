import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile in $HOME otherwise confuses it).
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },

  // Static export -> emits an `out/` folder of HTML/CSS/JS.
  // Deploys to Cloudflare Pages with zero server runtime.
  output: "export",

  // Cloudflare Pages serves clean URLs best with trailing-slash dirs.
  trailingSlash: true,

  // Static hosting can't run Next's image optimizer; serve images as-is.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
