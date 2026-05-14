import type { LandingEvent } from './types'
import { ASSET_HERO_IMG1, ASSET_HERO_IMG2, ASSET_PARTNER_LOGO } from './assets'
import { sanitizeUrl } from './sanitizeUrl'
import { SectionTitle } from './SectionTitle'

/*
 * Figma node 6055:4560 — "Donation" section.
 * Photo collage: 1 large left (466×358) + 2 stacked right (338×169 each).
 * Followed by "In partnership with" block.
 */

const DEFAULT_DONATION_TEXT =
  'All earnings after covering event costs are donated to charity. Every ticket you buy contributes directly to causes supported by the Zero1 community.'

export function DonationSection({ event }: { event: LandingEvent }) {
  const s = event.settings
  const img1 = sanitizeUrl(s?.donationImage1Url) || ASSET_HERO_IMG1
  const img2 = sanitizeUrl(s?.donationImage2Url) || ASSET_HERO_IMG2
  const img3 = sanitizeUrl(s?.donationImage3Url) || ASSET_HERO_IMG1
  const text = s?.donationText ?? DEFAULT_DONATION_TEXT
  const partnerLogo = sanitizeUrl(s?.partnerLogoUrl) || ASSET_PARTNER_LOGO

  return (
    <>
      {/* ── Mobile ── */}
      <div className="w-full md:hidden px-4" style={{ paddingTop: 60 }}>
        <SectionTitle>Donation</SectionTitle>

        {/* Photo collage — stacked on mobile */}
        <div className="flex gap-2 w-full" style={{ marginTop: 20, height: 200 }}>
          {/* Large left */}
          <div className="flex-1 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={img1} className="w-full h-full object-cover" />
          </div>
          {/* Two stacked right */}
          <div className="flex flex-col gap-2" style={{ width: '38%' }}>
            <div className="flex-1 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={img2} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={img3} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Text */}
        <p style={{ marginTop: 20, fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '22px', color: '#b7b5bb' }}>
          {text}
        </p>

        {/* In partnership with */}
        <div className="flex flex-col items-center" style={{ marginTop: 40, gap: 12 }}>
          <p style={{ fontFamily: 'Satisfy,cursive', fontWeight: 400, fontSize: 14, color: '#65636a', letterSpacing: '0.28px' }}>
            In partnership with
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Partner" src={partnerLogo} style={{ maxHeight: 64, maxWidth: 200, objectFit: 'contain', opacity: 0.4 }} />
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 120 }}>
        <div style={{ width: 841 }}>
          <SectionTitle>Donation</SectionTitle>

          {/* Photo collage */}
          <div className="flex gap-4" style={{ marginTop: 24, height: 358 }}>
            {/* Large left — 466px wide */}
            <div className="overflow-hidden rounded-2xl" style={{ width: 466, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={img1} className="w-full h-full object-cover" />
            </div>
            {/* Two stacked right — 338px wide */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="overflow-hidden rounded-2xl" style={{ height: 169 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={img2} className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-2xl" style={{ height: 169 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={img3} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Text */}
          <p style={{ marginTop: 28, fontFamily: 'Satoshi,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '26px', color: '#b7b5bb' }}>
            {text}
          </p>

          {/* In partnership with */}
          <div className="flex flex-col items-center" style={{ marginTop: 56, gap: 14 }}>
            <p style={{ fontFamily: 'Satisfy,cursive', fontWeight: 400, fontSize: 16, color: '#65636a', letterSpacing: '0.32px' }}>
              In partnership with
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Partner" src={partnerLogo} style={{ maxHeight: 72, maxWidth: 280, objectFit: 'contain', opacity: 0.4 }} />
          </div>
        </div>
      </div>
    </>
  )
}
