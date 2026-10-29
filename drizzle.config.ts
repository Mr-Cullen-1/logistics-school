import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : undefined;
databaseUrl?.searchParams.set("sslmode", "require");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: databaseUrl ? { url: databaseUrl.toString() } : undefined,
});
