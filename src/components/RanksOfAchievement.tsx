import type { Guild } from '../types'
import { RANKS } from '../constants'

interface Props {
  guilds: Guild[]
}

export default function RanksOfAchievement({ guilds }: Props) {
  const maxTotal = guilds.length > 0 ? Math.max(...guilds.map(g => g.seasonTotal)) : 0

  return (
    <div className="ranks-container">
      <h3 className="ranks-heading">✦ RANKS OF ACHIEVEMENT ✦</h3>
      <div className="ranks-row">
        {RANKS.map(rank => {
          const achieved = maxTotal >= rank.threshold
          return (
            <div key={rank.level} className={`rank-item${achieved ? ' achieved' : ''}`}>
              <span className="rank-level">{rank.level}</span>
              <span className="rank-name">{rank.name}</span>
              <span className="rank-pts">{rank.threshold} pts</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
