import { NextResponse } from "next/server";
import { DirectusRequestError } from "@/lib/directus-admin";
import { getAboutPage } from "@/lib/directus";
import { normalizeAboutPage } from "@/features/directus/transforms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getAboutPage();
    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof DirectusRequestError && error.status === 403) {
      console.warn(
        "[GET /api/about-page] Directus returned 403 — grant read access on About_Page for DIRECTUS_ADMIN_TOKEN.",
      );
      return NextResponse.json(normalizeAboutPage([]));
    }

    console.error("[GET /api/about-page]", error);
    return NextResponse.json({ error: "Failed to fetch about page" }, { status: 502 });
  }
}
