import { defineConfig } from "vitest/config"

const setupFiles = ["./test/setup.ts"]

export default defineConfig({
  test: {
    globals: false,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: {
        statements: 93,
        branches: 85,
        functions: 94,
        lines: 93,
      },
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "jsdom",
          globals: false,
          include: ["src/**/*.test.{ts,tsx}"],
          restoreMocks: true,
          setupFiles,
        },
      },
      {
        test: {
          name: "parity",
          server: { deps: { inline: [/@base-ui/] } },
          environment: "node",
          globals: false,
          include: ["parity/**/*.parity.test.tsx"],
          restoreMocks: true,
        },
      },
    ],
  },
})
