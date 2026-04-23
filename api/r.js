export const config = { runtime: 'edge' }

function loadingPage(destUrl) {
  const safeUrl = JSON.stringify(destUrl)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Redirecting…</title>
  <script>window.location.replace(${safeUrl})</script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      height: 100%;
      background: #0d0d1a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
    }

    /* ── Center badge ── */
    .badge {
      font-size: 56px;
      animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      margin-bottom: 14px;
    }
    @keyframes pop {
      from { transform: scale(0) rotate(-15deg); opacity: 0; }
      to   { transform: scale(1) rotate(0deg);   opacity: 1; }
    }

    .title {
      font-size: 22px;
      font-weight: 800;
      color: #22c55e;
      letter-spacing: -0.3px;
      animation: rise 0.45s ease 0.15s both;
    }
    .subtitle {
      font-size: 14px;
      color: #555;
      margin-top: 6px;
      animation: rise 0.45s ease 0.3s both;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Ground ── */
    .ground {
      position: fixed;
      bottom: 50px;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #2a2a3a 20%, #2a2a3a 80%, transparent);
    }

    /* ── Paw prints ── */
    .paws {
      position: fixed;
      bottom: 28px;
      left: 0; right: 0;
      display: flex;
      justify-content: space-around;
      padding: 0 16px;
      pointer-events: none;
    }
    .paw {
      font-size: 16px;
      opacity: 0;
      animation: paw-blink 2s linear infinite;
    }
    .paw:nth-child(1) { animation-delay: 0.0s; }
    .paw:nth-child(2) { animation-delay: 0.28s; }
    .paw:nth-child(3) { animation-delay: 0.56s; }
    .paw:nth-child(4) { animation-delay: 0.84s; }
    .paw:nth-child(5) { animation-delay: 1.12s; }
    .paw:nth-child(6) { animation-delay: 1.40s; }
    .paw:nth-child(7) { animation-delay: 1.68s; }
    @keyframes paw-blink {
      0%   { opacity: 0; }
      12%  { opacity: 0.55; }
      55%  { opacity: 0.55; }
      100% { opacity: 0; }
    }

    /* ── Cat track ── */
    .cat-track {
      position: fixed;
      bottom: 52px;
      left: 0; right: 0;
      height: 90px;
      pointer-events: none;
    }
    .cat-runner {
      position: absolute;
      bottom: 0;
      animation: run-across 2s linear infinite;
    }
    @keyframes run-across {
      from { left: -180px; }
      to   { left: calc(100vw + 70px); }
    }

    /* Cat body bob */
    .cat-svg {
      display: block;
      animation: body-bob 0.22s ease-in-out infinite alternate;
    }
    @keyframes body-bob {
      from { transform: translateY(0)   rotate(-1deg); }
      to   { transform: translateY(-7px) rotate(1deg); }
    }

    /* Legs */
    .leg-fl, .leg-fr, .leg-bl, .leg-br {
      transform-box: fill-box;
      transform-origin: 50% 0%;
    }
    .leg-fl { animation: leg-a 0.22s ease-in-out infinite alternate; }
    .leg-fr { animation: leg-b 0.22s ease-in-out infinite alternate; }
    .leg-bl { animation: leg-b 0.22s ease-in-out infinite alternate; }
    .leg-br { animation: leg-a 0.22s ease-in-out infinite alternate; }
    @keyframes leg-a {
      from { transform: rotate(-40deg); }
      to   { transform: rotate(30deg);  }
    }
    @keyframes leg-b {
      from { transform: rotate(30deg);  }
      to   { transform: rotate(-40deg); }
    }

    /* Tail */
    .tail-grp {
      transform-box: fill-box;
      transform-origin: 100% 100%;
      animation: tail-wag 0.44s ease-in-out infinite alternate;
    }
    @keyframes tail-wag {
      from { transform: rotate(-22deg); }
      to   { transform: rotate(18deg);  }
    }
  </style>
</head>
<body>

  <div class="badge">✅</div>
  <div class="title">Scan counted!</div>
  <div class="subtitle">Taking you to the event…</div>

  <!-- Paw prints -->
  <div class="paws">
    <span class="paw">🐾</span><span class="paw">🐾</span>
    <span class="paw">🐾</span><span class="paw">🐾</span>
    <span class="paw">🐾</span><span class="paw">🐾</span>
    <span class="paw">🐾</span>
  </div>

  <div class="ground"></div>

  <!-- Running wildcat -->
  <div class="cat-track">
    <div class="cat-runner">
      <svg class="cat-svg" width="165" height="88"
           viewBox="0 0 165 88" xmlns="http://www.w3.org/2000/svg">

        <!-- Ground shadow -->
        <ellipse cx="82" cy="86" rx="42" ry="5" fill="rgba(0,0,0,0.2)"/>

        <!-- Back legs (behind body) -->
        <g class="leg-bl">
          <rect x="46" y="54" width="12" height="26" rx="6" fill="#c8751e"/>
          <ellipse cx="52" cy="80" rx="10" ry="5.5" fill="#c8751e"/>
        </g>
        <g class="leg-br">
          <rect x="61" y="54" width="12" height="26" rx="6" fill="#b06018"/>
          <ellipse cx="67" cy="80" rx="10" ry="5.5" fill="#b06018"/>
        </g>

        <!-- Tail -->
        <g class="tail-grp">
          <path d="M 27,52 C 10,46 4,30 10,12 Q 15,3 22,8"
                stroke="#e8892e" stroke-width="10" fill="none"
                stroke-linecap="round"/>
          <circle cx="22" cy="9" r="7.5" fill="#e8892e"/>
        </g>

        <!-- Body -->
        <ellipse cx="80" cy="48" rx="40" ry="23" fill="#e8892e"/>

        <!-- Belly -->
        <ellipse cx="80" cy="54" rx="24" ry="15" fill="#f4b06a" opacity="0.45"/>

        <!-- Body stripes -->
        <path d="M 63,28 Q 60,48 63,68" stroke="#c87828"
              stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.65"/>
        <path d="M 76,26 Q 73,48 76,70" stroke="#c87828"
              stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.65"/>
        <path d="M 89,27 Q 86,48 89,69" stroke="#c87828"
              stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.65"/>

        <!-- Front legs (in front of body) -->
        <g class="leg-fl">
          <rect x="96" y="60" width="12" height="24" rx="6" fill="#e8892e"/>
          <ellipse cx="102" cy="84" rx="10" ry="5.5" fill="#e8892e"/>
        </g>
        <g class="leg-fr">
          <rect x="111" y="60" width="12" height="24" rx="6" fill="#d07828"/>
          <ellipse cx="117" cy="84" rx="10" ry="5.5" fill="#d07828"/>
        </g>

        <!-- Neck -->
        <ellipse cx="116" cy="40" rx="15" ry="13" fill="#e8892e"/>

        <!-- Head -->
        <circle cx="129" cy="27" r="23" fill="#e8892e"/>

        <!-- Face highlight -->
        <circle cx="129" cy="27" r="17" fill="#f4a050" opacity="0.22"/>

        <!-- Ears -->
        <polygon points="114,13 108,1 121,10"  fill="#e8892e"/>
        <polygon points="115,13 110,4 119,10"  fill="#d4937a"/>
        <polygon points="137,10 142,0 149,12"  fill="#e8892e"/>
        <polygon points="138,10 142,3 147,11"  fill="#d4937a"/>

        <!-- Eyes -->
        <ellipse cx="122" cy="24" rx="4.5" ry="5"   fill="#1a0800"/>
        <ellipse cx="136" cy="24" rx="4.5" ry="5"   fill="#1a0800"/>
        <ellipse cx="122" cy="24" rx="2.8" ry="3.8" fill="#3a8c3f"/>
        <ellipse cx="136" cy="24" rx="2.8" ry="3.8" fill="#3a8c3f"/>
        <ellipse cx="122" cy="24" rx="1.4" ry="2.8" fill="#080400"/>
        <ellipse cx="136" cy="24" rx="1.4" ry="2.8" fill="#080400"/>
        <circle  cx="123.5" cy="22" r="1.2" fill="white"/>
        <circle  cx="137.5" cy="22" r="1.2" fill="white"/>

        <!-- Determined brows -->
        <path d="M 118,18 Q 122,16 126,18"
              stroke="#c07020" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 132,18 Q 136,16 140,18"
              stroke="#c07020" stroke-width="2" fill="none" stroke-linecap="round"/>

        <!-- Nose -->
        <ellipse cx="129" cy="31" rx="3.5" ry="2.8" fill="#e05080"/>

        <!-- Mouth -->
        <path d="M 125.5,33.5 Q 129,37.5 132.5,33.5"
              stroke="#c04060" stroke-width="1.6" fill="none" stroke-linecap="round"/>

        <!-- Whiskers -->
        <line x1="103" y1="30" x2="122" y2="32"
              stroke="rgba(255,255,255,0.65)" stroke-width="1.1"/>
        <line x1="103" y1="34" x2="122" y2="34"
              stroke="rgba(255,255,255,0.65)" stroke-width="1.1"/>
        <line x1="136" y1="32" x2="155" y2="30"
              stroke="rgba(255,255,255,0.65)" stroke-width="1.1"/>
        <line x1="136" y1="34" x2="155" y2="34"
              stroke="rgba(255,255,255,0.65)" stroke-width="1.1"/>

        <!-- Speed lines -->
        <line x1="0" y1="36" x2="28" y2="36"
              stroke="rgba(232,137,46,0.45)" stroke-width="3" stroke-linecap="round"/>
        <line x1="4" y1="46" x2="24" y2="46"
              stroke="rgba(232,137,46,0.3)"  stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="56" x2="20" y2="56"
              stroke="rgba(232,137,46,0.18)" stroke-width="1.5" stroke-linecap="round"/>

      </svg>
    </div>
  </div>

</body>
</html>`
}

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

  const htmlResponse = (destUrl) =>
    new Response(loadingPage(destUrl), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })

  try {
    // Try atomic RPC first
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ event_id: id, scan_mode: 'in' }),
    })

    if (rpcRes.ok) {
      const data = await rpcRes.json()
      const event = Array.isArray(data) ? data[0] : data
      if (event?.url) return htmlResponse(event.url)
    }

    // Fallback: fetch + update
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/events?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
      { headers }
    )
    const events = await getRes.json()
    const event = events?.[0]

    if (event?.url) {
      await fetch(
        `${supabaseUrl}/rest/v1/events?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: { ...headers, Prefer: 'return=minimal' },
          body: JSON.stringify({ scan_count: (event.scan_count ?? 0) + 1 }),
        }
      ).catch(() => {})
      return htmlResponse(event.url)
    }
  } catch {}

  return Response.redirect(home, 302)
}
