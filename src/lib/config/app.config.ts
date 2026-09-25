/**
 * App / API environment config.
 *
 * - {@link AppConfig.BACK_END_URL} — browser RTK / client fetches (Railway in
 *   this project; empty would mean same-origin Next BFF).
 * - {@link AppConfig.API_BASE_URL} — server upstream for SSR / BFF proxies
 *   (same Railway host).
 */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/** Auth path segments under the API base (e.g. …/api/student/login). */
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
  /** Server-side API origin (SSR / Route Handler upstream). */
  API_BASE_URL: string;
  /**
   * @deprecated Use {@link AppConfig.API_BASE_URL}. Kept so existing imports
   * keep working during the rename.
   */
  LARAVEL_API_BASE_URL: string;
  DEPLOYMENT_URL?: string;
  AUTH: AuthEndpoints;
}

/** Default backend when no API_* / legacy env is set. */
const DEFAULT_API_BASE_URL =
  "https://innovera-testing-production.up.railway.app";

/**
 * Shared API origin (browser + server).
 * Prefer: API_BASE_URL | NEXT_PUBLIC_API_BASE_URL, then legacy LARAVEL_* / PAYMENT_*.
 */
const API_BASE_URL = trimTrailingSlash(
  process.env.API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.LARAVEL_API_BASE_URL?.trim() ||
    process.env.PAYMENT_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
    DEFAULT_API_BASE_URL,
);

/** Shared auth paths — do not change without updating Route Handlers / backend. */
const AUTH_ENDPOINTS: AuthEndpoints = {
  login: "/api/student/login",
  register: "/api/student/register",
  logout: "/api/student/logout",
  myEnrollments: "/api/internships/my-enrollments",
  forgotPasswordSendOtp: "/api/student/forgot-password/send-otp",
  forgotPasswordReset: "/api/student/forgot-password/reset",
};

/**
 * Browser base for RTK / client APIs.
 * Prefer NEXT_PUBLIC_API_BASE_URL; otherwise same host as {@link API_BASE_URL}.
 */
function resolveBrowserApiBase(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);
  return API_BASE_URL;
}

const developingAppConfig: AppConfig = {
  BACK_END_URL: resolveBrowserApiBase(),
  API_BASE_URL,
  LARAVEL_API_BASE_URL: API_BASE_URL,
  DEPLOYMENT_URL: "http://localhost:3001",
  AUTH: AUTH_ENDPOINTS,
};

const productionAppConfig: AppConfig = {
  BACK_END_URL: resolveBrowserApiBase(),
  API_BASE_URL,
  LARAVEL_API_BASE_URL: API_BASE_URL,
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
