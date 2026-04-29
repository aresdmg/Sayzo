import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv"

export default function initDB() {
    dotenv.config({
        path: "./.env",
        quiet: true
    })

    const DB_URL = process.env.DATABASE_URL
    if (!DB_URL) {
        throw new Error("DB_URL not set")
    }

    const pool = new Pool({
        connectionString: DB_URL,
        max: 20,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 20_000
    })

    const db = drizzle(pool)
    return { db, pool }
}