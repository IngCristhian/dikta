import { success, handleError } from "@/lib/api-response";
import { googleCalendarService } from "@/modules/google-calendar/google-calendar.service";

export async function GET() {
  try {
    const connected = await googleCalendarService.isConnected();
    return success({ connected });
  } catch (err) {
    return handleError(err);
  }
}
