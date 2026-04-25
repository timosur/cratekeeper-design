// =============================================================================
// UI Data Shapes — Event Detail
// =============================================================================

export type StepStatus = "idle" | "running" | "succeeded" | "failed" | "stale" | "cancelled";

export type JobStatus = "running" | "queued" | "failed" | "succeeded" | "cancelled";

export type StepPhase =
  | "Intake"
  | "Classify"
  | "Library"
  | "Analysis"
  | "Tagging"
  | "Build & Sync";

export type StepId =
  | "fetch"
  | "enrich"
  | "classify"
  | "review"
  | "scan"
  | "match"
  | "analyze-mood"
  | "classify-tags"
  | "apply-tags"
  | "build-event"
  | "build-library"
  | "sync";

export interface TrackCounts {
  total: number;
  matched: number;
  tagged: number;
  synced: number;
}

export interface ActiveJob {
  id: string;
  label: string;
  status: JobStatus;
  /** 0..1 fraction complete; null when queued */
  progress: number | null;
  processedUnits: number;
  totalUnits: number;
  startedAt: string;
  elapsedMs: number;
  /** Estimated seconds remaining; null when unknown */
  etaSeconds: number | null;
}

export interface PipelineStep {
  id: StepId;
  phase: StepPhase;
  /** 1-based step number for display */
  index: number;
  label: string;
  description: string;
  status: StepStatus;
  /** ISO-8601 of last completed run; null if never run */
  lastRunAt: string | null;
  /** Duration of the last successful run in milliseconds; null if not applicable */
  lastRunDurationMs: number | null;
  /** One-line summary of the last result */
  summary: string;
  /** Set when status is "running"; describes the live job */
  activeJob?: ActiveJob;
}

export interface QualityGate {
  /** Aggregate status across all checks */
  status: "pass" | "warning" | "fail";
  failingCount: number;
  warningCount: number;
  lastCheckedAt: string;
}

export interface QualityCheck {
  id: string;
  label: string;
  severity: "info" | "warning" | "error";
  status: "pass" | "warn" | "fail";
  detail: string;
}

export type StaleBuildKind = "event-folder" | "master-library";

export interface StaleBuild {
  kind: StaleBuildKind;
  reason: string;
  affectedSince: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  actor: "operator" | "system";
  /** Dot-namespaced action, e.g. "job.start", "review.bulk-rebucket" */
  action: string;
  targetKind: string;
  targetId: string;
  summary: string;
}

export interface EventDetail {
  id: string;
  name: string;
  slug: string;
  /** ISO date YYYY-MM-DD */
  eventDate: string;
  playlistUrl: string;
  trackCounts: TrackCounts;
  qualityGate: QualityGate;
  staleBuilds: StaleBuild[];
  /** Step id of the currently focused step in the right panel */
  activeStepId: StepId;
  /** Always 12 entries, ordered by index */
  steps: PipelineStep[];
  recentActivity: ActivityEntry[];
}

// -----------------------------------------------------------------------------
// Per-step detail datasets
// -----------------------------------------------------------------------------

export interface GenreDistributionEntry {
  bucket: string;
  count: number;
}

export interface ReviewTrack {
  id: string;
  artist: string;
  title: string;
  currentBucket: string;
  suggestedBucket: string;
  /** 0..1 — lower means more likely to need manual review */
  confidence: number;
}

export type MatchKind = "isrc" | "exact" | "fuzzy";

export interface MatchedTrack {
  id: string;
  artist: string;
  title: string;
  isrc: string;
  filePath: string;
  matchKind: MatchKind;
  spotifyUrl: string;
  tidalUrl: string;
  /** True when this track has been promoted into the curated Master Library. */
  promotedToLibrary: boolean;
}

export interface MissedTrack {
  id: string;
  artist: string;
  title: string;
  isrc: string;
  spotifyUrl: string;
  tidalPurchaseUrl: string;
}

export interface MatchResults {
  matched: MatchedTrack[];
  misses: MissedTrack[];
}

export type MoodAnalysisStatus = "queued" | "running" | "succeeded" | "failed";

export interface MoodAnalysisRow {
  id: string;
  artist: string;
  title: string;
  status: MoodAnalysisStatus;
  bpm: number | null;
  key: string | null;
  /** 0..1 */
  energy: number | null;
  /** 0..1 */
  valence: number | null;
  errorMessage?: string;
}

export interface TagCostEstimate {
  model: string;
  tracks: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedUsd: number;
  promptCachingEnabled: boolean;
  estimatedAt: string;
}

export type SyncService = "spotify" | "tidal";

export type SyncStatus = "not-run" | "running" | "succeeded" | "failed";

export interface SyncResult {
  service: SyncService;
  status: SyncStatus;
  lastSyncedAt: string | null;
  playlistUrl: string | null;
  isrcMatched: number | null;
  isrcMissed: number | null;
}

export interface SyncResults {
  spotify: SyncResult;
  tidal: SyncResult;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "metric";

export interface JobLogLine {
  ts: string;
  level: LogLevel;
  message: string;
}

export interface EventDetailDetails {
  classifyDistribution: GenreDistributionEntry[];
  reviewTracks: ReviewTrack[];
  matchResults: MatchResults;
  moodAnalysisRows: MoodAnalysisRow[];
  tagCostEstimate: TagCostEstimate;
  syncResults: SyncResults;
  jobLogLines: JobLogLine[];
  qualityChecks: QualityCheck[];
}

// =============================================================================
// Component Props
// =============================================================================

export interface EventDetailProps {
  /** The event being viewed, with all 12 steps and top-level state */
  event: EventDetail;
  /** Per-step detail datasets used by the right panel */
  details: EventDetailDetails;
  /** Called when the user selects a step in the left rail */
  onSelectStep?: (stepId: StepId) => void;
  /** Called when the user clicks Run / primary action on a step */
  onRunStep?: (stepId: StepId) => void;
  /** Called when the user pauses an in-flight job */
  onPauseJob?: (jobId: string) => void;
  /** Called when the user cancels an in-flight job */
  onCancelJob?: (jobId: string) => void;
  /** Called when the user resumes a failed/cancelled job from its last checkpoint */
  onResumeJob?: (stepId: StepId) => void;
  /** Called when the user kicks off a dry-run (apply-tags, build-event, build-library) */
  onDryRunStep?: (stepId: StepId) => void;
  /** Called when the user opens the Quality Checks side sheet */
  onOpenQualityChecks?: () => void;
  /** Called when the user submits a typed override of a quality-gate failure */
  onOverrideQualityGate?: (reason: string) => void;
  /** Called when the user bulk re-buckets selected review tracks */
  onBulkRebucket?: (trackIds: string[], targetBucket: string) => void;
  /** Called when the user requests a fresh tag-cost estimate before classify-tags */
  onEstimateTagCost?: () => void;
  /** Called when the user dispatches the LLM tag classification job */
  onDispatchTagClassification?: () => void;
  /** Called when the user clicks Undo on Apply Tags */
  onUndoTags?: () => void;
  /** Called when the user copies a Tidal purchase URL from the Match misses list */
  onCopyTidalUrl?: (url: string) => void;
  /** Called when the user reveals a matched track's local file in the OS file manager */
  onOpenLocalFile?: (filePath: string) => void;
  /** Called when the user opens a track on Spotify */
  onOpenSpotify?: (url: string) => void;
  /** Called when the user opens a track on Tidal */
  onOpenTidal?: (url: string) => void;
  /** Called when the user toggles a matched track's promotion to the curated Master Library. `next` is the new state. */
  onPromoteToLibrary?: (trackId: string, next: boolean) => void;
  /** Called when the user bulk-exports all missing tracks as Tidal purchase URLs (clipboard / .txt download) */
  onExportMissesTidalUrls?: (urls: string[]) => void;
  /** Called when the user opens a synced Spotify or Tidal playlist URL */
  onOpenSyncedPlaylist?: (service: SyncService, url: string) => void;
  /** Called when the user clicks "View all in Audit Log" in the recent activity footer */
  onViewAllActivity?: () => void;
}
