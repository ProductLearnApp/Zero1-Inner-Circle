import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const COOKIE_NAME = 'admin_session'
export const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

/** SHA-256 via Web Crypto — works in both Edge and Node.js runtimes */
export async function hashSecret(secret: string): Promise<string> {
  const encoded = new TextEncoder().encode(secret)
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function isValidAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminEmail || !adminSecret) throw new Error('ADMIN_EMAIL or ADMIN_SECRET not configured')
  return email === adminEmail && password === adminSecret
}

export async function getExpectedSessionToken(): Promise<string> {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) throw new Error('ADMIN_SECRET not configured')
  return hashSecret(adminSecret)
}

/** Use in Server Components / Server Actions */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get(COOKIE_NAME)
    if (!session) return false
    return session.value === await getExpectedSessionToken()
  } catch {
    return false
  }
}

/** Use in API Route handlers (Edge/Node) */
export async function isAdminAuthenticatedFromRequest(req: NextRequest): Promise<boolean> {
  const session = req.cookies.get(COOKIE_NAME)
  if (!session) return false
  return session.value === await getExpectedSessionToken()
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
