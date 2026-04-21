import { useState } from 'react'

export default function CreateEvent({ onAdd }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const canSubmit = name.trim() && url.trim()

  const submit = () => {
    if (!canSubmit) return
    let finalUrl = url.trim()
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl
    onAdd(name.trim(), finalUrl)
    setName('')
    setUrl('')
  }

  return (
    <div>
      <h1 className="page-title">Create Event</h1>
      <p className="page-sub">Generate a trackable QR code for your event</p>

      <label className="form-label">Event Name</label>
      <input
        className="form-input"
        placeholder="e.g. Science Fair 2026"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="form-label">Destination URL</label>
      <input
        className="form-input"
        placeholder="e.g. school-website.com/event"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />

      <button className="btn-primary" disabled={!canSubmit} onClick={submit}>
        Generate QR Code
      </button>
    </div>
  )
}
