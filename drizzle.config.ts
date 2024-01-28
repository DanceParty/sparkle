import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("database url is undefined");
}
export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;