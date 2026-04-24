# Cratekeeper — DJ Library Toolkit

## Description
Cratekeeper is a local-first, single-operator web app that turns a Spotify wish playlist into a classified, mood-analyzed, properly tagged, event-ready folder on disk — and syncs the result back to Spotify and Tidal as per-event sub-playlists. It runs entirely on the DJ's Mac against a local music NAS, with explicit checkpoints, undo for destructive steps, and a full audit trail.

## Problems & Solutions

### Problem 1: Spotify metadata is too shallow for set planning
Spotify exposes no usable BPM, key, energy, or mood data, so DJs can't plan sets from playlists alone. Cratekeeper runs local audio analysis (Essentia + TF models, native on Apple Silicon) to enrich every matched track with BPM, key, energy, mood probabilities, and arousal/valence.

### Problem 2: Tracks live across Spotify, Tidal, and a local NAS
Matching a wish playlist to local files by hand is tedious and error-prone. Cratekeeper indexes the NAS into Postgres and matches tracks ISRC-first, then exact, then fuzzy — emitting Tidal purchase URLs for anything missing.

### Problem 3: DJ software needs a clean, tagged folder structure
Apps like djay PRO expect a `Genre/Artist - Title.ext` layout with proper ID3/Vorbis/MP4 tags. Cratekeeper writes tags in place and builds per-event folders (and a master library) by copy or symlink, with a `dry_run` diff before anything touches disk.

### Problem 4: LLM-assisted tagging is powerful but easy to do inconsistently
Free-form prompting drifts across runs and burns tokens. Cratekeeper uses the Anthropic SDK with a fixed tag vocabulary (energy / function / crowd / mood), prompt caching, a pre-flight cost estimate, and live token usage during the run.

### Problem 5: Destructive tag and file operations need a safety net
Overwriting tags on a real library is high-risk. Cratekeeper takes a byte-exact per-file backup before every tag write, offers a dedicated undo job to restore the originals, and funnels every destructive action through a Quality-Gate panel and an immutable audit log.

## Key Features
- End-to-end 12-step pipeline (fetch → enrich → classify → match → analyze → tag → build → sync) with per-step checkpoints
- Local audio analysis: BPM, key, energy, and mood via Essentia + TF models, native on Apple Silicon
- LLM tag classification using Anthropic Sonnet, with prompt caching and a pre-flight cost preview
- Reversible tag writes with byte-level per-file backups and a one-click undo job
- Per-event sub-playlist sync to Spotify and Tidal, ISRC-first matching with click-through URLs persisted
- Guided per-event step rail with review lanes for low-confidence classifications and pre-flight quality checks
- Master library accumulator on disk in `Genre/Artist - Title.ext` layout, deduped across events
- Resumable jobs with SSE progress streams (last-event-id replay) and a 1-heavy / 4-light concurrency model
- Immutable audit log of every state-changing action, queryable from the UI
