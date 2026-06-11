import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

let ready = false;

export async function ensureSchema() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS wishlist_entries (
      id        SERIAL PRIMARY KEY,
      email     VARCHAR(255) UNIQUE NOT NULL,
      name      VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS scores (
      id           SERIAL PRIMARY KEY,
      email        VARCHAR(255) UNIQUE NOT NULL,
      name         VARCHAR(100) NOT NULL,
      iq           SMALLINT NOT NULL,
      time_seconds INT NOT NULL,
      time_display VARCHAR(10) NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  ready = true;
}
