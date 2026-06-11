# Blob Bash — IQ Maze Challenge

A 2-player competitive maze game where your speed and path efficiency calculate your real Spatial IQ score.

## What it is

Race your blob through 3 randomly generated pixel labyrinths. The game measures how fast you move and how efficiently you navigate — then produces a score based on a log-normal IQ model (mean 100, SD 15), just like a real cognitive assessment.

- 3 stages, each larger than the last (21×21 → 29×29 → 37×37)
- Every maze is unique — randomly generated each session
- 2-player local: P1 uses arrow keys, P2 uses WASD
- 4 playable characters: GLOOB, SPLATTY, OOZARA, BLOBZILLA
- Global leaderboard with real scores
- Save your score via wishlist email

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Game engine | HTML5 Canvas (no library) |
| Animations | Framer Motion |
| Backend | Vercel Serverless Functions (TypeScript) |
| Database | Neon (serverless PostgreSQL) |
| Hosting | Vercel (free tier) |
| PWA | vite-plugin-pwa — installable on iOS and Android |

## Project structure

```
frontend/
  src/
    components/
      BetaGame.tsx       — game engine, maze gen, IQ calc, all phases
      Leaderboard.tsx    — global rankings fetched from Neon
      Hero.tsx           — landing page hero section
      ...
    lib/
      api.ts             — axios client for all API calls
    data/
      gameData.ts        — character definitions
  api/
    _db.ts              — Neon connection + schema init
    wishlist.ts         — POST /api/wishlist
    characters.ts       — GET /api/characters
    scores.ts           — POST /api/scores
    leaderboard.ts      — GET /api/leaderboard
```

## Local development

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000` (Laravel backend).  
In production on Vercel, `/api/*` routes go directly to the serverless functions.

## Deploy

```bash
cd frontend
npx vercel --prod
```

Environment variable required on Vercel:

```
DATABASE_URL=postgresql://...   # Neon connection string
```

## IQ scoring model

Each stage records:
- **time** — how long the player took
- **moves** — how many cells they traversed
- **optimal moves** — shortest path via BFS

These are converted to z-scores using log-normal distributions calibrated so an average player scores ~100. Speed accounts for 60% of the score, path efficiency 40%.

## Live

[blogbushiq.vercel.app](https://blogbushiq.vercel.app)
