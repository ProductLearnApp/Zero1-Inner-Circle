import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, getExpectedSessionToken } from '@/lib/auth'

const ADMIN_LOGIN_PATH = '/admin'

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const session = req.cookies.get(COOKIE_NAME)
  if (!session) return false
  try {
    const expected = await getExpectedSessionToken()
    return session.value === expected
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin/** pages (but not the login page itself)
  const isAdminPage = pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH
  // Protect /api/admin/** routes (but not the login endpoint)
  const isAdminApi =
    pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')

  // GET requests to /api/admin/media/<folder>/<file> serve public landing-page images
  // and must NOT require admin auth.  Upload / delete / list / info still require auth.
  const isPublicMediaServe =
    req.method === 'GET' &&
    pathname.startsWith('/api/admin/media/') &&
    !pathname.startsWith('/api/admin/media/upload') &&
    !pathname.startsWith('/api/admin/media/info') &&
    pathname !== '/api/admin/media'

  if ((isAdminPage || (isAdminApi && !isPublicMediaServe)) && !(await isAuthenticated(req))) {
    // #region agent log
    fetch('http://127.0.0.1:7554/ingest/866bc12d-c90a-4588-a31e-44da4cab020d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5fbd79'},body:JSON.stringify({sessionId:'5fbd79',location:'middleware.ts:28',message:'post-fix: auth blocked (non-media)',data:{pathname,method:req.method,hasCookie:!!req.cookies.get('admin_session')},hypothesisId:'H-A',runId:'post-fix',timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = ADMIN_LOGIN_PATH
    return NextResponse.redirect(loginUrl)
  }

  // #region agent log
  if (isPublicMediaServe) {
    fetch('http://127.0.0.1:7554/ingest/866bc12d-c90a-4588-a31e-44da4cab020d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5fbd79'},body:JSON.stringify({sessionId:'5fbd79',location:'middleware.ts:40',message:'post-fix: public media serve — no auth required',data:{pathname,method:req.method,hasCookie:!!req.cookies.get('admin_session')},hypothesisId:'H-A',runId:'post-fix',timestamp:Date.now()})}).catch(()=>{});
  }
  // #endregion

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
