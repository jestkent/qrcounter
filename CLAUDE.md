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

Changed file:
- `src/components/Scanner.jsx`

### 5) Scan Feedback (Vibration + Flash)
- On successful scan: green screen flash + short vibration (100ms).
- On no match: red screen flash + double vibration (100ms pause 60ms 100ms).
- Uses `navigator.vibrate` — works on Android, silently ignored on iOS/desktop.

Changed file:
- `src/components/Scanner.jsx`

### 6) In/Out Stats on Event Detail
- Event detail page shows three stat boxes:
  - **Check In** (green) — total check-ins
  - **Inside Now** (accent) — check-ins minus check-outs
  - **Check Out** (red) — total check-outs
- Total Scans counter still shown above.

Changed file:
- `src/components/EventDetail.jsx`

### 7) Environment + Security Hygiene
- `.env` is gitignored and never committed.
- `.env.example` is the template.
- Vercel has env vars set via dashboard (Production + Preview).

## Supabase Details
- Project ID: `ssovivfxmffdoxjfmvcq`
- URL: `https://ssovivfxmffdoxjfmvcq.supabase.co`
- Anon key is set in local `.env` and in Vercel environment variables.

## Current Data Model
Table: `public.events`
- `id` text primary key
- `name` text not null
- `url` text not null — the destination URL (where phone scans redirect to)
- `scan_count` integer not null default 0 — total scans
- `check_in_count` integer not null default 0
- `check_out_count` integer not null default 0
- `created_at` timestamptz not null default now()

App-side event shape:
- `id`
- `name`
- `url`
- `count` (← scan_count)
- `checkInCount` (← check_in_count)
- `checkOutCount` (← check_out_count)
- `createdAt` (← created_at)

SQL to add in/out columns (run once in Supabase SQL Editor):
```sql
alter table public.events add column if not exists check_in_count integer not null default 0;
alter table public.events add column if not exists check_out_count integer not null default 0;
```

## Deployment
- Platform: Vercel (project: `qrcountercbq`)
- Deploy command: `npx vercel --prod`
- Vercel is NOT auto-connected to GitHub — must deploy manually via CLI
- Two GitHub repos exist: `qrcounter` (public, has the code) and `qrcountercbq` (private, Vercel was originally pointed here — ignore it)

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

## Next Likely Edits (for future AI)
1. Connect Vercel to the correct GitHub repo (`qrcounter`) for auto-deploy on push.
2. Tighten RLS policies (current policies allow full anon access).
3. Add auth to scope events by user/team.
4. Fix CSS `@import` order warning in stylesheet.
5. Consider code splitting to reduce JS bundle size warning.
