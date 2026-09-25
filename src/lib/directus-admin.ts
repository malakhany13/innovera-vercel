import { API_CONFIG } from "@/lib/config/api.config";
import { SERVER_DIRECTUS_URL } from "@/lib/config/directus.config";

/**
 * Server Directus host: DIRECTUS_URL → NEXT_PUBLIC_DIRECTUS_URL → localhost (dev only).
 * Production must set DIRECTUS_URL and/or NEXT_PUBLIC_DIRECTUS_URL.
 */
const DIRECTUS_SERVER_URL = SERVER_DIRECTUS_URL;

// Dev: always re-fetch so Directus edits show on refresh.
// Prod / static export: cache so HTML can be generated once without runtime hits.
const DEFAULT_FETCH_OPTIONS: RequestInit =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { cache: "force-cache" };

/** Authorization headers for server-side Directus calls. Token is never exposed to the client. */
export function getDirectusAdminHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = process.env.DIRECTUS_ADMIN_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function getDirectusServerUrl(): string {
  return DIRECTUS_SERVER_URL;
}

export class DirectusRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public path: string,
  ) {
    super(message);
    this.name = "DirectusRequestError";
  }
}

/** Authenticated server-side fetch against the Directus REST API. */
export async function directusAdminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!DIRECTUS_SERVER_URL) {
    throw new DirectusRequestError(
      "Directus URL is not configured. Set DIRECTUS_URL or NEXT_PUBLIC_DIRECTUS_URL.",
      503,
      path,
    );
  }

  const url = `${DIRECTUS_SERVER_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...DEFAULT_FETCH_OPTIONS,
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(8000),
    headers: {
      ...getDirectusAdminHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new DirectusRequestError(
      `Directus request failed (${response.status})`,
      response.status,
      path,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { API_CONFIG };
