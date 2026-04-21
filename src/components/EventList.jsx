import { formatDate } from '../utils/storage.js'

export default function EventList({ events, onSelect, onCreate }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <p className="empty-title">No events yet</p>
        <p className="empty-text">Create your first QR-tracked event</p>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '12px 32px', display: 'inline-block' }}
          onClick={onCreate}
        >
          + Create Event
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Your Events</h1>
      <p className="page-sub">
        {events.length} event{events.length !== 1 ? 's' : ''} tracked
      </p>
      {events.map((e) => (
        <div key={e.id} className="event-card" onClick={() => onSelect(e)}>
          <div className="card-top">
            <div>
              <div className="card-name">{e.name}</div>
              <div className="card-url">{e.url}</div>
            </div>
            <div className="badge">{e.count}</div>
          </div>
          <div className="card-date">Created {formatDate(e.createdAt)}</div>
        </div>
      ))}
    </div>
  )
}
