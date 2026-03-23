import { NextRequest } from "next/server";
import { success, error, handleError } from "@/lib/api-response";
import { googleCalendarService } from "@/modules/google-calendar/google-calendar.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const task = await googleCalendarService.createEventFromTask(
      id,
      body.dateTime,
    );
    return success(task);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("ya está en Google Calendar"))
        return error(err.message, 409);
      if (err.message.includes("no conectado"))
        return error(err.message, 401);
    }
    return handleError(err);
  }
}
