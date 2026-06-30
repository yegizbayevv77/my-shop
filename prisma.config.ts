// prisma.config.ts  (Prisma 7 config)
import "dotenv/config"; // load .env for CLI commands (migrate / seed / generate)
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  // Migrations run through the DIRECT (session-mode) connection — port 5432.
  // The pooled pgbouncer URL (6543) cannot run DDL / advisory locks.
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
