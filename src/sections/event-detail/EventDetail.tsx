import data from "../../../product/sections/event-detail/data.json";
import type {
  EventDetail as EventDetailData,
  EventDetailDetails,
} from "../../../product/sections/event-detail/types";
import { EventDetail } from "./components/EventDetail";

export default function EventDetailPreview() {
  return (
    <EventDetail
      event={data.event as EventDetailData}
      details={data.details as EventDetailDetails}
      onSelectStep={(id) => console.log("select step", id)}
      onRunStep={(id) => console.log("run step", id)}
      onPauseJob={(id) => console.log("pause job", id)}
      onCancelJob={(id) => console.log("cancel job", id)}
      onResumeJob={(id) => console.log("resume step", id)}
      onDryRunStep={(id) => console.log("dry run step", id)}
      onOpenQualityChecks={() => console.log("open quality checks")}
      onOverrideQualityGate={(reason) => console.log("override gate:", reason)}
      onBulkRebucket={(ids, bucket) => console.log("rebucket", ids, "->", bucket)}
      onEstimateTagCost={() => console.log("estimate tag cost")}
      onDispatchTagClassification={() => console.log("dispatch tags")}
      onUndoTags={() => console.log("undo tags")}
      onCopyTidalUrl={(url) => {
        navigator.clipboard?.writeText(url);
        console.log("copy tidal url", url);
      }}
      onOpenLocalFile={(filePath) => console.log("reveal local file", filePath)}
      onOpenSpotify={(url) => window.open(url, "_blank", "noopener,noreferrer")}
      onOpenTidal={(url) => window.open(url, "_blank", "noopener,noreferrer")}
      onExportMissesTidalUrls={(urls) => {
        navigator.clipboard?.writeText(urls.join("\n"));
        console.log(`exported ${urls.length} tidal URLs to clipboard`);
      }}
      onOpenSyncedPlaylist={(svc, url) => console.log("open synced", svc, url)}
      onViewAllActivity={() => console.log("view all activity")}
    />
  );
}
