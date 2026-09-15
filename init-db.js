import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const setupSqlPath = path.join(__dirname, "src", "setup.sql");

try {
  const setupSql = await fs.readFile(setupSqlPath, "utf8");
  await pool.query(setupSql);
  console.log("Database initialized successfully.");
} catch (error) {
  console.error("Unable to initialize database:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
