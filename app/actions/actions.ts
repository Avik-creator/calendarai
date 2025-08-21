'use server'

import { calendar_v3, google } from 'googleapis'
import { EventInput } from '@fullcalendar/core'
import { auth } from '@/lib/auth' // Adjust path to your Better Auth instance
import { headers } from 'next/headers'

// Helper function to get authenticated calendar client
async function getAuthenticatedCalendar() {
  const session = await auth.api.getSession({
    headers: await headers()
  })



  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "google",
      userId: session?.user?.id,

    }
  })

  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  // Get the access token from the session
  // Note: This assumes you have the Google access token stored in the session
  // You might need to adjust this based on your Better Auth configuration


  if (!accessToken) {
    throw new Error('No access token available')
  }

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token: accessToken })

  return {
    calendar: google.calendar({ version: 'v3', auth: oauth2Client }),
    session
  }
}

export async function getCalendarEvents(start: string, end: string) {
  try {
    if (!start || !end) {
      throw new Error('Start and end dates are required')
    }

    const { calendar } = await getAuthenticatedCalendar()

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events: EventInput[] = response.data.items?.map((event) => ({
      id: event.id!,
      title: event.summary || 'Busy',
      start: event.start?.dateTime! || event.start?.date!,
      end: event.end?.dateTime! || event.end?.date!,
      allDay: !event.start?.dateTime,
      extendedProps: {
        description: event.description || '',
        attendees: event.attendees?.map((attendee) => attendee.email) || [],
        recurrence: event.recurrence || [],
        hangoutLink: event.hangoutLink || '',
        videoConferenceLink:
          event.conferenceData?.entryPoints?.find(
            (ep) => ep.entryPointType === 'video',
          )?.uri || '',
        responseStatus:
          event.attendees?.find((attendee) => attendee.self)?.responseStatus ||
          'accepted',
      },
    })) || []

    return { success: true, events }
  } catch (error: any) {
    console.error('Failed to fetch events:', error)
    return { success: false, error: error.message || 'Failed to fetch events' }
  }
}

export async function createCalendarEvent(eventData: {
  summary?: string
  description?: string
  start: string
  end: string
  attendees?: string[]
}) {
  try {
    if (!eventData.start || !eventData.end) {
      throw new Error('Start and end are required')
    }

    const { calendar, session } = await getAuthenticatedCalendar()

    const attendees = eventData.attendees?.length
      ? [
        ...eventData.attendees.map(email => ({ email })),
        {
          email: session.user.email,
        },
      ]
      : []

    const eventBody: calendar_v3.Schema$Event = {
      summary: eventData.summary || 'Appointment',
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventData.end,
        timeZone: 'UTC',
      },
      attendees,
    }

    if (eventData.attendees && eventData.attendees.length > 0) {
      eventBody.conferenceData = {
        createRequest: {
          requestId: Math.random().toString(36).substring(2),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      }
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventBody,
      conferenceDataVersion: 1,
    })

    return { success: true, event: response.data }
  } catch (error: any) {
    console.error('Failed to create event:', error)
    return { success: false, error: error.message || 'Failed to create event' }
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    const { calendar } = await getAuthenticatedCalendar()

    const response = await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    })

    return { success: true, event: response.data }
  } catch (error: any) {
    console.error('Failed to delete event:', error)
    return { success: false, error: error.message || 'Failed to delete event' }
  }
}

export async function updateCalendarEvent(eventData: {
  id: string
  summary: string
  description?: string
  start: string
  end: string
  attendees?: string[]
}) {
  try {
    if (!eventData.summary || !eventData.start || !eventData.end) {
      throw new Error('Summary, start, and end are required')
    }

    const { calendar, session } = await getAuthenticatedCalendar()

    const attendees = eventData.attendees?.length
      ? [
        ...eventData.attendees.map((attendee: string) => ({
          email: attendee,
        })),
        {
          email: session.user.email,
        },
      ]
      : []

    const eventBody: calendar_v3.Schema$Event = {
      id: eventData.id,
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventData.end,
        timeZone: 'UTC',
      },
      attendees,
      status: 'confirmed',
    }

    if (eventData.attendees && eventData.attendees.length > 0) {
      eventBody.conferenceData = {
        createRequest: {
          requestId: Math.random().toString(36).substring(2),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      }
    }

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventData.id,
      requestBody: eventBody,
      conferenceDataVersion: 1,
    })

    return { success: true, event: response.data }
  } catch (error: any) {
    console.error('Failed to update event:', error)
    return { success: false, error: error.message || 'Failed to update event' }
  }
}
