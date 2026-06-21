import type { Guild } from '../types'
import { MAX_SEASON } from '../constants'

interface Props {
  guilds: Guild[]
}

function ProgressBar({
  value,
  max,
  color,
  useGradient = false,
}: {
  value: number
  max: number
  color: string
  useGradient?: boolean
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const fill = useGradient
    ? 'linear-gradient(90deg, var(--teal), var(--gold-rich))'
    : color
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%`, background: fill }} />
    </div>
  )
}

function GuildCard({ guild, rank }: { guild: Guild; rank: number }) {
  const pct = Math.min(100, Math.round((guild.seasonTotal / MAX_SEASON) * 100))
  return (
    <div className="guild-card" style={{ borderLeftColor: guild.color }}>
      <div className="guild-card-header">
        <div
          className="guild-emblem"
          style={{ background: guild.colorAlpha, borderColor: guild.color }}
        >
          {guild.emoji}
        </div>
        <div className="guild-info">
          <div className="guild-rank-row">
            <span className="guild-rank" style={{ color: guild.color }}>#{rank}</span>
            <span className="guild-name" style={{ color: guild.color }}>{guild.name}</span>
          </div>
          <span className="guild-identity">{guild.identity}</span>
        </div>
      </div>
      <ProgressBar value={guild.seasonTotal} max={MAX_SEASON} color={guild.color} useGradient />
      <div className="guild-stats">
        <span>⭐ {guild.seasonTotal.toLocaleString()} pts</span>
        <span>📍 Space #{guild.position + 1}</span>
        <span>{pct}%</span>
      </div>
    </div>
  )
}


export default function Scoreboard({ guilds }: Props) {
  const sortedGuilds = [...guilds].sort((a, b) => b.seasonTotal - a.seasonTotal)

  return (
    <div className="scoreboard">
      <section className="sb-section">
        <h2 className="sb-heading">⚔ GUILDS</h2>
        {sortedGuilds.length === 0 ? (
          <p className="sb-empty">Loading guild data…</p>
        ) : (
          sortedGuilds.map((guild, i) => (
            <GuildCard key={guild.name} guild={guild} rank={i + 1} />
          ))
        )}
      </section>
    </div>
  )
}
