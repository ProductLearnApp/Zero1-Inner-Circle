'use client'

import { useEffect, useRef, useState } from 'react'
import { BASE_PATH } from '@/lib/basePath'

type ScanResult = {
  status: string
  passType?: 'primary' | 'plusone'
  attendee?: {
    name: string
    seatLabel: string | null
    checkedInAt: string | null
    plusOneCheckedInAt: string | null
    plusOneName: string | null
  }
  checkedInAt?: string
  message?: string
}

interface Props {
  onResult: (result: ScanResult) => void
}

export default function QRScanner({ onResult }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number | null>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const scanningRef = useRef(true)      // false while waiting for API / result
  const onResultRef = useRef(onResult)  // stable ref — never causes effect re-run

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scanLine, setScanLine] = useState(0) // 0-100% for animation

  // Keep ref in sync without restarting the scanner
  useEffect(() => { onResultRef.current = onResult }, [onResult])

  // Animate scan line
  useEffect(() => {
    let dir = 1
    const id = setInterval(() => {
      setScanLine(p => {
        const next = p + dir * 2
        if (next >= 100) dir = -1
        if (next <= 0)   dir = 1
        return next
      })
    }, 16)
    return () => clearInterval(id)
  }, [])

  // Camera + scan loop — only reruns when facingMode changes
  useEffect(() => {
    let cancelled = false
    scanningRef.current = true

    async function start() {
      // Stop previous stream
      streamRef.current?.getTracks().forEach(t => t.stop())

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }

        streamRef.current = stream
        const video = videoRef.current!
        video.srcObject = stream
        await video.play()

        const canvas  = canvasRef.current!
        const ctx     = canvas.getContext('2d', { willReadFrequently: true })!
        const { default: jsQR } = await import('jsqr')

        // 60ms interval + 960px canvas gives ~14fps effective scan rate.
        // 960px keeps ≥3.4px/module for our 320px QR at arm's length,
        // while cutting jsQR processing from ~70ms to ~25ms vs full 1280px.
        const SCAN_INTERVAL_MS = 60
        const MAX_W = 960
        let lastScan = 0

        const tick = (now: number) => {
          if (cancelled) return
          rafRef.current = requestAnimationFrame(tick)

          if (now - lastScan < SCAN_INTERVAL_MS) return
          lastScan = now

          if (video.readyState !== video.HAVE_ENOUGH_DATA) return

          const scale = Math.min(1, MAX_W / video.videoWidth)
          canvas.width  = Math.round(video.videoWidth  * scale)
          canvas.height = Math.round(video.videoHeight * scale)
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(img.data, img.width, img.height, {
            inversionAttempts: 'attemptBoth',
          })

          // jsQR can return a "code" with empty/short data on noisy backgrounds.
          // Real JWT tokens for our passes are 250+ chars; reject anything shorter
          // as a false positive so the scanner keeps running.
          if (code && code.data.length >= 100 && scanningRef.current) {
            scanningRef.current = false
            handleToken(code.data)
          }
        }
        rafRef.current = requestAnimationFrame(tick)
      } catch (e) {
        if (!cancelled) setError('Camera access denied or unavailable')
        console.error(e)
      }
    }

    async function handleToken(token: string) {
      try {
        const res  = await fetch(BASE_PATH + '/api/admin/checkin/verify', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ token }),
        })
        const data = await res.json()
        onResultRef.current(data)
      } catch {
        onResultRef.current({ status: 'INVALID_QR', message: 'Network error' })
      }
    }

    start()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [facingMode, retryCount])

  const BOX = 300 // scan zone size in CSS px

  return (
    <div className="absolute inset-0 overflow-hidden select-none"
      style={{ background: '#000' }}>

      {/* Hidden video source */}
      <video ref={videoRef} playsInline muted
        className="absolute inset-0 w-full h-full object-cover" />

      {/* Hidden canvas for jsQR pixel reads */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scan zone — outward shadow darkens ONLY outside the clear window */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative" style={{ width: BOX, height: BOX }}>

          {/* Outward shadow creates the dark surround; scan zone stays fully clear */}
          <div className="absolute inset-0"
            style={{ boxShadow: `0 0 0 9999px rgba(0,0,0,0.65)`, borderRadius: 12 }} />

          {/* Corner brackets */}
          {([
            ['top-0 left-0',     'border-t-[3px] border-l-[3px] rounded-tl-xl'],
            ['top-0 right-0',    'border-t-[3px] border-r-[3px] rounded-tr-xl'],
            ['bottom-0 left-0',  'border-b-[3px] border-l-[3px] rounded-bl-xl'],
            ['bottom-0 right-0', 'border-b-[3px] border-r-[3px] rounded-br-xl'],
          ] as [string, string][]).map(([pos, border], i) => (
            <div key={i} className={`absolute w-8 h-8 ${pos} ${border}`}
              style={{ borderColor: 'var(--accent)' }} />
          ))}

          {/* Animated scan line */}
          <div className="absolute left-3 right-3 h-px transition-none"
            style={{
              top:        `${scanLine}%`,
              background: `linear-gradient(90deg, transparent, var(--accent), transparent)`,
              boxShadow:  `0 0 6px var(--accent)`,
            }} />
        </div>
      </div>

      {/* Flip camera button */}
      <button
        onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')}
        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
        style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 18 }}>
        ⇄
      </button>

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}>
          <span className="text-3xl">📷</span>
          <p className="text-sm text-white/80">{error}</p>
          <button onClick={() => { setError(null); setRetryCount(c => c + 1) }}
            className="text-xs px-4 py-2 rounded-lg text-black font-semibold"
            style={{ background: 'var(--accent)' }}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
