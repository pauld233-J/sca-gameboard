import type { Expedition } from '../types'

interface Props {
  expeditions: Expedition[]
}

function ExpeditionCard({ exp }: { exp: Expedition }) {
  return (
    <div
      className="exp-sidebar-card"
      style={{ borderLeftColor: exp.color }}
      data-status={exp.status}
    >
      <div className="exp-sidebar-header">
        <span className="exp-sidebar-icon">{exp.icon}</span>
        <div className="exp-sidebar-info">
          <span className="exp-sidebar-name" style={{ color: exp.color }}>{exp.name}</span>
          <span className="status-pill" data-status={exp.status}>{exp.status}</span>
        </div>
      </div>
      {exp.divisionName && (
        <div className="exp-sidebar-division">{exp.divisionName}</div>
      )}
      {exp.bossBattle && (
        <div className="exp-sidebar-boss">⚔ {exp.bossBattle}</div>
      )}
      {exp.classProgress > 0 && (
        <div className="exp-sidebar-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, exp.classProgress)}%`, background: exp.color }}
            />
          </div>
          <span className="exp-progress-label">{exp.classProgress}%</span>
        </div>
      )}
    </div>
  )
}

export default function ExpeditionSidebar({ expeditions }: Props) {
  return (
    <div className="expedition-sidebar">
      <h3 className="expedition-sidebar-heading">EXPEDITIONS</h3>
      {expeditions.length === 0 ? (
        <p className="sb-empty">Loading…</p>
      ) : (
        expeditions.map(exp => <ExpeditionCard key={exp.order} exp={exp} />)
      )}
    </div>
  )
}
