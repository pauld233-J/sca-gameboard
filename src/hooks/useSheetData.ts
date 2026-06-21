import { useState, useEffect, useCallback } from 'react'
import type { Guild, Expedition } from '../types'
import { SHEET_ID, GUILD_CONFIGS, EXPEDITION_CONFIGS, REFRESH_MS } from '../constants'
import { calcGuildPosition } from '../utils/board'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GvizRow = { c: ({ v: unknown } | null)[] }

async function fetchGviz(sheet: string, range: string): Promise<{ table: { rows: GvizRow[] } }> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?sheet=${encodeURIComponent(sheet)}&range=${range}&tqx=out:json`
  const res = await fetch(url)
  const text = await res.text()
  const start = text.indexOf('(') + 1
  const end = text.lastIndexOf(')')
  return JSON.parse(text.slice(start, end)) as { table: { rows: GvizRow[] } }
}

function cell(row: GvizRow, idx: number): unknown {
  return row?.c?.[idx]?.v ?? null
}

function parseGuilds(rows: GvizRow[]): Guild[] {
  return rows.map((row, i) => {
    const name = String(cell(row, 0) ?? '')
    const identity = String(cell(row, 1) ?? '')
    const seasonTotal = Number(cell(row, 8) ?? 0)
    const standing = Number(cell(row, 9) ?? i + 1)
    const config = GUILD_CONFIGS.find(g => g.name === name) ?? GUILD_CONFIGS[i % GUILD_CONFIGS.length]
    return { ...config, name, identity, seasonTotal, standing, position: calcGuildPosition(seasonTotal) }
  })
}

function parseExpeditions(rows: GvizRow[]): Expedition[] {
  return rows.map((row, i) => {
    const order = Number(cell(row, 0) ?? i + 1)
    const name = String(cell(row, 1) ?? '')
    const divisionName = String(cell(row, 2) ?? '')
    const rawStatus = String(cell(row, 3) ?? 'Locked')
    const status = (['Current', 'Completed', 'Locked'].includes(rawStatus)
      ? rawStatus
      : 'Locked') as Expedition['status']
    const bossBattle = String(cell(row, 4) ?? '')
    const classProgress = Number(cell(row, 5) ?? 0)
    const config = EXPEDITION_CONFIGS[order - 1] ?? EXPEDITION_CONFIGS[i % EXPEDITION_CONFIGS.length]
    return { ...config, order, name, divisionName, status, bossBattle, classProgress }
  })
}

export function useSheetData() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [expeditions, setExpeditions] = useState<Expedition[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const [guildResp, expedResp] = await Promise.all([
        fetchGviz('Guild Scoreboard', 'A5:J8'),
        fetchGviz('Class Gameboard', 'A5:G10'),
      ])
      setGuilds(parseGuilds(guildResp.table?.rows ?? []))
      setExpeditions(parseExpeditions(expedResp.table?.rows ?? []))
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { guilds, expeditions, lastRefresh, loading, error, refresh }
}
