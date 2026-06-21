import { useEffect, useState } from 'react'
import { REFRESH_MS, EXPEDITION_CONFIGS } from '../constants'

function BadgeImg({ badgeFile, fallback }: { badgeFile: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span style={{ fontSize: 20 }}>{fallback}</span>
  return (
    <img
      src={`${import.meta.env.BASE_URL}badges/${badgeFile}`}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
      onError={() => setFailed(true)}
    />
  )
}

interface Props {
  lastRefresh: Date | null
  onRefresh: () => void
}

function useCountdown(lastRefresh: Date | null) {
  const [display, setDisplay] = useState('5:00')
  useEffect(() => {
    function tick() {
      if (!lastRefresh) { setDisplay('--:--'); return }
      const remaining = Math.max(0, lastRefresh.getTime() + REFRESH_MS - Date.now())
      const m = Math.floor(remaining / 60000)
      const s = Math.floor((remaining % 60000) / 1000)
      setDisplay(`${m}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lastRefresh])
  return display
}

export default function Header({ lastRefresh, onRefresh }: Props) {
  const countdown = useCountdown(lastRefresh)
  const [logoHidden, setLogoHidden] = useState(false)

  return (
    <header className="header">
      {/* Left: Logo + Title */}
      <div className="header-left">
        <div className="header-logo-wrap">
          {!logoHidden ? (
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="SCA"
              className="header-logo-img"
              onError={() => setLogoHidden(true)}
            />
          ) : (
            <div className="header-hex-logo">
              <span className="header-hex-star">✦</span>
            </div>
          )}
        </div>
        <div className="header-title-block">
          <span className="header-sca">SCA</span>
          <span className="header-subtitle">SCIENTIFIC EXPEDITION</span>
          <span className="header-tagline">— MASTERING CREATION THROUGH SCIENCE —</span>
        </div>
      </div>

      {/* Center: Boss hexagons */}
      <div className="header-boss-hexes">
        {EXPEDITION_CONFIGS.map(exp => (
          <div className="boss-hex-item" key={exp.name}>
            <div className="boss-hex" style={{ '--hex-color': exp.color } as React.CSSProperties}>
              <BadgeImg badgeFile={exp.badgeFile} fallback={exp.icon} />
            </div>
            <span className="boss-hex-label">{exp.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Right: Countdown + Refresh */}
      <div className="header-right">
        <span className="header-countdown">
          <span className="countdown-label">Next refresh</span>
          <strong className="countdown-time">{countdown}</strong>
        </span>
        <button className="refresh-btn" onClick={onRefresh}>↻ Refresh</button>
      </div>
    </header>
  )
}
