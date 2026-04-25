# Master Library Specification

## Overview
Master Library is the DJ's curated permanent collection — the masterpieces, every-event essentials, and personal favorites that live on disk independently of any single event. Tracks land here in two ways: **promoted** from an event after they've proven themselves, or **added directly** outside of any event (manual upload from disk, drag-and-drop, or Spotify URL import). The page surfaces library-wide stats, a per-genre breakdown, and a filterable/paginated browse table — with affordances for adding, promoting, and removing.

This is a curated collection, not an aggregate of every track ever processed. Most event tracks never come here; only the keepers do.

## User Flows

**Browse and inspect**
- View library overview: total masterpieces, total storage used, number of events these tracks have served, and library health (% with full tags / artwork / analysis).
- Scan the per-genre breakdown as a sortable table (bucket, count, storage, % of library, last added).
- Click a genre bucket row → track table below filters to that bucket.
- Search the track table by free-text across title and artist.
- Narrow with multi-select bucket chips, BPM range slider, Camelot key filter, and format chips.
- Paginate (50/page), sort any column.
- Click a track row → reveal that file in the OS file explorer (Finder).
- Hover a track row → see "Times used" + "Last used in" metadata, plus a discrete "Remove" action.

**Add tracks (3 entry points, all from the Tracks card header)**
- **Add track** → opens a dialog with a local file path picker + optional Spotify URL field for metadata enrichment. After upload, the track is classified into a bucket and analyzed.
- **Drag and drop** → drag audio files anywhere on the page; a full-page drop overlay accepts the files and routes them through the same intake flow.
- **Import from Spotify** → paste a Spotify track URL, fetch metadata, then prompt the user to upload the matching local audio file.

**Promote from events**
- Inside Event Detail Match panel, each matched track has a "Star" / "Promote to library" affordance (designed in the Event Detail spec; surfaced here for context).
- A "Promote from event" button in the Tracks card header opens a bulk-promotion view: pick an event, multi-select tracks, confirm. Tracks get marked with `origin: "promoted"` and remember which event they came from.

**Remove**
- Row-hover "Remove from library" affordance opens a confirmation that explicitly states the file on disk is NOT deleted — only the library membership is removed. Tracks may be re-added later.

## UI Requirements

### Page layout
- Single vertical-scroll page (max-width ~1280px, generous side padding).
- Order: Overview strip → Genres card → Tracks card.
- Subtle page background wash (`neutral-50` / `neutral-950`) so cards float.

### Overview strip
- Page title "Master Library" with subtitle "Your curated collection — masterpieces and every-event essentials."
- "Updated [relative]" pill on the right with a refresh icon (mono).
- 4 stat tiles in a responsive grid (2-col on mobile, 4-col on lg+):
  1. **Masterpieces** — total track count (mono, large)
  2. **Storage used** — formatted bytes (GB/TB)
  3. **Events served** — number of distinct events these tracks have appeared in
  4. **Library health** — overall % in colored mono on the right, with 3 mini segments below for Tags / Artwork / Analysis (per-segment bar + label + per-segment %, colored by threshold ≥90 emerald / ≥75 amber / else red)

### Genres card
- Header: "Genres · [N] buckets" + subtitle "Click a row to filter the track table below."
- Sortable table — columns: Bucket / Tracks / Storage / % of library (with inline scaled bar) / Last added (relative).
- Selected row → 2px sky left accent + soft sky background tint; bar fills sky.
- Empty buckets render dimmed, em-dash placeholders, non-clickable.
- Hover row → bar tints sky.

### Tracks card

**Header**
- Title: "Tracks · [filtered] of [total] shown" + subtitle "Click a row to reveal the file in Finder."
- Header trailing actions (right side, three buttons grouped):
  - **+ Add track** (sky primary) — opens add-track dialog
  - **Promote from event** (secondary) — opens bulk promotion view
  - **Import from Spotify** (compact secondary, music icon)

**Drag-and-drop overlay**
- When the user drags audio files over the page, a full-page sky-tinted overlay appears with a dashed border, large upload icon, and the message "Drop audio files to add to library".
- On drop, fires `onDropAudioFiles(files)`.

**Filter bar** (border-separated under the header)
- Search input with leading magnifier icon (focus ring sky) + "Clear filters" link top-right when any filter is active.
- Bucket multi-select chips (each with track count; selected = sky-filled).
- 3-column bottom row: BPM dual-range slider (mono lo/hi labels, sky fill, custom thumbs) / Camelot Key dropdown (mono) / Format chips (FLAC / WAV / AIFF / MP3).

**Track table** — sortable columns:
- **Title / Artist** — stacked, title bold, truncate to ~28ch with full title in `title` attribute.
- **Bucket** — chip.
- **BPM / Key** — stacked mono.
- **Origin** — `Manual` (neutral chip) or `Promoted` (sky chip with small star icon). Hover shows source event for promoted tracks.
- **Source event** — text-link in sky for promoted tracks; em-dash for manual. Click stops propagation and fires `onOpenSourceEvent`.
- **Times used** — count (mono); 0 for never-used masterpieces (acceptable for manual additions).
- **Last used** — relative time of `lastUsedInEvent.date`; em-dash if never.
- **Added** — relative `addedAt`.
- **Size** — formatted bytes + format mini-label below (mono, stacked).
- **Path** — truncated middle ellipsis, full path on hover.

**Row interactions**
- Click row → `onRevealInFinder(track)`.
- On row hover, the right-side actions slot reveals two affordances (small icon buttons, sky for "Reveal", red for "Remove"): "Reveal in Finder" and "Remove from library".
- "Remove" opens a confirmation (modal or inline) clarifying file is not deleted from disk.

**Pagination**
- Footer: mono "Page X of Y · N of total results" + first/prev/next/last icon buttons.
- 50 tracks per page.

### Empty states
- **Library empty** (zero tracks total) → centered card with message "No masterpieces yet. Promote tracks from events or add them directly." + the same three add buttons.
- **Filters return zero** → row with message "No tracks match the current filters." + Clear-filters link.

### Out of scope
- Editing tags or metadata on a track (read-only fields here).
- Deleting the actual file on disk.
- Re-running analysis on tracks.
- Re-classifying genre buckets (lives in Settings).
- Audio playback / preview.

### Conventions
- Sky for primary actions and active state, emerald for healthy stats, amber/red for health/danger.
- Inter for UI; JetBrains Mono with tabular-nums for counts, BPM, key, sizes, paths, timestamps.
- `rounded-md`, 1px borders, compact density.
- Full dark mode coverage.

## Configuration
- shell: true
