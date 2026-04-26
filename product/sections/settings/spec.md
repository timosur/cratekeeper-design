# Settings Specification

## Overview
Settings is the single place to configure all credentials, paths, and vocabularies that drive the pipeline: Spotify OAuth (the source of every event's wish playlist), Tidal OAuth (used only as a secondary listening / acquisition target via per-track URLs), the Anthropic API key and model, filesystem roots, the bearer token for the local API, and the editable genre-bucket list. It is the only screen that exposes sensitive values and destructive credential actions, so it favors clarity and explicit confirmation over speed.

## User Flows

### Navigation
- User opens Settings from the shell sidebar and lands on **Integrations** by default.
- A persistent left sub-nav lists four categories: **Integrations**, **Filesystem roots**, **Genre buckets**, **API access**. Selecting one swaps the right panel.

### Integrations \u2014 Spotify & Tidal
- Each service shows a status card: `Connected` (with account name + last refreshed) or `Not connected`.
- When connected: **Re-link** (re-runs OAuth) and **Disconnect** (revokes tokens, opens confirm dialog).
- When not connected: **Connect** (runs OAuth flow in a popup window).

### Integrations \u2014 Anthropic
- Masked API key field with **Reveal** (auto-hides after 10s), **Rotate** (paste-to-replace + validate before save), and a connection status dot.
- Curated **Model** dropdown: `claude-sonnet-4`, `claude-haiku-4`, `claude-opus-4`.
- **Prompt caching enabled** toggle.
- **Lifetime usage** counter showing total tokens + USD spent across all events.

### Filesystem roots
- Three rows: `Local music NAS`, `Master library output`, `Backup directory`.
- Each row shows: editable path, live **Reachable / Unreachable** badge, free space, last scanned timestamp.
- Per-row **Test** button re-checks reachability and free space without saving.
- Per-row **Edit** opens an inline path editor with validation.

### Genre buckets
- Editable inline list of all 18 buckets with order numbers.
- Drag-to-reorder via a grip handle on each row.
- Each row is inline-editable (rename in place).
- **Add bucket** appends a new row at the bottom in edit mode.
- Per-row delete with a confirm dialog when the bucket is currently in use by any track.
- A live counter shows how many tracks across all events use each bucket.

### API access (bearer token)
- Single row showing token status (`Active since \u2026`) and a masked value.
- **Reveal** (auto-hides after 10s) and **Copy**.
- **Rotate** opens a confirm dialog warning that all clients must be re-configured, then displays the new token value once with a Copy button before masking it.

### Sensitive value handling
- All API keys, OAuth refresh tokens, and bearer tokens are masked by default.
- Reveal toggles hide automatically after 10 seconds.
- Rotation flows show the new value once, immediately after generation.

## UI Requirements
- Two-column layout: 200px left sub-nav (Integrations \u2192 Filesystem roots \u2192 Genre buckets \u2192 API access) + scrolling right panel.
- The active category is highlighted with the same sky left-border treatment used in Event Detail.
- Each right panel has a category title, a one-line description, then grouped cards.
- Status dots: `emerald` for connected/reachable/active, `red` for disconnected/unreachable, `amber` for stale/warning.
- All sensitive fields render as masked monospace text (`\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 abcd`) until revealed.
- Reveal buttons use the eye icon and show a small countdown timer while open.
- Confirm dialogs for destructive actions: red primary button, requires typing the service name (Spotify / Tidal) or `ROTATE` to enable.
- Inline edits use save/cancel buttons appearing on the row when dirty; Esc cancels, Enter saves.
- Bucket rows show a drag handle on the left, the name in the middle (inline-editable), and usage count + delete on the right.
- Filesystem root cards stack: path on top, status row underneath (badge + free space + last scanned + Test + Edit).
- All save actions show inline success/error feedback under the field; never use a toast for credential changes.
- Free-space and last-scanned values render in JetBrains Mono.

## Configuration
- shell: true
