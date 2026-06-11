import type { VercelRequest, VercelResponse } from '@vercel/node';

const CHARACTERS = [
  { id: 1, name: 'GLOOB',     role: 'The Navigator', tag: 'Blob #001', color: '#3d9bff', svgColor: '#2ecc40', svgDark: '#1aab2e', stats: { str: 88, spd: 62, goo: 74 } },
  { id: 2, name: 'SPLATTY',   role: 'The Speedster', tag: 'Blob #002', color: '#ff5555', svgColor: '#ff2d55', svgDark: '#b01f3b', stats: { str: 55, spd: 97, goo: 48 } },
  { id: 3, name: 'OOZARA',    role: 'The Analyst',   tag: 'Blob #003', color: '#9b59b6', svgColor: '#8e44ad', svgDark: '#6c3483', stats: { str: 42, spd: 58, goo: 100 } },
  { id: 4, name: 'BLOBZILLA', role: 'The Boss',      tag: 'Blob #???', color: '#f39c12', svgColor: '#f1c40f', svgDark: '#b7950b', stats: { str: 100, spd: 72, goo: 100 } },
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.status(200).json({ data: CHARACTERS });
}
