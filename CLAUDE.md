# CLAUDE.md

## Project Snapshot
- App: QR Counter (React + Vite)
- Goal completed: connect persistence to Supabase while keeping local fallback
- Current local run URL (last verified): http://localhost:5174/

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
  - `incrementEventByMatch(value)`
  - `resetEventCount(id)`
  - `deleteEvent(id)`
- Maintains local cache via localStorage for resilience.

### 2) App Flow Updated to Async Persistence
- Replaced sync local save flow with async storage calls.
- Added loading state during initial data fetch.
- Added error handling + toast feedback around create/increment/reset/delete.

Changed file:
- `src/App.jsx`

### 3) Scanner Callback Updated for Async Match
- Scanner now awaits async match/increment handler before showing no-match behavior.

Changed file:
- `src/components/Scanner.jsx`

### 4) Environment + Security Hygiene
- Created local env template for Supabase keys.
- Added `.env` to git ignore so keys are not committed.
- Created real local `.env` in workspace with provided project values.

Changed files:
- `.env.example`
- `.gitignore`
- `.env` (local only, should remain uncommitted)

### 5) Documentation
- README updated with Supabase setup instructions.
- Added SQL block for `events` table and RLS policies.

Changed file:
- `README.md`

## Supabase Details Already Wired
- Project ID: `ssovivfxmffdoxjfmvcq`
- URL in env: `https://ssovivfxmffdoxjfmvcq.supabase.co`
- Anon key is set in local `.env`.

## Important Operational Note
- Code is ready for Supabase, but database table/policies must exist in Supabase project.
- SQL to run is documented in `README.md` under "Supabase Setup".
- Until SQL is applied successfully, app behavior may fall back to localStorage.

## Validation Performed
- `npm install` completed.
- `npm run build` completed successfully after integration.
- Dev server starts successfully.
- Known non-blocking warnings:
  - CSS `@import` order warning
  - bundle size warning (>500 kB chunk)

## Current Data Model
Table: `public.events`
- `id` text primary key
- `name` text not null
- `url` text not null
- `scan_count` integer not null default 0
- `created_at` timestamptz not null default now()

App-side event shape:
- `id`
- `name`
- `url`
- `count`
- `createdAt`

Mapping:
- `scan_count` <-> `count`
- `created_at` <-> `createdAt`

## Next Likely Edits (for future AI)
1. Tighten RLS policies (current policies are broad for quick setup).
2. Add auth (optional) and scope events by user/team.
3. Add migration from existing localStorage-only datasets into Supabase.
4. Address CSS import-order warning in stylesheet.
5. Consider code splitting/manual chunks to reduce JS bundle warning.

## Safe Commands
- Install deps: `npm install`
- Run dev: `npm run dev`
- Build: `npm run build`

## Guardrails
- Do not commit `.env`.
- Keep `.env.example` as template only.
- If Supabase env vars are absent, app should continue working via local fallback.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Session Rules

- Check Obsidian project note (`projects/qrcounter.md`) before starting work each session
- Update the Session Log in that note at the end of each session
- Run `/graphify .` after major refactors to rebuild the knowledge graph
- Use `py -m graphify` not `graphify` directly (Windows PATH issue)
