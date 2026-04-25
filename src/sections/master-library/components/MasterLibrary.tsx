import { useEffect, useMemo, useRef, useState } from "react";
import {
  Disc3,
  HardDrive,
  CalendarDays,
  Activity,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Plus,
  Star,
  Music2,
  Sparkles,
  UploadCloud,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type {
  AudioFormat,
  BucketStat,
  CamelotKey,
  LibraryTrack,
  MasterLibraryProps,
} from "../../../../product/sections/master-library/types";

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────

const mono: React.CSSProperties = {
  fontFamily:
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontVariantNumeric: "tabular-nums",
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  const decimals = i >= 3 ? (value < 10 ? 2 : 1) : 0;
  return `${value.toFixed(decimals)} ${units[i]}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatRelative(iso: string | null): string {
  if (!iso) return "Never";
  const ts = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.max(0, Math.floor((now - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

function truncatePath(path: string, max = 56): string {
  if (path.length <= max) return path;
  const head = Math.floor((max - 3) * 0.4);
  const tail = max - 3 - head;
  return `${path.slice(0, head)}\u2026${path.slice(path.length - tail)}`;
}

function healthAccent(pct: number): string {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-red-500";
}

function healthText(pct: number): string {
  if (pct >= 90) return "text-emerald-700 dark:text-emerald-400";
  if (pct >= 75) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// shared atoms
// ─────────────────────────────────────────────────────────────────────────────

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  trailing,
  subtitle,
}: {
  title: React.ReactNode;
  trailing?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="flex-shrink-0">{trailing}</div> : null}
    </div>
  );
}

function Chip({
  children,
  active = false,
  onClick,
  count,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  const base =
    "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300";
  const activeStyle =
    "border-sky-500 dark:border-sky-500 bg-sky-500 text-white shadow-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11.5px] font-medium transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
        active ? activeStyle : base
      }`}
    >
      <span>{children}</span>
      {count !== undefined ? (
        <span
          className={`tabular-nums ${
            active
              ? "text-white/80"
              : "text-neutral-500 dark:text-neutral-500"
          }`}
          style={mono}
        >
          {formatNumber(count)}
        </span>
      ) : null}
    </button>
  );
}

function PrimaryBtn({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-[12px] font-medium transition-colors shadow-sm"
    >
      {icon}
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick,
  icon,
  title,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 text-[12px] font-medium transition-colors"
    >
      {icon}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// overview strip
// ─────────────────────────────────────────────────────────────────────────────

function OverviewStrip({
  overview,
}: {
  overview: MasterLibraryProps["overview"];
}) {
  const { totalTracks, totalStorageBytes, eventsServed, health, lastUpdatedAt } =
    overview;
  const overall = Math.round(
    (health.tagsPercent + health.artworkPercent + health.analysisPercent) / 3,
  );

  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Master Library
          </h2>
          <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
            Your curated collection {"\u2014"} masterpieces and every-event essentials.
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400"
          style={mono}
        >
          <RefreshCw className="w-3 h-3" />
          updated {formatRelative(lastUpdatedAt)}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          icon={<Sparkles className="w-4 h-4" />}
          label="Masterpieces"
          value={formatNumber(totalTracks)}
        />
        <StatTile
          icon={<HardDrive className="w-4 h-4" />}
          label="Storage used"
          value={formatBytes(totalStorageBytes)}
        />
        <StatTile
          icon={<CalendarDays className="w-4 h-4" />}
          label="Events served"
          value={formatNumber(eventsServed)}
        />
        <HealthTile overall={overall} health={health} />
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
        {label}
      </div>
      <div
        className="mt-1.5 text-[22px] font-semibold text-neutral-900 dark:text-neutral-100 leading-none"
        style={mono}
      >
        {value}
      </div>
    </Card>
  );
}

function HealthTile({
  overall,
  health,
}: {
  overall: number;
  health: MasterLibraryProps["overview"]["health"];
}) {
  const segments: Array<{ label: string; pct: number }> = [
    { label: "Tags", pct: health.tagsPercent },
    { label: "Artwork", pct: health.artworkPercent },
    { label: "Analysis", pct: health.analysisPercent },
  ];

  return (
    <Card className="px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          <Activity className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          Library health
        </div>
        <span
          className={`text-[11px] font-semibold ${healthText(overall)}`}
          style={mono}
        >
          {overall}%
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {segments.map((s) => (
          <div key={s.label}>
            <div className="h-1.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                className={`h-full ${healthAccent(s.pct)}`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400">
                {s.label}
              </span>
              <span
                className={`text-[10.5px] ${healthText(s.pct)}`}
                style={mono}
              >
                {s.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// genres table
// ─────────────────────────────────────────────────────────────────────────────

type BucketSortKey =
  | "name"
  | "trackCount"
  | "storageBytes"
  | "percentOfLibrary"
  | "lastAddedAt";

function GenresTable({
  buckets,
  selectedBucketIds,
  onToggleBucket,
}: {
  buckets: BucketStat[];
  selectedBucketIds: string[];
  onToggleBucket: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<BucketSortKey>("trackCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...buckets];
    copy.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "name":
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
          break;
        case "lastAddedAt":
          av = a.lastAddedAt ? new Date(a.lastAddedAt).getTime() : 0;
          bv = b.lastAddedAt ? new Date(b.lastAddedAt).getTime() : 0;
          break;
        default:
          av = a[sortKey] as number;
          bv = b[sortKey] as number;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [buckets, sortKey, sortDir]);

  const handleSort = (key: BucketSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <>
            Genres{" "}
            <span className="text-neutral-400 dark:text-neutral-500 font-normal">
              {"\u00b7"} {buckets.length} buckets
            </span>
          </>
        }
        subtitle="Click a row to filter the track table below."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left bg-neutral-50/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
              <SortHeader
                label="Bucket"
                active={sortKey === "name"}
                dir={sortDir}
                onClick={() => handleSort("name")}
                className="pl-5 pr-3 py-2 w-[28%]"
              />
              <SortHeader
                label="Tracks"
                active={sortKey === "trackCount"}
                dir={sortDir}
                onClick={() => handleSort("trackCount")}
                align="right"
                className="px-3 py-2 w-[12%]"
              />
              <SortHeader
                label="Storage"
                active={sortKey === "storageBytes"}
                dir={sortDir}
                onClick={() => handleSort("storageBytes")}
                align="right"
                className="px-3 py-2 w-[14%]"
              />
              <SortHeader
                label="% of library"
                active={sortKey === "percentOfLibrary"}
                dir={sortDir}
                onClick={() => handleSort("percentOfLibrary")}
                className="px-3 py-2 w-[28%]"
              />
              <SortHeader
                label="Last added"
                active={sortKey === "lastAddedAt"}
                dir={sortDir}
                onClick={() => handleSort("lastAddedAt")}
                align="right"
                className="px-3 pr-5 py-2 w-[18%]"
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((b) => {
              const empty = b.trackCount === 0;
              const selected = selectedBucketIds.includes(b.id);
              return (
                <tr
                  key={b.id}
                  onClick={() => !empty && onToggleBucket(b.id)}
                  className={`group border-b last:border-b-0 border-neutral-100 dark:border-neutral-800/60 transition-colors ${
                    empty
                      ? "cursor-default opacity-50"
                      : "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  } ${selected ? "bg-sky-50/60 dark:bg-sky-950/30" : ""}`}
                >
                  <td className="pl-5 pr-3 py-2.5 relative">
                    {selected ? (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-sky-500" />
                    ) : null}
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {b.name}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2.5 text-right text-neutral-700 dark:text-neutral-300"
                    style={mono}
                  >
                    {empty ? "\u2014" : formatNumber(b.trackCount)}
                  </td>
                  <td
                    className="px-3 py-2.5 text-right text-neutral-700 dark:text-neutral-300"
                    style={mono}
                  >
                    {empty ? "\u2014" : formatBytes(b.storageBytes)}
                  </td>
                  <td className="px-3 py-2.5">
                    {empty ? (
                      <span
                        className="text-neutral-400 dark:text-neutral-600"
                        style={mono}
                      >
                        {"\u2014"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className={`h-full ${
                              selected
                                ? "bg-sky-500"
                                : "bg-neutral-400 dark:bg-neutral-600 group-hover:bg-sky-500"
                            } transition-colors`}
                            style={{
                              width: `${Math.max(2, b.percentOfLibrary * 5)}%`,
                            }}
                          />
                        </div>
                        <span
                          className="w-12 text-right text-neutral-600 dark:text-neutral-400"
                          style={mono}
                        >
                          {b.percentOfLibrary.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td
                    className="px-3 pr-5 py-2.5 text-right text-neutral-500 dark:text-neutral-400"
                    style={mono}
                  >
                    {b.lastAddedAt ? formatRelative(b.lastAddedAt) : "Never"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  align = "left",
  className = "",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      className={`text-[11px] font-medium uppercase tracking-wide ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 ${
          align === "right" ? "ml-auto" : ""
        } ${
          active
            ? "text-neutral-900 dark:text-neutral-100"
            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        }`}
      >
        {align === "right" ? (
          <>
            {active ? (
              dir === "asc" ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40" />
            )}
            {label}
          </>
        ) : (
          <>
            {label}
            {active ? (
              dir === "asc" ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 opacity-40" />
            )}
          </>
        )}
      </button>
    </th>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// tracks filter bar
// ─────────────────────────────────────────────────────────────────────────────

interface TracksFilterState {
  query: string;
  bucketIds: string[];
  bpmRange: [number, number];
  key: CamelotKey | "any";
  formats: AudioFormat[];
}

function TrackFilters({
  filterOptions,
  filters,
  setFilters,
  hasActive,
  onClear,
}: {
  filterOptions: MasterLibraryProps["filterOptions"];
  filters: TracksFilterState;
  setFilters: (next: TracksFilterState) => void;
  hasActive: boolean;
  onClear: () => void;
}) {
  const toggleBucket = (id: string) =>
    setFilters({
      ...filters,
      bucketIds: filters.bucketIds.includes(id)
        ? filters.bucketIds.filter((x) => x !== id)
        : [...filters.bucketIds, id],
    });

  const toggleFormat = (f: AudioFormat) =>
    setFilters({
      ...filters,
      formats: filters.formats.includes(f)
        ? filters.formats.filter((x) => x !== f)
        : [...filters.formats, f],
    });

  return (
    <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3.5">
      {/* search row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) =>
              setFilters({ ...filters, query: e.target.value })
            }
            placeholder={"Search title or artist\u2026"}
            className="w-full h-9 pl-8 pr-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[12.5px] placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-neutral-900 dark:text-neutral-100"
          />
        </div>
        {hasActive ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      {/* bucket chips */}
      <div>
        <FilterLabel>Buckets</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.buckets.map((b) => (
            <Chip
              key={b.id}
              active={filters.bucketIds.includes(b.id)}
              onClick={() => toggleBucket(b.id)}
              count={b.trackCount}
            >
              {b.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* bpm + key + formats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <FilterLabel>BPM range</FilterLabel>
          <BpmRange
            min={filterOptions.bpmMin}
            max={filterOptions.bpmMax}
            value={filters.bpmRange}
            onChange={(v) => setFilters({ ...filters, bpmRange: v })}
          />
        </div>

        <div className="lg:col-span-3">
          <FilterLabel>Key</FilterLabel>
          <select
            value={filters.key}
            onChange={(e) =>
              setFilters({
                ...filters,
                key: e.target.value as TracksFilterState["key"],
              })
            }
            className="w-full h-9 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[12.5px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            style={mono}
          >
            <option value="any">Any key</option>
            {filterOptions.keys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-4">
          <FilterLabel>Format</FilterLabel>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.formats.map((f) => (
              <Chip
                key={f}
                active={filters.formats.includes(f)}
                onClick={() => toggleFormat(f)}
              >
                {f}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1.5 text-[10.5px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
      {children}
    </div>
  );
}

function BpmRange({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const span = max - min;
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  return (
    <div className="h-9 flex items-center gap-3">
      <span
        className="text-[12px] text-neutral-700 dark:text-neutral-300 w-9 text-right"
        style={mono}
      >
        {lo}
      </span>
      <div className="relative flex-1 h-9 flex items-center">
        <div className="absolute left-0 right-0 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div
          className="absolute h-1 rounded-full bg-sky-500"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), hi);
            onChange([next, hi]);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-sky-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), lo);
            onChange([lo, next]);
          }}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-sky-500"
        />
      </div>
      <span
        className="text-[12px] text-neutral-700 dark:text-neutral-300 w-9"
        style={mono}
      >
        {hi}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// origin chip
// ─────────────────────────────────────────────────────────────────────────────

function OriginChip({
  origin,
  sourceEventName,
}: {
  origin: LibraryTrack["origin"];
  sourceEventName: string | null;
}) {
  if (origin === "promoted") {
    return (
      <span
        className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300"
        title={sourceEventName ? `Promoted from ${sourceEventName}` : "Promoted"}
      >
        <Star className="w-2.5 h-2.5 fill-current" />
        Promoted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center h-5 px-1.5 rounded text-[10.5px] font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
      Manual
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// tracks table
// ─────────────────────────────────────────────────────────────────────────────

type TrackSortKey =
  | "title"
  | "bucketName"
  | "bpm"
  | "origin"
  | "timesUsed"
  | "addedAt"
  | "fileSizeBytes";

const PAGE_SIZE = 50;

function TracksTable({
  tracks,
  filteredCount,
  totalCount,
  onRevealInFinder,
  onOpenSourceEvent,
  onRequestRemove,
}: {
  tracks: LibraryTrack[];
  filteredCount: number;
  totalCount: number;
  onRevealInFinder?: (track: LibraryTrack) => void;
  onOpenSourceEvent?: (eventId: string) => void;
  onRequestRemove: (track: LibraryTrack) => void;
}) {
  const [sortKey, setSortKey] = useState<TrackSortKey>("addedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...tracks];
    copy.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "title":
          av = a.title.toLowerCase();
          bv = b.title.toLowerCase();
          break;
        case "bucketName":
          av = a.bucketName.toLowerCase();
          bv = b.bucketName.toLowerCase();
          break;
        case "origin":
          av = a.origin;
          bv = b.origin;
          break;
        case "addedAt":
          av = new Date(a.addedAt).getTime();
          bv = new Date(b.addedAt).getTime();
          break;
        default:
          av = a[sortKey] as number;
          bv = b[sortKey] as number;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [tracks, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  const handleSort = (key: TrackSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "title" || key === "origin" ? "asc" : "desc");
    }
    setPage(1);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left bg-neutral-50/60 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
              <SortHeader
                label="Title / Artist"
                active={sortKey === "title"}
                dir={sortDir}
                onClick={() => handleSort("title")}
                className="pl-5 pr-3 py-2 w-[24%]"
              />
              <SortHeader
                label="Bucket"
                active={sortKey === "bucketName"}
                dir={sortDir}
                onClick={() => handleSort("bucketName")}
                className="px-3 py-2 w-[10%]"
              />
              <SortHeader
                label="BPM / Key"
                active={sortKey === "bpm"}
                dir={sortDir}
                onClick={() => handleSort("bpm")}
                align="right"
                className="px-3 py-2 w-[8%]"
              />
              <SortHeader
                label="Origin"
                active={sortKey === "origin"}
                dir={sortDir}
                onClick={() => handleSort("origin")}
                className="px-3 py-2 w-[16%]"
              />
              <SortHeader
                label="Used"
                active={sortKey === "timesUsed"}
                dir={sortDir}
                onClick={() => handleSort("timesUsed")}
                align="right"
                className="px-3 py-2 w-[10%]"
              />
              <SortHeader
                label="Added"
                active={sortKey === "addedAt"}
                dir={sortDir}
                onClick={() => handleSort("addedAt")}
                align="right"
                className="px-3 py-2 w-[10%]"
              />
              <SortHeader
                label="Size"
                active={sortKey === "fileSizeBytes"}
                dir={sortDir}
                onClick={() => handleSort("fileSizeBytes")}
                align="right"
                className="px-3 py-2 w-[10%]"
              />
              <th className="px-3 pr-5 py-2 w-[12%]" />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <div className="text-[13px] text-neutral-500 dark:text-neutral-400">
                    No tracks match the current filters.
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onRevealInFinder?.(t)}
                  className="group cursor-pointer border-b last:border-b-0 border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                >
                  <td className="pl-5 pr-3 py-2.5">
                    <div
                      className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[28ch]"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                    <div
                      className="text-[11.5px] text-neutral-500 dark:text-neutral-400 truncate max-w-[28ch]"
                      title={t.artist}
                    >
                      {t.artist}
                    </div>
                    <div
                      className="text-[10.5px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5"
                      style={mono}
                      title={t.filePath}
                    >
                      {truncatePath(t.filePath, 44)}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center h-5 px-1.5 rounded text-[10.5px] font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                      {t.bucketName}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right" style={mono}>
                    <div className="text-neutral-900 dark:text-neutral-100">
                      {t.bpm}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {t.key}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-1">
                      <OriginChip
                        origin={t.origin}
                        sourceEventName={t.sourceEventName}
                      />
                      {t.origin === "promoted" && t.sourceEventId && t.sourceEventName ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenSourceEvent?.(t.sourceEventId!);
                          }}
                          className="text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline truncate max-w-[18ch] text-left"
                          title={t.sourceEventName}
                        >
                          {t.sourceEventName}
                        </button>
                      ) : (
                        <span
                          className="text-[11px] text-neutral-400 dark:text-neutral-500"
                          style={mono}
                        >
                          {"\u2014"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right" style={mono}>
                    <div className="text-neutral-900 dark:text-neutral-100">
                      {t.timesUsed === 0 ? (
                        <span className="text-neutral-400 dark:text-neutral-500">0</span>
                      ) : (
                        `${t.timesUsed}\u00d7`
                      )}
                    </div>
                    <div
                      className="text-[10.5px] text-neutral-500 dark:text-neutral-400 truncate max-w-[12ch] ml-auto"
                      title={t.lastUsedInEvent?.eventName ?? undefined}
                    >
                      {t.lastUsedInEvent
                        ? formatRelative(t.lastUsedInEvent.date)
                        : "Never"}
                    </div>
                  </td>
                  <td
                    className="px-3 py-2.5 text-right text-neutral-600 dark:text-neutral-400"
                    style={mono}
                  >
                    {formatRelative(t.addedAt)}
                  </td>
                  <td className="px-3 py-2.5 text-right" style={mono}>
                    <div className="text-neutral-900 dark:text-neutral-100">
                      {formatBytes(t.fileSizeBytes)}
                    </div>
                    <div className="text-[10.5px] text-neutral-500 dark:text-neutral-400">
                      {t.format}
                    </div>
                  </td>
                  <td className="px-3 pr-5 py-2.5">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRevealInFinder?.(t);
                        }}
                        title="Reveal in Finder"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestRemove(t);
                        }}
                        title="Remove from library"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40">
        <div
          className="text-[11.5px] text-neutral-500 dark:text-neutral-400"
          style={mono}
        >
          Page{" "}
          <span className="text-neutral-900 dark:text-neutral-100">
            {safePage}
          </span>{" "}
          of {totalPages} {"\u00b7"}{" "}
          <span className="text-neutral-900 dark:text-neutral-100">
            {formatNumber(filteredCount)}
          </span>{" "}
          of {formatNumber(totalCount)} results
        </div>
        <div className="flex items-center gap-1">
          <PageBtn
            disabled={safePage === 1}
            onClick={() => setPage(1)}
            aria-label="First page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </PageBtn>
          <PageBtn
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </PageBtn>
          <PageBtn
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </PageBtn>
          <PageBtn
            disabled={safePage === totalPages}
            onClick={() => setPage(totalPages)}
            aria-label="Last page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </PageBtn>
        </div>
      </div>
    </>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
      {...rest}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// remove confirmation modal
// ─────────────────────────────────────────────────────────────────────────────

function RemoveConfirmModal({
  track,
  onCancel,
  onConfirm,
}: {
  track: LibraryTrack;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md mx-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-md bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                Remove from library?
              </h3>
              <p className="mt-1 text-[12.5px] text-neutral-600 dark:text-neutral-400">
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {track.title}
                </span>{" "}
                by {track.artist} will no longer be part of your master library.
              </p>
              <p className="mt-2 text-[11.5px] text-neutral-500 dark:text-neutral-500">
                The audio file on disk is{" "}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  not deleted
                </span>
                . You can re-add it any time.
              </p>
              <div
                className="mt-2.5 text-[10.5px] text-neutral-400 dark:text-neutral-500 truncate"
                style={mono}
                title={track.filePath}
              >
                {truncatePath(track.filePath, 60)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 rounded-b-md">
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white text-[12px] font-medium transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove from library
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// drag-and-drop overlay
// ─────────────────────────────────────────────────────────────────────────────

function DropOverlay() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-8">
      <div className="absolute inset-4 rounded-lg border-2 border-dashed border-sky-500 bg-sky-500/10 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-neutral-900 border border-sky-200 dark:border-sky-900 rounded-md px-6 py-5 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
          <UploadCloud className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
            Drop audio files to add to library
          </div>
          <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
            FLAC, WAV, AIFF, or MP3 {"\u2014"} we'll classify and analyze them.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// root
// ─────────────────────────────────────────────────────────────────────────────

export function MasterLibrary({
  overview,
  buckets,
  tracks,
  filterOptions,
  onSelectBucket,
  onRevealInFinder,
  onOpenSourceEvent,
  onAddTrack,
  onImportFromSpotify,
  onDropAudioFiles,
  onPromoteFromEvent,
  onRemoveFromLibrary,
}: MasterLibraryProps) {
  const [filters, setFilters] = useState<TracksFilterState>({
    query: "",
    bucketIds: [],
    bpmRange: [filterOptions.bpmMin, filterOptions.bpmMax],
    key: "any",
    formats: [],
  });

  const [pendingRemove, setPendingRemove] = useState<LibraryTrack | null>(null);

  // drag-and-drop state — uses a counter to handle nested dragenter/dragleave
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer || !Array.from(e.dataTransfer.types).includes("Files"))
        return;
      dragDepth.current += 1;
      setIsDragging(true);
    };
    const onDragLeave = () => {
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setIsDragging(false);
    };
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        onDropAudioFiles?.(Array.from(e.dataTransfer.files));
      }
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [onDropAudioFiles]);

  const hasActive =
    filters.query !== "" ||
    filters.bucketIds.length > 0 ||
    filters.formats.length > 0 ||
    filters.key !== "any" ||
    filters.bpmRange[0] !== filterOptions.bpmMin ||
    filters.bpmRange[1] !== filterOptions.bpmMax;

  const filteredTracks = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return tracks.filter((t) => {
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !t.artist.toLowerCase().includes(q)
      )
        return false;
      if (
        filters.bucketIds.length > 0 &&
        !filters.bucketIds.includes(t.bucketId)
      )
        return false;
      if (t.bpm < filters.bpmRange[0] || t.bpm > filters.bpmRange[1])
        return false;
      if (filters.key !== "any" && t.key !== filters.key) return false;
      if (filters.formats.length > 0 && !filters.formats.includes(t.format))
        return false;
      return true;
    });
  }, [tracks, filters]);

  const handleToggleBucket = (id: string) => {
    setFilters({
      ...filters,
      bucketIds: filters.bucketIds.includes(id)
        ? filters.bucketIds.filter((x) => x !== id)
        : [...filters.bucketIds, id],
    });
    onSelectBucket?.(id);
  };

  const handleClear = () =>
    setFilters({
      query: "",
      bucketIds: [],
      bpmRange: [filterOptions.bpmMin, filterOptions.bpmMax],
      key: "any",
      formats: [],
    });

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      onRemoveFromLibrary?.(pendingRemove);
      setPendingRemove(null);
    }
  };

  return (
    <div
      ref={rootRef}
      className="min-h-full bg-neutral-50 dark:bg-neutral-950 relative"
    >
      <div className="max-w-[1280px] mx-auto px-6 py-6 space-y-5">
        <OverviewStrip overview={overview} />

        <GenresTable
          buckets={buckets}
          selectedBucketIds={filters.bucketIds}
          onToggleBucket={handleToggleBucket}
        />

        <Card>
          <CardHeader
            title={
              <>
                Tracks{" "}
                <span className="text-neutral-400 dark:text-neutral-500 font-normal">
                  {"\u00b7"} {formatNumber(filteredTracks.length)} of{" "}
                  {formatNumber(tracks.length)} shown
                </span>
              </>
            }
            subtitle="Click a row to reveal the file in Finder."
            trailing={
              <div className="flex items-center gap-2">
                <SecondaryBtn
                  onClick={onImportFromSpotify}
                  icon={<Music2 className="w-3.5 h-3.5" />}
                  title="Import from Spotify URL"
                >
                  Spotify
                </SecondaryBtn>
                <SecondaryBtn
                  onClick={onPromoteFromEvent}
                  icon={<Star className="w-3.5 h-3.5" />}
                >
                  Promote from event
                </SecondaryBtn>
                <PrimaryBtn
                  onClick={onAddTrack}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add track
                </PrimaryBtn>
              </div>
            }
          />
          <TrackFilters
            filterOptions={filterOptions}
            filters={filters}
            setFilters={setFilters}
            hasActive={hasActive}
            onClear={handleClear}
          />
          <TracksTable
            tracks={filteredTracks}
            filteredCount={filteredTracks.length}
            totalCount={tracks.length}
            onRevealInFinder={onRevealInFinder}
            onOpenSourceEvent={onOpenSourceEvent}
            onRequestRemove={(t) => setPendingRemove(t)}
          />
        </Card>

        <div className="flex items-center justify-center gap-1.5 pt-2 pb-4 text-[11px] text-neutral-400 dark:text-neutral-600">
          <Disc3 className="w-3 h-3" />
          <span>
            Tip: drag audio files anywhere on this page to add them to the
            library.
          </span>
        </div>
      </div>

      {isDragging ? <DropOverlay /> : null}

      {pendingRemove ? (
        <RemoveConfirmModal
          track={pendingRemove}
          onCancel={() => setPendingRemove(null)}
          onConfirm={handleConfirmRemove}
        />
      ) : null}
    </div>
  );
}
