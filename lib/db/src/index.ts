import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[DB] WARNING: DATABASE_URL is not set — all database queries will fail. Set this env var to enable database features.",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("[DB] Pool error (connection dropped):", err.message);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
