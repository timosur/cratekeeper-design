// =============================================================================
// UI Data Shapes — These define the data the components expect to receive
// =============================================================================

export type AudioFormat = "FLAC" | "WAV" | "AIFF" | "MP3";

export type CamelotKey =
  | "1A" | "1B" | "2A" | "2B" | "3A" | "3B"
  | "4A" | "4B" | "5A" | "5B" | "6A" | "6B"
  | "7A" | "7B" | "8A" | "8B" | "9A" | "9B"
  | "10A" | "10B" | "11A" | "11B" | "12A" | "12B";

/** How a track entered the master library. */
export type TrackOrigin = "manual" | "promoted";

export interface LibraryHealth {
  /** Percentage of tracks with full Spotify metadata + tags written */
  tagsPercent: number;
  /** Percentage of tracks with embedded artwork */
  artworkPercent: number;
  /** Percentage of tracks with completed mood/BPM/key analysis */
  analysisPercent: number;
}

export interface LibraryOverview {
  /** Total number of curated masterpieces in the library */
  totalTracks: number;
  /** Total bytes used on disk by all tracks */
  totalStorageBytes: number;
  /** Number of distinct events these masterpieces have been used in */
  eventsServed: number;
  /** Health coverage percentages */
  health: LibraryHealth;
  /** ISO timestamp of the last library refresh */
  lastUpdatedAt: string;
}

export interface BucketStat {
  id: string;
  name: string;
  /** Number of tracks in this bucket */
  trackCount: number;
  /** Total bytes used by tracks in this bucket */
  storageBytes: number;
  /** Share of the total library, 0–100 */
  percentOfLibrary: number;
  /** ISO timestamp of the most recently added track in this bucket; null if empty */
  lastAddedAt: string | null;
}

/** Reference to the most recent event a track was used in, if any. */
export interface LastUsedInEvent {
  eventId: string;
  eventName: string;
  /** ISO timestamp the track was loaded into that event */
  date: string;
}

export interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  /** The genre bucket this track lives in */
  bucketId: string;
  bucketName: string;
  /** Beats per minute from analysis */
  bpm: number;
  /** Camelot wheel key from analysis */
  key: CamelotKey;
  /** How this track came to be in the library */
  origin: TrackOrigin;
  /** The source event for promoted tracks; null for manually added tracks */
  sourceEventId: string | null;
  sourceEventName: string | null;
  /** Number of events this masterpiece has been used in */
  timesUsed: number;
  /** Most recent event the track appeared in; null if never used */
  lastUsedInEvent: LastUsedInEvent | null;
  /** ISO timestamp the track was added to the library */
  addedAt: string;
  format: AudioFormat;
  fileSizeBytes: number;
  /** Absolute filesystem path to the audio file */
  filePath: string;
}

export interface BucketFilterOption {
  id: string;
  name: string;
  trackCount: number;
}

export interface FilterOptions {
  /** Buckets that may appear as filter chips */
  buckets: BucketFilterOption[];
  /** Camelot keys available in the library */
  keys: CamelotKey[];
  /** File formats present in the library */
  formats: AudioFormat[];
  /** Lower bound for the BPM range slider */
  bpmMin: number;
  /** Upper bound for the BPM range slider */
  bpmMax: number;
}

// =============================================================================
// Component Props
// =============================================================================

export interface MasterLibraryProps {
  /** Library-wide totals and health */
  overview: LibraryOverview;
  /** Per-genre breakdown rows */
  buckets: BucketStat[];
  /** Track rows (a representative slice; pagination is handled in the component) */
  tracks: LibraryTrack[];
  /** Distinct values used to populate the filter bar */
  filterOptions: FilterOptions;

  // Browse / drill
  /** Called when the user clicks a genre row to filter the track table */
  onSelectBucket?: (bucketId: string) => void;
  /** Called when the user clicks a track row to reveal it in the OS file explorer */
  onRevealInFinder?: (track: LibraryTrack) => void;
  /** Called when the user clicks the source event link in a track row */
  onOpenSourceEvent?: (eventId: string) => void;

  // Add tracks (3 entry points)
  /** Called when the user clicks the primary "+ Add track" button */
  onAddTrack?: () => void;
  /** Called when the user clicks "Import from Spotify" */
  onImportFromSpotify?: () => void;
  /** Called when audio files are dropped onto the page */
  onDropAudioFiles?: (files: File[]) => void;

  // Promote from events
  /** Called when the user clicks "Promote from event" to open the bulk promotion view */
  onPromoteFromEvent?: () => void;

  // Remove
  /** Called when the user confirms removing a track from the library (file on disk is preserved) */
  onRemoveFromLibrary?: (track: LibraryTrack) => void;
}
