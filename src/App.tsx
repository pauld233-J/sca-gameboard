import { useSheetData } from './hooks/useSheetData'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import Scoreboard from './components/Scoreboard'
import RanksOfAchievement from './components/RanksOfAchievement'

export default function App() {
  const { guilds, expeditions, lastRefresh, loading, error, refresh } = useSheetData()

  return (
    <div className="app">
      <Header lastRefresh={lastRefresh} onRefresh={refresh} />
      {error && <div className="error-banner">⚠ Data error: {error}</div>}
      <RanksOfAchievement guilds={guilds} />
      <main className={`app-layout${loading ? ' loading' : ''}`}>
        <div className="board-section">
          <GameBoard guilds={guilds} expeditions={expeditions} />
        </div>
        <div className="scoreboard-section">
          <Scoreboard guilds={guilds} expeditions={expeditions} />
        </div>
      </main>
    </div>
  )
}
