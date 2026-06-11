export interface Character {
  id: number;
  name: string;
  role: string;
  tag: string;
  color: string;
  svgColor: string;
  svgDark: string;
  stats: { str: number; spd: number; goo: number };
}

export interface Feature {
  id: number;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface RoadmapItem {
  id: number;
  quarter: string;
  title: string;
  detail: string;
  done: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  region: string;
  iq: number;
  time: string;
  blobId: number;
}

export interface ScorePayload {
  email: string;
  iq: number;
  time_seconds: number;
  time_display: string;
}

export interface ScoreResponse {
  message: string;
  name?: string;
  iq?: number;
  rank?: number;
  improved?: boolean;
  code?: string;
}

export interface PressQuote {
  id: number;
  quote: string;
  score: string;
  source: string;
}

export interface WishlistPayload {
  email: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
