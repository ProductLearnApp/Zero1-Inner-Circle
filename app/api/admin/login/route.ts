import { NextRequest } from 'next/server'
import { isValidAdminCredentials, hashSecret, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }

    if (!isValidAdminCredentials(email, password)) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await hashSecret(process.env.ADMIN_SECRET!)
    const response = Response.json({ ok: true })
    response.headers.set(
      'Set-Cookie',
      `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    )
    return response
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = Response.json({ ok: true })
  response.headers.set(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  )
  return response
}
