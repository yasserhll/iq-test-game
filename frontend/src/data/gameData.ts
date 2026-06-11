import type { Character, Feature, RoadmapItem, PressQuote } from '../types';

export const FEATURES: Feature[] = [
  {
    id: 1,
    number: '01',
    title: '4-Player Co-op',
    description: 'Team up locally or online. Coordinate your goo attacks or just smash everything — both strategies are equally valid.',
    icon: 'users',
  },
  {
    id: 2,
    number: '02',
    title: '16 Goo Zones',
    description: 'From the Goo Sewers to the Slime Towers, every level drips with unique mechanics that change how you fight.',
    icon: 'map',
  },
  {
    id: 3,
    number: '03',
    title: 'Goo Finishers',
    description: '48 unique moves, chain combos, and unleash devastating Goo Finishers that drown the screen in beautiful chaos.',
    icon: 'zap',
  },
];

export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'GLOOB',
    role: 'The Tank',
    tag: 'Blob #001',
    color: '#3d9bff',
    svgColor: '#2ecc40',
    svgDark: '#1aab2e',
    stats: { str: 90, spd: 40, goo: 75 },
  },
  {
    id: 2,
    name: 'SPLATTY',
    role: 'The Speedster',
    tag: 'Blob #002',
    color: '#ff5555',
    svgColor: '#ff2d55',
    svgDark: '#b01f3b',
    stats: { str: 50, spd: 95, goo: 60 },
  },
  {
    id: 3,
    name: 'OOZARA',
    role: 'The Mage',
    tag: 'Blob #003',
    color: '#9b59b6',
    svgColor: '#8e44ad',
    svgDark: '#6c3483',
    stats: { str: 35, spd: 65, goo: 100 },
  },
  {
    id: 4,
    name: 'BLOBZILLA',
    role: 'The Boss',
    tag: 'Blob #???',
    color: '#f39c12',
    svgColor: '#f1c40f',
    svgDark: '#b7950b',
    stats: { str: 100, spd: 70, goo: 100 },
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    id: 1,
    quarter: 'Q1 2026',
    title: 'Alpha Build',
    detail: 'Core combat, 4 playable blobs, 3 test zones. Internal testing live.',
    done: true,
  },
  {
    id: 2,
    quarter: 'Q2 2026',
    title: 'Beta Access',
    detail: 'Wishlist backers get early access. All 16 zones + online multiplayer.',
    done: true,
  },
  {
    id: 3,
    quarter: 'Q3 2026',
    title: 'Gold Master',
    detail: 'Final polish, console cert, launch trailer, press embargo lifts.',
    done: false,
  },
  {
    id: 4,
    quarter: 'Q4 2026',
    title: 'Launch Day',
    detail: 'Global release on PC, PS5, Xbox Series & Switch. Time to bash!',
    done: false,
  },
];

export const PRESS_QUOTES: PressQuote[] = [
  { id: 1, quote: '"The most disgusting fun I\'ve had in years. I need a shower and a sequel."', score: '9.5', source: 'Game Slime Weekly' },
  { id: 2, quote: '"Finally, a co-op brawler that rewards chaos as much as teamwork."', score: '9.0', source: 'Pixel Press' },
  { id: 3, quote: '"Every pixel oozes with personality. Gloob is my new best friend."', score: '8.8', source: 'Retro Gamer Mag' },
  { id: 4, quote: '"Blob Bash is what happens when you give geniuses too much time and goo."', score: '9.2', source: 'IndieSpot' },
];

export const TICKER_ITEMS = [
  'BLOB BASH', '4-PLAYER CO-OP', '16 CHAOS LEVELS',
  'PC + CONSOLES', 'FALL 2026', 'RATED G FOR GOO', 'WISHLIST NOW',
];
