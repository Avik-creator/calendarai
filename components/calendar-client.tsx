"use client";

import { useState, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventChangeArg,
} from "@fullcalendar/core";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Trash2,
  Edit,
  MessageCircle,
} from "lucide-react";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/app/actions/actions";
import EventModal from "./event-modal";
import ChatSidebar from "./chat-sidebar";

interface CalendarClientProps {
  initialEvents: EventInput[];
  initialError: string | null;
}

export default function CalendarClient({
  initialEvents,
  initialError,
}: CalendarClientProps) {
  const [events, setEvents] = useState<EventInput[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "view"
  );
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Fetch events for a specific date range
  const fetchEvents = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const result = await getCalendarEvents(
        start.toISOString(),
        end.toISOString()
      );
      if (result.success) {
        setEvents(result.events || []);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch events");
      }
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle date range changes (when user navigates months/weeks)
  const handleDatesSet = useCallback(
    (dateInfo: any) => {
      fetchEvents(dateInfo.start, dateInfo.end);
    },
    [fetchEvents]
  );

  // Handle date selection for creating new events
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedEvent({
      id: "",
      title: "",
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
    });
    setModalMode("create");
    setShowEventModal(true);
  }, []);

  // Handle event click for viewing/editing
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() || "",
      end: event.end?.toISOString() || "",
      allDay: event.allDay,
      extendedProps: event.extendedProps,
    });
    setModalMode("view");
    setShowEventModal(true);
  }, []);

  // Handle event updates (drag & drop, resize)
  const handleEventChange = useCallback(async (changeInfo: EventChangeArg) => {
    const event = changeInfo.event;

    try {
      const result = await updateCalendarEvent({
        id: event.id,
        summary: event.title,
        description: event.extendedProps?.description || "",
        start: event.start?.toISOString() || "",
        end: event.end?.toISOString() || "",
        attendees: event.extendedProps?.attendees || [],
      });

      if (!result.success) {
        // Revert the change if update failed
        changeInfo.revert();
        setError(result.error || "Failed to update event");
      }
    } catch (err) {
      changeInfo.revert();
      setError("Failed to update event");
    }
  }, []);

  // Create new event
  const handleCreateEvent = async (eventData: any) => {
    setLoading(true);
    try {
      const result = await createCalendarEvent(eventData);
      if (result.success) {
        // Refresh events
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
          const view = calendarApi.view;
          await fetchEvents(view.currentStart, view.currentEnd);
        }
        setShowEventModal(false);
        setError(null);
      } else {
        setError(result.error || "Failed to create event");
      }
    } catch (err) {
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  // Update existing event
  const handleUpdateEvent = async (eventData: any) => {
    setLoading(true);
    try {
      const result = await updateCalendarEvent(eventData);
      if (result.success) {
        // Refresh events
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
          const view = calendarApi.view;
          await fetchEvents(view.currentStart, view.currentEnd);
        }
        setShowEventModal(false);
        setError(null);
      } else {
        setError(result.error || "Failed to update event");
      }
    } catch (err) {
      setError("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    setLoading(true);
    try {
      const result = await deleteCalendarEvent(eventId);
      if (result.success) {
        // Refresh events
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
          const view = calendarApi.view;
          await fetchEvents(view.currentStart, view.currentEnd);
        }
        setShowEventModal(false);
        setError(null);
      } else {
        setError(result.error || "Failed to delete event");
      }
    } catch (err) {
      setError("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  // Refresh calendar events (called by chat sidebar)
  const handleRefreshCalendar = useCallback(async () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const view = calendarApi.view;
      await fetchEvents(view.currentStart, view.currentEnd);
    }
  }, [fetchEvents]);

  return (
    <>
      <div className="space-y-6">
        {error && (
          <Card className="p-4 border-destructive bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Calendar View</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChatSidebar(true)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                AI Assistant
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedEvent({
                    id: "",
                    title: "",
                    start: new Date().toISOString(),
                    end: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
                    allDay: false,
                  });
                  setModalMode("create");
                  setShowEventModal(true);
                }}
              >
                Add Event
              </Button>

              {loading && (
                <Badge variant="secondary" className="animate-pulse">
                  Loading...
                </Badge>
              )}
            </div>
          </div>

          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            datesSet={handleDatesSet}
            height="auto"
            eventContent={(eventInfo) => (
              <div className="flex items-center gap-1 p-1 overflow-hidden">
                <div className="flex-1 truncate text-xs">
                  {eventInfo.event.title}
                </div>
                {eventInfo.event.extendedProps?.videoConferenceLink && (
                  <Video className="w-3 h-3 flex-shrink-0" />
                )}
                {eventInfo.event.extendedProps?.attendees?.length > 0 && (
                  <Users className="w-3 h-3 flex-shrink-0" />
                )}
              </div>
            )}
          />
        </Card>

        <EventModal
          open={showEventModal}
          onClose={() => setShowEventModal(false)}
          event={selectedEvent}
          mode={modalMode}
          onSave={
            modalMode === "create" ? handleCreateEvent : handleUpdateEvent
          }
          onDelete={handleDeleteEvent}
          onEdit={() => setModalMode("edit")}
          loading={loading}
        />
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={showChatSidebar}
        onClose={() => setShowChatSidebar(false)}
        onRefreshCalendar={handleRefreshCalendar}
      />
    </>
  );
}
