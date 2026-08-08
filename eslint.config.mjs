import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Private draft consulting page + cross-repo audit bundles (not part of the site).
    "src/app/_build/**",
    "docs/bug-audits/**",
    // One-off Node asset generators (CJS require).
    "scripts/**",
  ]),
]);

export default eslintConfig;
