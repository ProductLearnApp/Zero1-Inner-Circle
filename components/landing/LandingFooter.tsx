import type { LandingEvent } from './types'
import { ASSET_ZERO1_LOGO_NAV, ASSET_ZERO1_LOGO_FOOTER, ASSET_INSTAGRAM, ASSET_EMAIL } from './assets'

export function LandingFooter({ event }: { event: LandingEvent }) {
  const instagram = event.settings?.instagramUrl
  const email = event.settings?.emailAddress

  return (
    <>
      {/* ── Mobile footer ── */}
      <div className="relative w-full md:hidden" style={{ background: '#0f071a' }}>
        <div className="flex flex-col items-center" style={{ paddingTop: 50, paddingBottom: 40, gap: 32 }}>
          {/* Zero1 logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Zero1" src={ASSET_ZERO1_LOGO_FOOTER} style={{ width: 122, height: 37 }} />
          {/* Social icons */}
          <div className="flex items-center" style={{ gap: 13 }}>
            <a href={instagram || '#'} target={instagram ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Instagram"
              className="relative overflow-hidden" style={{ width: 32, height: 32 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Instagram" src={ASSET_INSTAGRAM} style={{ width: 20, height: 20, position: 'absolute', left: 6, top: 6 }} />
            </a>
            <a href={email ? `mailto:${email}` : '#'} aria-label="Email"
              className="relative overflow-hidden" style={{ width: 32, height: 32 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Email" src={ASSET_EMAIL} style={{ width: 20, height: 20, position: 'absolute', left: 6, top: 6 }} />
            </a>
          </div>
          {/* Copyright */}
          <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '22px', color: '#535157', textAlign: 'center', maxWidth: 281 }}>
            This property is owned and managed by Zero1 by Zerodha. All rights reserved 2026 ©
          </p>
        </div>
      </div>

      {/* ── Desktop footer ── */}
      <div className="relative w-full hidden md:block" style={{ background: '#0f071a', height: 180 }}>
        {/* top border line */}
        <div className="absolute" style={{ left: 116, top: 40, width: 1202, borderTop: '2px solid #171717' }} />
        {/* Zero1 logo — left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Zero1" src={ASSET_ZERO1_LOGO_NAV}
          style={{ position: 'absolute', left: 150, top: 76, width: 138, height: 42 }} />
        {/* copyright — centre */}
        <p style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 84,
          fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '22px',
          color: '#535157', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          This property is owned and managed by Zero1 by Zerodha. All rights reserved 2026 ©
        </p>
        {/* social icons — right */}
        <div className="absolute flex items-center" style={{ left: 1195, top: 81, gap: 25 }}>
          <a href={instagram || '#'} target={instagram ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Instagram"
            style={{ width: 32, height: 32, overflow: 'hidden', position: 'relative', display: 'block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Instagram" src={ASSET_INSTAGRAM} style={{ width: 24, height: 24, position: 'absolute', left: 4, top: 4 }} />
          </a>
          <a href={email ? `mailto:${email}` : '#'} aria-label="Email"
            style={{ width: 32, height: 32, overflow: 'hidden', position: 'relative', display: 'block' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Email" src={ASSET_EMAIL} style={{ width: 20, height: 20, position: 'absolute', left: 6, top: 6 }} />
          </a>
        </div>
      </div>
    </>
  )
}
