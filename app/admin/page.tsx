'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BASE_PATH } from '@/lib/basePath'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(BASE_PATH + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex" style={{ background: '#0a0a0f' }}>

      {/* Left hero panel */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden flex-shrink-0"
        style={{
          width: 520,
          background: 'linear-gradient(to right, #030308, #0a0a0f 50%, #05050a)',
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: -60, top: 100,
            width: 360, height: 360,
            background: 'radial-gradient(circle, rgba(242,186,48,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: 200, top: 500,
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(100,80,200,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: 100, top: 700,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(60,40,160,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Subtle overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(255,255,255,0.01)' }} />

        {/* Bolt + wordmark */}
        <div className="absolute flex flex-col items-center" style={{ left: 155, top: 310 }}>
          <img src="/zero1-bolt.svg" alt="" style={{ height: 80, width: 'auto' }} />
          <p className="text-[42px] font-extrabold text-white leading-none mt-1">ZERO1</p>
          <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Money Circle</p>
        </div>

        {/* Tagline */}
        <div className="absolute" style={{ left: 48, bottom: 120 }}>
          <p className="text-xl font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Your exclusive network<br />for trusted investing.
          </p>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block flex-shrink-0 w-px" style={{ background: '#252525' }} />

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: '#0a0a0f' }}>

        {/* Mobile logo (shown only on small screens) */}
        <div className="lg:hidden flex flex-col items-center mb-10">
          <img src="/zero1-bolt.svg" alt="" style={{ height: 52, width: 'auto' }} />
          <img src="/zero1-wordmark.svg" alt="ZERO1" className="mt-3" style={{ height: 18, width: 'auto' }} />
        </div>

        {/* Card */}
        <div
          className="w-full max-w-[420px] rounded-2xl overflow-hidden p-8"
          style={{ background: '#161616', border: '1px solid #252525' }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: '#666' }}>Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#666' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@zero1.money"
                autoFocus
                required
                className="w-full rounded-lg px-3 py-3 text-sm text-white outline-none transition focus:ring-1"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #252525',
                  '--tw-ring-color': '#f2ba30',
                } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#666' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-lg px-3 py-3 text-sm text-white outline-none transition focus:ring-1"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #252525',
                  '--tw-ring-color': '#f2ba30',
                } as React.CSSProperties}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-lg font-semibold text-[#0a0a0f] text-[15px] transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(to right, #fccc40, #f2ba30)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(102,102,102,0.4)' }}>
          Zero1 Admin Portal &nbsp;·&nbsp; © 2025 Zero1 Money
        </p>
      </div>
    </main>
  )
}
