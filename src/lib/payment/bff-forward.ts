import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import { proxyPaymentGet, proxyPaymentPost } from "@/lib/payment/proxy";
import { paymentDataFromLaravelPayload } from "@/lib/payment/show-from-status";
import type { PaymentData } from "@/types/payment";

function jsonUnavailable(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message:
        "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
    },
    { status: 503 },
  );
}

function isJsonContentType(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").includes("application/json");
}

async function forward(response: Response | null): Promise<NextResponse> {
  if (!response) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the Laravel payment API.",
      },
      { status: 502 },
    );
  }

  const text = await response.text();

  if (!isJsonContentType(response)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Payment API returned a web page instead of JSON. Check LARAVEL_API_BASE_URL.",
      },
      { status: 502 },
    );
  }

  return new NextResponse(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Keep `{ success, data }` if Laravel already sent checkout fields on `/status`. */
function paymentShowFromStatusPayload(
  payload: unknown,
): { success: boolean; data?: PaymentData; message?: string } {
  const root = asRecord(payload) ?? {};
  if (root.success === false) {
    return {
      success: false,
      message: asString(root.message) || asString(root.error) || "Payment not found.",
    };
  }

  const data = paymentDataFromLaravelPayload(payload);
  if (!data) {
    return { success: false, message: "Payment not found." };
  }
  return { success: true, data };
}

export function laravelPaymentPath(
  token: string,
  extra: string[] | undefined,
  search: string,
): string {
  const parts = [token, ...(extra ?? [])].map((part) => encodeURIComponent(part));
  return `/api/payment/${parts.join("/")}${search}`;
}

/** GET /api/payment/{token}/… → Laravel JSON (never the App Router HTML shell). */
export async function handlePaymentGet(
  request: NextRequest,
  token: string,
  extra?: string[],
): Promise<NextResponse> {
  if (!hasLaravelBackend()) return jsonUnavailable();
  const search = request.nextUrl.search;

  if (!extra?.length) {
    const statusResponse = await proxyPaymentGet(
      laravelPaymentPath(token, ["status"], search),
    );
    if (!statusResponse) return forward(null);
    if (!isJsonContentType(statusResponse)) return forward(statusResponse);

    const raw = await statusResponse.text();
    let payload: unknown = {};
    try {
      payload = raw.trim() ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json(
        { success: false, message: "Payment status was not valid JSON." },
        { status: 502 },
      );
    }

    if (!statusResponse.ok) {
      return NextResponse.json(
        asRecord(payload) ?? { success: false, message: "Payment not found." },
        { status: statusResponse.status },
      );
    }

    return NextResponse.json(paymentShowFromStatusPayload(payload), {
      status: 200,
    });
  }

  return forward(await proxyPaymentGet(laravelPaymentPath(token, extra, search)));
}

/** POST /api/payment/{token}/… → Laravel JSON. */
export async function handlePaymentPost(
  request: NextRequest,
  token: string,
  extra?: string[],
): Promise<NextResponse> {
  if (!hasLaravelBackend()) return jsonUnavailable();
  const laravelPath = laravelPaymentPath(token, extra, request.nextUrl.search);

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  return forward(await proxyPaymentPost(laravelPath, body));
}
