import data from "../../../product/sections/events/data.json";
import type { EventCard } from "../../../product/sections/events/types";
import { Dashboard } from "./components/Dashboard";

export default function DashboardPreview() {
  return (
    <Dashboard
      events={data.events as EventCard[]}
      onCreateEvent={() => console.log("Create new event")}
      onOpenEvent={(id) => {
        console.log("Open event:", id);
        // Inside the clickdummy, navigate to the Event Detail screen.
        window.dispatchEvent(
          new CustomEvent("cratekeeper:navigate", {
            detail: { sectionId: "event-detail", eventId: id },
          }),
        );
      }}
      onResumeJob={(eventId, jobId) =>
        console.log("Resume job:", { eventId, jobId })
      }
    />
  );
}
