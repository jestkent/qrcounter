import { useState } from 'react'

export default function ManualEntry({ events, onMatch }) {
  const [open, setOpen] = useState(false)

  if (events.length === 0) return null

  return (
    <div className="manual-section">
      <button className="btn-secondary" onClick={() => setOpen(!open)}>
        {open ? 'Hide manual counter' : 'Manual counter ↓'}
      </button>

      {open && (
        <div style={{ marginTop: 12 }}>
          {events.map((e) => (
            <div key={e.id} className="manual-card">
              <div>
                <div className="manual-card-name">{e.name}</div>
                <div className="manual-card-count">{e.count} scans</div>
              </div>
              <button className="btn-accent-outline" onClick={() => onMatch(e.id)}>
                +1
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
