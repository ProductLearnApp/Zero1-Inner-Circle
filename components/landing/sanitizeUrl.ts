export { resolveMediaUrl } from '@/lib/basePath'

/**
 * Returns null for any URL that points to localhost (http://localhost:* or
 * https://localhost:*). These are dev-machine URLs that were accidentally
 * stored via the old "Copy URL" button and will never resolve on any other
 * device or on the Railway deployment.
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
