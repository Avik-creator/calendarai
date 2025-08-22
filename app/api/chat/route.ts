import { groq } from "@ai-sdk/groq";
import {
  streamText,
  tool,
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  generateId,
} from "ai";
import { calendarTools } from "@/lib/ai-tools";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { UIMessage } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

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
    };

    // Create UI message stream following the reference pattern
    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: groq("meta-llama/llama-4-maverick-17b-128e-instruct"),
          system: `You are a expert google calendar search assistant. You need to use it whenever the user asks for information from Google Calendar. To search for information, you can use the following parameters from the tools available to you.

          1. get_calendar_events: 
            - StartDate in ISO Format
            - EndDate in ISO Format
          2. create_calendar_event:
            - Summary of the event
            - Description of the event
            - Start date in ISO Format
            - End date in ISO Format
            - Attendees (emails) of the event
          3. update_calendar_event:
            - ID of the event to update
            - New summary of the event
            - New description of the event
            - New start date in ISO Format
            - New end date in ISO Format
            - New attendees (emails) of the event
          4. delete_calendar_event:
            - ID of the event to delete for which you can use get_calendar_events
          5. get_current_date:
            - No input parameters

Examples of good queries:
- "What are the events in this week for me."
- "Can you book an event on 2025-08-22?"
- "Can you delete the event on 2025-08-22?"
            `,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
          experimental_activeTools: [
            "get_calendar_events",
            "create_calendar_event",
            "update_calendar_event",
            "delete_calendar_event",
            "get_current_date",
          ],
          experimental_transform: smoothStream({ chunking: "word" }),
          tools,
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateId,
      onFinish: async ({ messages }) => {
        // Optional: Save messages to database if needed
        console.log("Conversation finished with messages:", messages);
      },
      onError: () => {
        return "Oops, an error occurred while processing your calendar request!";
      },
    });

    // Return the streaming response
    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
