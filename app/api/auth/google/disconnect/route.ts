import { success, handleError } from "@/lib/api-response";
import { googleCalendarService } from "@/modules/google-calendar/google-calendar.service";

export async function POST() {
  try {
    await googleCalendarService.disconnect();
    return success({ disconnected: true });
  } catch (err) {
    return handleError(err);
  }
}
