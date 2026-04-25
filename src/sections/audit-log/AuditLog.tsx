import data from "../../../product/sections/audit-log/data.json";
import { AuditLog } from "./components/AuditLog";
import type { AuditLogProps } from "../../../product/sections/audit-log/types";

const typedData = data as unknown as Pick<
  AuditLogProps,
  "entries" | "filterOptions" | "stats"
>;

export default function AuditLogPreview() {
  return (
    <AuditLog
      entries={typedData.entries}
      filterOptions={typedData.filterOptions}
      stats={typedData.stats}
      initialLiveTail={true}
      onToggleLiveTail={(next) => console.log("toggle live tail:", next)}
      onCopyPermalink={(url) => console.log("copy permalink:", url)}
      onExport={(format) => console.log("export:", format)}
      onExpandEntry={(id) => console.log("expand entry:", id)}
      onJumpToTarget={(target) =>
        console.log("jump to target:", target.kind, target.id)
      }
      onCopyEntryJson={(entry) =>
        console.log("copy entry as JSON:", entry.id)
      }
      onCopyEntryPermalink={(id) =>
        console.log("copy entry permalink:", id)
      }
      onCopyTargetId={(id) => console.log("copy target id:", id)}
    />
  );
}
