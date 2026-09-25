/**
 * App / API environment config (Magico-style).
 *
 * - {@link AppConfig.BACK_END_URL} — browser RTK / client fetches.
 *   Empty string = same-origin Next BFF (e.g. http://localhost:3001/api/...),
 *   matching curls like GET /api/internships/my-enrollments.
 * - {@link AppConfig.LARAVEL_API_BASE_URL} — server-only upstream the BFF
 *   proxies to (env, else production Laravel host).
 */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/** Same-origin Next BFF paths (browser → localhost:3001 in next-dev). */
export interface AuthEndpoints {
  login: string;
  register: string;
  logout: string;
  myEnrollments: string;
  forgotPasswordSendOtp: string;
  forgotPasswordReset: string;
}

export interface AppConfig {
  /**
   * Browser API origin for `baseApi` / `authApi` / public fetches.
   * `""` = same-origin (Next BFF on the page host).
   */
  BACK_END_URL: string;
  /** Server BFF → Laravel upstream. */
  LARAVEL_API_BASE_URL: string;
  DEPLOYMENT_URL?: string;
  AUTH: AuthEndpoints;
}

/** Fallback only when no LARAVEL_* / NEXT_PUBLIC_* env is set (server upstream). */
const DEFAULT_LARAVEL_UPSTREAM = "https://www.innoveracorp.com";

/**
 * Server-side Laravel origin (BFF proxy target).
 * Prefer env: LARAVEL_API_BASE_URL | PAYMENT_API_BASE_URL | NEXT_PUBLIC_LARAVEL_API_BASE_URL.
 */
const LARAVEL_API_BASE_URL = trimTrailingSlash(
  process.env.LARAVEL_API_BASE_URL?.trim() ||
    process.env.PAYMENT_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
    DEFAULT_LARAVEL_UPSTREAM,
);

/** Shared auth BFF paths — do not change without updating Route Handlers. */
const AUTH_ENDPOINTS: AuthEndpoints = {
  login: "/api/student/login",
  register: "/api/student/register",
  logout: "/api/student/logout",
  myEnrollments: "/api/internships/my-enrollments",
  forgotPasswordSendOtp: "/api/student/forgot-password/send-otp",
  forgotPasswordReset: "/api/student/forgot-password/reset",
};

/**
 * Browser base for RTK / client APIs — same-origin BFF (like the my-enrollments curl).
 * Override with NEXT_PUBLIC_API_BASE_URL only if the API is on another origin.
 */
function resolveBrowserApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);
  return "";
}

const developingAppConfig: AppConfig = {
  BACK_END_URL: resolveBrowserApiBase(),
  LARAVEL_API_BASE_URL,
  DEPLOYMENT_URL: "http://localhost:3001",
  AUTH: AUTH_ENDPOINTS,
};

const productionAppConfig: AppConfig = {
  BACK_END_URL: resolveBrowserApiBase(),
  LARAVEL_API_BASE_URL,
  DEPLOYMENT_URL: "https://www.innoveracorp.com",
  AUTH: AUTH_ENDPOINTS,
};

type Environment = "development" | "production";

const appConfig: Record<Environment, AppConfig> = {
  development: developingAppConfig,
  production: productionAppConfig,
};

const env: Environment =
  process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production" ||
  process.env.NODE_ENV === "production"
    ? "production"
    : "development";

const Config = appConfig[env];

export default Config;
