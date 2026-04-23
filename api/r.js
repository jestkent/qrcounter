export const config = { runtime: 'edge' }

export default async function handler(request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const home = 'https://qrcountercbq.vercel.app'

  if (!id) return Response.redirect(home, 302)

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return Response.redirect(home, 302)

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  }

  try {
    // Try atomic RPC first — single round trip, race-condition safe
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ event_id: id, scan_mode: 'in' }),
    })

    if (rpcRes.ok) {
      const data = await rpcRes.json()
      const event = Array.isArray(data) ? data[0] : data
      if (event?.url) return Response.redirect(event.url, 302)
    }

    // Fallback: fetch event URL, then increment separately
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/events?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
      { headers }
    )
    const events = await getRes.json()
    const event = events?.[0]

    if (event?.url) {
      // Await the update so it completes before the edge function exits
      await fetch(
        `${supabaseUrl}/rest/v1/events?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: { ...headers, Prefer: 'return=minimal' },
          body: JSON.stringify({ scan_count: (event.scan_count ?? 0) + 1 }),
        }
      ).catch(() => {})

      return Response.redirect(event.url, 302)
    }
  } catch {}

  return Response.redirect(home, 302)
}
