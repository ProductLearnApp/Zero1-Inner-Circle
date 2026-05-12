import { SectionTitle } from './SectionTitle'
import type { TimelineItem, LandingEvent } from './types'
import { ASSET_CARD_BG } from './assets'

/*
 * Fresh connector asset URLs from Figma (5768:2398, fetched 2026-05-11)
 * Vector126 = horizontal dashed line (left connectors)
 * Vector129/130 = horizontal dashed line (right connectors, rotated)
 * Vector127 = vertical centre line
 */
const CARD_BG_FRESH  = 'https://www.figma.com/api/mcp/asset/e03b83ee-03c5-48f7-b7d6-4866c3cef908' // Rectangle281
const DOT_INNER_FRESH = 'https://www.figma.com/api/mcp/asset/51cbc578-8520-4e2f-8049-53f625caca74' // Ellipse1124
const DOT_OUTER_FRESH = 'https://www.figma.com/api/mcp/asset/9aa14555-8d5b-4a5f-a925-caaac847ebbf' // Ellipse1125
const H_CONNECTOR_L  = 'https://www.figma.com/api/mcp/asset/4590f8db-dcf8-4a90-805d-d05df41447ac' // Vector126
const H_CONNECTOR_R  = 'https://www.figma.com/api/mcp/asset/8d578b4a-7983-48ee-a5a9-afb8192562a4' // Vector129
const V_LINE         = 'https://www.figma.com/api/mcp/asset/060b905f-c5cd-49e8-a8ef-c1b833060565' // Vector127

const DEFAULT_TIMELINE: TimelineItem[] = [
  { time: '11 AM – 11:30 AM',    title: 'Money Charades',                         imageUrl: '' },
  { time: '11:30 AM – 12:30 PM', title: 'The Curious Case of a Dead Portfolio',   imageUrl: '' },
  { time: '12:30 PM – 1:30 PM',  title: 'Lunch, Networking & Experience Zones',   imageUrl: '' },
  { time: '1:30 PM – 2:15 PM',   title: 'Battle of the Paylords',                 imageUrl: '' },
  { time: '2:15 PM – 3:00 PM',   title: 'The Silver Lining (Origami balloons)',   imageUrl: '' },
]

const ACCENT = ['#fbb03a', '#ffacf1', '#bc9cff', '#f1a76a', '#00f2ee']

/* ─── Mobile card 140×150px ───────────────────────────────── */
function MobileCard({ item, accent }: { item: TimelineItem; accent: string }) {
  const words = item.title.split(' ')
  const last  = words.pop()!
  const rest  = words.join(' ')
  const bg    = item.imageUrl || ASSET_CARD_BG
  return (
    <div className="relative overflow-hidden shrink-0" style={{ width: 140, height: 150, borderRadius: 7.74, border: '0.65px solid #212121' }}>
      <img alt="" src={bg} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 86, background: 'linear-gradient(to top,#000,transparent)' }} />
      <p className="absolute text-center w-full px-1 uppercase" style={{ bottom: 8, fontFamily: 'Impact,"Arial Black",sans-serif', fontWeight: 800, fontSize: 13, letterSpacing: 0.4, lineHeight: 1.15, color: '#fff' }}>
        {rest && <span>{rest} </span>}
        <span style={{ color: accent }}>{last}</span>
      </p>
    </div>
  )
}

/* ─── Desktop card 217×232px ──────────────────────────────── */
function DesktopCard({ item, accent }: { item: TimelineItem; accent: string; align?: 'center' | 'left' | 'right' }) {
  const words = item.title.split(' ')
  const last  = words.pop()!
  const rest  = words.join(' ')
  const bg    = item.imageUrl || CARD_BG_FRESH
  return (
    <div className="relative overflow-hidden shrink-0" style={{ width: 217, height: 232, borderRadius: 12, border: '1px solid #212121' }}>
      {/* Card bg — slightly oversized and centred as in Figma */}
      <div className="absolute" style={{ left: '50%', top: -49, transform: 'translateX(calc(-50% - 8px))', width: 241, height: 334, borderRadius: 24 }}>
        <img alt="" src={bg} className="absolute inset-0 w-full h-full object-cover rounded-[24px] pointer-events-none" />
      </div>
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0" style={{ width: 217, height: 134, background: 'linear-gradient(to top,#000 0%,rgba(0,0,0,0) 100%)' }} />
      {/* Title */}
      <p className="absolute text-center uppercase w-full" style={{
        top: 182,
        fontFamily: 'Impact,"Arial Black","Thunder ExtraBoldLC",sans-serif',
        fontWeight: 800, fontSize: 24, letterSpacing: 0.72, lineHeight: 1.1, color: '#fff',
        padding: '0 8px',
      }}>
        {rest && <span>{rest} </span>}
        <span style={{ color: accent }}>{last}</span>
      </p>
    </div>
  )
}

function Dot25() {
  return (
    <div className="relative shrink-0" style={{ width: 25, height: 25 }}>
      <img alt="" src={DOT_OUTER_FRESH} className="absolute inset-0 w-full h-full" />
      <img alt="" src={DOT_INNER_FRESH} className="absolute" style={{ left: 5.36, top: 5.36, width: 14.29, height: 14.29 }} />
    </div>
  )
}

/* ─── Mobile layout (same as before) ──────────────────────── */
const M_TOPS_L = [0, 243, 475], M_TOPS_R = [115, 354]
const M_CARD_H = 150, M_LABEL_H = 20, M_GAP = 14
const M_BLOCK_H = Math.max(
  M_TOPS_L[2] + M_LABEL_H + M_GAP + M_CARD_H,
  M_TOPS_R[1] + M_LABEL_H + M_GAP + M_CARD_H,
)

function MobileDot() {
  return (
    <div className="relative shrink-0" style={{ width: 14, height: 14 }}>
      <img alt="" src={DOT_OUTER_FRESH} className="absolute inset-0 w-full h-full" />
      <img alt="" src={DOT_INNER_FRESH} className="absolute" style={{ left: 3, top: 3, width: 8, height: 8 }} />
    </div>
  )
}

export function TimelineSection({ event }: { event: LandingEvent }) {
  const items = event.settings?.timeline?.length ? event.settings.timeline : DEFAULT_TIMELINE

  /* Mobile left/right split */
  const mLeft  = items.filter((_, i) => i % 2 === 0)
  const mRight = items.filter((_, i) => i % 2 === 1)
  const mDotTops = items.map((_, i) => {
    const tops = i % 2 === 0 ? M_TOPS_L : M_TOPS_R
    const base = tops[Math.floor(i / 2)] ?? (tops[tops.length - 1] + (Math.floor(i / 2) - tops.length + 1) * (M_LABEL_H + M_GAP + M_CARD_H + 10))
    return base + M_LABEL_H + M_GAP + M_CARD_H / 2 - 7
  })

  /*
   * Desktop positions are computed dynamically so any number of timeline slots
   * are supported. Constants derived from Figma 5768:2398 spacing:
   *   BASE_L=98  STEP_L=351  (left-column slot tops)
   *   BASE_R=214 STEP_R=344  (right-column slot tops, offset by ~116px)
   *   SLOT_H=269 = label(20) + gap(17) + card(232)
   */
  const leftItems  = items.filter((_, i) => i % 2 === 0)
  const rightItems = items.filter((_, i) => i % 2 === 1)

  const BASE_L = 98,  STEP_L = 351
  const BASE_R = 214, STEP_R = 344
  const SLOT_H = 269

  const dLeftCards  = leftItems.map((_,  i) => BASE_L + i * STEP_L)
  const dRightCards = rightItems.map((_, i) => BASE_R + i * STEP_R)
  const dLeftDots   = leftItems.map((_,  i) => BASE_L + 2  + i * STEP_L)
  const dRightDots  = rightItems.map((_, i) => BASE_R      + i * STEP_R)
  const dHConnL     = leftItems.map((_,  i) => BASE_L + 14 + i * STEP_L)
  const dHConnR     = rightItems.map((_, i) => BASE_R + 13 + i * STEP_R)

  const lastL     = leftItems.length  ? BASE_L + (leftItems.length  - 1) * STEP_L + SLOT_H : 0
  const lastR     = rightItems.length ? BASE_R + (rightItems.length - 1) * STEP_R + SLOT_H : 0
  const D_BLOCK_H = Math.max(lastL, lastR) + 20
  const D_CARD_W  = 217

  // Vertical line spans first dot to last dot
  const firstDotY = Math.min(BASE_L + 2, BASE_R)
  const lastDotY  = Math.max(
    leftItems.length  ? BASE_L + 2 + (leftItems.length  - 1) * STEP_L : 0,
    rightItems.length ? BASE_R     + (rightItems.length - 1) * STEP_R : 0,
  )
  const V_LINE_H = Math.max(lastDotY - firstDotY + 25, 0)

  return (
    <>
      {/* ══════ MOBILE ══════ */}
      <div className="flex flex-col md:hidden" style={{ gap: 32 }}>
        <SectionTitle>Activities for you</SectionTitle>
        <div className="px-4">
          <div className="relative" style={{ width: 328, height: M_BLOCK_H }}>
            {/* vertical centre line */}
            <div className="absolute" style={{
              left: 157 + 7,
              top: mDotTops[0],
              width: 1,
              height: (mDotTops[mDotTops.length - 1] ?? 0) - (mDotTops[0] ?? 0) + 14,
              background: 'rgba(255,255,255,0.15)',
            }} />
            {mDotTops.map((top, i) => (
              <div key={i} className="absolute" style={{ left: 157, top }}><MobileDot /></div>
            ))}
            {mLeft.map((item, i) => (
              <div key={i} className="absolute flex flex-col" style={{ left: 0, top: M_TOPS_L[i], gap: M_GAP }}>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>{item.time}</p>
                <MobileCard item={item} accent={ACCENT[i * 2] ?? '#f5bd34'} />
              </div>
            ))}
            {mRight.map((item, i) => (
              <div key={i} className="absolute flex flex-col items-end" style={{ right: 0, top: M_TOPS_R[i], gap: M_GAP }}>
                <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>{item.time}</p>
                <MobileCard item={item} accent={ACCENT[i * 2 + 1] ?? '#f5bd34'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ DESKTOP ══════ */}
      <div className="hidden md:flex flex-col" style={{ gap: 56, width: 678 }}>
        <SectionTitle>Activities for you</SectionTitle>
        <div className="relative" style={{ width: 678, height: D_BLOCK_H }}>

          {/* Vertical centre line: spans first dot to last dot */}
          <div className="absolute" style={{ left: 339, top: firstDotY, width: 0, height: V_LINE_H }}>
            <img alt="" src={V_LINE} className="block" style={{ width: 1, height: V_LINE_H }} />
          </div>

          {/* Left horizontal connectors (Vector126): left=236, width=90 */}
          {dHConnL.map((top, i) => (
            items[i * 2] && (
              <div key={i} className="absolute overflow-hidden" style={{ left: 236, top, width: 90, height: 1 }}>
                <img alt="" src={H_CONNECTOR_L} className="block w-full" style={{ height: 1 }} />
              </div>
            )
          ))}

          {/* Right horizontal connectors (Vector129, left-pointing): left=353, width=90 */}
          {dHConnR.map((top, i) => (
            items[i * 2 + 1] && (
              <div key={i} className="absolute overflow-hidden" style={{ left: 353, top, width: 90, height: 1 }}>
                <img alt="" src={H_CONNECTOR_R} className="block w-full" style={{ height: 1 }} />
              </div>
            )
          ))}

          {/* Left column DOTS at left=326 */}
          {dLeftDots.map((top, i) => (
            items[i * 2] && (
              <div key={i} className="absolute" style={{ left: 326, top }}>
                <Dot25 />
              </div>
            )
          ))}

          {/* Right column DOTS at left=326 */}
          {dRightDots.map((top, i) => (
            items[i * 2 + 1] && (
              <div key={i} className="absolute" style={{ left: 326, top }}>
                <Dot25 />
              </div>
            )
          ))}

          {/* Left column cards: left=0, items-end */}
          {dLeftCards.map((top, i) => {
            const item = items[i * 2]
            if (!item) return null
            return (
              <div key={i} className="absolute flex flex-col items-end" style={{ left: 0, top, width: D_CARD_W, gap: 17 }}>
                <p className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
                  {item.time}
                </p>
                <DesktopCard item={item} accent={ACCENT[i * 2] ?? '#f5bd34'} />
              </div>
            )
          })}

          {/* Right column cards: left=461 (326+135), items-start */}
          {dRightCards.map((top, i) => {
            const item = items[i * 2 + 1]
            if (!item) return null
            return (
              <div key={i} className="absolute flex flex-col items-start" style={{ left: 461, top, width: D_CARD_W, gap: 17 }}>
                <p className="text-center w-full" style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 700, fontSize: 18, lineHeight: '20px', color: '#fff', whiteSpace: 'nowrap' }}>
                  {item.time}
                </p>
                <DesktopCard item={item} accent={ACCENT[i * 2 + 1] ?? '#f5bd34'} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
