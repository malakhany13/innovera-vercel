import { NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  fetchInternshipPrograms,
  InternshipProgramsError,
} from "@/lib/laravel/internship-programs";

/** BFF: GET /api/internship-programs → Laravel GET /api/internship-programs */
export async function GET() {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const programs = await fetchInternshipPrograms();
    return NextResponse.json({
      success: true,
      internship_programs: programs.map((program) => ({
        id: program.id,
        title: program.title,
        description: program.description,
        price: program.price,
        Second_price: program.secondPrice,
      })),
    });
  } catch (error) {
    console.error("[GET /api/internship-programs]", error);
    if (error instanceof InternshipProgramsError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to load internship programs." },
      { status: 502 },
    );
  }
}
