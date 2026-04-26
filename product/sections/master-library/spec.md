# Master Library Specification

## Overview
Master Library is the DJ's curated permanent collection — the masterpieces, every-event essentials, and personal favorites that live on the **local OS disk** (separate from the larger NAS Library that the Match step searches against). Tracks land here in two ways: **promoted** from an event after they've proven themselves, or **added directly** outside of any event (manual upload from disk, drag-and-drop, or Spotify URL import). The page surfaces library-wide stats including on-disk integrity, a per-genre breakdown, and a filterable/paginated browse table — with affordances for adding, promoting, verifying, and removing.

This is a curated collection, not an aggregate of every track ever processed. Most event tracks never come here; only the keepers do.

### Master Library vs NAS Library
- **Master Library** — the curated collection described in this spec. Lives on the local OS disk. Each entry has explicit presence tracking (`present` / `missing` / `unknown`).
- **NAS Library** — the larger pool of audio files on the NAS that the Match step searches against. Not curated. Tracks here are not "masterpieces" until they are promoted into the Master Library.
- The Match step prefers a Master Library file when the same ISRC resolves to both pools; the per-row "library" pill (see Event Detail spec) tells the operator which is which.

## User Flows

**Browse and inspect**
- View library overview: total masterpieces, total storage used, number of events these tracks have served, library health (% with full tags / artwork / analysis / **on disk**), and a dedicated **missing files** indicator when any masterpiece has gone missing.
- Scan the per-genre breakdown as a sortable table (bucket, count, storage, % of library, last added).
- Click a genre bucket row → track table below filters to that bucket.
- Search the track table by free-text across title and artist.
- Narrow with multi-select bucket chips, BPM range slider, Camelot key filter, format chips, and an **origin filter** (Manual / Promoted).
- Paginate (50/page), sort any column.
- Click a track row → reveal that file in the OS file explorer (Finder). Disabled when the file is `missing`; row's right-side action shows "Locate file…" (future) or "Drop missing entry" instead.
- Hover a track row → see "Times used" + "Last used in" metadata, plus the appropriate removal action for the row's presence state.

**Add tracks (3 entry points, all from the Tracks card header)**
- **Add track** → opens a dialog with a local file path picker + optional Spotify URL field for metadata enrichment. After upload, the track is classified into a bucket and analyzed.
- **Drag and drop** → drag audio files anywhere on the page; a full-page drop overlay accepts the files and routes them through the same intake flow.
- **Import from Spotify** → paste a Spotify track URL, fetch metadata, then prompt the user to upload the matching local audio file.

**Promote from events**
- Inside Event Detail Match panel, each matched track has a "Star" / "Promote to library" affordance (designed in the Event Detail spec; surfaced here for context). Promotion is **only available when the source file is present on disk** — the star is disabled with a tooltip otherwise.
- A "Promote from event" button in the Tracks card header opens a bulk-promotion view: pick an event, multi-select tracks, confirm. Tracks get marked with `origin: "promoted"` and remember which event they came from.

**Verify on-disk integrity**
- A "Verify library" button in the Overview strip dispatches the `verify-library` job. The job stat()s every masterpiece path, updates each entry's `localFilePresence`, `lastVerifiedAt`, and `fileSizeOnDisk`, and surfaces drift in the audit log.
- Verification also runs automatically when the app launches.
- While running, the button shows a sky spinner and progress count ("Verifying 124 / 482…"). On completion, the Overview tile updates and any new missing files appear in the Tracks table with a leading red dot.

**Remove (two distinct flows)**
- **Remove from library** (file is `present`) — row-hover red icon button. Opens a confirmation that explicitly states the file on disk is NOT deleted; only the library membership is removed. Tracks may be re-added later.
- **Drop missing entry** (file is `missing`) — row-hover red icon button with a different glyph (broken-link icon) and label. Opens a confirmation explaining there is nothing on disk to keep, and the entry will be removed from the library. Distinct from the present-file flow so the operator can never confuse "clean up dead entries" with "deliberately remove a healthy file from my collection."

## UI Requirements

### Page layout
- Single vertical-scroll page (max-width ~1280px, generous side padding).
- Order: Overview strip → Genres card → Tracks card.
- Subtle page background wash (`neutral-50` / `neutral-950`) so cards float.

### Overview strip
- Page title "Master Library" with subtitle "Your curated collection on disk — masterpieces and every-event essentials."
- "Updated [relative]" pill on the right with a refresh icon (mono).
- Trailing "**Verify library**" secondary button next to the updated pill (sky outline; shows spinner + count while a `verify-library` job is running).
- 4 stat tiles in a responsive grid (2-col on mobile, 4-col on lg+):
  1. **Masterpieces** — total track count (mono, large)
  2. **Storage used** — formatted bytes (GB/TB)
  3. **Events served** — number of distinct events these tracks have appeared in
  4. **Library health** — overall % in colored mono on the right, with **4 mini segments** below for Tags / Artwork / Analysis / **On disk** (per-segment bar + label + per-segment %, colored by threshold ≥90 emerald / ≥75 amber / else red). The On-disk segment is `present_count / total_count` and is the most prominent of the four when any are missing.
- When `missing_count > 0`, a 5th compact tile appears spanning the full row width: red-tinted, "⚠ [N] masterpieces missing on disk" with an inline action "Show missing" that filters the Tracks table to `presence = missing`.

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
- **Origin filter** — chip pair (Manual / Promoted), each with count; multi-select; sky-filled when active.
- 3-column bottom row: BPM dual-range slider (mono lo/hi labels, sky fill, custom thumbs) / Camelot Key dropdown (mono) / Format chips (FLAC / WAV / AIFF / MP3).

**Track table** — sortable columns:
- **Presence dot** — leading column, ~12px: emerald dot (`present`) / red dot (`missing`) / amber dot (`unknown` — not yet verified or stale verification > 7 days old). Tooltip shows status + last verified relative time.
- **Title / Artist** — stacked, title bold, truncate to ~28ch with full title in `title` attribute. When `missing`, title text is muted and the path column is struck through.
- **Bucket** — chip.
- **BPM / Key** — stacked mono.
- **Origin** — `Manual` (neutral chip) or `Promoted` (sky chip with small star icon). Hover shows source event for promoted tracks.
- **Source event** — text-link in sky for promoted tracks; em-dash for manual. Click stops propagation and fires `onOpenSourceEvent`.
- **Times used** — count (mono); 0 for never-used masterpieces (acceptable for manual additions).
- **Last used** — relative time of `lastUsedInEvent.date`; em-dash if never.
- **Added** — relative `addedAt`.
- **Size** — formatted bytes + format mini-label below (mono, stacked). When verified `fileSizeOnDisk` differs from recorded size, append a small amber drift dot with tooltip "Size on disk drifted: was X, now Y."
- **Path** — truncated middle ellipsis, full path on hover.

**Row interactions**
- Click row → `onRevealInFinder(track)`. **Disabled when `presence === "missing"`** — cursor-not-allowed, no callback fires.
- On row hover, the right-side actions slot reveals two affordances (small icon buttons):
  - **Reveal in Finder** (sky) — hidden when `missing`.
  - **Remove from library** (red, trash icon) when `present`; **Drop missing entry** (red, broken-link icon) when `missing`. Mutually exclusive based on presence state.
- Each removal opens its own confirmation flow (see User Flows above).

**Pagination**
- Footer: mono "Page X of Y · N of total results" + first/prev/next/last icon buttons.
- 50 tracks per page.

### Empty states
- **Library empty** (zero tracks total) → centered card with message "No masterpieces yet. Promote tracks from events or add them directly." + the same three add buttons.
- **Filters return zero** → row with message "No tracks match the current filters." + Clear-filters link.
- **All missing** (filtered to `presence = missing` and zero remain) → row with message "No missing entries. Library is healthy."

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
