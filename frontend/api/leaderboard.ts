import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  await ensureSchema();

  const rows = await sql`
    SELECT name, iq, time_display, created_at
    FROM scores
    ORDER BY iq DESC, time_seconds ASC
    LIMIT 10
  `;

  return res.status(200).json({ data: rows });
}
