import { NextResponse } from "next/server";
import { getNewsPage } from "@/lib/directus";
import { LaravelNewsError } from "@/lib/laravel/news";

/** BFF: list news from Laravel GET /api/v1/news (normalized NewsPageContent). */
export async function GET() {
  try {
    const newsPage = await getNewsPage();
    return NextResponse.json(newsPage);
  } catch (error) {
    console.error("[GET /api/news]", error);
    const status =
      error instanceof LaravelNewsError && error.status ? error.status : 502;
    return NextResponse.json(
      {
        error:
          error instanceof LaravelNewsError
            ? error.message
            : "Failed to fetch news",
      },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
