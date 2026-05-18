import type { LandingEvent } from './types'
import { ASSET_INSTAGRAM, ASSET_EMAIL } from './assets'
import { BASE_PATH } from '@/lib/basePath'

const ZERO1_LOGO = BASE_PATH + '/zero1-white-logo.svg'

export function LandingFooter({ event }: { event: LandingEvent }) {
  const instagram = event.settings?.instagramUrl
  const email = event.settings?.emailAddress

  return (
    <>
      {/* ── Mobile footer ── */}
      <div className="relative w-full md:hidden" style={{ background: 'linear-gradient(to bottom, #0f071a 0%, #000000 30%)' }}>
        <div className="flex flex-col items-center" style={{ paddingTop: 50, paddingBottom: 40, gap: 32 }}>
          {/* Zero1 logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Zero1" src={ZERO1_LOGO} loading="lazy" style={{ width: 122, height: 37 }} />
          {/* Social icons */}
          <div className="flex items-center" style={{ gap: 13 }}>
            <a href={instagram || '#'} target={instagram ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Instagram"
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Instagram" src={ASSET_INSTAGRAM} loading="lazy" style={{ width: 32, height: 32 }} />
            </a>
            <a href={email ? `mailto:${email}` : '#'} aria-label="Email"
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Email" src={ASSET_EMAIL} loading="lazy" style={{ width: 32, height: 32 }} />
            </a>
          </div>
          {/* Copyright */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '22px', color: '#535157', textAlign: 'center', maxWidth: 281 }}>
            This property is owned and managed by Zero1 by Zerodha. All rights reserved 2026 ©
          </p>
        </div>
      </div>

      {/* ── Desktop footer ── */}
      <div className="relative w-full hidden md:block" style={{ background: '#000000', height: 180 }}>
        {/* gradient transition from page bg to black */}
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: 80, background: 'linear-gradient(to bottom, #0f071a 0%, #000000 100%)' }} />
        {/* top border line */}
        <div className="absolute" style={{ left: 116, top: 40, width: 1202, borderTop: '2px solid #171717' }} />
        {/* Zero1 logo — left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Zero1" src={ZERO1_LOGO} loading="lazy"
          style={{ position: 'absolute', left: 150, top: 76, width: 139, height: 42 }} />
        {/* copyright — centre */}
        <p style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 84,
          fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '22px',
          color: '#535157', textAlign: 'center', whiteSpace: 'nowrap',
        }}>
          This property is owned and managed by Zero1 by Zerodha. All rights reserved 2026 ©
        </p>
        {/* social icons — right */}
        <div className="absolute flex items-center" style={{ left: 1195, top: 81, gap: 25 }}>
          <a href={instagram || '#'} target={instagram ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Instagram"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Instagram" src={ASSET_INSTAGRAM} loading="lazy" style={{ width: 32, height: 32 }} />
          </a>
          <a href={email ? `mailto:${email}` : '#'} aria-label="Email"
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Email" src={ASSET_EMAIL} loading="lazy" style={{ width: 32, height: 32 }} />
          </a>
        </div>
      </div>
    </>
  )
}
