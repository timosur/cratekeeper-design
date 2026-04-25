# Audit Log Specification

## Overview
The Audit Log is the operator's investigation surface — a filterable, append-only timeline of every state-changing action across the system (jobs, reviews, settings changes, library promotions, quality-gate overrides). The primary use is forensic: pick one event, track, or job and see its full history with structured before/after payloads.

## User Flows
- Operator pastes an event or track id into the **Target ID** filter and sees every action that ever touched it, ordered newest-first.
- Operator filters by **Action type** (e.g. `library.promote`, `review.rebucket`) and a **time range** preset (Last hour / 24h / 7d / 30d / Custom) to investigate a specific class of changes.
- Operator clicks any row to expand it inline, seeing the full structured payload with a before → after diff, the override reason (when present), and a "Jump to target" link that opens the affected Event Detail / Master Library / Settings view in context.
- Operator clicks **Copy as JSON** on an expanded entry to paste a single record into a bug report or chat.
- Operator toggles **Live tail** to watch new entries auto-prepend at the top via SSE; toggling it off pins the current view so it doesn't shift while scrolling.
- Operator narrows the filter set, clicks **Export**, and downloads the filtered results as CSV or NDJSON.
- Operator hits **Copy permalink** to share their current filter state as a URL with a teammate; opening that URL restores the same filters.

## UI Requirements
- **Page header** with title "Audit Log", a one-line subtitle ("Append-only history of every state-changing action"), and a row of trailing actions on the right: `Live tail` toggle (with a pulsing sky dot when on), `Copy permalink` (icon button), `Export ▾` (split button: CSV / NDJSON).
- **Sticky filter bar** below the header containing, in order:
  - **Time range** segmented control: `1h` / `24h` / `7d` / `30d` / `Custom…` (custom opens a date-range popover).
  - **Actor** dropdown: `Anyone` / `Operator` / `System` / individual operator names from the dataset.
  - **Action type** multi-select chip popover, grouped by namespace: `job.*`, `review.*`, `library.*`, `settings.*`, `gate.*`, `sync.*`. Selected chips show inline below the bar with × to remove.
  - **Target kind** chip group: `Event` / `Track` / `Library` / `Settings` / `Job` (toggles, multi-select).
  - **Target ID** monospaced input with placeholder `Paste id (evt-… / trk-… / job-…)` and a small `×` clear button.
  - **Severity** chip group: `Info` / `Warning` / `Error` / `Override` with matching colored dots (neutral / amber / red / sky).
  - Trailing **Reset** link, only visible when at least one filter is active. A **filter summary** line shows `N entries · filtered from M total` in JetBrains Mono.
- **Timeline list** as a single-pane virtualized list below the filter bar:
  - Each collapsed row is a single line, fixed-height (~44 px): leading severity dot · monospace timestamp (relative on hover, absolute below) · actor pill (`Operator` neutral / `System` sky-50) · action label in monospace (`library.promote`) · target chip (`event evt-001` / `track trk-0042`) · one-line summary that truncates with ellipsis · trailing chevron.
  - Override entries get a left border accent in sky and a small "Override" badge after the action label.
  - Hovering a row reveals row-level Quick actions on the right: `Copy id`, `Jump to target`, `Copy as JSON`.
  - Clicking a row expands it inline (collapses any other open row) with a smooth height transition.
- **Expanded row content**:
  - A two-column metadata strip at the top: left column shows `Action`, `Actor`, `Target`, `Timestamp` (absolute + relative). Right column shows `Job ID` (when applicable), `Severity`, and the `Override reason` block (sky-bordered card) when severity is Override.
  - **Before → After diff** as a side-by-side JSON viewer with monospace font, additions in emerald, removals in red, unchanged keys dimmed. Diff collapses long unchanged regions ("… 6 unchanged keys").
  - Footer action row inside the expanded panel: `Jump to target` (sky primary), `Copy as JSON` (secondary), `Copy permalink to entry` (secondary).
- **Live tail behavior**:
  - When ON, new entries fade in at the top with a brief 600 ms sky highlight; a small "+3 new" pill appears at the top of the list if the user is scrolled away from the top, clicking it scrolls to top.
  - When OFF, scroll position is preserved as new entries arrive in the background; the pill is the only indicator.
- **Empty / loading states**:
  - First load: skeleton rows (8) matching the row layout.
  - No entries match filters: centered illustration with title "Nothing matches these filters" and a `Reset filters` link.
  - Live tail with no new activity: a quiet footer line `Watching for new entries…` with a slow pulsing sky dot.
- **Accessibility**: rows are keyboard navigable (↑/↓), Enter to expand/collapse, `c` to copy id when focused.
- **Read-only**: no inline editing or deletion — the log is append-only. Retention/cleanup policy is configured in Settings, not here.

## Configuration
- shell: true
