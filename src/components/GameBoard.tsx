import { useState } from 'react'
import type { Guild, Expedition } from '../types'
import { BOSS_INDICES, FINISH_IDX, EXPEDITION_CONFIGS } from '../constants'

interface Props {
  guilds: Guild[]
  expeditions: Expedition[]
}

// ── SVG layout constants ──────────────────────────────────
const SVG_W = 752
const SVG_H = 725
const SX = 40   // left margin
const SY = 65   // top margin (room for BOSS label above row-0 nodes)
const DX = 112  // horizontal node spacing
const DY = 100  // vertical row spacing

function nodePos(index: number): { x: number; y: number } {
  const row = Math.floor(index / 7)
  const col = row % 2 === 0 ? index % 7 : 6 - (index % 7)
  return { x: SX + col * DX, y: SY + row * DY }
}

// 4-quadrant stagger for shared spaces
const STAGGER: [number, number][] = [[-22, -22], [22, -22], [-22, 22], [22, 22]]
function guildOffset(i: number, total: number): [number, number] {
  return total <= 1 ? [0, 0] : STAGGER[i % 4]
}

function useZone(idx: number, expeditions: Expedition[]) {
  const ei = Math.min(Math.floor(idx / 7), 5)
  const exp = expeditions[ei]
  const cfg = EXPEDITION_CONFIGS[ei]
  return {
    color:     exp?.color     ?? cfg.color,
    icon:      exp?.icon      ?? cfg.icon,
    name:      exp?.name      ?? cfg.name,
    badgeFile: cfg.badgeFile,
  }
}

function SvgBadge({ badgeFile, fallback, x, y, r, clipId }: {
  badgeFile: string; fallback: string
  x: number; y: number; r: number; clipId: string
}) {
  const [failed, setFailed] = useState(false)
  const base = import.meta.env.BASE_URL
  if (failed || !badgeFile) {
    return <text x={x} y={y + 8} textAnchor="middle" fontSize="20">{fallback}</text>
  }
  return (
    <image
      href={`${base}badges/${badgeFile}`}
      x={x - r} y={y - r} width={r * 2} height={r * 2}
      clipPath={`url(#${clipId})`}
      preserveAspectRatio="xMidYMid meet"
      onError={() => setFailed(true)}
    />
  )
}


export default function GameBoard({ guilds, expeditions }: Props) {
  // Build position → guilds map
  const byPos = new Map<number, Guild[]>()
  for (const g of guilds) {
    const list = byPos.get(g.position) ?? []
    list.push(g)
    byPos.set(g.position, list)
  }

  return (
    <div className="board-container">
      <div className="board-svg-wrapper">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width="100%"
          height="auto"
          className="board-svg"
          aria-label="SCA Scientific Expedition gameboard"
        >
          <defs>
            {/* Boss node fill */}
            <radialGradient id="bossGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#ff7043" />
              <stop offset="100%" stopColor="#7b1200" />
            </radialGradient>
            {/* Boss glow filter */}
            <filter id="bossGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Token glow filter */}
            <filter id="tokenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Dashed path between consecutive nodes ── */}
          {Array.from({ length: 42 }, (_, i) => {
            const a = nodePos(i)
            const b = nodePos(i + 1)
            return (
              <line
                key={i}
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
                stroke="#4dd0e1"
                strokeWidth="4"
                strokeDasharray="9 7"
                opacity="0.55"
              />
            )
          })}

          {/* ── Nodes ── */}
          {Array.from({ length: 43 }, (_, idx) => {
            const pos = nodePos(idx)
            const isBoss   = BOSS_INDICES.has(idx)
            const isStart  = idx === 0
            const isFinish = idx === FINISH_IDX
            const zone     = useZone(idx, expeditions)
            const here     = byPos.get(idx) ?? []

            return (
              <g key={idx}>
                {/* ── BOSS node ── */}
                {isBoss && (
                  <>
                    <text
                      x={pos.x} y={pos.y - 34}
                      textAnchor="middle" fontSize="8"
                      fontFamily="Orbitron, sans-serif" fontWeight="900"
                      fill="#d4af37" letterSpacing="2"
                    >BOSS</text>
                    <circle
                      cx={pos.x} cy={pos.y} r={28}
                      fill="url(#bossGrad)"
                      stroke={zone.color} strokeWidth="3"
                      filter="url(#bossGlow)"
                    />
                    <clipPath id={`bossClip${idx}`}>
                      <circle cx={pos.x} cy={pos.y} r={25} />
                    </clipPath>
                    <SvgBadge
                      badgeFile={zone.badgeFile ?? ''}
                      fallback={zone.icon}
                      x={pos.x} y={pos.y} r={25}
                      clipId={`bossClip${idx}`}
                    />
                    <text
                      x={pos.x} y={pos.y + 45}
                      textAnchor="middle" fontSize="8"
                      fontFamily="Orbitron, sans-serif"
                      fill="#ffffff" opacity="0.9"
                    >{zone.name}</text>
                  </>
                )}

                {/* ── START node ── */}
                {isStart && (
                  <>
                    <text
                      x={pos.x} y={pos.y - 28}
                      textAnchor="middle" fontSize="8"
                      fontFamily="Orbitron, sans-serif" fontWeight="900"
                      fill="#2DC653" letterSpacing="1"
                    >START</text>
                    <circle
                      cx={pos.x} cy={pos.y} r={22}
                      fill="rgba(20,70,20,0.9)"
                      stroke="#2DC653" strokeWidth="3"
                    />
                    <text x={pos.x} y={pos.y + 8} textAnchor="middle" fontSize="18">▶</text>
                  </>
                )}

                {/* ── FINISH node ── */}
                {isFinish && (
                  <>
                    <text
                      x={pos.x} y={pos.y - 29}
                      textAnchor="middle" fontSize="8"
                      fontFamily="Orbitron, sans-serif" fontWeight="900"
                      fill="#d4af37" letterSpacing="1"
                    >FINISH</text>
                    <circle
                      cx={pos.x} cy={pos.y} r={22}
                      fill="rgba(140,110,0,0.25)"
                      stroke="#d4af37" strokeWidth="3"
                    />
                    <text x={pos.x} y={pos.y + 9} textAnchor="middle" fontSize="20">🏆</text>
                  </>
                )}

                {/* ── Normal node ── */}
                {!isBoss && !isStart && !isFinish && (
                  <>
                    <circle
                      cx={pos.x} cy={pos.y} r={18}
                      fill="rgba(18,36,90,0.88)"
                      stroke={zone.color} strokeWidth="2"
                    />
                    <text
                      x={pos.x} y={pos.y + 5}
                      textAnchor="middle" fontSize="11"
                      fontFamily="Orbitron, sans-serif" fontWeight="bold"
                      fill="#ffffff"
                    >{idx}</text>
                  </>
                )}

                {/* ── Guild tokens ── */}
                {here.map((guild, gi) => {
                  const [ox, oy] = guildOffset(gi, here.length)
                  const tx = pos.x + ox
                  const ty = pos.y + oy
                  return (
                    <g key={guild.name} filter="url(#tokenGlow)">
                      <circle
                        cx={tx} cy={ty} r={16}
                        fill={guild.color}
                        stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
                      />
                      <text x={tx} y={ty - 2} textAnchor="middle" fontSize="13">
                        {guild.emoji}
                      </text>
                      <text
                        x={tx} y={ty + 9}
                        textAnchor="middle" fontSize="6"
                        fontFamily="Orbitron, sans-serif" fontWeight="700"
                        fill="#fff" letterSpacing="0.5"
                      >{guild.initials}</text>
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

    </div>
  )
}
