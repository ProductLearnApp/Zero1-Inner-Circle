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
  // #region agent log
  fetch('http://127.0.0.1:7554/ingest/866bc12d-c90a-4588-a31e-44da4cab020d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5fbd79'},body:JSON.stringify({sessionId:'5fbd79',location:'sanitizeUrl.ts:12',message:'H-C: sanitizeUrl input',data:{url},hypothesisId:'H-C',runId:'run1',timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
    // #region agent log
    fetch('http://127.0.0.1:7554/ingest/866bc12d-c90a-4588-a31e-44da4cab020d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5fbd79'},body:JSON.stringify({sessionId:'5fbd79',location:'sanitizeUrl.ts:15',message:'H-C CONFIRMED: localhost URL rejected, falling back to default',data:{url},hypothesisId:'H-C',runId:'run1',timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return null
  }
  return url
}
