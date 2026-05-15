import type { LandingEvent } from './types'
import {
  ASSET_HERO_IMG2, ASSET_CARD_ICON_DATE, ASSET_CARD_ICON_PASSES, ASSET_INFO_ICON,
} from './assets'
import { sanitizeUrl } from './sanitizeUrl'
import { SectionTitle } from './SectionTitle'

/*
 * Figma node 6055:4197 — "Upcoming events" section.
 *
 * Event card: 820×457px desktop / full-width mobile (aspect 820/457).
 * Gradient: linear-gradient(1.17deg, #0f071a 11.92%, rgba(15,7,26,0.705) 48.79%, transparent 99.48%)
 *
 * Title: Gilroy ExtraBold 29.681px, 3-layer stacked via CSS text-shadow:
 *   - White text on top
 *   - Gold (#f5bd34) shadow at 0 2px
 *   - Orange (#f57434) shadow at 0 4px
 *
 * Info bar:
 *   - Positioned at top: 353px (desktop)
 *   - Icon containers: 74×74px, icon image 44×44px centred
 */


function IconBox({ src, size }: { src: string; size: number }) {
  return (
    <div style={{
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={src} style={{ width: size === 74 ? 44 : 36, height: size === 74 ? 44 : 36 }} />
    </div>
  )
}

export function UpcomingEvents({ event }: { event: LandingEvent }) {
  const cardImage = sanitizeUrl(event.settings?.eventCardImageUrl) || ASSET_HERO_IMG2

  return (
    <>
      {/* ── Mobile ── */}
      <div className="w-full md:hidden px-4" style={{ paddingTop: 40 }}>
        <SectionTitle>Upcoming events</SectionTitle>

        <div className="relative w-full overflow-hidden rounded-3xl" style={{ marginTop: 20, aspectRatio: '820/457' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="" src={cardImage}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager" fetchPriority="high"
          />
          <div className="absolute inset-x-0 bottom-0" style={{
            height: '40%',
            background: 'linear-gradient(to top, rgba(15,7,26,0.85) 0%, rgba(15,7,26,0.4) 60%, transparent 100%)',
          }} />

          {/* Bottom info bar */}
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-between" style={{ padding: '0 12px 12px' }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <IconBox src={ASSET_CARD_ICON_DATE} size={44} />
              <div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 11, lineHeight: '16px', color: '#fff', margin: 0 }}>{event.date}</p>
                <div className="flex items-center" style={{ gap: 3 }}>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 11, color: '#fff', margin: 0 }}>{event.city}</p>
                  {event.venue && (
                    <div className="group relative" style={{ display: 'flex', alignItems: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" src={ASSET_INFO_ICON} style={{ width: 12, height: 12, opacity: 0.5 }} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{
                        background: 'rgba(15,7,26,0.9)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontFamily: 'Inter,sans-serif',
                        fontWeight: 500,
                        fontSize: 11,
                        color: '#fff',
                        zIndex: 10,
                      }}>
                        {event.venue}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: 6 }}>
              <IconBox src={ASSET_CARD_ICON_PASSES} size={44} />
              <div>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 11, lineHeight: '16px', color: '#fff', margin: 0 }}>Only {event.maxCapacity} passes</p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 11, color: '#fff', margin: 0 }}>{event.price ?? '₹3,000'} + GST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 80 }}>
        <div style={{ width: 900 }}>
          <SectionTitle>Upcoming events</SectionTitle>

          {/* Card: 900×506 (16:9) */}
          <div className="relative overflow-hidden rounded-3xl" style={{ marginTop: 24, width: 900, height: 506 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="" src={cardImage}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager" fetchPriority="high"
            />
            {/* Subtle bottom gradient — only covers info bar area */}
            <div className="absolute inset-x-0 bottom-0" style={{
              height: 160,
              background: 'linear-gradient(to top, rgba(15,7,26,0.85) 0%, rgba(15,7,26,0.4) 60%, transparent 100%)',
            }} />

            {/* Info bar — anchored to bottom, full card width split equally */}
            <div className="absolute flex items-center" style={{
              bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 856,
            }}>
              {/* Passes + price — left half */}
              <div className="flex items-center" style={{ flex: 1, minWidth: 0 }}>
                <IconBox src={ASSET_CARD_ICON_PASSES} size={74} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 16, lineHeight: '24px', color: '#fff', margin: 0 }}>
                    Only <strong>{event.maxCapacity}</strong> passes
                  </p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 16, lineHeight: '24px', color: '#fff', margin: 0 }}>
                    {event.price ?? '₹3,000'} + GST (includes you &amp; a +1)
                  </p>
                </div>
              </div>
              {/* Date + city — right half */}
              <div className="flex items-center" style={{ flex: 1, minWidth: 0 }}>
                <IconBox src={ASSET_CARD_ICON_DATE} size={74} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 16, lineHeight: '24px', color: '#fff', margin: 0 }}>
                    {event.date}{event.time ? `, [${event.time}]` : ''}
                  </p>
                  <div className="flex items-center" style={{ gap: 4 }}>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 16, color: '#fff', margin: 0 }}>{event.city}</p>
                    {event.venue && (
                      <div className="group relative" style={{ display: 'flex', alignItems: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="" src={ASSET_INFO_ICON} style={{ width: 24, height: 24 }} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{
                          background: 'rgba(15,7,26,0.9)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 8,
                          padding: '6px 14px',
                          fontFamily: 'Inter,sans-serif',
                          fontWeight: 500,
                          fontSize: 13,
                          color: '#fff',
                          zIndex: 10,
                        }}>
                          {event.venue}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
