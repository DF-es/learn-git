import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Define the path to the SQLite database file
const dbPath = path.resolve(process.cwd(), "sqlite.db");

// Initialize the SQLite database
const sqlite = new Database(dbPath);

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });
