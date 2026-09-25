import { NextResponse } from "next/server";
import { extractActiveSlots } from "@/lib/enroll/slots";
import {
  CourseNotFoundError,
  getCourseWithLessons,
  getLaravelCourseId,
} from "@/lib/directus";
import { LaravelCoursesError } from "@/lib/laravel/courses";
import { hasLaravelBackend } from "@/lib/laravel/config";
import { proxyLaravelGet } from "@/lib/laravel/proxy";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** BFF: single course from Laravel; merges `active_slots` from Laravel detail when present. */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const data = await getCourseWithLessons(id);
    let active_slots = extractActiveSlots(data);

    if (active_slots.length === 0 && hasLaravelBackend()) {
      const laravelCourseId = getLaravelCourseId(data.course);
      const laravelResponse = await proxyLaravelGet(
        `/api/v1/courses/${encodeURIComponent(laravelCourseId)}`,
      );
      if (laravelResponse?.ok) {
        const laravelPayload: unknown = await laravelResponse.json().catch(() => null);
        active_slots = extractActiveSlots(laravelPayload);
      }
    }

    return NextResponse.json({ ...data, active_slots });
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    console.error(`[GET /api/courses/${id}]`, error);
    const status =
      error instanceof LaravelCoursesError && error.status ? error.status : 502;
    return NextResponse.json(
      {
        error:
          error instanceof LaravelCoursesError
            ? error.message
            : "Failed to fetch course",
      },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
