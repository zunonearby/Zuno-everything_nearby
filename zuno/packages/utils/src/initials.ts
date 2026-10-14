/**
 * Derives up to 2 uppercase initials from a person's full name.
 * Handles single-word names, multi-word names, whitespace trimming, and Unicode safely.
 * Examples:
 * - "Shivam Kumar" -> "SK"
 * - "Shivam" -> "S"
 * - "  Aarav   Singh  Verma " -> "AS"
 * - "" / null / undefined -> "Z"
 */
export function getProfileInitials(fullName?: string | null, fallback = "Z"): string {
  if (!fullName || typeof fullName !== "string") {
    return fallback;
  }

  const cleaned = fullName.trim();
  if (cleaned.length === 0) {
    return fallback;
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const single = parts[0];
    return (Array.from(single)[0] || fallback).toUpperCase();
  }

  const firstChar = Array.from(parts[0])[0] || "";
  const lastChar = Array.from(parts[parts.length - 1])[0] || "";

  const initials = `${firstChar}${lastChar}`.toUpperCase();
  return initials || fallback;
}
