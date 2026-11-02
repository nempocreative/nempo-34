// The JSON API camelizes database column names (guest_stars -> guestStars),
// while page types are written in snake_case. Normalize a response back to
// snake_case before reading it so multi-word fields are never silently lost.
export function toSnake<T>(value: unknown): T {
  if (Array.isArray(value)) return value.map(toSnake) as T;
  if (!value || typeof value !== "object") return value as T;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(),
      toSnake(val),
    ]),
  ) as T;
}
