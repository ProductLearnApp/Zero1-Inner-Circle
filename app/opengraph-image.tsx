import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Zero1 Inner Circle'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const interSemiBold = await fetch(
    'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2'
  ).then((r) => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#0f071a',
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        {/* Top-right gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 560,
            height: 560,
            background: 'radial-gradient(circle at top right, rgba(245,116,52,0.18) 0%, transparent 65%)',
          }}
        />
        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 320,
            background: 'linear-gradient(to top, rgba(15,7,26,0.9) 0%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
          {/* "Zero1 presents" */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              Zero1 presents
            </span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-1px',
                lineHeight: 1.05,
              }}
            >
              Inner Circle
            </span>
          </div>

          {/* Subtitle */}
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: 'rgba(183,181,187,1)',
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            An offline community to solve REAL personal finance problems
          </span>

          {/* Domain pill */}
          <div
            style={{
              display: 'flex',
              marginTop: 12,
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.12)',
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
              zero1byzerodha.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
