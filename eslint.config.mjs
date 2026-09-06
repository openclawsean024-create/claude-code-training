// Claude Code Training — ESLint 9 flat config
// v3.0.2 — Fleet alignment
import nextPlugin from "eslint-config-next"

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "prisma/dev.db",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  ...nextPlugin,
]
