import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const hasRenderDb = process.env.DATABASE_URL?.includes("render.com");
const isProduction = process.env.NODE_ENV?.toLowerCase() === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction || hasRenderDb ? { rejectUnauthorized: false } : false,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool