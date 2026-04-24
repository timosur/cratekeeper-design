import data from "../../../product/sections/dashboard/data.json";
import type { EventCard } from "../../../product/sections/dashboard/types";
import { Dashboard } from "./components/Dashboard";

export default function DashboardPreview() {
  return (
    <Dashboard
      events={data.events as EventCard[]}
      onCreateEvent={() => console.log("Create new event")}
      onOpenEvent={(id) => console.log("Open event:", id)}
      onResumeJob={(eventId, jobId) =>
        console.log("Resume job:", { eventId, jobId })
      }
    />
  );
}
