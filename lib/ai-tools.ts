import { z } from "zod";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/app/actions/actions";

// Tool schemas for AI to understand what each tool does
export const calendarTools = {
  get_calendar_events: {
    description: "Get calendar events for a specific date range",
    inputSchema: z.object({
      start: z
        .string()
        .describe(
          'Start date in ISO string format (e.g., "2025-08-22T00:00:00Z")'
        ),
      end: z
        .string()
        .describe(
          'End date in ISO string format (e.g., "2025-08-22T23:59:59Z")'
        ),
    }),
    execute: async ({ start, end }: { start: string; end: string }) => {
      const result = await getCalendarEvents(start, end);
      if (result.success) {
        return {
          success: true,
          events:
            result.events?.map((event) => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              description: event.extendedProps?.description,
              attendees: event.extendedProps?.attendees,
            })) || [],
        };
      } else {
        return { success: false, error: result.error };
      }
    },
  },
  create_calendar_event: {
    description: "Create a new calendar event",
    inputSchema: z.object({
      summary: z.string().describe("Event title/summary"),
      description: z.string().optional().describe("Event description"),
      start: z.string().describe("Start date and time in ISO string format"),
      end: z.string().describe("End date and time in ISO string format"),
      attendees: z
        .array(z.string())
        .optional()
        .describe("Array of attendee email addresses"),
    }),
    execute: async ({
      summary,
      description,
      start,
      end,
      attendees,
    }: {
      summary: string;
      description?: string;
      start: string;
      end: string;
      attendees?: string[];
    }) => {
      const result = await createCalendarEvent({
        summary,
        description,
        start,
        end,
        attendees,
      });
      return result;
    },
  },
  update_calendar_event: {
    description: "Update an existing calendar event",
    inputSchema: z.object({
      id: z.string().describe("Event ID to update"),
      summary: z.string().describe("New event title/summary"),
      description: z.string().optional().describe("New event description"),
      start: z
        .string()
        .describe("New start date and time in ISO string format"),
      end: z.string().describe("New end date and time in ISO string format"),
      attendees: z
        .array(z.string())
        .optional()
        .describe("New array of attendee email addresses"),
    }),
    execute: async ({
      id,
      summary,
      description,
      start,
      end,
      attendees,
    }: {
      id: string;
      summary: string;
      description?: string;
      start: string;
      end: string;
      attendees?: string[];
    }) => {
      const result = await updateCalendarEvent({
        id,
        summary,
        description,
        start,
        end,
        attendees,
      });
      return result;
    },
  },
  delete_calendar_event: {
    description: "Delete a calendar event",
    inputSchema: z.object({
      id: z.string().describe("Event ID to delete"),
    }),
    execute: async ({ id }: { id: string }) => {
      const result = await deleteCalendarEvent(id);
      return result;
    },
  },
  get_current_date: {
    description: "Get the current date and time information",
    inputSchema: z.object({}),
    execute: async () => {
      const now = new Date();
      return {
        currentDate: now.toISOString(),
        currentDateFormatted: now.toLocaleDateString(),
        currentTimeFormatted: now.toLocaleTimeString(),
        dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
        month: now.toLocaleDateString("en-US", { month: "long" }),
        year: now.getFullYear(),
      };
    },
  },
};
