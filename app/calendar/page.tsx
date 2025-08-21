import CalendarClient from '@/components/calendar-client'
import { getCalendarEvents } from '@/app/actions/actions' // Adjust path as needed

export default async function CalendarPage() {
  // Get initial events for the current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)


  const initialEventsResult = await getCalendarEvents(
    startOfMonth.toISOString(),
    endOfMonth.toISOString()
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Google Calendar events
          </p>
        </div>

        <CalendarClient
          initialEvents={initialEventsResult.success ? initialEventsResult.events || [] : []}
          initialError={initialEventsResult.success ? null : initialEventsResult.error}
        />
      </div>
    </div>
  )
}
