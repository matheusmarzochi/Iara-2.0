import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema/**",
  dialect: "postgresql",
  out: "./database/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
