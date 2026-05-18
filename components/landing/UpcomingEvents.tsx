import Image from 'next/image'
import type { LandingEvent } from './types'
import {
  ASSET_HERO_IMG2, ASSET_CARD_ICON_DATE, ASSET_CARD_ICON_PASSES, ASSET_INFO_ICON,
} from './assets'
import { resolveMediaUrl, isExternalUrl } from './sanitizeUrl'
import { SectionTitle } from './SectionTitle'

/*
 * Figma node 6055:4197 — "Upcoming events" section.
 *
 * Event card: 820×457px desktop / full-width mobile (aspect 820/457).
 * Gradient: linear-gradient(1.17deg, #0f071a 11.92%, rgba(15,7,26,0.705) 48.79%, transparent 99.48%)
 *
 * Title: Inter ExtraBold 29.681px, 3-layer stacked via CSS text-shadow:
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
  const cardImage = resolveMediaUrl(event.settings?.eventCardImageUrl) || ASSET_HERO_IMG2

  return (
    <>
      {/* ── Mobile ── Figma node 6120:7525 — 328×249px card ── */}
      <div className="w-full md:hidden" style={{ paddingTop: 40 }}>
        <div className="px-4">
          <SectionTitle>Upcoming events</SectionTitle>
        </div>

        {/*
          Card: 328×249px, borderRadius 9.659px, centered.
          Gradient starts at top:65px, height 184px (Figma 6120:7527).
          Event title at top:21px (Figma 6120:7544).
          Info bar at top:190px (Figma 6122:7553).
        */}
        <div
          className="relative overflow-hidden mx-auto"
          style={{ marginTop: 20, width: 328, height: 249, borderRadius: 9.66 }}
        >
          <Image
            alt="" src={cardImage}
            fill priority
            unoptimized={isExternalUrl(cardImage)}
            sizes="(max-width: 768px) 328px, 900px"
            className="object-cover object-bottom"
          />
          {/* Gradient overlay — anchored 65px from top */}
          <div style={{
            position: 'absolute', left: 0, top: 65, width: '100%', height: 184,
            background: 'linear-gradient(1.17deg, #0f071a 11.92%, rgba(15,7,26,0.705) 48.79%, transparent 99.48%)',
          }} />

          {/* Event title overlay — top:21px, centered, 152px wide */}
          {(event.settings?.eventCardSubtitle?.trim()) && (
            <div style={{
              position: 'absolute', top: 21, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', width: 152, gap: 0.4,
            }}>
              {/* 3-layer stacked shadow title */}
              <div style={{
                display: 'inline-grid',
                gridTemplateColumns: 'max-content',
                gridTemplateRows: 'max-content',
                placeItems: 'start',
                lineHeight: 0,
              }}>
                {(['#f57434', '#f5bd34', '#ffffff'] as const).map((color, idx) => (
                  <p key={idx} style={{
                    gridColumn: 1, gridRow: 1,
                    fontFamily: 'Inter,sans-serif',
                    fontWeight: 800,
                    fontSize: 11.9,
                    lineHeight: 0.98,
                    textTransform: 'uppercase',
                    color,
                    whiteSpace: 'nowrap',
                    margin: 0,
                    marginTop: idx === 1 ? 0.75 : 0,
                  }}>
                    {event.settings?.eventCardSubtitle}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Info bar at top:190px */}
          <div style={{
            position: 'absolute', top: 190,
            left: '50%', transform: 'translateX(-50.5%)',
            width: 317,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}>
            {/* Left: date + city */}
            <div className="flex items-start" style={{ gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 2.21, overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={ASSET_CARD_ICON_DATE} style={{ width: 19, height: 19, objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3.22, width: 138 }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#fff', margin: 0 }}>
                  {event.date}{event.time ? `, [${event.time}]` : ''}
                </p>
                <div className="flex items-center" style={{ gap: 1.61 }}>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#fff', margin: 0 }}>{event.city}</p>
                  {event.venue && (
                    <div className="group relative" style={{ display: 'flex', alignItems: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" src={ASSET_INFO_ICON} style={{ width: 9.66, height: 9.66 }} />
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
            {/* Right: passes + price */}
            <div className="flex items-start" style={{ gap: 4, width: 140 }}>
              <div style={{
                width: 29.78, height: 29.78, borderRadius: 2.05, overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={ASSET_CARD_ICON_PASSES} style={{ width: 17.7, height: 17.7, objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3.22 }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#fff', margin: 0 }}>
                  Only {event.maxCapacity} passes
                </p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#fff', margin: 0 }}>
                  {event.price ?? '₹3,000'} + GST (you &amp; your +1)
                </p>
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
            <Image
              alt="" src={cardImage}
              fill priority
              unoptimized={isExternalUrl(cardImage)}
              sizes="900px"
              className="object-cover"
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
