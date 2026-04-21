import { useState, useEffect, useCallback } from 'react'
import { loadEvents, saveEvents, generateId } from './utils/storage.js'
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

  useEffect(() => {
    setEvents(loadEvents())
  }, [])

  const save = (updated) => {
    setEvents(updated)
    saveEvents(updated)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const addEvent = (name, url) => {
    const ev = {
      id: generateId(),
      name,
      url,
      count: 0,
      createdAt: new Date().toISOString(),
    }
    const updated = [ev, ...events]
    save(updated)
    setSelected(ev)
    setView('detail')
    showToast('Event created!')
  }

  const increment = useCallback(
    (value) => {
      let found = null
      const updated = events.map((e) => {
        if (e.id === value || e.url === value) {
          found = { ...e, count: e.count + 1 }
          return found
        }
        return e
      })
      if (found) {
        save(updated)
        setSelected(found)
        showToast(`+1 scan for "${found.name}" (${found.count})`)
        return found
      }
      return null
    },
    [events]
  )

  const deleteEvent = (id) => {
    save(events.filter((e) => e.id !== id))
    setView('list')
    showToast('Event deleted')
  }

  const resetCount = (id) => {
    let found = null
    const updated = events.map((e) => {
      if (e.id === id) {
        found = { ...e, count: 0 }
        return found
      }
      return e
    })
    if (found) {
      save(updated)
      setSelected(found)
      showToast('Counter reset')
    }
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
        {view === 'list' && (
          <EventList
            events={events}
            onSelect={(e) => {
              setSelected(e)
              setView('detail')
            }}
            onCreate={() => setView('create')}
          />
        )}

        {view === 'create' && <CreateEvent onAdd={addEvent} />}

        {view === 'scan' && (
          <Scanner
            events={events}
            onMatch={increment}
            onNoMatch={() => showToast('No matching event found')}
          />
        )}

        {view === 'detail' && selected && (
          <EventDetail
            event={selected}
            onBack={() => setView('list')}
            onDelete={deleteEvent}
            onReset={resetCount}
          />
        )}
      </main>

      {toast && <Toast message={toast} />}
    </div>
  )
}
