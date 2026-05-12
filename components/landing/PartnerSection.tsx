import type { LandingEvent } from './types'
import { ASSET_PARTNER_LOGO } from './assets'

export function PartnerSection({ event }: { event: LandingEvent }) {
  const logoUrl = event.settings?.partnerLogoUrl || ASSET_PARTNER_LOGO

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col items-center px-4 md:hidden" style={{ gap: 8, minHeight: 120 }}>
        <p style={{ fontFamily: 'Satisfy,cursive', fontWeight: 400, fontSize: 12, lineHeight: 'normal', color: '#b7b5bb', letterSpacing: '0.24px', textAlign: 'center' }}>
          In partnership with
        </p>
        <img alt="Partner" src={logoUrl} style={{ maxHeight: 90, maxWidth: 180, objectFit: 'contain', opacity: 0.2 }} />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col items-center" style={{ gap: 4, width: 480 }}>
        <p style={{ fontFamily: 'Satisfy,cursive', fontWeight: 400, fontSize: 16, lineHeight: 'normal', color: '#b7b5bb', letterSpacing: '0.32px', textAlign: 'center', width: '100%' }}>
          In partnership with
        </p>
        <img alt="Partner" src={logoUrl} style={{ maxHeight: 160, maxWidth: 290, objectFit: 'contain', opacity: 0.2 }} />
      </div>
    </>
  )
}
