import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY = 'qr-counter-events'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

function loadLocalEvents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveLocalEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('Failed to save events locally:', e)
  }
}

function normalizeRow(row) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    count: row.scan_count ?? 0,
    checkInCount: row.check_in_count ?? 0,
    checkOutCount: row.check_out_count ?? 0,
    createdAt: row.created_at,
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabase)
}

export async function loadEvents() {
  if (!supabase) return loadLocalEvents()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase load failed, using local data:', error)
    return loadLocalEvents()
  }

  const events = (data || []).map(normalizeRow)
  saveLocalEvents(events)
  return events
}

export async function createEvent(event) {
  if (!supabase) {
    const current = loadLocalEvents()
    const updated = [event, ...current]
    saveLocalEvents(updated)
    return event
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      id: event.id,
      name: event.name,
      url: event.url,
      scan_count: event.count,
      created_at: event.createdAt,
    })
    .select('*')
    .single()

  if (error) throw error

  const saved = normalizeRow(data)
  const current = loadLocalEvents().filter((item) => item.id !== saved.id)
  saveLocalEvents([saved, ...current])
  return saved
}

export async function incrementEventByMatch(value, mode = 'in') {
  if (!supabase) {
    const current = loadLocalEvents()
    let found = null
    const updated = current.map((item) => {
      if (item.id === value || item.url === value) {
        found = {
          ...item,
          count: item.count + 1,
          checkInCount: mode === 'in' ? (item.checkInCount ?? 0) + 1 : (item.checkInCount ?? 0),
          checkOutCount: mode === 'out' ? (item.checkOutCount ?? 0) + 1 : (item.checkOutCount ?? 0),
        }
        return found
      }
      return item
    })
    if (found) saveLocalEvents(updated)
    return found
  }

  let { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', value)
    .limit(1)

  if (error) throw error

  if (!data || data.length === 0) {
    const second = await supabase
      .from('events')
      .select('*')
      .eq('url', value)
      .limit(1)
    data = second.data
    if (second.error) throw second.error
  }

  if (!data || data.length === 0) return null

  const row = data[0]

  // Try atomic RPC first (race-condition safe for simultaneous scans)
  const { data: rpcData, error: rpcError } = await supabase
    .rpc('increment_scan', { event_id: row.id, scan_mode: mode })

  let updatedRow
  if (!rpcError && rpcData?.[0]) {
    updatedRow = rpcData[0]
  } else {
    // Fallback: direct update (run the SQL function in Supabase to enable atomic mode)
    const hasInOut = row.check_in_count !== undefined
    const updateData = { scan_count: (row.scan_count ?? 0) + 1 }
    if (hasInOut) {
      updateData.check_in_count = (row.check_in_count ?? 0) + (mode === 'in' ? 1 : 0)
      updateData.check_out_count = (row.check_out_count ?? 0) + (mode === 'out' ? 1 : 0)
    }
    const { data: fallbackRow, error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', row.id)
      .select('*')
      .single()
    if (updateError) throw updateError
    updatedRow = fallbackRow
  }

  const updated = normalizeRow(updatedRow)
  const current = loadLocalEvents().map((item) => (item.id === updated.id ? updated : item))
  saveLocalEvents(current)
  return updated
}

export async function resetEventCount(id) {
  if (!supabase) {
    const current = loadLocalEvents()
    let found = null
    const updated = current.map((item) => {
      if (item.id === id) {
        found = { ...item, count: 0, checkInCount: 0, checkOutCount: 0 }
        return found
      }
      return item
    })
    if (found) saveLocalEvents(updated)
    return found
  }

  const { data: existing } = await supabase.from('events').select('*').eq('id', id).single()
  const hasInOut = existing && existing.check_in_count !== undefined

  const updateData = { scan_count: 0 }
  if (hasInOut) {
    updateData.check_in_count = 0
    updateData.check_out_count = 0
  }

  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error

  const updated = normalizeRow(data)
  const current = loadLocalEvents().map((item) => (item.id === updated.id ? updated : item))
  saveLocalEvents(current)
  return updated
}

export async function deleteEvent(id) {
  if (!supabase) {
    const current = loadLocalEvents()
    const updated = current.filter((item) => item.id !== id)
    saveLocalEvents(updated)
    return
  }

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error

  const current = loadLocalEvents()
  saveLocalEvents(current.filter((item) => item.id !== id))
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
