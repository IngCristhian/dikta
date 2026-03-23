import { NextRequest, NextResponse } from "next/server";
import { googleCalendarService } from "@/modules/google-calendar/google-calendar.service";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/?google=error`);
  }

  try {
    await googleCalendarService.handleCallback(code);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/?google=connected`);
  } catch {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/?google=error`);
  }
}
