import type { Guild } from '../types'

interface Props {
  guild: Guild
  offsetX?: number
  offsetY?: number
}

export default function GuildPiece({ guild, offsetX = 0, offsetY = 0 }: Props) {
  return (
    <div
      className="guild-piece"
      title={`${guild.name} — ${guild.seasonTotal} pts`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: guild.color,
        boxShadow: `0 0 8px ${guild.color}, 0 0 2px rgba(0,0,0,0.6)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        cursor: 'default',
        userSelect: 'none',
        border: '1.5px solid rgba(255,255,255,0.25)',
      }}
    >
      <span style={{ fontSize: 13, lineHeight: 1 }}>{guild.emoji}</span>
      <span
        style={{
          fontSize: 6.5,
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.5px',
          lineHeight: 1.2,
        }}
      >
        {guild.initials}
      </span>
    </div>
  )
}
