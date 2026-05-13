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
