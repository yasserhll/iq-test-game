import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitScore } from '../lib/api';
import { CHARACTERS } from '../data/gameData';
import { BlobSvg } from './Hero';
import type { ScoreResponse, Character } from '../types';

// ─── Stage configs ────────────────────────────────────────────────────────────
interface StageConfig {
  stage: number;
  cols: number;
  rows: number;
  maxCell: number;
  moveMs: number;
}

const BASE_STAGES: StageConfig[] = [
  { stage: 1, cols: 21, rows: 21, maxCell: 30, moveMs: 150 },
  { stage: 2, cols: 29, rows: 29, maxCell: 22, moveMs: 120 },
  { stage: 3, cols: 37, rows: 37, maxCell: 16, moveMs: 85  },
];

// Compute cell so canvas fits inside viewport without clipping
function computeCell(cols: number, rows: number, maxCell: number): number {
  const chromeH = 182; // header + hud + footer + borders
  const availH  = Math.floor(window.innerHeight * 0.93 - chromeH);
  const availW  = Math.floor(Math.min(window.innerWidth - 50, 860));
  return Math.max(10, Math.min(maxCell, Math.floor(availH / rows), Math.floor(availW / cols)));
}

// ─── Pixel art blob map — 16×15, derived from BlobSvg ────────────────────────
// '.' transparent | 'K' #0a0a0a | 'B' body | 'D' dark | 'W' white
const BLOB_MAP = [
  '................',
  '...KKKKKKKKKK..',
  '.KBBBBBBBBBBBK..',
  'KBBBBBBBBBBBBBBK',
  'KBBBBBBBBBBBBBBK',
  'KBBBKKWWKKWWKKBK',
  'KBBBKKWKKKWKKKBK',
  'KBBBBBBBBBBBBBBK',
  'KBBBKWWWWWWKBBBK',
  'KBBB.WWKKWW.BBBK',
  '.BBBBBBBBBBBBBB.',
  '.KBBBBBBBBBBBBK.',
  '.KDDDDDKKDDDDDDK.',
  '.KDDDDDKKDDDDDDK.',
  '..KKKKK..KKKKK..',
] as const;

const BLOB_W = 16, BLOB_H = 15;

// ─── Maze generation ─────────────────────────────────────────────────────────
function buildMaze(cols: number, rows: number, seed: number): number[][] {
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));
  let s = (seed >>> 0) || 1;
  const rand = () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
  const shuffle = <T,>(a: T[]): T[] => {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  };
  const DIRS: [number, number][] = [[0, -2], [2, 0], [0, 2], [-2, 0]];
  const carve = (cx: number, cy: number) => {
    for (const [dx, dy] of shuffle(DIRS)) {
      const nx = cx + dx, ny = cy + dy;
      if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1 && grid[ny][nx] === 1) {
        grid[cy + dy / 2][cx + dx / 2] = 0; grid[ny][nx] = 0; carve(nx, ny);
      }
    }
  };
  grid[1][1] = 0; carve(1, 1);
  grid[1][1] = 0; grid[rows - 2][cols - 2] = 0; grid[1][cols - 2] = 0;
  return grid;
}

// BFS to get optimal path length
function bfsPathLen(maze: number[][], sx: number, sy: number, ex: number, ey: number, cols: number, rows: number): number {
  const vis: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const q: [number, number, number][] = [[sx, sy, 0]];
  vis[sy][sx] = true;
  while (q.length) {
    const [x, y, d] = q.shift()!;
    if (x === ex && y === ey) return d;
    for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !vis[ny][nx] && maze[ny][nx] === 0) {
        vis[ny][nx] = true; q.push([nx, ny, d + 1]);
      }
    }
  }
  return 1;
}

// ─── IQ calculation ──────────────────────────────────────────────────────────
// Based on log-normal model:
//   Average player takes ~10x the optimal time, ~2.5x the optimal moves
interface StageStat { timeMs: number; moves: number; optimalMoves: number; moveMs: number; }

function calcIQ(stats: StageStat[]): { speed: number; accuracy: number; iq: number; percentile: number; label: string } {
  if (stats.length === 0) return { speed: 100, accuracy: 100, iq: 100, percentile: 50, label: 'Average' };

  const zScores = stats.map(s => {
    const optTime = s.optimalMoves * s.moveMs;
    const speedRatio = Math.min(1, optTime / Math.max(optTime, s.timeMs));
    const effRatio   = Math.min(1, s.optimalMoves / Math.max(s.optimalMoves, s.moves));
    // μ_speed = ln(0.08), σ_speed = 0.9 → average player gets ~IQ 100
    const zSpeed = (Math.log(Math.max(0.001, speedRatio)) - Math.log(0.08)) / 0.9;
    // μ_eff = ln(0.38), σ_eff = 0.65
    const zEff   = (Math.log(Math.max(0.001, effRatio))   - Math.log(0.38)) / 0.65;
    return { zSpeed, zEff };
  });

  const avgZS = zScores.reduce((a, b) => a + b.zSpeed, 0) / zScores.length;
  const avgZE = zScores.reduce((a, b) => a + b.zEff, 0)   / zScores.length;
  const combined = avgZS * 0.60 + avgZE * 0.40;

  const toIQ = (z: number) => Math.round(Math.max(45, Math.min(155, 100 + z * 15)));

  const iq = toIQ(combined);
  const speed = toIQ(avgZS);
  const accuracy = toIQ(avgZE);

  // Normal CDF approximation for percentile
  const z = (iq - 100) / 15;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const rawPerc = 1 - d * poly;
  const percentile = Math.round((z > 0 ? rawPerc : 1 - rawPerc) * 100);

  const label =
    iq >= 130 ? 'Exceptionally Gifted' :
    iq >= 120 ? 'Superior' :
    iq >= 110 ? 'High Average' :
    iq >= 90  ? 'Average' :
    iq >= 80  ? 'Low Average' :
    iq >= 70  ? 'Borderline' : 'Below Average';

  return { speed, accuracy, iq, percentile, label };
}

// ─── Rendering ───────────────────────────────────────────────────────────────
function renderMaze(ctx: CanvasRenderingContext2D, maze: number[][], cols: number, rows: number, cell: number) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * cell, py = y * cell;
      if (maze[y][x] === 1) {
        ctx.fillStyle = '#0d0d0d';
        ctx.fillRect(px, py, cell, cell);
        ctx.fillStyle = 'rgba(255,229,0,0.06)';
        ctx.fillRect(px, py, cell, 1);
        ctx.fillRect(px, py, 1, cell);
      } else {
        ctx.fillStyle = '#181818';
        ctx.fillRect(px, py, cell, cell);
        if (cell >= 14) {
          ctx.fillStyle = 'rgba(255,229,0,0.04)';
          ctx.fillRect(px + cell / 2 - 1, py + cell / 2 - 1, 2, 2);
        }
      }
    }
  }
}

function renderExit(ctx: CanvasRenderingContext2D, cols: number, cell: number, t: number) {
  const ex = cols - 2, ey = 1;
  const px = ex * cell, py = ey * cell;
  const cx = px + cell / 2, cy = py + cell / 2;
  const pulse = 0.65 + 0.35 * Math.sin(t * 0.005);

  // Solid pulsing background for the exit cell
  ctx.fillStyle = `rgba(255,229,0,${0.22 * pulse})`;
  ctx.fillRect(px, py, cell, cell);

  // Bright border around exit cell
  ctx.strokeStyle = `rgba(255,229,0,${0.9 * pulse})`;
  ctx.lineWidth = Math.max(1.5, cell * 0.07);
  ctx.strokeRect(px + 1, py + 1, cell - 2, cell - 2);

  // Glow
  ctx.save();
  ctx.shadowColor = '#FFE500';
  ctx.shadowBlur = cell * 0.8 * pulse;

  // Star
  const r = cell * 0.36 * pulse;
  ctx.fillStyle = '#FFE500';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    const vx = cx + Math.cos(angle) * rad;
    const vy = cy + Math.sin(angle) * rad;
    i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // "EXIT" label if cell is large enough
  if (cell >= 18) {
    ctx.fillStyle = `rgba(255,229,0,${0.85 * pulse})`;
    ctx.font = `bold ${Math.floor(cell * 0.28)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EXIT', cx, cy + r + cell * 0.22);
  }
}

function renderPixelBlob(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  color: string,
  dark: string,
  cell: number,
) {
  const cx = pos.x * cell + cell / 2;
  const cy = pos.y * cell + cell / 2;
  const scale = Math.max(0.5, (cell - 2) / BLOB_W);
  const startX = cx - (BLOB_W * scale) / 2;
  const startY = cy - (BLOB_H * scale) / 2;

  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = cell * 0.4;
  ctx.fillStyle = color + '44';
  ctx.beginPath();
  ctx.arc(cx, cy, cell * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  for (let y = 0; y < BLOB_H; y++) {
    for (let x = 0; x < BLOB_W; x++) {
      const ch = BLOB_MAP[y][x];
      const fill = ch === 'K' ? '#0a0a0a' : ch === 'B' ? color : ch === 'D' ? dark : ch === 'W' ? '#ffffff' : null;
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(startX + x * scale, startY + y * scale, scale, scale);
      }
    }
  }
}

// ─── Time formatter ───────────────────────────────────────────────────────────
function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
}

function fmtTimeDisplay(totalMs: number): string {
  const s = Math.max(1, Math.round(totalMs / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

// ─── IQ Result Screen ─────────────────────────────────────────────────────────
function IQResultScreen({
  iqResult,
  stageStats,
  onPlayAgain,
  onClose,
}: {
  iqResult: IQResult;
  stageStats: StageStat[];
  onPlayAgain: () => void;
  onClose: () => void;
}) {
  const [email, setEmail]       = useState('');
  const [savePhase, setSavePhase] = useState<'idle' | 'saving' | 'saved' | 'no_improvement' | 'not_wishlisted' | 'error'>('idle');
  const [response, setResponse] = useState<ScoreResponse | null>(null);
  const [errMsg, setErrMsg]     = useState('');

  const totalMs      = stageStats.reduce((a, s) => a + s.timeMs, 0);
  const totalSeconds = Math.max(1, Math.round(totalMs / 1000));
  const timeDisplay  = fmtTimeDisplay(totalMs);

  const labelColor =
    iqResult.iq >= 130 ? '#FFE500' :
    iqResult.iq >= 120 ? '#2ECC40' :
    iqResult.iq >= 110 ? '#4ECDC4' :
    iqResult.iq >= 90  ? '#fff'    : '#FF2D55';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSavePhase('saving');
    try {
      const res = await submitScore({
        email: email.trim(),
        iq: iqResult.iq,
        time_seconds: totalSeconds,
        time_display: timeDisplay,
      });
      setResponse(res);
      setSavePhase(res.improved === false ? 'no_improvement' : 'saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue.';
      if (msg.toLowerCase().includes('wishlist')) {
        setSavePhase('not_wishlisted');
      } else {
        setErrMsg(msg);
        setSavePhase('error');
      }
    }
  };

  const speedPct    = Math.round(((iqResult.speed    - 45) / 110) * 100);
  const accuracyPct = Math.round(((iqResult.accuracy - 45) / 110) * 100);

  return (
    <motion.div key="iqresult" className="gm-screen"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="gm-screen-box gs-iq-box">
        <p className="gs-eyebrow">IQ Assessment</p>

        <div className="gs-iq-number" style={{ color: labelColor }}>{iqResult.iq}</div>
        <div className="gs-iq-label" style={{ color: labelColor }}>{iqResult.label}</div>
        <div className="gs-iq-percentile">Top {100 - iqResult.percentile}% of all players</div>

        <div className="gs-iq-bars">
          <div className="gs-iq-bar-row">
            <span>Speed</span>
            <div className="gs-iq-track">
              <div className="gs-iq-fill" style={{ width: `${speedPct}%`, background: '#2ECC40' }} />
            </div>
            <span className="gs-iq-val">{iqResult.speed}</span>
          </div>
          <div className="gs-iq-bar-row">
            <span>Accuracy</span>
            <div className="gs-iq-track">
              <div className="gs-iq-fill" style={{ width: `${accuracyPct}%`, background: '#FF2D55' }} />
            </div>
            <span className="gs-iq-val">{iqResult.accuracy}</span>
          </div>
        </div>

        <div className="gs-iq-time">Total time: {timeDisplay}</div>

        {savePhase === 'idle' && (
          <form className="gs-save-form" onSubmit={handleSave}>
            <p className="gs-save-hint">Save to global leaderboard</p>
            <div className="gs-save-field">
              <input
                type="email"
                placeholder="Your wishlist email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="gs-save-input"
                required
                autoComplete="email"
              />
              <button type="submit" className="gs-save-submit">SAVE</button>
            </div>
          </form>
        )}

        {savePhase === 'saving' && (
          <p className="gs-save-status">Saving score...</p>
        )}

        {savePhase === 'saved' && response && (
          <div className="gs-save-success">
            <div className="gs-save-rank">#{response.rank}</div>
            <p className="gs-save-msg">
              {response.improved ? 'New personal best!' : 'Score saved!'}<br />
              Welcome to the board, <strong>{response.name}</strong>.
            </p>
          </div>
        )}

        {savePhase === 'no_improvement' && response && (
          <div className="gs-save-notice">
            <p>Your previous score of <strong>{response.iq}</strong> is higher — keep pushing!</p>
          </div>
        )}

        {savePhase === 'not_wishlisted' && (
          <div className="gs-save-notice">
            <p>Join the wishlist first to save your score to the leaderboard.</p>
          </div>
        )}

        {savePhase === 'error' && (
          <div className="gs-save-notice gs-save-notice-err">
            <p>{errMsg || 'Error saving score. Try again.'}</p>
          </div>
        )}

        <div className="gs-btn-row">
          <button className="gs-cta" onClick={onPlayAgain}>PLAY AGAIN</button>
          <button className="gs-cta gs-cta-outline" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
type Phase = 'charselect' | 'intro' | 'playing' | 'stageclear' | 'victory' | 'iqresult';
interface Pos { x: number; y: number; }
interface IQResult { speed: number; accuracy: number; iq: number; percentile: number; label: string; }

interface GS {
  phase: Phase;
  stageIdx: number;
  cell: number;
  maze: number[][];
  p1: Pos; p2: Pos;
  keys: Set<string>;
  lastMove: { p1: number; p2: number };
  stageWinner: 1 | 2 | null;
  stageStartTime: number;
  p1Moves: number;
  p2Moves: number;
  optimalMoves: number;
  stageStats: StageStat[];
  elapsedMs: number;
  p1Color: string; p1Dark: string;
  p2Color: string; p2Dark: string;
}

const DEFAULT_P1 = CHARACTERS[0];
const DEFAULT_P2 = CHARACTERS[1];

function initStage(
  stageIdx: number,
  p1: Character = DEFAULT_P1,
  p2: Character = DEFAULT_P2,
): GS {
  const cfg  = BASE_STAGES[stageIdx];
  const cell = computeCell(cfg.cols, cfg.rows, cfg.maxCell);
  const seed = (Math.random() * 0xFFFFFFFF) >>> 0;
  const maze = buildMaze(cfg.cols, cfg.rows, seed);
  const opt  = bfsPathLen(maze, 1, 1, cfg.cols - 2, 1, cfg.cols, cfg.rows);
  return {
    phase: 'playing',
    stageIdx,
    cell,
    maze,
    p1: { x: 1, y: 1 },
    p2: { x: cfg.cols - 2, y: cfg.rows - 2 },
    keys: new Set(),
    lastMove: { p1: 0, p2: 0 },
    stageWinner: null,
    stageStartTime: performance.now(),
    p1Moves: 0,
    p2Moves: 0,
    optimalMoves: opt,
    stageStats: [],
    elapsedMs: 0,
    p1Color: p1.svgColor, p1Dark: p1.svgDark,
    p2Color: p2.svgColor, p2Dark: p2.svgDark,
  };
}

const INIT = initStage(0);
INIT.phase = 'charselect';

export default function BetaGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef<GS>(INIT);

  const [phase, setPhase]           = useState<Phase>('charselect');
  const [stageIdx, setStageIdx]     = useState(0);
  const [winner, setWinner]         = useState<1 | 2 | null>(null);
  const [elapsed, setElapsed]       = useState(0);
  const [iqResult, setIqResult]     = useState<IQResult | null>(null);
  const [stageStats, setStageStats] = useState<StageStat[]>([]);
  const [p1Char, setP1Char]         = useState<Character>(DEFAULT_P1);
  const [p2Char, setP2Char]         = useState<Character>(DEFAULT_P2);

  const startStage = useCallback((idx: number, prevStats: StageStat[] = [], c1 = p1Char, c2 = p2Char) => {
    const state = initStage(idx, c1, c2);
    state.stageStats = prevStats;
    gs.current = state;
    setStageIdx(idx);
    setWinner(null);
    setElapsed(0);
    setPhase('playing');
  }, [p1Char, p2Char]);

  const startGame = useCallback(() => startStage(0, [], p1Char, p2Char), [startStage, p1Char, p2Char]);

  const confirmChars = useCallback(() => {
    gs.current.p1Color = p1Char.svgColor;
    gs.current.p1Dark  = p1Char.svgDark;
    gs.current.p2Color = p2Char.svgColor;
    gs.current.p2Dark  = p2Char.svgDark;
    gs.current.phase   = 'intro';
    setPhase('intro');
  }, [p1Char, p2Char]);

  const advanceStage = useCallback(() => {
    const next  = gs.current.stageIdx + 1;
    const stats = gs.current.stageStats;
    if (next < BASE_STAGES.length) {
      startStage(next, stats, p1Char, p2Char);
    } else {
      const result = calcIQ(stats);
      setStageStats(stats);
      setIqResult(result);
      gs.current.phase = 'iqresult';
      setPhase('iqresult');
    }
  }, [startStage, p1Char, p2Char]);

  // ── Game loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let lastSecond = 0;

    const GAME_KEYS = new Set([
      'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
      'w','a','s','d','W','A','S','D',
    ]);
    const onKeyDown = (e: KeyboardEvent) => { if (GAME_KEYS.has(e.key)) e.preventDefault(); gs.current.keys.add(e.key); };
    const onKeyUp   = (e: KeyboardEvent) => gs.current.keys.delete(e.key);
    const onEsc     = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    window.addEventListener('keydown', onEsc);

    const loop = (t: number) => {
      const state = gs.current;
      const cfg   = BASE_STAGES[state.stageIdx];
      const cell  = state.cell;
      const CW    = cfg.cols * cell;
      const CH    = cfg.rows * cell;
      const exitX = cfg.cols - 2;

      if (canvas.width !== CW)  canvas.width  = CW;
      if (canvas.height !== CH) canvas.height = CH;

      if (state.phase === 'playing') {
        const { p1, p2, keys, lastMove, maze } = state;
        const now = performance.now();
        state.elapsedMs = now - state.stageStartTime;

        // Update elapsed display every second
        if (now - lastSecond > 1000) {
          setElapsed(Math.floor(state.elapsedMs));
          lastSecond = now;
        }

        // P1 — arrow keys
        if (t - lastMove.p1 > cfg.moveMs) {
          let dx = 0, dy = 0;
          if (keys.has('ArrowLeft'))       dx = -1;
          else if (keys.has('ArrowRight')) dx =  1;
          else if (keys.has('ArrowUp'))    dy = -1;
          else if (keys.has('ArrowDown'))  dy =  1;
          if (dx || dy) {
            const nx = p1.x + dx, ny = p1.y + dy;
            if (nx >= 0 && nx < cfg.cols && ny >= 0 && ny < cfg.rows && maze[ny][nx] === 0) {
              p1.x = nx; p1.y = ny; state.p1Moves++;
            }
            lastMove.p1 = t;
          }
        }

        // P2 — WASD
        if (t - lastMove.p2 > cfg.moveMs) {
          let dx = 0, dy = 0;
          if (keys.has('a') || keys.has('A'))      dx = -1;
          else if (keys.has('d') || keys.has('D')) dx =  1;
          else if (keys.has('w') || keys.has('W')) dy = -1;
          else if (keys.has('s') || keys.has('S')) dy =  1;
          if (dx || dy) {
            const nx = p2.x + dx, ny = p2.y + dy;
            if (nx >= 0 && nx < cfg.cols && ny >= 0 && ny < cfg.rows && maze[ny][nx] === 0) {
              p2.x = nx; p2.y = ny; state.p2Moves++;
            }
            lastMove.p2 = t;
          }
        }

        // Win detection
        const p1Won = p1.x === exitX && p1.y === 1;
        const p2Won = p2.x === exitX && p2.y === 1;
        if (p1Won || p2Won) {
          const w = p1Won ? 1 : 2;
          const moves = p1Won ? state.p1Moves : state.p2Moves;
          const stat: StageStat = {
            timeMs: state.elapsedMs,
            moves: Math.max(state.optimalMoves, moves),
            optimalMoves: state.optimalMoves,
            moveMs: cfg.moveMs,
          };
          const newStats = [...state.stageStats, stat];
          state.stageStats = newStats;
          state.stageWinner = w;

          const isLast = state.stageIdx === BASE_STAGES.length - 1;
          const next: Phase = isLast ? 'victory' : 'stageclear';
          state.phase = next;
          setWinner(w);
          setPhase(next);
        }
      }

      // Render
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, CW, CH);
      if (state.phase !== 'charselect' && state.phase !== 'intro') {
        renderMaze(ctx, state.maze, cfg.cols, cfg.rows, cell);
        renderExit(ctx, cfg.cols, cell, t);
        renderPixelBlob(ctx, state.p1, state.p1Color, state.p1Dark, cell);
        renderPixelBlob(ctx, state.p2, state.p2Color, state.p2Dark, cell);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  // ── IQ result trigger ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'victory') {
      const t = setTimeout(() => {
        const stats  = gs.current.stageStats;
        const result = calcIQ(stats);
        setStageStats(stats);
        setIqResult(result);
        gs.current.phase = 'iqresult';
        setPhase('iqresult');
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // ── JSX ────────────────────────────────────────────────────────────────────
  const cfg  = BASE_STAGES[stageIdx];
  const cell = gs.current.cell || computeCell(cfg.cols, cfg.rows, cfg.maxCell);
  const CW   = cfg.cols * cell;
  const CH   = cfg.rows * cell;

  return (
    <motion.div
      className="game-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="game-modal"
        initial={{ scale: 0.88, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="gm-header">
          <div className="gm-logo">
            <span className="gm-logo-name">BLOB BASH</span>
            <span className="gm-logo-badge">BETA</span>
          </div>
          <button className="gm-close" onClick={onClose} aria-label="Fermer">&#x2715;</button>
        </div>

        {/* HUD */}
        <div className="gm-hud">
          <div className="gm-player">
            <div className="gm-dot" style={{ background: p1Char.svgColor }} />
            <div>
              <div className="gm-pname">{p1Char.name} <span>P1</span></div>
              <div className="gm-pkeys">&#8592; &#8593; &#8595; &#8594;</div>
            </div>
          </div>
          <div className="gm-hud-center">
            <div className="gm-vs">VS</div>
            {phase !== 'intro' && phase !== 'iqresult' && phase !== 'charselect' && (
              <div className="gm-stage-badge">STAGE {stageIdx + 1} / {BASE_STAGES.length}</div>
            )}
            {phase === 'playing' && (
              <div className="gm-timer">{fmtTime(elapsed)}</div>
            )}
          </div>
          <div className="gm-player gm-player-r">
            <div>
              <div className="gm-pname">{p2Char.name} <span>P2</span></div>
              <div className="gm-pkeys">W &nbsp;A &nbsp;S &nbsp;D</div>
            </div>
            <div className="gm-dot" style={{ background: p2Char.svgColor }} />
          </div>
        </div>

        {/* Canvas + overlays */}
        <div className="gm-canvas-wrap">
          <canvas ref={canvasRef} width={CW} height={CH} />

          <AnimatePresence>
            {/* Character Select */}
            {phase === 'charselect' && (
              <motion.div key="charselect" className="gm-screen"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <div className="gm-screen-box cs-box">
                  <p className="gs-eyebrow">Choose Your Character</p>
                  <p className="cs-hint">
                    <span style={{ color: p1Char.svgColor }}>P1</span> left-click &nbsp;&middot;&nbsp; <span style={{ color: p2Char.svgColor }}>P2</span> right-click
                  </p>

                  <div className="cs-grid">
                    {CHARACTERS.map(ch => {
                      const isP1 = p1Char.id === ch.id;
                      const isP2 = p2Char.id === ch.id;
                      return (
                        <button
                          key={ch.id}
                          className={`cs-card${isP1 ? ' cs-card-p1' : ''}${isP2 ? ' cs-card-p2' : ''}`}
                          style={{ '--cs-color': ch.svgColor } as React.CSSProperties}
                          onClick={() => setP1Char(ch)}
                          onContextMenu={(e) => { e.preventDefault(); setP2Char(ch); }}
                        >
                          {isP1 && <span className="cs-badge cs-badge-p1" style={{ background: p1Char.svgColor }}>P1</span>}
                          {isP2 && <span className={`cs-badge cs-badge-p2${isP1 ? ' cs-badge-p2-shift' : ''}`} style={{ background: p2Char.svgColor }}>P2</span>}
                          <BlobSvg color={ch.svgColor} dark={ch.svgDark} size={48} />
                          <span className="cs-name">{ch.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button className="gs-cta" onClick={confirmChars}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    START GAME
                  </button>
                </div>
              </motion.div>
            )}

            {/* Intro */}
            {phase === 'intro' && (
              <motion.div key="intro" className="gm-screen"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <div className="gm-screen-box">
                  <p className="gs-lead">
                    Race through 3 mazes. Your <strong style={{ color: '#FFE500' }}>speed</strong> and{' '}
                    <strong style={{ color: '#FFE500' }}>path efficiency</strong> determine your IQ score.<br />
                    Reach the <span className="gs-yellow">&#9733; EXIT</span> in the <strong>top-right corner</strong> first.
                  </p>
                  <div className="gs-stages-row">
                    {BASE_STAGES.map(s => (
                      <div key={s.stage} className="gs-stage-pip">
                        <span className="gs-stage-num">{s.stage}</span>
                        <span className="gs-stage-size">{s.cols}×{s.rows}</span>
                      </div>
                    ))}
                  </div>
                  <div className="gs-ctrl-grid">
                    <div className="gs-ctrl-row">
                      <span className="gs-badge" style={{ background: p1Char.svgColor }}>P1 {p1Char.name}</span>
                      <div className="gs-keys"><kbd>&#8592;</kbd><kbd>&#8593;</kbd><kbd>&#8595;</kbd><kbd>&#8594;</kbd></div>
                    </div>
                    <div className="gs-ctrl-row">
                      <span className="gs-badge" style={{ background: p2Char.svgColor }}>P2 {p2Char.name}</span>
                      <div className="gs-keys"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div>
                    </div>
                  </div>
                  <button className="gs-cta" onClick={startGame}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    START GAME
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stage clear */}
            {phase === 'stageclear' && winner && (
              <motion.div key="stageclear" className="gm-screen"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <div className="gm-screen-box">
                  <p className="gs-eyebrow">Stage {stageIdx + 1} Complete</p>
                  <div className="gs-winner-tag" style={{ background: winner === 1 ? p1Char.svgColor : p2Char.svgColor }}>
                    {winner === 1 ? p1Char.name : p2Char.name} WINS
                  </div>
                  <div className="gs-stage-track">
                    {BASE_STAGES.map((s, i) => (
                      <div key={s.stage} className={`gs-track-pip${i <= stageIdx ? ' gs-track-done' : ''}`} />
                    ))}
                  </div>
                  <p className="gs-lead">
                    Stage {stageIdx + 2} — {BASE_STAGES[stageIdx + 1]?.cols}×{BASE_STAGES[stageIdx + 1]?.rows} maze awaits.
                  </p>
                  <div className="gs-btn-row">
                    <button className="gs-cta" onClick={advanceStage}>STAGE {stageIdx + 2} &#8594;</button>
                    <button className="gs-cta gs-cta-outline" onClick={onClose}>EXIT</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Victory (brief, then IQ screen) */}
            {phase === 'victory' && winner && (
              <motion.div key="victory" className="gm-screen"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="gm-screen-box">
                  <p className="gs-eyebrow">All 3 Stages Cleared</p>
                  <div className="gs-winner-tag" style={{ background: winner === 1 ? p1Char.svgColor : p2Char.svgColor }}>
                    {winner === 1 ? p1Char.name : p2Char.name}
                  </div>
                  <h2 className="gs-win-title">WINS!</h2>
                  <p className="gs-lead" style={{ color: 'rgba(255,229,0,.7)' }}>Calculating IQ score...</p>
                </div>
              </motion.div>
            )}

            {/* IQ Result */}
            {phase === 'iqresult' && iqResult && (
              <IQResultScreen
                iqResult={iqResult}
                stageStats={stageStats}
                onPlayAgain={() => {
                  gs.current = initStage(0, p1Char, p2Char);
                  gs.current.phase = 'charselect';
                  setStageIdx(0);
                  setWinner(null);
                  setElapsed(0);
                  setIqResult(null);
                  setPhase('charselect');
                }}
                onClose={onClose}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="gm-footer">
          <span>
            <span className="gs-yellow">&#9733; EXIT</span> is at the <strong>top-right corner</strong>
            &nbsp;&middot;&nbsp; Escape to close
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
