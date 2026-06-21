import type { GuildConfig, ExpeditionConfig } from './types'

export const SHEET_ID = '1XjBaKDGYfQlM4oHsoTVEO-absmPERQO7LS9_AGLXcLg'
export const REFRESH_MS = 5 * 60 * 1000
export const MAX_SEASON = 1260
export const BOARD_MAX = 41
export const FINISH_IDX = 42
export const BOSS_INDICES = new Set([6, 13, 20, 27, 34, 41])

export const EXPEDITION_CONFIGS: ExpeditionConfig[] = [
  { name: 'Forces',               color: '#0096C7', icon: '⬆',  badgeFile: 'forces.png' },
  { name: 'Energy',               color: '#F9C74F', icon: '⚡',  badgeFile: 'energy.png' },
  { name: 'Waves',                color: '#00B4D8', icon: '〰',  badgeFile: 'waves.png' },
  { name: 'Space',                color: '#9D4EDD', icon: '🪐',  badgeFile: 'space.png' },
  { name: "Earth's History",      color: '#A0522D', icon: '🪨',  badgeFile: 'earth_s_history.png' },
  { name: 'Evolution & Genetics', color: '#2DC653', icon: '🧬',  badgeFile: 'evolution___genetics.png' },
]

export const GUILD_CONFIGS: GuildConfig[] = [
  { name: 'Helix',   color: '#00B4D8', colorAlpha: 'rgba(0,180,216,0.6)',   emoji: '🧬', initials: 'HX' },
  { name: 'Nova',    color: '#9D4EDD', colorAlpha: 'rgba(157,78,221,0.6)',  emoji: '⭐', initials: 'NV' },
  { name: 'Titan',   color: '#F4511E', colorAlpha: 'rgba(244,81,30,0.6)',   emoji: '⚡', initials: 'TN' },
  { name: 'Quantum', color: '#F9C74F', colorAlpha: 'rgba(249,199,79,0.6)',  emoji: '⚛', initials: 'QT' },
]
