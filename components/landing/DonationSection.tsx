import Image from 'next/image'
import type { LandingEvent } from './types'
import { ASSET_HERO_IMG1 } from './assets'
import { sanitizeUrl, isExternalUrl } from './sanitizeUrl'
import { SectionTitle } from './SectionTitle'

/*
 * Figma node 6055:4560 — "Donation" section.
 *
 * Desktop:
 *   Photo collage: left 466×358px + right column 2×(338×169px), gap 18px, rounded-[24px]
 *   Text below: Inter Regular 15px, text-center, #b7b5bb, line-height 24px
 *   "In partnership with": Satisfy 20px, #98969d, tracking 0.4px
 *   Partner logo: opacity 30%
 *
 * Mobile: same layout scaled down, photos stacked in 2-column grid.
 */

const DEFAULT_DONATION_TEXT =
  `Starting your investing journey can feel intimidating, especially when there's no perfect rubric to follow.\nIn this meet-up we will try to answer a few questions Starting your investing journey can feel intimidating, especially when there's no perfect rubric to follow. In this meet-up we will try to answer a few questions:`

export function DonationSection({ event }: { event: LandingEvent }) {
  const s = event.settings
  const img1 = sanitizeUrl(s?.donationImage1Url) || ASSET_HERO_IMG1
  const img2 = sanitizeUrl(s?.donationImage2Url) || ASSET_HERO_IMG1
  const img3 = sanitizeUrl(s?.donationImage3Url) || ASSET_HERO_IMG1
  const text = s?.donationText ?? DEFAULT_DONATION_TEXT
  const partnerName = s?.partnerName ?? 'Roastery Coffee'
  const partnerLogo = sanitizeUrl(s?.partnerLogoUrl) ?? null

  return (
    <>
      {/* ── Mobile (Figma 6126:7893) ── */}
      <div className="w-full md:hidden px-4" style={{ paddingTop: 60 }}>
        <SectionTitle>Donation</SectionTitle>

        {/* Photo collage: left 186×160, right 135×(77+7+75), gap 7px, rounded 9.577px */}
        <div className="flex" style={{ marginTop: 20, gap: 7, height: 160 }}>
          <div style={{ position: 'relative', width: 186, height: 160, borderRadius: 9.577, overflow: 'hidden', flexShrink: 0 }}>
            <Image alt="" src={img1} fill unoptimized={isExternalUrl(img1)} sizes="186px" className="object-cover" />
          </div>
          <div className="flex flex-col" style={{ width: 135, gap: 7, flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 135, height: 77, borderRadius: 9.577, overflow: 'hidden' }}>
              <Image alt="" src={img2} fill unoptimized={isExternalUrl(img2)} sizes="135px" className="object-cover" />
            </div>
            <div style={{ position: 'relative', width: 135, height: 75, borderRadius: 9.577, overflow: 'hidden' }}>
              <Image alt="" src={img3} fill unoptimized={isExternalUrl(img3)} sizes="135px" className="object-cover" />
            </div>
          </div>
        </div>

        {/* Text */}
        <p style={{ marginTop: 18, fontFamily: '"Inter",sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '22px', color: '#b7b5bb', textAlign: 'center' }}>
          {text}
        </p>

        {/* In partnership with */}
        <div className="flex flex-col items-center" style={{ marginTop: 36, gap: 27 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 400, fontSize: 16, color: '#98969d', letterSpacing: '0.32px', margin: 0 }}>
            In partnership with
          </p>
          {partnerLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Partner" src={partnerLogo} loading="lazy" style={{ maxWidth: 210, height: 40, objectFit: 'contain' }} />
          ) : (
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 400, fontSize: 22, letterSpacing: '0.15em', color: '#fff', opacity: 0.3, margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>
              {partnerName}
            </p>
          )}
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 120 }}>
        <div style={{ width: 841 }}>
          <SectionTitle>Donation</SectionTitle>

          {/* Photo collage: gap 18px */}
          <div className="flex" style={{ marginTop: 32, gap: 18, height: 358 }}>
            {/* Large left — 466px */}
            <div className="overflow-hidden rounded-[24px]" style={{ position: 'relative', width: 466, flexShrink: 0 }}>
              <Image alt="" src={img1} fill unoptimized={isExternalUrl(img1)} sizes="466px" className="object-cover" />
            </div>
            {/* Two stacked right — 338px each */}
            <div className="flex flex-col" style={{ gap: 18, width: 338, flexShrink: 0 }}>
              <div className="overflow-hidden rounded-[24px]" style={{ position: 'relative', height: 169 }}>
                <Image alt="" src={img2} fill unoptimized={isExternalUrl(img2)} sizes="338px" className="object-cover" />
              </div>
              <div className="overflow-hidden rounded-[24px]" style={{ position: 'relative', height: 169 }}>
                <Image alt="" src={img3} fill unoptimized={isExternalUrl(img3)} sizes="338px" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Text below photos — Inter Regular 15px, centred */}
          <p style={{ marginTop: 18, fontFamily: '"Inter",sans-serif', fontWeight: 400, fontSize: 15, lineHeight: '24px', color: '#b7b5bb', textAlign: 'center' }}>
            {text}
          </p>

          {/* In partnership with — Satisfy 20px, #98969d, centred */}
          <div className="flex flex-col items-center" style={{ marginTop: 120, gap: 27 }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 400, fontSize: 20, color: '#98969d', letterSpacing: '0.4px', margin: 0, textAlign: 'center' }}>
              In partnership with
            </p>
            {partnerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Partner" src={partnerLogo} loading="lazy" style={{ width: 420, height: 54, objectFit: 'contain' }} />
            ) : (
              <p style={{ fontFamily: '"Inter,sans-serif', fontWeight: 400, fontSize: 36, letterSpacing: '0.15em', color: '#fff', opacity: 0.3, margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>
                {partnerName}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
