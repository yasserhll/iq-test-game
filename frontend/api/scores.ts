import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, iq, time_seconds, time_display } = req.body ?? {};

  if (
    !email || typeof email !== 'string' ||
    typeof iq !== 'number' || iq < 40 || iq > 200 ||
    typeof time_seconds !== 'number' || time_seconds < 1 ||
    typeof time_display !== 'string'
  ) {
    return res.status(422).json({ message: 'Données invalides.' });
  }

  await ensureSchema();

  const emailKey = email.toLowerCase().trim();

  const [entry] = await sql`
    SELECT name FROM wishlist_entries WHERE email = ${emailKey}
  `;

  if (!entry) {
    return res.status(422).json({
      message: 'Email not found in wishlist. Join the wishlist first to save your score.',
      code: 'not_wishlisted',
    });
  }

  const [existing] = await sql`
    SELECT iq FROM scores WHERE email = ${emailKey}
  `;

  if (existing && existing.iq >= iq) {
    return res.status(200).json({
      message: 'Your previous score was higher!',
      name: entry.name,
      iq: existing.iq,
      improved: false,
    });
  }

  await sql`
    INSERT INTO scores (email, name, iq, time_seconds, time_display)
    VALUES (${emailKey}, ${entry.name}, ${iq}, ${time_seconds}, ${time_display})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name,
          iq = EXCLUDED.iq,
          time_seconds = EXCLUDED.time_seconds,
          time_display = EXCLUDED.time_display
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM scores WHERE iq > ${iq}
  `;
  const rank = (count as number) + 1;

  return res.status(201).json({
    message: 'Score saved!',
    name: entry.name,
    iq,
    rank,
    improved: !!existing,
  });
}
