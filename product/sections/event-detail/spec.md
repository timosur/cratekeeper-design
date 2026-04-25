# Event Detail Specification

## Overview

The core working surface of Cratekeeper. A two-pane master-detail layout: a compact left rail listing all 12 pipeline steps grouped into phases, and a focused right panel that swaps to show the active step's controls, status, and live output. Above both panes sits an event header with the event identity, top-level health banners, and quick track-count stats. This is where the operator actually moves a wedding playlist from "fetched" to "synced."

## User Flows

- Operator opens an event from the Dashboard and lands on the right panel for the event's current step (auto-selected). They can click any other step in the rail to inspect it.
- Operator clicks `Run` on the active step to kick off a job; the panel switches to a live view with progress bar, per-unit metrics, and a streaming log; they can `Pause` or `Cancel` mid-flight.
- Operator returns to a step that previously failed, sees the error and last checkpoint, and clicks `Resume` to continue from the last unprocessed unit without redoing completed work.
- On the Review step, operator filters tracks by low classification confidence and bulk re-buckets a selection into a different genre with a single action.
- On Match, operator scans the misses list and copies the auto-generated Tidal purchase URLs to a clipboard.
- On Classify Tags, operator opens a pre-flight cost estimate panel showing token counts and dollar estimate before dispatching to Anthropic; live token usage updates during the run.
- On Apply Tags, Build Event, and Build Library, operator runs a Dry-run first to inspect a diff of files-to-be-changed; only then runs for real.
- When a destructive step is blocked by quality-gate failures, a banner appears at the top of the page; operator opens the Quality Checks panel, reads the failures, types the confirmation phrase to override, and the override is logged to the audit trail.
- Operator clicks `Undo Tags` on the Apply Tags step to restore audio files from per-file backups; the step status returns to "ready to re-run."
- After a successful Apply Tags, the rail shows downstream Build Event and Build Library steps marked stale; operator runs the rebuild from those panels.
- Operator clicks the Spotify playlist link in the header to open the source playlist in a new tab for cross-reference.

## UI Requirements

### Page header
- Sticky header (below the global top bar) showing the event name (large, Inter 600), event date (caption), and slug in JetBrains Mono.
- Spotify playlist URL as an external-link chip on the right.
- Below the title row, a compact stats strip: `Total / Matched / Tagged / Synced` in JetBrains Mono with subtle dividers, mirroring the Dashboard card layout.
- Banners (stacked when both apply, dismissible only when resolved):
  - **Quality gate banner** — red, surfaces the count of failing checks and a `Review checks` action that opens the Quality Checks side sheet. Required state for any destructive step.
  - **Stale build banner** — amber, lists which builds are stale (event folder, master library) with a `Rebuild` action that jumps to the relevant step.

### Left step rail (260px, sticky)
- Vertical list of all 12 steps, numbered, grouped into 6 phases with thin section headers:
  - Intake (Fetch, Enrich)
  - Classify (Classify, Review)
  - Library (Scan, Match)
  - Analysis (Analyze Mood, Classify Tags)
  - Tagging (Apply Tags)
  - Build & Sync (Build Event, Build Library, Sync)
- Each row: step number (mono, neutral-500), step label, and a small status icon on the right:
  - Idle: empty circle (neutral)
  - Running: spinning sky loader
  - Succeeded: emerald check
  - Failed: red exclamation
  - Stale: amber warning
- Active step gets sky background tint, sky-600 left border accent, and sky-700 text — same active treatment as the global sidebar.
- Compact density — 32px row height; no timestamps in v1.

### Right panel (master-detail)
The right panel swaps wholesale to a focused view per step. All step panels share a common skeleton:
- **Step header:** large step name + one-line description; primary action button on the right (`Run`, `Resume`, or step-specific verb); status pill matching the rail icon.
- **Body:** step-specific content (see per-step notes below).
- **Live job tray:** when a job is running for the step, a fixed bottom tray inside the panel with a progress bar, per-unit count ("47 / 124 tracks"), elapsed time, and an SSE log stream (collapsible). `Pause` and `Cancel` buttons live here.
- **Footer:** "Last run" timestamp + duration + "View in audit log" link (deep-link to filtered Audit Log section).

### Per-step panel notes
- **Fetch / Enrich / Scan:** simple Run button + last-result summary (track count, source URL, MusicBrainz lookups).
- **Classify:** distribution chart of tracks per genre bucket with counts.
- **Review:** filterable table of low-confidence tracks (confidence < threshold) with checkbox selection and a "Re-bucket selected → [bucket dropdown]" bulk action.
- **Match:** a "Matched" tab (table of resolved local files with ISRC source) and a "Misses" tab (table with one-click copy of generated Tidal purchase URLs). Each matched row has a leading **promote-to-library star** — operators star tracks they want to keep as permanent masterpieces in the curated Master Library. Filled gold star = already promoted; outline star = not yet. Toggling fires `onPromoteToLibrary(trackId, next)`. The star never deletes the file; it only adds/removes the track from the curated collection.
- **Analyze Mood:** per-track checkpoint table; running rows pulse; failed rows show a re-try affordance.
- **Classify Tags:** pre-flight cost panel showing estimated input/output tokens and dollar estimate (using current Anthropic pricing from settings); live token usage tile during the run; `Run estimate` and `Dispatch` are two separate actions.
- **Apply Tags:** `Dry-run` and `Apply` actions side by side; dry-run shows a per-file diff of tag changes. After a real Apply, an `Undo` button appears with a confirmation modal.
- **Build Event / Build Library:** `Dry-run` and `Build` actions; dry-run shows the file diff (additions / removals / unchanged) grouped by genre folder.
- **Sync:** Spotify and Tidal as side-by-side cards; each shows last sync result, ISRC match counts, and the resulting playlist URL when available.

### Cross-cutting requirements
- All destructive actions (`Apply`, `Build`, `Sync`, `Undo`) require the quality gate to be clear or an active override; the override modal is a typed-confirmation phrase that writes to the audit log.
- Live SSE log lines render in JetBrains Mono with subdued timestamp prefixes; auto-scroll with a "scroll to bottom" pill when the user has scrolled away.
- Status colors are consistent: sky for in-progress, emerald for healthy/done, amber for stale/warning, red for failed.
- Each panel is self-contained and full-height; no horizontal scrolling.
- A "Recent activity" footer block at the very bottom of the right panel shows the last 5 audit entries for this event with a "View all in Audit Log" link.

### Out of scope
- Editing event metadata (separate dialog, future)
- Archiving / deleting events (future, lives in Settings or a menu)
- Master-library browse (lives in the Master Library section)
- Full audit-log filtering and search (lives in the Audit Log section; only recent activity surfaces here)
- Editing genre buckets (lives in Settings)

## Configuration
- shell: true
