# Data Shape

## Entities

### Track
The central entity — a song known to the system. Carries Spotify metadata (title, artist, album, ISRC, duration), the resolved local file path on the NAS (when matched), and the assigned genre bucket. Tracks accumulate across events; a curated subset are promoted into the Master Library.

Library membership fields:
- `origin`: `"manual"` (added directly to the Master Library outside any event) or `"promoted"` (starred from an event's Match panel) or `null` (event-only track, not in the Master Library).
- `isMasterpiece`: derived boolean — true when `origin` is set.
- `promotedFromEventId`: optional reference to the source event when `origin === "promoted"`.
- `addedToLibraryAt`: timestamp of library admission.

File-presence fields (Master Library tracks only — the Master Library lives on the local OS disk):
- `localFilePresence`: `"present" | "missing" | "unknown"`.
- `lastVerifiedAt`: timestamp of the last verify-library job that touched this entry.
- `fileSizeOnDisk`: bytes recorded at last verification (used for drift detection against the size recorded at promotion / add time).

### MoodAnalysis
The audio-derived fingerprint of a track: BPM, musical key, energy, mood probabilities, and arousal/valence. Produced by the local Essentia + TF analyzer and consumed by the LLM tag step and the DJ during set planning.

### TrackTags
The LLM-assigned structured tags for a track using the fixed vocabulary: energy, function, crowd, and mood. Distinct from MoodAnalysis because it's authored by Anthropic Sonnet, has its own cost/audit story, and can be re-generated independently.

### Event
A single gig being prepared (wedding, corporate party). Owns a slug, a source Spotify playlist URL, its current step status across the 11-step pipeline, and the per-event output folder on disk.

### EventTrack
A track's membership in an event. Holds event-scoped state — match status, classification confidence, review decisions, tag-write status — without polluting the canonical Track.

### GenreBucket
One of the 18 genre classifications used to sort tracks into folders. Editable, reorderable, and may carry a fallback flag for the "unknown" bucket.

### Job
A single pipeline step run for an event (fetch, enrich, classify, scan, match, analyze-mood, classify-tags, apply-tags, undo-tags, build-event, build-library) or a library maintenance run (verify-library). Has a status, classification (heavy / light), and a live SSE stream while running.

`verify-library` is event-less: it walks every Master Library track's recorded path, stat()s the file, and updates `localFilePresence`, `lastVerifiedAt`, and `fileSizeOnDisk` on each entry. Surfaces drift (size changed) and missing files. Runs automatically on app launch and can be triggered manually from the Master Library page or Settings.

### Checkpoint
A per-unit progress record within a Job — per-track for analyze-mood, per-batch for classify-tags, per-file for apply-tags and builds. Lets a job resume from the first unprocessed unit after a crash or cancel.

### TagBackup
A byte-exact snapshot of an audio file taken before its tags were written. One per file per apply-tags run; consumed and removed by a successful undo-tags.

### Build
A materialized folder output — either a per-event folder or the Master Library. Tracks where it was built, when, and whether it has gone stale because tags or matches changed downstream.

### NasLibrary
Not a stored entity — a conceptual pool. The full set of audio files reachable on the NAS that the Match step searches against. The Match step prefers a Master Library hit when the same ISRC resolves to both pools; falls back to a NAS Library hit otherwise. Distinct from the Master Library (which is the curated, on-OS-disk subset).

### AuditEntry
A record of a state-changing action — who/what/when, the target kind and id, and any override reason. Every destructive action funnels through this entity; it is append-only.

### Setting
A stored configuration value — integration credentials (Spotify, Tidal, Anthropic), filesystem roots, the bearer token, the genre bucket order, and the Anthropic model + prompt-caching toggle. Sensitive values are encrypted at rest.

## Relationships

- Event has many EventTracks
- EventTrack belongs to one Event and references one Track
- Track has one MoodAnalysis
- Track has one TrackTags
- Track belongs to one GenreBucket
- Event has many Jobs
- Job has many Checkpoints
- Job produces many AuditEntries
- Event has many TagBackups (one per file per apply-tags run)
- Event has many Builds (per-event folder builds); the Master Library is a Build with no Event
- A Track's `localPath` resolves to either the Master Library (on local OS disk) or the NAS Library (search pool); Match prefers Master Library when both contain the same ISRC
- AuditEntry references any target entity by kind + id
- Setting stands alone (global configuration)
