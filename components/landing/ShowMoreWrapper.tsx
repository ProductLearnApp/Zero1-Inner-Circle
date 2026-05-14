'use client'

import { useState } from 'react'

/*
 * ShowMoreWrapper — collapses/expands content beneath "About the event".
 *
 * Children are ALWAYS rendered (display:none when collapsed) so that server-component
 * children are included in the initial RSC payload and become visible instantly on click.
 * Conditional {open && children} does NOT work reliably with RSC children in Next.js 14
 * App Router — the payload may be missing, making the button appear broken.
 */
export function ShowMoreWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Content — always in DOM, hidden until opened */}
      <div style={{ display: open ? 'block' : 'none' }}>
        {children}
      </div>

      {/* Gradient fade + toggle button */}
      <div className="relative flex flex-col items-center" style={{ paddingTop: open ? 40 : 0, paddingBottom: 8 }}>
        {/* Upward gradient when collapsed */}
        {!open && (
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              bottom: '100%',
              height: 80,
              background: 'linear-gradient(to top, #0f071a 0%, transparent 100%)',
            }}
          />
        )}
        <button
          onClick={() => setOpen(v => !v)}
          className="relative flex items-center z-10"
          style={{
            gap: 8,
            fontFamily: 'Satoshi,sans-serif',
            fontWeight: 400,
            fontSize: 18,
            lineHeight: '24px',
            color: '#fff',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <span>{open ? 'Show less' : 'Show more'}</span>
          <span style={{
            display: 'inline-block',
            fontSize: 14,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}>▼</span>
        </button>
      </div>
    </>
  )
}
