import { NextResponse } from "next/server";
import { getCoursesWithVendors } from "@/lib/directus";
import { LaravelCoursesError } from "@/lib/laravel/courses";

/** BFF: list courses from Laravel GET /api/courses (normalized `Course[]`). */
export async function GET() {
  try {
    const courses = await getCoursesWithVendors();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("[GET /api/courses]", error);
    const status =
      error instanceof LaravelCoursesError && error.status ? error.status : 502;
    return NextResponse.json(
      {
        error:
          error instanceof LaravelCoursesError
            ? error.message
            : "Failed to fetch courses",
      },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
