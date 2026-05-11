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

  if ((isAdminPage || isAdminApi) && !(await isAuthenticated(req))) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = ADMIN_LOGIN_PATH
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
