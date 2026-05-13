# Graph Report - d:/Desktop/qrcounter  (2026-05-05)

## Corpus Check
- Corpus is ~2,830 words - fits in a single context window. You may not need a graph.

## Summary
- 60 nodes · 88 edges · 6 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App & Storage Wiring|App & Storage Wiring]]
- [[_COMMUNITY_UI Architecture & Navigation|UI Architecture & Navigation]]
- [[_COMMUNITY_Storage Layer & Data Model|Storage Layer & Data Model]]
- [[_COMMUNITY_QR Input & Docs|QR Input & Docs]]
- [[_COMMUNITY_Event Display Components|Event Display Components]]
- [[_COMMUNITY_Vite Config Concept|Vite Config Concept]]

## God Nodes (most connected - your core abstractions)
1. `App Component` - 16 edges
2. `loadLocalEvents()` - 6 edges
3. `saveLocalEvents()` - 6 edges
4. `incrementEventByMatch Function` - 6 edges
5. `loadLocalEvents Function` - 6 edges
6. `saveLocalEvents Function` - 6 edges
7. `createEvent()` - 5 edges
8. `incrementEventByMatch()` - 5 edges
9. `resetEventCount()` - 5 edges
10. `Scanner Component` - 5 edges

## Surprising Connections (you probably didn't know these)
- `CLAUDE.md Project Documentation` --references--> `App Component`  [EXTRACTED]
  CLAUDE.md → src/App.jsx
- `HTML Entry Point` --references--> `Main Entry Point`  [EXTRACTED]
  index.html → src/main.jsx
- `CLAUDE.md Project Documentation` --references--> `Scanner Component`  [EXTRACTED]
  CLAUDE.md → src/components/Scanner.jsx
- `CLAUDE.md Project Documentation` --references--> `Storage Utility`  [EXTRACTED]
  CLAUDE.md → src/utils/storage.js
- `README` --references--> `Storage Utility`  [EXTRACTED]
  README.md → src/utils/storage.js

## Hyperedges (group relationships)
- **Supabase CRUD with localStorage Cache Pattern** — storage_loadevents, storage_createevent, storage_incrementeventbymatch, storage_reseteventcount, storage_deleteevent [EXTRACTED 0.95]
- **App Event Lifecycle (create, scan, display, delete)** — app_app, storage_storage, scanner_scanner [INFERRED 0.85]
- **Local Cache Sync (load, normalize, save)** — storage_normalizerow, storage_loadlocalevents, storage_savelocalevents [EXTRACTED 0.95]

## Communities

### Community 0 - "App & Storage Wiring"
Cohesion: 0.41
Nodes (11): App(), createEvent(), deleteEvent(), generateId(), incrementEventByMatch(), isSupabaseConfigured(), loadEvents(), loadLocalEvents() (+3 more)

### Community 1 - "UI Architecture & Navigation"
Cohesion: 0.18
Nodes (13): App Component, App View State Machine (list/create/scan/detail), CreateEvent Component, EventDetail Component, EventList Component, QR Counter Favicon (Q letter on teal background), Header Component, HTML Entry Point (+5 more)

### Community 2 - "Storage Layer & Data Model"
Cohesion: 0.44
Nodes (9): createEvent Function, deleteEvent Function, Events Data Model (id, name, url, count, createdAt), incrementEventByMatch Function, loadEvents Function, loadLocalEvents Function, normalizeRow Function, resetEventCount Function (+1 more)

### Community 3 - "QR Input & Docs"
Cohesion: 0.29
Nodes (7): CLAUDE.md Project Documentation, ManualEntry Component, README, Scanner Scan Cooldown Mechanism, Scanner Component, Storage Utility, Supabase with localStorage Fallback Pattern

### Community 4 - "Event Display Components"
Cohesion: 0.5
Nodes (2): EventDetail(), formatDate()

### Community 12 - "Vite Config Concept"
Cohesion: 1.0
Nodes (1): Vite Config

## Knowledge Gaps
- **11 isolated node(s):** `Vite Config`, `Header Component`, `Toast Component`, `generateId Function`, `isSupabaseConfigured Function` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Event Display Components`** (5 nodes): `EventDetail()`, `EventList()`, `EventDetail.jsx`, `EventList.jsx`, `formatDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config Concept`** (1 nodes): `Vite Config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App Component` connect `UI Architecture & Navigation` to `Storage Layer & Data Model`, `QR Input & Docs`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `CLAUDE.md Project Documentation` connect `QR Input & Docs` to `UI Architecture & Navigation`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `formatDate()` connect `Event Display Components` to `App & Storage Wiring`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Vite Config`, `Header Component`, `Toast Component` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._