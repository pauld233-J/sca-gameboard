import type { Guild, Expedition } from '../types'
import { BOSS_INDICES, FINISH_IDX, EXPEDITION_CONFIGS } from '../constants'
import { gridToIndex, expeditionIndexForSpace } from '../utils/board'
import GuildPiece from './GuildPiece'

interface Props {
  guilds: Guild[]
  expeditions: Expedition[]
}

const STAGGER: [number, number][] = [[-9, -9], [9, -9], [-9, 9], [9, 9]]

function getStagger(idx: number, total: number): [number, number] {
  if (total <= 1) return [0, 0]
  return STAGGER[idx % 4]
}

interface SpaceCellProps {
  spaceIdx: number
  guildsHere: Guild[]
  expeditions: Expedition[]
}

function SpaceCell({ spaceIdx, guildsHere, expeditions }: SpaceCellProps) {
  const isStart = spaceIdx === 0
  const isFinish = spaceIdx === FINISH_IDX
  const isBoss = BOSS_INDICES.has(spaceIdx)
  const expIdx = isFinish ? -1 : expeditionIndexForSpace(spaceIdx)
  const expConfig = expIdx >= 0 ? (expeditions[expIdx] ?? EXPEDITION_CONFIGS[expIdx]) : null
  const zoneColor = expConfig?.color ?? '#F9C74F'

  let bgColor = 'var(--navy-light)'
  let borderStyle: React.CSSProperties = {}
  let shadow = ''

  if (isStart) {
    bgColor = 'rgba(45,198,83,0.18)'
    borderStyle = { border: '2px solid #2DC653' }
  } else if (isFinish) {
    bgColor = 'rgba(249,199,79,0.18)'
    borderStyle = { border: '2px solid var(--gold)' }
  } else if (isBoss) {
    bgColor = `${zoneColor}18`
    borderStyle = { border: `2px solid ${zoneColor}` }
    shadow = `0 0 14px ${zoneColor}88, inset 0 0 8px ${zoneColor}22`
  } else {
    borderStyle = { borderLeft: `3px solid ${zoneColor}` }
  }

  return (
    <div
      className={`space-cell${isBoss ? ' boss-space' : ''}${isStart ? ' start-space' : ''}${isFinish ? ' finish-space' : ''}`}
      style={{
        background: bgColor,
        boxShadow: shadow || undefined,
        position: 'relative',
        overflow: 'visible',
        ...borderStyle,
      }}
    >
      {isStart && (
        <div className="space-label start-label">
          <span>START</span>
          <span style={{ fontSize: 14 }}>▶</span>
        </div>
      )}

      {isFinish && (
        <div className="space-label finish-label">
          <span style={{ fontSize: 14 }}>🏆</span>
          <span>FINISH</span>
        </div>
      )}

      {isBoss && expConfig && (
        <div className="boss-content">
          <img
            src={`${import.meta.env.BASE_URL}badges/${expConfig.badgeFile}`}
            alt=""
            className="boss-badge-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <span className="boss-icon">{expConfig.icon}</span>
          <span className="boss-text">BOSS</span>
          <span className="boss-name" style={{ color: zoneColor }}>{expConfig.name}</span>
        </div>
      )}

      {!isStart && !isFinish && !isBoss && (
        <div className="normal-space-content">
          <span className="space-dot" style={{ background: zoneColor }} />
          <span className="space-num">{spaceIdx}</span>
        </div>
      )}

      {guildsHere.map((guild, i) => {
        const [ox, oy] = getStagger(i, guildsHere.length)
        return <GuildPiece key={guild.name} guild={guild} offsetX={ox} offsetY={oy} />
      })}
    </div>
  )
}

function ExpeditionLegend({ expeditions }: { expeditions: Expedition[] }) {
  const items = EXPEDITION_CONFIGS.map((cfg, i) => {
    const data = expeditions.find(e => e.order === i + 1)
    return { ...cfg, status: data?.status ?? 'Locked' as const }
  })

  return (
    <div className="expedition-legend">
      {items.map(exp => (
        <div key={exp.name} className="legend-item">
          <span className="legend-icon">{exp.icon}</span>
          <span className="legend-name">{exp.name}</span>
          <span
            className="status-pill"
            data-status={exp.status}
          >
            {exp.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function GameBoard({ guilds, expeditions }: Props) {
  // Build map: position → guilds
  const byPosition = new Map<number, Guild[]>()
  for (const guild of guilds) {
    const list = byPosition.get(guild.position) ?? []
    list.push(guild)
    byPosition.set(guild.position, list)
  }

  // Build 7×7 grid of space indices
  const cells: (number | null)[][] = Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => gridToIndex(row, col)),
  )

  return (
    <div className="board-container">
      <div className="board-grid">
        {cells.flatMap((row, rowIdx) =>
          row.map((spaceIdx, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="board-cell"
              style={{ gridRow: rowIdx + 1, gridColumn: colIdx + 1 }}
            >
              {spaceIdx !== null ? (
                <SpaceCell
                  spaceIdx={spaceIdx}
                  guildsHere={byPosition.get(spaceIdx) ?? []}
                  expeditions={expeditions}
                />
              ) : (
                <div className="empty-cell" />
              )}
            </div>
          )),
        )}
      </div>
      <ExpeditionLegend expeditions={expeditions} />
    </div>
  )
}
