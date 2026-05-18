'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BASE_PATH } from '@/lib/basePath'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/attendees', label: 'Attendees' },
  { href: '/admin/checkin',   label: 'Check-in'  },
  { href: '/admin/pass',      label: 'Pass'      },
  { href: '/admin/meetup-settings', label: 'Meetup Settings' },
  { href: '/admin/media',     label: 'Media'     },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  // Don't render nav on the login page
  if (pathname === '/admin') return null

  async function handleLogout() {
    await fetch(BASE_PATH + '/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-[220px] min-h-screen fixed top-0 left-0 z-20"
        style={{
          background: 'linear-gradient(to bottom, #030308, #06060c)',
          borderRight: '1px solid #252525',
        }}
      >
        {/* Logo header */}
        <div className="flex items-center px-5 h-16 flex-shrink-0">
          <img src="/zero1-wordmark.svg" alt="ZERO1" style={{ height: 20, width: 'auto' }} />
        </div>

        {/* Divider */}
        <div className="h-px mx-0 flex-shrink-0" style={{ background: '#252525' }} />

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 px-[11px] pt-3 flex-1">
          {links.map(l => {
            const active = pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center h-10 px-4 rounded-lg text-sm transition-colors"
                style={active
                  ? {
                      background: 'rgba(242,186,48,0.10)',
                      border: '0.5px solid #f2ba30',
                      color: '#f2ba30',
                      fontWeight: 600,
                    }
                  : {
                      color: 'rgba(102,102,102,0.7)',
                      fontWeight: 500,
                    }
                }
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* View landing page */}
        <div className="px-[11px] pb-3">
          <a
            href={BASE_PATH + '/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center h-10 px-4 rounded-lg text-sm transition-colors"
            style={{ color: 'rgba(102,102,102,0.55)', border: '1px dashed #2a2a2a' }}
          >
            View Landing Page ↗
          </a>
        </div>

        {/* User footer */}
        <div className="flex-shrink-0">
          <div className="h-px" style={{ background: '#252525' }} />
          <div className="flex items-center gap-3 px-4 h-16">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#333' }}
            >
              <span className="text-sm font-bold" style={{ color: '#f2ba30' }}>A</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-none mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Admin
              </p>
              <button
                onClick={handleLogout}
                className="text-[11px] leading-none hover:text-white/60 transition-colors"
                style={{ color: 'rgba(102,102,102,0.6)' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex"
        style={{ background: '#06060c', borderTop: '1px solid #252525' }}
      >
        {links.map(l => {
          const active = pathname.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex-1 flex items-center justify-center py-3 text-xs transition-colors"
              style={active
                ? { color: '#f2ba30', fontWeight: 600 }
                : { color: 'rgba(102,102,102,0.7)', fontWeight: 500 }
              }
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
