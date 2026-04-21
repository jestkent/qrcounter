# QR Counter

A simple web app that generates QR codes for events and counts scans.

- **In-app scanner**: Scans the QR code and increments the event counter
- **Any other scanner**: Opens the destination URL directly

## Features

- Create events with a name and destination URL
- Generate downloadable QR codes for each event
- Scan QR codes with the built-in camera scanner
- Track scan counts per event
- Manual +1 counter as a fallback
- Data persists in Supabase (or localStorage fallback)

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and add your Supabase keys
# Windows PowerShell: Copy-Item .env.example .env
# macOS/Linux: cp .env.example .env

# Start dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 18 + Vite
- [qrcode](https://www.npmjs.com/package/qrcode) for QR generation
- [html5-qrcode](https://www.npmjs.com/package/html5-qrcode) for camera scanning
- [Supabase](https://supabase.com/) for persistence

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run:

```sql
create table if not exists public.events (
    id text primary key,
    name text not null,
    url text not null,
    scan_count integer not null default 0,
    created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Public read events"
on public.events
for select
to anon
using (true);

create policy "Public insert events"
on public.events
for insert
to anon
with check (true);

create policy "Public update events"
on public.events
for update
to anon
using (true)
with check (true);

create policy "Public delete events"
on public.events
for delete
to anon
using (true);
```

3. Copy `.env.example` to `.env`.
4. Set:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

If env vars are missing or Supabase is unavailable, the app automatically falls back to localStorage.

## Deployment

Build and deploy the `dist/` folder to any static hosting (with env vars configured in host settings):

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: drag and drop `dist/` folder
- **GitHub Pages**: use `vite-plugin-gh-pages` or manually push `dist/`

## Project Structure

```
qr-counter/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── App.css
    ├── components/
    │   ├── Header.jsx
    │   ├── EventList.jsx
    │   ├── CreateEvent.jsx
    │   ├── EventDetail.jsx
    │   ├── Scanner.jsx
    │   ├── ManualEntry.jsx
    │   └── Toast.jsx
    └── utils/
        └── storage.js
```

## License

MIT
