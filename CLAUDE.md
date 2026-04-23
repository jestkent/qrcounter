# CLAUDE.md

## Project Snapshot
- App: QR Counter (React + Vite)
- Live URL: https://qrcountercbq.vercel.app
- Deployed via: Vercel CLI (`npx vercel --prod`) — NOT connected to GitHub auto-deploy
- Local dev URL: http://localhost:5174/

## What Was Implemented

### 1) Supabase Integration (with fallback)
- Added `@supabase/supabase-js` dependency.
- Reworked storage layer to support async Supabase CRUD.
- Kept localStorage as automatic fallback when env vars are missing or Supabase fails.
- All queries use `select('*')` so the app works even if optional columns don't exist yet.
- Inserts never explicitly set `check_in_count`/`check_out_count` — relies on DB defaults.
- Updates for in/out counts are conditional: only applied if those columns exist in the fetched row.

Changed file:
- `src/utils/storage.js`

Key behavior in storage layer:
- Reads env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Creates a Supabase client only when both vars exist.
- Exposes async functions used by the app:
  - `loadEvents()`
  - `createEvent(event)`
  - `incrementEventByMatch(value, mode = 'in')` — mode is 'in' or 'out'
  - `resetEventCount(id)` — resets scan_count, check_in_count, check_out_count to 0
  - `deleteEvent(id)`
- Maintains local cache via localStorage for resilience.

### 2) App Flow Updated to Async Persistence
- Replaced sync local save flow with async storage calls.
- Added loading state during initial data fetch.
- Added error handling + toast feedback around create/increment/reset/delete.
- Toast message shows "Check In" or "Check Out" label based on scan mode.

Changed file:
- `src/App.jsx`

### 3) Smart QR Redirect (/r route)
- QR codes no longer encode the destination URL directly.
- QR codes now encode `https://qrcountercbq.vercel.app/r?id=EVENT_ID`.
- When a normal phone camera scans the QR:
  - Browser opens `/r?id=EVENT_ID`
  - App increments count (defaults to 'in' mode)
  - Immediately redirects to `event.url` (the real destination)
- When the app's built-in scanner scans the same QR:
  - Extracts event ID from the redirect URL
  - Increments count with the current toggle mode (in/out)
  - Does NOT redirect — stays in app
- `vercel.json` added to rewrite all routes to `index.html` for SPA support.

Changed files:
- `src/App.jsx` (redirect handler on mount)
- `src/components/EventDetail.jsx` (QR code uses redirect URL)
- `src/components/Scanner.jsx` (extracts ID from redirect URL)
- `vercel.json` (new file)

### 4) Check In / Check Out Scanner Toggle
- Scanner has a two-button toggle: `[ ↓ Check In ] [ ↑ Check Out ]`
- Mode persists while scanner is open (flip once, scan many).
- Scans are recorded as check-in or check-out in Supabase.
- Mode is tracked via `modeRef` (not state) so the scanner's `useEffect` closure always reads the latest value without needing to restart the camera.

Changed file:
- `src/components/Scanner.jsx`

### 5) Scan Feedback (Vibration + Flash)
- Check In success → green screen flash + short vibration (100ms).
- Check Out success → red screen flash + short vibration (100ms).
- No match → red screen flash + double vibration ([100, 60, 100]ms).
- Vibration uses `navigator.vibrate` — works on Android, not supported on iOS.
- `triggerFeedback` is stored as a `useRef` (not a plain function) so the scanner's closed-over `useEffect` always calls the latest version — fixes stale closure bug that prevented vibration from firing.

Changed file:
- `src/components/Scanner.jsx`

### 6) Vibration Toggle
- Checkbox below the scanner: "Vibration (disable to save battery)"
- Enabled by default.
- Preference saved to `localStorage` key `vibrate` ('on'/'off') — persists across sessions.
- Read via `vibrateRef` inside the feedback function so it's always current without restarting the scanner.

Changed file:
- `src/components/Scanner.jsx`

### 7) In/Out Stats on Event Detail
- Event detail page shows three stat boxes:
  - **Check In** (green) — total check-ins
  - **Inside Now** (accent) — check-ins minus check-outs
  - **Check Out** (red) — total check-outs
- Total Scans counter still shown above.
- Stats show 0 gracefully if `check_in_count`/`check_out_count` columns don't exist yet.

Changed file:
- `src/components/EventDetail.jsx`

### 8) Atomic Increment (Race-Condition Safe)
- `incrementEventByMatch` now tries a Supabase RPC call (`increment_scan`) first.
- RPC does the `scan_count + 1` increment atomically in the database — safe for simultaneous scans from multiple devices.
- Falls back to the old read-then-write method if the RPC function doesn't exist yet.
- This means two people scanning at the exact same moment will both be counted correctly.

Changed file:
- `src/utils/storage.js`

### 9) Environment + Security Hygiene
- `.env` is gitignored and never committed.
- `.env.example` is the template.
- Vercel has env vars set via dashboard (Production + Preview).

## Supabase Details
- Project ID: `ssovivfxmffdoxjfmvcq`
- URL: `https://ssovivfxmffdoxjfmvcq.supabase.co`
- Anon key is set in local `.env` and in Vercel environment variables.

## Pending SQL (run in Supabase SQL Editor)

### Step 1 — Add in/out columns (required for Check In/Out tracking):
```sql
alter table public.events add column if not exists check_in_count integer not null default 0;
alter table public.events add column if not exists check_out_count integer not null default 0;
```

### Step 2 — Create atomic increment function (required for concurrent-safe counting):
```sql
create or replace function increment_scan(event_id text, scan_mode text)
returns setof events language plpgsql as $$
begin
  update events set
    scan_count = scan_count + 1,
    check_in_count = case when scan_mode = 'in' then check_in_count + 1 else check_in_count end,
    check_out_count = case when scan_mode = 'out' then check_out_count + 1 else check_out_count end
  where id = event_id;
  return query select * from events where id = event_id;
end;
$$;
```

> The app works without both SQL steps but with degraded functionality:
> - Without Step 1: in/out stats always show 0.
> - Without Step 2: simultaneous scans from multiple devices may lose counts.

## Current Data Model
Table: `public.events`
- `id` text primary key
- `name` text not null
- `url` text not null — the destination URL (where phone scans redirect to)
- `scan_count` integer not null default 0 — total scans
- `check_in_count` integer not null default 0 — added via Step 1 SQL above
- `check_out_count` integer not null default 0 — added via Step 1 SQL above
- `created_at` timestamptz not null default now()

App-side event shape:
- `id`
- `name`
- `url`
- `count` (← scan_count)
- `checkInCount` (← check_in_count, defaults to 0 if column missing)
- `checkOutCount` (← check_out_count, defaults to 0 if column missing)
- `createdAt` (← created_at)

## Deployment
- Platform: Vercel (project: `qrcountercbq`)
- Deploy command: `npx vercel --prod`
- Vercel is NOT auto-connected to GitHub — must deploy manually via CLI
- Two GitHub repos exist: `qrcounter` (public, has the code) and `qrcountercbq` (private, Vercel was originally pointed here — ignore it)
- Vercel env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are set in the Vercel dashboard for Production + Preview.

## Known Non-Blocking Warnings
- CSS `@import` order warning in stylesheet
- Bundle size warning (>500 kB chunk)

## Safe Commands
- Install deps: `npm install`
- Run dev: `npm run dev`
- Build: `npm run build`
- Deploy: `npx vercel --prod`

## Guardrails
- Do not commit `.env`.
- Keep `.env.example` as template only.
- If Supabase env vars are absent, app continues working via localStorage fallback.
- Never use explicit column names in select queries — always use `select('*')` to stay resilient to missing optional columns.

## Next Likely Edits (for future AI)
1. Run the two pending SQL steps in Supabase (in/out columns + atomic increment function).
2. Connect Vercel to the correct GitHub repo (`qrcounter`) for auto-deploy on push.
3. Tighten RLS policies (current policies allow full anon access).
4. Add auth to scope events by user/team.
5. Fix CSS `@import` order warning in stylesheet.
6. Consider code splitting to reduce JS bundle size warning.
