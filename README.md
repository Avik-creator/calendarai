# CalendarAI - AI-Powered Calendar Management

A Next.js application that integrates Google Calendar with AI capabilities, allowing users to manage their calendar events through natural language conversations.

## Features

- **Google Calendar Integration**: Full CRUD operations for calendar events
- **AI-Powered Assistant**: Chat with your calendar using natural language
- **Tool Calling**: AI can perform calendar operations automatically
- **Real-time Streaming**: Chat responses stream in real-time
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## AI Capabilities

The AI assistant can help you with:

- **Viewing Events**: "Show me my events for this week"
- **Creating Events**: "Create a meeting with John tomorrow at 2 PM"
- **Updating Events**: "Change my 3 PM meeting to 4 PM"
- **Deleting Events**: "Delete my 3 PM meeting"
- **Date Queries**: "What's on my calendar today?"

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI**: AI SDK v5, Groq LLM
- **Calendar**: Google Calendar API, FullCalendar
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS, Radix UI

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Google Calendar API credentials
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd calendarai
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL=your_postgres_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Better Auth
AUTH_SECRET=your_auth_secret
```

4. Set up the database:

```bash
bun run db:generate
bun run db:migrate
```

5. Run the development server:

```bash
bun run dev
```

## Usage

### Chat with Your Calendar

1. Navigate to the calendar page
2. Click the "AI Assistant" button to open the chat sidebar
3. Ask questions in natural language:
   - "What meetings do I have today?"
   - "Schedule a team meeting for Friday at 2 PM"
   - "Show me my events for next week"

### Manual Calendar Management

- Click on calendar dates to create new events
- Click on existing events to view/edit/delete them
- Drag and drop events to reschedule them
- Use the calendar view switcher (month/week/day)

## API Endpoints

- `POST /api/chat` - AI chat endpoint with tool calling
- `GET /api/getCalendarEvents` - For Getting Events.
- `GET /api/auth/[...all]` - Authentication endpoints

## AI Tools

The AI has access to these calendar tools:

- `get_calendar_events` - Retrieve events for a date range
- `create_calendar_event` - Create new calendar events
- `update_calendar_event` - Modify existing events
- `delete_calendar_event` - Remove events
- `get_current_date` - Get current date/time information

## Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── calendar/          # Calendar page
│   └── actions/           # Server actions
├── components/            # React components
│   ├── ui/               # UI components
│   ├── calendar-client.tsx
│   └── chat-sidebar.tsx  # AI chat interface
├── lib/                  # Utility functions
│   ├── ai-tools.ts       # AI tool definitions
│   └── auth.ts           # Authentication
└── db/                   # Database schema and migrations
```

### Adding New AI Tools

1. Define the tool in `lib/ai-tools.ts`:

```typescript
{
  name: 'new_tool',
  description: 'Description of what the tool does',
  inputSchema: z.object({
    // Define input parameters
  }),
  execute: async (params) => {
    // Implement tool logic
  }
}
```

2. Add the tool to the API route in `app/api/chat/route.ts`

3. The AI will automatically be able to use the new tool

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
