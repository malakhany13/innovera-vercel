import { hasLaravelBackend, LARAVEL_JSON_HEADERS, laravelApiUrl } from "@/lib/laravel/config";

export interface InternshipProgram {
  id: number;
  title: string;
  description: string;
  /** First-trial fee (EGP). */
  price: string;
  /** Second-trial / retake fee (EGP). Laravel `Second_price`. */
  secondPrice: string | null;
}

export class InternshipProgramsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "InternshipProgramsError";
  }
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parsePriceField(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return asTrimmedString(value);
}

function parseProgram(value: unknown): InternshipProgram | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = asNumber(record.id);
  if (id == null) return null;

  const price = parsePriceField(record.price);
  if (!price) return null;

  const secondPrice =
    parsePriceField(record.Second_price) ||
    parsePriceField(record.second_price) ||
    parsePriceField(record.secondPrice) ||
    null;

  return {
    id,
    title: asTrimmedString(record.title),
    description: asTrimmedString(record.description),
    price,
    secondPrice,
  };
}

/** First-trial `price`, or dashboard `Second_price` on a retake. Never swaps in a hardcoded fee. */
export function internshipFeeForAttempt(
  program: Pick<InternshipProgram, "price" | "secondPrice">,
  isSecondTrial: boolean,
): string {
  if (isSecondTrial) {
    return program.secondPrice?.trim() || "";
  }
  return program.price.trim();
}

function extractPrograms(payload: unknown): InternshipProgram[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  const list = Array.isArray(record.internship_programs)
    ? record.internship_programs
    : Array.isArray(record.data)
      ? record.data
      : Array.isArray(payload)
        ? payload
        : [];

  return list
    .map(parseProgram)
    .filter((program): program is InternshipProgram => program != null);
}

/**
 * Parse Next BFF or Laravel `{ success, internship_programs: [...] }` payloads.
 * Use this from the browser when the static export hits Laravel directly.
 */
export function parseInternshipProgramsPayload(
  payload: unknown,
): InternshipProgram[] {
  return extractPrograms(payload);
}

/** GET Laravel internship programs (dashboard `price` + `Second_price`). */
export async function fetchInternshipPrograms(): Promise<InternshipProgram[]> {
  if (!hasLaravelBackend()) {
    throw new InternshipProgramsError(
      "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
      503,
    );
  }

  const paths = ["/api/internship-programs", "/api/v1/internship-programs"];
  let lastError: InternshipProgramsError | null = null;

  for (const path of paths) {
    for (let attempt = 0; attempt < 3; attempt++) {
      let response: Response;
      try {
        response = await fetch(laravelApiUrl(path), {
          method: "GET",
          headers: LARAVEL_JSON_HEADERS,
          cache: "no-store",
        });
      } catch {
        lastError = new InternshipProgramsError(
          "Unable to reach Laravel internship programs API.",
          502,
        );
        await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        continue;
      }

      const payload: unknown = await response.json().catch(() => null);
      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          typeof (payload as { message?: unknown }).message === "string"
            ? (payload as { message: string }).message
            : `Failed to load internship programs (${response.status})`;
        lastError = new InternshipProgramsError(message, response.status);

        if (response.status === 404 || response.status === 502 || response.status === 503) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
          continue;
        }
        break;
      }

      if (!contentType.includes("application/json")) {
        lastError = new InternshipProgramsError(
          "Internship programs API returned a web page instead of JSON.",
          502,
        );
        break;
      }

      return extractPrograms(payload);
    }
  }

  throw (
    lastError ??
    new InternshipProgramsError("Unable to load internship programs.", 502)
  );
}
