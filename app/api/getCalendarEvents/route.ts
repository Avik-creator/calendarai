import { NextRequest, NextResponse } from "next/server";
import { getCalendarEvents } from "@/app/actions/actions";
export async function GET(req: NextRequest, res: NextResponse) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const initialEventsResult = await getCalendarEvents(
    startOfMonth.toISOString(),
    endOfMonth.toISOString()
  );
  return NextResponse.json(initialEventsResult);
}
