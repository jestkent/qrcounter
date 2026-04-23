import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { formatDate } from '../utils/storage.js'

export default function EventDetail({ event, onBack, onDelete, onReset }) {
  const canvasRef = useRef(null)

  const redirectUrl = `${window.location.origin}/r?id=${event.id}`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, redirectUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#1a1a2e',
          light: '#f0f0f0',
        },
      })
    }
  }, [event.url])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `${event.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div>
      <button className="btn-secondary btn-back" onClick={onBack}>
        ← Back
      </button>

      <h1 className="page-title">{event.name}</h1>
      <p className="page-sub">{event.url}</p>

      <div className="qr-box">
        <canvas ref={canvasRef} style={{ borderRadius: 8 }} />
      </div>

      <div className="counter-display">
        <div className="counter-number">{event.count}</div>
        <div className="counter-label">Total Scans</div>
      </div>

      <div className="inout-stats">
        <div className="inout-box inout-in">
          <div className="inout-number">{event.checkInCount ?? 0}</div>
          <div className="inout-label">↓ Check In</div>
        </div>
        <div className="inout-box inout-present">
          <div className="inout-number">{Math.max(0, (event.checkInCount ?? 0) - (event.checkOutCount ?? 0))}</div>
          <div className="inout-label">Inside Now</div>
        </div>
        <div className="inout-box inout-out">
          <div className="inout-number">{event.checkOutCount ?? 0}</div>
          <div className="inout-label">↑ Check Out</div>
        </div>
      </div>

      <div className="detail-date">Created {formatDate(event.createdAt)}</div>

      <div className="detail-actions">
        <button className="btn-secondary" onClick={downloadQR}>
          Download QR
        </button>
        <button className="btn-secondary" onClick={() => onReset(event.id)}>
          Reset Counter
        </button>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm('Delete this event?')) onDelete(event.id)
          }}
        >
          Delete
        </button>
      </div>

      <p className="detail-hint">
        Any camera scan → opens event page &amp; counts.
        <br />
        App scanner → counts only.
      </p>
    </div>
  )
}
