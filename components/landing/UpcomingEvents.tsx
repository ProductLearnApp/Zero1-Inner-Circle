import type { LandingEvent } from './types'
import { ASSET_HERO_IMG2, ASSET_ICON_DATE, ASSET_ICON_PASSES } from './assets'
import { sanitizeUrl } from './sanitizeUrl'
import { SectionTitle } from './SectionTitle'

/*
 * Figma node 6055:4197 — "Upcoming events" section.
 * Card: 820×457px desktop, full-width mobile.
 * Bottom info bar: date+city left, passes+price right.
 */

export function UpcomingEvents({ event }: { event: LandingEvent }) {
  const cardImage = sanitizeUrl(event.settings?.eventCardImageUrl) || ASSET_HERO_IMG2
  const cardSubtitle = event.settings?.eventCardSubtitle ?? 'Curating the right mix of investments'

  return (
    <>
      {/* ── Mobile ── */}
      <div className="w-full md:hidden px-4" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <SectionTitle>Upcoming events</SectionTitle>
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ marginTop: 20, aspectRatio: '820/457' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={cardImage}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager" fetchPriority="high" />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.88) 100%)' }} />

          {/* Title overlay — top */}
          <div className="absolute" style={{ top: 18, left: 16, right: 16 }}>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Satoshi,sans-serif' }}>
              ACTIVITY 1
            </p>
            <p className="font-bold" style={{ fontFamily: '"Gilroy-ExtraBold","Gilroy","Satoshi",sans-serif', fontSize: 20, lineHeight: 1.1, color: '#fff', marginTop: 2 }}>
              {event.name}
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', marginTop: 4, fontFamily: 'Satoshi,sans-serif' }}>
              {cardSubtitle}
            </p>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-3" style={{ gap: 8 }}>
            {/* Date + city */}
            <div className="flex items-center" style={{ gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={ASSET_ICON_DATE} style={{ width: 36, height: 36, borderRadius: 8 }} />
              <div>
                <p className="text-white text-xs font-medium" style={{ fontFamily: 'Satoshi,sans-serif', lineHeight: 1.3 }}>{event.date}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Satoshi,sans-serif' }}>{event.city}</p>
              </div>
            </div>
            {/* Passes + price */}
            <div className="flex items-center" style={{ gap: 8 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={ASSET_ICON_PASSES} style={{ width: 36, height: 36, borderRadius: 8 }} />
              <div>
                <p className="text-white text-xs font-medium" style={{ fontFamily: 'Satoshi,sans-serif', lineHeight: 1.3 }}>Only {event.maxCapacity} passes</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Satoshi,sans-serif' }}>{event.price ?? '₹3,000'} + GST (you &amp; your +1)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 80 }}>
        <div style={{ width: 820 }}>
          <SectionTitle>Upcoming events</SectionTitle>
          <div className="relative overflow-hidden rounded-2xl" style={{ marginTop: 24, width: 820, height: 457 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={cardImage}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager" fetchPriority="high" />
            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.85) 100%)' }} />

            {/* Title overlay — top centre */}
            <div className="absolute flex flex-col items-center" style={{ top: 28, left: '50%', transform: 'translateX(-50%)', width: 378, textAlign: 'center' }}>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Satoshi,sans-serif' }}>
                ACTIVITY 1
              </p>
              <p className="font-bold" style={{ fontFamily: '"Gilroy-ExtraBold","Gilroy","Satoshi",sans-serif', fontSize: 29, lineHeight: 1.1, color: '#fff', marginTop: 4 }}>
                {event.name}
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginTop: 6, fontFamily: 'Satoshi,sans-serif', lineHeight: 1.4 }}>
                {cardSubtitle}
              </p>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between" style={{ padding: '0 22px 16px' }}>
              {/* Date + city */}
              <div className="flex items-center" style={{ gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={ASSET_ICON_DATE} style={{ width: 44, height: 44, borderRadius: 10 }} />
                <div>
                  <p className="text-white font-medium" style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 15, lineHeight: 1.4 }}>{event.date}{event.time ? `, [${event.time}]` : ''}</p>
                  <div className="flex items-center" style={{ gap: 4 }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontFamily: 'Satoshi,sans-serif' }}>{event.city}</p>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>ⓘ</span>
                  </div>
                </div>
              </div>
              {/* Passes + price */}
              <div className="flex items-center" style={{ gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={ASSET_ICON_PASSES} style={{ width: 44, height: 44, borderRadius: 10 }} />
                <div>
                  <p className="text-white font-medium" style={{ fontFamily: 'Satoshi,sans-serif', fontSize: 15, lineHeight: 1.4 }}>Only {event.maxCapacity} passes</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontFamily: 'Satoshi,sans-serif' }}>{event.price ?? '₹3,000'} + GST (you &amp; your +1)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
