'use client'

import { useState } from 'react'

export function ShowMoreWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Show more / Show less button */}
      <div className="flex justify-center" style={{ paddingTop: 32 }}>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center transition-colors"
          style={{ gap: 8, fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 16, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span>{open ? 'Show less' : 'Show more'}</span>
          <span style={{
            display: 'inline-block',
            fontSize: 14,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}>∨</span>
        </button>
      </div>

      {/* Expandable content */}
      {open && <>{children}</>}
    </>
  )
}
