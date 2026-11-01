import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for pure lib/ code only: no DOM, no React. Run one file at a
// time: `corepack pnpm test lib/notebook.test.ts --maxWorkers=1`.
export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./", import.meta.url)) }],
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
