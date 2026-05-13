import { useState, useRef } from 'react'
import jsQR from 'jsqr'

export default function CreateEvent({ onAdd }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [qrError, setQrError] = useState('')
  const [qrSuccess, setQrSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const canSubmit = name.trim() && url.trim()

  const submit = () => {
    if (!canSubmit) return
    let finalUrl = url.trim()
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl
    onAdd(name.trim(), finalUrl)
    setName('')
    setUrl('')
    setQrSuccess(false)
    setQrError('')
  }

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setQrError('')
    setQrSuccess(false)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data) {
        setUrl(code.data)
        setQrSuccess(true)
      } else {
        setQrError('No QR code found in this image. Try a clearer photo.')
      }
    }
    img.onerror = () => setQrError('Could not read the image file.')
    img.src = URL.createObjectURL(file)

    e.target.value = ''
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
        onChange={(e) => { setUrl(e.target.value); setQrSuccess(false) }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />

      <button
        className="btn-secondary"
        style={{ marginBottom: '8px', width: '100%' }}
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        Upload QR Code Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleQrUpload}
      />

      {qrSuccess && (
        <p style={{ color: '#22c55e', fontSize: '0.85rem', marginBottom: '12px' }}>
          QR decoded — URL filled in below.
        </p>
      )}
      {qrError && (
        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>
          {qrError}
        </p>
      )}

      <button className="btn-primary" disabled={!canSubmit} onClick={submit}>
        Generate QR Code
      </button>
    </div>
  )
}
