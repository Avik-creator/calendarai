import CalendarClient from "@/components/calendar-client";
import { getCalendarEvents } from "@/app/actions/actions"; // Adjust path as needed

export default async function CalendarPage() {
  // Get initial events for the current month
  const initialEvents = await fetch(
    "http://localhost:3000/api/getCalendarEvents",
    { next: { tags: ["initialEvents"] } }
  );
  const initialEventsResult = await initialEvents.json();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Google Calendar events with AI assistance
          </p>
        </div>

        <CalendarClient
          initialEvents={
            initialEventsResult.success ? initialEventsResult.events || [] : []
          }
          initialError={
            initialEventsResult.success ? null : initialEventsResult.error
          }
        />
      </div>
    </div>
  );
}
