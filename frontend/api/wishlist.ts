import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, ensureSchema } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body ?? {};

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ message: 'Email invalide.' });
  }

  await ensureSchema();

  await sql`
    INSERT INTO wishlist_entries (email, name)
    VALUES (${email.toLowerCase().trim()}, ${name?.trim() ?? null})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  `;

  return res.status(201).json({ data: null, message: 'Added to wishlist!' });
}
