import { groq } from '@ai-sdk/groq'
import { streamText, tool, convertToModelMessages, UIMessage, generateObject } from 'ai'
import { calendarTools } from '@/lib/ai-tools'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    // Create tool definitions for the AI using the tool helper
    const tools = {
      get_calendar_events: tool({
        description: calendarTools.get_calendar_events.description,
        inputSchema: calendarTools.get_calendar_events.inputSchema,
        execute: calendarTools.get_calendar_events.execute,
      }),
      create_calendar_event: tool({
        description: calendarTools.create_calendar_event.description,
        inputSchema: calendarTools.create_calendar_event.inputSchema,
        execute: calendarTools.create_calendar_event.execute,
      }),
      update_calendar_event: tool({
        description: calendarTools.update_calendar_event.description,
        inputSchema: calendarTools.update_calendar_event.inputSchema,
        execute: calendarTools.update_calendar_event.execute,
      }),
      delete_calendar_event: tool({
        description: calendarTools.delete_calendar_event.description,
        inputSchema: calendarTools.delete_calendar_event.inputSchema,
        execute: calendarTools.delete_calendar_event.execute,
      }),
      get_current_date: tool({
        description: calendarTools.get_current_date.description,
        inputSchema: calendarTools.get_current_date.inputSchema,
        execute: calendarTools.get_current_date.execute,
      }),
    }

    // Stream AI response with tool calling
    const result = streamText({
        model: groq('gemma2-9b-it'),
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that can help with calendar events. You can use the following tools to help with calendar events: ${Object.keys(tools).join(', ')}. 
            You are currently in the year ${new Date().getFullYear()}. 
            You are currently in the month of ${new Date().getMonth()}.
            You are currently in the day of ${new Date().getDate()}.
            You are currently in the hour of ${new Date().getHours()}.
            You are currently in the minute of ${new Date().getMinutes()}.
            You are currently in the second of ${new Date().getSeconds()}.
            If there are no bookings for the current day, you should say "No bookings found for today".
            If there are no bookings for the current month, you should say "No bookings found for this month".
            If there are no bookings for the current year, you should say "No bookings found for this year".
            If there are no bookings for the current week, you should say "No bookings found for this week".
            If there are no bookings for the current day, you should say "No bookings found for today".
            If there are no bookings for the current month, you should say "No bookings found for this month".
            If there are no bookings for the current year, you should say "No bookings found for this year".
            If there are no bookings for the current week, you should say "No bookings found for this week".
            `
          },
          ...convertToModelMessages(messages)
        ],
        tools,
      })

    // Return streaming response
    return result.toUIMessageStreamResponse()

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
