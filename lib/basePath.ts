/** The Next.js basePath — prefix all client-side fetch('/api/...') calls with this. */
export const BASE_PATH = '/inner-circle'

/**
 * Resolves a media URL so it works under basePath: '/inner-circle'.
 * The Next.js production server rejects any path that doesn't start with
 * the basePath prefix, so local /api/... paths must be prefixed.
 *
 * - External URLs (https://...): returned unchanged
 * - Local API paths (/api/...): BASE_PATH prefix added → /inner-circle/api/...
 * - localhost URLs: filtered out (returns null)
 * - Anything else (public paths, already-prefixed paths): returned as-is
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/api/')) return BASE_PATH + url
  return url
}
