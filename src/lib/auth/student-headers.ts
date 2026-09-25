/** Headers for authenticated student BFF calls (avoids Authorization stripping). */
export function studentAuthHeaders(token: string): HeadersInit {
  const bearer = token.trim().replace(/^Bearer\s+/i, "");
  return {
    Accept: "application/json",
    Authorization: `Bearer ${bearer}`,
    "X-Student-Token": bearer,
  };
}
