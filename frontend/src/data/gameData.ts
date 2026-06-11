import type { Character, Feature, RoadmapItem, PressQuote, LeaderboardEntry } from '../types';

export const FEATURES: Feature[] = [
  {
    id: 1,
    number: '01',
    title: 'Real IQ Scoring',
    description: 'Your maze completion time and path efficiency are processed through a log-normal cognitive model — the same statistical framework used in standardized spatial reasoning tests.',
    icon: 'users',
  },
  {
    id: 2,
    number: '02',
    title: '3 Escalating Stages',
    description: 'Start with the 21×21 warm-up, survive the 29×29 maze, then conquer the brutal 37×37 labyrinth. Each stage demands sharper spatial reasoning than the last.',
    icon: 'map',
  },
  {
    id: 3,
    number: '03',
    title: '2-Player Race Mode',
    description: 'Challenge a friend on the same keyboard — P1 uses arrow keys, P2 uses WASD. The first blob to reach the EXIT wins the stage and earns the IQ crown.',
    icon: 'zap',
  },
];

export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'GLOOB',
    role: 'The Navigator',
    tag: 'Blob #001',
    color: '#3d9bff',
    svgColor: '#2ecc40',
    svgDark: '#1aab2e',
    stats: { str: 88, spd: 62, goo: 74 },
  },
  {
    id: 2,
    name: 'SPLATTY',
    role: 'The Speedster',
    tag: 'Blob #002',
    color: '#ff5555',
    svgColor: '#ff2d55',
    svgDark: '#b01f3b',
    stats: { str: 55, spd: 97, goo: 48 },
  },
  {
    id: 3,
    name: 'OOZARA',
    role: 'The Analyst',
    tag: 'Blob #003',
    color: '#9b59b6',
    svgColor: '#8e44ad',
    svgDark: '#6c3483',
    stats: { str: 42, spd: 58, goo: 100 },
  },
  {
    id: 4,
    name: 'BLOBZILLA',
    role: 'The Boss',
    tag: 'Blob #???',
    color: '#f39c12',
    svgColor: '#f1c40f',
    svgDark: '#b7950b',
    stats: { str: 100, spd: 72, goo: 100 },
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    id: 1,
    quarter: 'Q1 2026',
    title: 'Prototype',
    detail: 'Single-stage maze with basic IQ scoring engine. Fixed seed maze, dual player input, internal playtesting.',
    done: true,
  },
  {
    id: 2,
    quarter: 'Q2 2026',
    title: 'Beta Live',
    detail: 'Full 3-stage system, Processing Speed + Spatial Accuracy metrics, pixel art blobs, IQ result screen.',
    done: true,
  },
  {
    id: 3,
    quarter: 'Q3 2026',
    title: 'Global Leaderboard',
    detail: 'Submit your IQ score to a worldwide ranking. Daily challenge mazes with fresh seeds every 24h.',
    done: false,
  },
  {
    id: 4,
    quarter: 'Q4 2026',
    title: 'Online Multiplayer',
    detail: 'Race strangers worldwide in real time. Cross-region IQ tournaments with elimination brackets.',
    done: false,
  },
];

export const PRESS_QUOTES: PressQuote[] = [
  {
    id: 1,
    quote: '"I tested my IQ and scored 127. Then my 10-year-old sat down and got 135. We no longer speak."',
    score: '9.5',
    source: 'Dad Gaming Daily',
  },
  {
    id: 2,
    quote: '"Three hours of maze solving and I finally cracked Superior range. Cannot. Stop. Playing."',
    score: '9.1',
    source: 'Pixel Press',
  },
  {
    id: 3,
    quote: '"The most addictive IQ test ever disguised as a blob game. Science should be illegal."',
    score: '9.3',
    source: 'IndieSpot',
  },
  {
    id: 4,
    quote: '"My therapist told me to stop. I scored 142. I am now my own therapist."',
    score: '10',
    source: 'Blob Brain Gazette',
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  name: 'NeuralNinja',  region: 'JP', iq: 148, time: '2:34', blobId: 2 },
  { rank: 2,  name: 'MazeMaster',   region: 'DE', iq: 145, time: '2:41', blobId: 1 },
  { rank: 3,  name: 'BlobCrusher',  region: 'US', iq: 142, time: '2:58', blobId: 3 },
  { rank: 4,  name: 'SpatialKing',  region: 'KR', iq: 139, time: '3:12', blobId: 1 },
  { rank: 5,  name: 'QuickBrain',   region: 'FR', iq: 137, time: '3:28', blobId: 4 },
  { rank: 6,  name: 'PuzzlePro',    region: 'BR', iq: 135, time: '3:45', blobId: 2 },
  { rank: 7,  name: 'IQHunter',     region: 'AU', iq: 132, time: '3:57', blobId: 3 },
  { rank: 8,  name: 'MazeRacer',    region: 'GB', iq: 130, time: '4:02', blobId: 1 },
  { rank: 9,  name: 'LogicLord',    region: 'CA', iq: 128, time: '4:18', blobId: 4 },
  { rank: 10, name: 'BrainBlast',   region: 'IT', iq: 125, time: '4:33', blobId: 2 },
];

export const TICKER_ITEMS = [
  'BLOB BASH', 'IQ MAZE CHALLENGE', '3 STAGES', 'PC KEYBOARD REQUIRED',
  'TEST YOUR BRAIN', 'FALL 2026', 'RATED G FOR GOO', 'WISHLIST NOW',
];
