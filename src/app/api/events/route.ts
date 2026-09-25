import { NextResponse } from "next/server";
import { getEventsPage } from "@/lib/directus";
import { LaravelEventsError } from "@/lib/laravel/events";

/** BFF: list events from Laravel GET /api/v1/events (normalized EventsPageContent). */
export async function GET() {
  try {
    const eventsPage = await getEventsPage();
    return NextResponse.json(eventsPage);
  } catch (error) {
    console.error("[GET /api/events]", error);
    const status =
      error instanceof LaravelEventsError && error.status ? error.status : 502;
    return NextResponse.json(
      {
        error:
          error instanceof LaravelEventsError
            ? error.message
            : "Failed to fetch events",
      },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
