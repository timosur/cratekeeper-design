# Cratekeeper — DJ Library Toolkit

## Description
Cratekeeper is a local-first, single-operator web app that turns a Spotify wish playlist into a classified, mood-analyzed, properly tagged, event-ready folder on disk — and accumulates the keepers into a curated Master Library on the DJ's Mac. It runs entirely against a local music NAS, with explicit checkpoints, undo for destructive steps, and a full audit trail. Spotify is the source of the wishlist; Tidal is used only as a secondary listening / acquisition target via per-track URLs.

## Problems & Solutions

### Problem 1: Spotify metadata is too shallow for set planning
Spotify exposes no usable BPM, key, energy, or mood data, so DJs can't plan sets from playlists alone. Cratekeeper runs local audio analysis (Essentia + TF models, native on Apple Silicon) to enrich every matched track with BPM, key, energy, mood probabilities, and arousal/valence.

### Problem 2: Tracks live across Spotify catalogs and a local NAS
Matching a wish playlist to local files by hand is tedious and error-prone. Cratekeeper indexes the NAS into Postgres and matches tracks ISRC-first, then exact, then fuzzy — emitting Tidal purchase / listen URLs for anything missing so the DJ can acquire it.

### Problem 3: DJ software needs a clean, tagged folder structure
Apps like djay PRO expect a `Genre/Artist - Title.ext` layout with proper ID3/Vorbis/MP4 tags. Cratekeeper writes tags in place and builds per-event folders (and a master library) by copy or symlink, with a `dry_run` diff before anything touches disk.

### Problem 4: LLM-assisted tagging is powerful but easy to do inconsistently
Free-form prompting drifts across runs and burns tokens. Cratekeeper uses the Anthropic SDK with a fixed tag vocabulary (energy / function / crowd / mood), prompt caching, a pre-flight cost estimate, and live token usage during the run.

### Problem 5: Destructive tag and file operations need a safety net
Overwriting tags on a real library is high-risk. Cratekeeper takes a byte-exact per-file backup before every tag write, offers a dedicated undo job to restore the originals, and funnels every destructive action through a Quality-Gate panel and an immutable audit log.

## Key Features
- End-to-end 11-step pipeline (fetch → enrich → classify → review → scan → match → analyze → classify-tags → apply → build event → build library) with per-step checkpoints
- Local audio analysis: BPM, key, energy, and mood via Essentia + TF models, native on Apple Silicon
- LLM tag classification using Anthropic Sonnet, with prompt caching and a pre-flight cost preview
- Reversible tag writes with byte-level per-file backups and a one-click undo job
- Per-event folder builds and a curated Master Library accumulator on disk in `Genre/Artist - Title.ext` layout, deduped across events
- Tidal listen / purchase URL export for unmatched tracks so the DJ can fill catalog gaps
- Guided per-event step rail with review lanes for low-confidence classifications and pre-flight quality checks
- Resumable jobs with SSE progress streams (last-event-id replay) and a 1-heavy / 4-light concurrency model
- Immutable audit log of every state-changing action, queryable from the UI
