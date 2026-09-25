/**
 * Sentinel id for the exported course shell pages.
 *
 * A static export can only contain a page per course that existed at build
 * time, so a course added in the admin afterwards has no HTML file and 404s
 * until the next rebuild. Rather than rebuild on every catalog change, the
 * export also ships one *shell* page per course route. Laravel serves that
 * shell for any course id it has no file for, keeping the browser URL intact,
 * and the shell reads the real id back out of the URL and fetches the course
 * live. This is the same trick `/payment/{token}` already uses — see
 * `docs/static-payment-hosting.md`.
 *
 * `fallback` is safe as a sentinel because Laravel course ids are numeric, so
 * it can never collide with a real course.
 */
export const COURSE_STATIC_SHELL_ID = "fallback";

/** Course routes whose `{id}` segment gets a shell page in the export. */
export const COURSE_SHELL_ROUTES = [
  ["courses", COURSE_STATIC_SHELL_ID],
  ["courses", "enroll", COURSE_STATIC_SHELL_ID],
  ["training", "enroll", COURSE_STATIC_SHELL_ID],
] as const;

/**
 * Pull the course id out of a `/courses/{id}`, `/courses/enroll/{id}` or
 * `/training/enroll/{id}` pathname. Returns null when the path carries no
 * usable id (including when it is still the shell sentinel).
 */
export function courseIdFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);

  const id =
    segments.length === 2 && segments[0] === "courses"
      ? segments[1]
      : segments.length === 3 &&
          segments[1] === "enroll" &&
          (segments[0] === "courses" || segments[0] === "training")
        ? segments[2]
        : null;

  if (!id || id === COURSE_STATIC_SHELL_ID) return null;

  return decodeURIComponent(id);
}
