import data from "../../../product/sections/master-library/data.json";
import type {
  BucketStat,
  FilterOptions,
  LibraryOverview,
  LibraryTrack,
} from "../../../product/sections/master-library/types";
import { MasterLibrary } from "./components/MasterLibrary";

export default function MasterLibraryPreview() {
  return (
    <MasterLibrary
      overview={data.library as LibraryOverview}
      buckets={data.buckets as BucketStat[]}
      tracks={data.tracks as LibraryTrack[]}
      filterOptions={data.filterOptions as FilterOptions}
      onSelectBucket={(id) => console.log("select bucket", id)}
      onRevealInFinder={(t) => console.log("reveal in Finder:", t.filePath)}
      onOpenSourceEvent={(id) => console.log("open source event", id)}
      onAddTrack={() => console.log("add track manually")}
      onImportFromSpotify={() => console.log("import from Spotify URL")}
      onDropAudioFiles={(files) =>
        console.log(
          "drop audio files",
          files.map((f) => f.name),
        )
      }
      onPromoteFromEvent={() => console.log("promote from event")}
      onRemoveFromLibrary={(t) =>
        console.log("remove from library:", t.title, "by", t.artist)
      }
    />
  );
}
