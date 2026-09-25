import { NextResponse } from "next/server";
import { DirectusRequestError } from "@/lib/directus-admin";
import { emptyAcademyPageContent } from "@/features/directus/transforms";
import { getAcademyPage } from "@/lib/directus";

export const dynamic = "force-dynamic";

/** BFF: academy page content from Directus (admin token stays server-side). */
export async function GET() {
  try {
    const content = await getAcademyPage();
    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof DirectusRequestError && error.status === 403) {
      console.warn(
        "[GET /api/academy-page] Directus returned 403 — grant read access on Academy_page for DIRECTUS_ADMIN_TOKEN.",
      );
      return NextResponse.json(emptyAcademyPageContent());
    }

    console.error("[GET /api/academy-page]", error);
    return NextResponse.json({ error: "Failed to fetch academy page" }, { status: 502 });
  }
}
