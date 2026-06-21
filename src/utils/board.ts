import { BOARD_MAX, MAX_SEASON, FINISH_IDX } from '../constants'

export function indexToGrid(index: number): { row: number; col: number } {
  const row = Math.floor(index / 7)
  const col = row % 2 === 0 ? index % 7 : 6 - (index % 7)
  return { row, col }
}

export function gridToIndex(row: number, col: number): number | null {
  if (row === 6 && col !== 0) return null
  const index = row % 2 === 0 ? row * 7 + col : row * 7 + (6 - col)
  return index <= FINISH_IDX ? index : null
}

export function expeditionIndexForSpace(spaceIdx: number): number {
  return Math.min(Math.floor(spaceIdx / 7), 5)
}

export function calcGuildPosition(seasonTotal: number): number {
  return Math.min(Math.round((seasonTotal / MAX_SEASON) * BOARD_MAX), BOARD_MAX)
}
