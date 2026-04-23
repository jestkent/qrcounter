import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import ManualEntry from './ManualEntry.jsx'

export default function Scanner({ events, onMatch, onNoMatch }) {
  const scannerRef = useRef(null)
  const cooldownRef = useRef(false)
  const [status, setStatus] = useState('starting')
  const [lastResult, setLastResult] = useState(null)
  const [mode, setMode] = useState('in')
  const [flash, setFlash] = useState(null) // 'success' | 'fail' | null
  const modeRef = useRef('in')

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  const triggerFeedback = (success) => {
    setFlash(success ? 'success' : 'fail')
    setTimeout(() => setFlash(null), 600)
    if (navigator.vibrate) {
      navigator.vibrate(success ? 100 : [100, 60, 100])
    }
  }

  useEffect(() => {
    const scannerId = 'qr-reader'
    let html5Qr = null

    const startScanner = async () => {
      try {
        html5Qr = new Html5Qrcode(scannerId)
        scannerRef.current = html5Qr

        const handleDecoded = async (decodedText) => {
          if (cooldownRef.current) return
          cooldownRef.current = true
          setLastResult(decodedText)

          let matchValue = decodedText
          try {
            const parsed = new URL(decodedText)
            const id = parsed.searchParams.get('id')
            if (parsed.pathname === '/r' && id) matchValue = id
          } catch {}

          const found = await onMatch(matchValue, modeRef.current)
          if (found) {
            triggerFeedback(true)
          } else {
            triggerFeedback(false)
            onNoMatch()
          }

          setTimeout(() => {
            cooldownRef.current = false
          }, 2000)
        }

        await html5Qr.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            void handleDecoded(decodedText)
          },
          () => {}
        )

        setStatus('scanning')
      } catch (err) {
        console.error('Scanner error:', err)
        setStatus('error')
      }
    }

    startScanner()

    return () => {
      if (html5Qr && html5Qr.isScanning) {
        html5Qr.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div>
      {flash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: flash === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
            pointerEvents: 'none',
            zIndex: 999,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      <h1 className="page-title">Scan QR</h1>
      <p className="page-sub">Point camera at an event QR code</p>

      <div className="scan-toggle">
        <button
          className={`toggle-btn ${mode === 'in' ? 'toggle-in active' : 'toggle-in'}`}
          onClick={() => setMode('in')}
        >
          ↓ Check In
        </button>
        <button
          className={`toggle-btn ${mode === 'out' ? 'toggle-out active' : 'toggle-out'}`}
          onClick={() => setMode('out')}
        >
          ↑ Check Out
        </button>
      </div>

      <div
        id="qr-reader"
        style={{
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      />

      {status === 'starting' && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Starting camera...
        </p>
      )}

      {status === 'error' && (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-icon">📷</div>
          <p className="empty-title">Camera not available</p>
          <p className="empty-text" style={{ lineHeight: 1.5 }}>
            Allow camera access and reload, or use the manual counter below.
          </p>
        </div>
      )}

      {lastResult && (
        <div className="scan-result">
          <span className="scan-result-label">Last scanned: </span>
          <span className="scan-result-value">{lastResult}</span>
        </div>
      )}

      <ManualEntry events={events} onMatch={(val) => onMatch(val, mode)} />
    </div>
  )
}
