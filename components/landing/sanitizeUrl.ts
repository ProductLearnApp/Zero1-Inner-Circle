import { BASE_PATH } from '@/lib/basePath'

/**
 * Returns null for any URL that points to localhost (http://localhost:* or
 * https://localhost:*). These are dev-machine URLs that were accidentally
 * stored via the old "Copy URL" button and will never resolve on any other
 * device or on the Railway deployment.
 *
 * Relative paths (e.g. /api/admin/media/...) are returned as-is — they
 * resolve correctly against whatever origin serves the page.
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) return null
  return url
}

/**
 * Returns true for absolute http(s) URLs (e.g. Figma CDN, Cloudinary).
 * Returns false for relative paths like /api/admin/media/... which are
 * served locally and can benefit from Next.js image optimisation.
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

/**
 * Resolves a media URL for use in a plain <img> src attribute.
 *
 * With basePath: '/inner-circle', the Next.js production server strictly
 * serves API routes under /inner-circle/api/... Plain <img> tags do NOT
 * get basePath prepended automatically (only <Image> does). So any local
 * /api/admin/media/... path must have the prefix added here.
 *
 * - External URLs (https://...): returned unchanged
 * - Local API paths (/api/...): BASE_PATH prefix added
 * - Public file paths (/zero1-logo.svg etc.): returned unchanged (served at root)
 * - localhost URLs: filtered out (returns null)
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/api/')) return BASE_PATH + url
  return url
}
