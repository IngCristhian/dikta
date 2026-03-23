import { NextResponse } from "next/server";
import { googleCalendarService } from "@/modules/google-calendar/google-calendar.service";
import { handleError } from "@/lib/api-response";

export async function GET() {
  try {
    const url = googleCalendarService.getAuthUrl();
    return NextResponse.redirect(url);
  } catch (err) {
    return handleError(err);
  }
}
