import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DB_URL) {
  throw new Error("DB_URL is not defined in environment variables");
}

// Initiate PostgreSQL connection pool
const pool = new Pool({ connectionString: ENV.DB_URL });

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", () => {
  console.error("Database connection error");
});

export const db = drizzle({ client: pool, schema });
