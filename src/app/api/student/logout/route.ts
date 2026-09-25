import { NextRequest, NextResponse } from "next/server";
import Config from "@/lib/config/app.config";
import {
  hasLaravelBackend,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
} from "@/lib/laravel/config";

/** BFF: POST /api/student/logout → Laravel POST /api/student/logout (revokes the token) */
export async function POST(request: NextRequest) {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  try {
    const response = await fetch(laravelApiUrl(Config.AUTH.logout), {
      method: "POST",
      headers: {
        ...LARAVEL_JSON_HEADERS,
        Authorization: authorization,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        payload ?? { error: "Logout failed." },
        { status: response.status },
      );
    }
    return NextResponse.json(payload ?? { message: "Successfully logged out" });
  } catch (error) {
    console.error("[POST /api/student/logout]", error);
    // Best-effort: even if the upstream call fails, the client still clears
    // its local session. Report success-ish so the UI doesn't get stuck.
    return NextResponse.json(
      { error: "Unable to reach Laravel to revoke the token." },
      { status: 502 },
    );
  }
}
