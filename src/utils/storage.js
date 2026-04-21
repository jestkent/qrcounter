const STORAGE_KEY = 'qr-counter-events'

export function loadEvents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('Failed to save events:', e)
  }
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
