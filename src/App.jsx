import { useState, useEffect, useCallback } from 'react'
import {
  loadEvents,
  createEvent,
  incrementEventByMatch,
  resetEventCount,
  deleteEvent,
  generateId,
  isSupabaseConfigured,
} from './utils/storage.js'
import Header from './components/Header.jsx'
import EventList from './components/EventList.jsx'
import CreateEvent from './components/CreateEvent.jsx'
import EventDetail from './components/EventDetail.jsx'
import Scanner from './components/Scanner.jsx'
import Toast from './components/Toast.jsx'
import './App.css'

export default function App() {
  const [view, setView] = useState('list')
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(
    window.location.pathname === '/r'
  )

  useEffect(() => {
    if (window.location.pathname === '/r') {
      const id = new URLSearchParams(window.location.search).get('id')
      if (id) {
        incrementEventByMatch(id)
          .then((found) => {
            if (found?.url) {
              window.location.replace(found.url)
            } else {
              window.history.replaceState({}, '', '/')
              setIsRedirecting(false)
              setLoading(false)
            }
          })
          .catch(() => {
            window.history.replaceState({}, '', '/')
            setIsRedirecting(false)
            setLoading(false)
          })
        return
      }
    }

    const init = async () => {
      try {
        const loaded = await loadEvents()
        setEvents(loaded)
      } catch (error) {
        console.error('Failed to load events:', error)
        showToast('Could not load events')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const addEvent = async (name, url) => {
    const ev = {
      id: generateId(),
      name,
      url,
      count: 0,
      createdAt: new Date().toISOString(),
    }

    try {
      const saved = await createEvent(ev)
      setEvents((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)])
      setSelected(saved)
      setView('detail')
      showToast('Event created!')
    } catch (error) {
      console.error('Failed to create event:', error)
      showToast('Could not create event')
    }
  }

  const increment = useCallback(
    async (value) => {
      try {
        const found = await incrementEventByMatch(value)
        if (found) {
          setEvents((prev) => prev.map((item) => (item.id === found.id ? found : item)))
          setSelected(found)
          showToast(`+1 scan for "${found.name}" (${found.count})`)
          return found
        }
      } catch (error) {
        console.error('Failed to increment event:', error)
        showToast('Could not update counter')
      }
      return null
    },
    []
  )

  const removeEvent = async (id) => {
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((item) => item.id !== id))
      setSelected(null)
      setView('list')
      showToast('Event deleted')
    } catch (error) {
      console.error('Failed to delete event:', error)
      showToast('Could not delete event')
    }
  }

  const resetCount = async (id) => {
    try {
      const found = await resetEventCount(id)
      if (found) {
        setEvents((prev) => prev.map((item) => (item.id === found.id ? found : item)))
        setSelected(found)
        showToast('Counter reset')
      }
    } catch (error) {
      console.error('Failed to reset counter:', error)
      showToast('Could not reset counter')
    }
  }

  if (isRedirecting) {
    return (
      <div className="app">
        <main className="main">
          <div className="empty-state" style={{ padding: '32px 20px' }}>
            <p className="empty-title">Redirecting...</p>
            <p className="empty-text">Taking you to the event page.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        view={view}
        onNavigate={(v) => {
          setView(v)
          if (v !== 'detail') setSelected(null)
        }}
      />

      <main className="main">
        {loading && (
          <div className="empty-state" style={{ padding: '32px 20px' }}>
            <p className="empty-title">Loading events...</p>
            <p className="empty-text">
              {isSupabaseConfigured()
                ? 'Syncing with Supabase.'
                : 'Using local storage. Add Supabase env vars to sync online.'}
            </p>
          </div>
        )}

        {!loading && view === 'list' && (
          <EventList
            events={events}
            onSelect={(e) => {
              setSelected(e)
              setView('detail')
            }}
            onCreate={() => setView('create')}
          />
        )}

        {!loading && view === 'create' && <CreateEvent onAdd={addEvent} />}

        {!loading && view === 'scan' && (
          <Scanner
            events={events}
            onMatch={increment}
            onNoMatch={() => showToast('No matching event found')}
          />
        )}

        {!loading && view === 'detail' && selected && (
          <EventDetail
            event={selected}
            onBack={() => setView('list')}
            onDelete={removeEvent}
            onReset={resetCount}
          />
        )}
      </main>

      {toast && <Toast message={toast} />}
    </div>
  )
}
