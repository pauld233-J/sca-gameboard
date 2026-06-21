import type { GuildConfig, ExpeditionConfig } from './types'

export const SHEET_ID = '1XjBaKDGYfQlM4oHsoTVEO-absmPERQO7LS9_AGLXcLg'
export const REFRESH_MS = 5 * 60 * 1000
export const MAX_SEASON = 1260
export const BOARD_MAX = 41
export const FINISH_IDX = 42
export const BOSS_INDICES = new Set([6, 13, 20, 27, 34, 41])

export const EXPEDITION_CONFIGS: ExpeditionConfig[] = [
  { name: 'Forces',               color: '#0096C7', icon: '⬆',  badgeFile: 'Forces and Motion Badge.png' },
  { name: 'Energy',               color: '#F9C74F', icon: '⚡',  badgeFile: 'Energy Badge.png' },
  { name: 'Waves',                color: '#00B4D8', icon: '〰',  badgeFile: 'Waves Badge.png' },
  { name: 'Space',                color: '#9D4EDD', icon: '🪐',  badgeFile: 'Space Badge.png' },
  { name: "Earth's History",      color: '#A0522D', icon: '🪨',  badgeFile: 'Earth History Badge.png' },
  { name: 'Evolution & Genetics', color: '#2DC653', icon: '🧬',  badgeFile: 'Evoluton Genetics Badge.png' },
]

export interface Rank {
  level: number
  name: string
  threshold: number
}

export const RANKS: Rank[] = [
  { level: 1, name: 'Novice',       threshold: 0 },
  { level: 2, name: 'Apprentice',   threshold: 180 },
  { level: 3, name: 'Scholar',      threshold: 360 },
  { level: 4, name: 'Researcher',   threshold: 540 },
  { level: 5, name: 'Expert',       threshold: 756 },
  { level: 6, name: 'Master',       threshold: 1008 },
  { level: 7, name: 'Grand Sage',   threshold: 1260 },
]

export function getGuildRank(seasonTotal: number): Rank {
  let current = RANKS[0]
  for (const r of RANKS) {
    if (seasonTotal >= r.threshold) current = r
    else break
  }
  return current
}

export const GUILD_CONFIGS: GuildConfig[] = [
  { name: 'Helix',   color: '#00B4D8', colorAlpha: 'rgba(0,180,216,0.6)',   emoji: '🧬', initials: 'HX' },
  { name: 'Nova',    color: '#9D4EDD', colorAlpha: 'rgba(157,78,221,0.6)',  emoji: '⭐', initials: 'NV' },
  { name: 'Titan',   color: '#F4511E', colorAlpha: 'rgba(244,81,30,0.6)',   emoji: '⚡', initials: 'TN' },
  { name: 'Quantum', color: '#F9C74F', colorAlpha: 'rgba(249,199,79,0.6)',  emoji: '⚛', initials: 'QT' },
]
