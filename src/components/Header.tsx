import { useEffect, useState } from 'react'
import { REFRESH_MS } from '../constants'

interface Props {
  lastRefresh: Date | null
  onRefresh: () => void
}

function useCountdown(lastRefresh: Date | null) {
  const [display, setDisplay] = useState('5:00')

  useEffect(() => {
    function tick() {
      if (!lastRefresh) {
        setDisplay('--:--')
        return
      }
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

  return (
    <header className="header">
      <div className="header-left">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="SCA Logo"
          className="header-logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <h1 className="header-title">Scientific Expedition Gameboard</h1>
      </div>
      <div className="header-right">
        <span className="header-countdown">
          Next refresh: <strong>{countdown}</strong>
        </span>
        <button className="refresh-btn" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>
    </header>
  )
}
