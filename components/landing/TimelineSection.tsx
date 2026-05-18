import { SectionTitle } from './SectionTitle'
import type { TimelineItem, LandingEvent } from './types'
import { resolveMediaUrl } from './sanitizeUrl'

/*
 * Figma node 6055:4051 — "Flow of the Event" section.
 *
 * Each card: bg #1c1a1f, border-radius 36px, width 290px
 *   - Image at top: full-width, 243px tall
 *   - Time badge: overlaid on image, top-left, rgba(28,26,31,0.4) pill
 *   - Title: Inter Bold 18px white
 *   - Body: Inter Medium 13px #c5c4c8
 *
 * Desktop 2-column zig-zag layout: left col (0, 2, 4), right col (1, 3)
 * Right column offset down by 123px vs left column.
 * Vertical dashed center line + horizontal dashed connectors + dot indicators.
 *
 * Mobile: single-column full-width cards stacked vertically.
 */

/* ─── Figma image assets for card backgrounds (expire 7 days) ───────── */
const CARD_BG: string[] = [
  'https://www.figma.com/api/mcp/asset/57be8527-376d-420b-9e9d-4fc16bfa2b5c', // Money Charades
  'https://www.figma.com/api/mcp/asset/259ce848-9d7e-47da-88c0-b61addaac1ca', // Curious Case of a Dead Portfolio
  'https://www.figma.com/api/mcp/asset/837a6c33-21ae-4013-af42-645510b9c967', // Networking and Experience Zones
  'https://www.figma.com/api/mcp/asset/652891c7-fccb-4420-9694-0d5d736db677', // Balance(d) Sheet
  'https://www.figma.com/api/mcp/asset/837a6c33-21ae-4013-af42-645510b9c967', // Lunch
]

/* ─── Connector + dot assets ─────────────────────────────────────────── */
const DOT_OUTER   = 'https://www.figma.com/api/mcp/asset/9aa14555-8d5b-4a5f-a925-caaac847ebbf'
const DOT_INNER   = 'https://www.figma.com/api/mcp/asset/51cbc578-8520-4e2f-8049-53f625caca74'
const H_CONN_L    = 'https://www.figma.com/api/mcp/asset/4590f8db-dcf8-4a90-805d-d05df41447ac'
const H_CONN_R    = 'https://www.figma.com/api/mcp/asset/8d578b4a-7983-48ee-a5a9-afb8192562a4'
const V_LINE      = 'https://www.figma.com/api/mcp/asset/060b905f-c5cd-49e8-a8ef-c1b833060565'


/* ─── Mobile layout constants (Figma 6126:7785 — 328.25px container) ── */
const M_CARD_W   = 139.25
const M_CONT_W   = 328
const M_RIGHT_X  = 189       // left edge of right column
const M_DOT_X    = 157.75    // left edge of dot (center ≈ 164.75 ≈ M_CONT_W/2)
const M_DOT_SZ   = 14        // outer dot diameter (mobile dots are 14px)
const M_BASE_L   = 0         // left col first card top
const M_BASE_R   = 78        // right col offset below left (Figma: right_y - left_y = 126-48)
const M_GAP      = 32        // gap between cards in same column
const M_H_CONN_L = M_DOT_X - M_CARD_W                       // 18.5px
const M_H_CONN_R = M_RIGHT_X - (M_DOT_X + M_DOT_SZ)        // 17.25px

// Mobile card fixed height: 8(pad) + 116.682(img) + 6(gap) + 16(title) + 8(pad) = 154.682
// Each description line adds 20px (lineHeight 20px); ~17 chars/line in 123.25px inner width
function estimateMobileCardHeight(description = '') {
  const lines = Math.max(1, Math.ceil(description.length / 17))
  return 154.682 + lines * 20
}

/* ─── Desktop layout constants (matches Figma 6055:4051) ─────────────── */
const D_CARD_W   = 290   // card width
const D_CONT_W   = 760   // total section container width
const D_RIGHT_X  = 470   // D_CONT_W - D_CARD_W — left edge of right column
const D_DOT_X    = 368   // left edge of center dot (center 380 - dot_size/2 12.5)
const D_DOT_SZ   = 25    // dot diameter
const D_H_CONN_W = D_DOT_X - D_CARD_W  // 78px — connector from card edge to dot
const D_BASE_L   = 0     // left column first card top
const D_BASE_R   = 123   // right column first card top (offset below left)
const GAP        = 43    // consistent gap between cards in same column

// Fixed height parts: 24 (top pad) + 243 (img) + 8 (gap) + 24 (title lh) + 4 (gap) + 24 (bottom pad)
// + description lines × 18px; ~35 chars per line at 13px Inter in 242px inner width
function estimateCardHeight(description = '') {
  const lines = Math.max(1, Math.ceil(description.length / 35))
  return 327 + lines * 18
}

/* ─── Dot components ────────────────────────────────────────────────── */
function Dot() {
  return (
    <div style={{ position: 'relative', width: D_DOT_SZ, height: D_DOT_SZ, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_OUTER} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_INNER} loading="lazy" style={{ position: 'absolute', left: 5.36, top: 5.36, width: 14.29, height: 14.29 }} />
    </div>
  )
}

/* Mobile dot: 14×14 outer, 8×8 inner at offset 3,3 (Figma 6122:7721) */
function MobileDot() {
  return (
    <div style={{ position: 'relative', width: M_DOT_SZ, height: M_DOT_SZ }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_OUTER} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_INNER} loading="lazy" style={{ position: 'absolute', left: 3, top: 3, width: 8, height: 8 }} />
    </div>
  )
}

/* ─── Mobile card (Figma 6124:7737) ─────────────────────────────────── */
function MobileTimelineCard({ item, defaultBg }: { item: TimelineItem; defaultBg: string }) {
  const imgSrc = resolveMediaUrl(item.imageUrl) || defaultBg
  return (
    <div style={{
      background: '#1c1a1f',
      borderRadius: 17.286,
      padding: 8,
      width: M_CARD_W,
      flexShrink: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 116.682, borderRadius: 9.603, overflow: 'hidden', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={imgSrc} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 12, lineHeight: '16px', color: '#fff', margin: 0 }}>
            {item.title}
          </p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '20px', color: '#b7b5bb', margin: 0 }}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Card component ─────────────────────────────────────────────────── */
function TimelineCard({
  item,
  defaultBg,
  description,
  mobile,
}: {
  item: TimelineItem
  defaultBg: string
  description?: string
  mobile?: boolean
}) {
  const imgSrc   = resolveMediaUrl(item.imageUrl) || defaultBg
  const cardPad  = mobile ? 18 : 24
  const imgH     = mobile ? 160 : 243
  const imgR     = mobile ? 16 : 20
  const titleFs  = mobile ? 16 : 18
  const bodyFs   = mobile ? 12 : 13

  return (
    <div style={{
      background: '#1c1a1f',
      borderRadius: mobile ? 24 : 36,
      padding: cardPad,
      width: mobile ? '100%' : D_CARD_W,
      flexShrink: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Image with rounded corners */}
        <div style={{
          position: 'relative',
          height: imgH,
          borderRadius: imgR,
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={imgSrc}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Time badge */}
          {item.time && (
            <div style={{
              position: 'absolute',
              top: mobile ? 10 : 10,
              left: mobile ? 10 : 10,
              background: 'rgba(28,26,31,0.4)',
              borderRadius: 31,
              padding: mobile ? '3px 10px' : '4px 12px',
            }}>
              <span style={{
                fontFamily: 'Inter,sans-serif',
                fontWeight: 700,
                fontSize: mobile ? 11 : 12,
                lineHeight: '16px',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}>
                {item.time}
              </span>
            </div>
          )}
        </div>

        {/* Title + body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{
            fontFamily: 'Inter,sans-serif',
            fontWeight: 600,
            fontSize: titleFs,
            lineHeight: '24px',
            color: '#fff',
            margin: 0,
          }}>
            {item.title}
          </p>
          <p style={{
            fontFamily: 'Inter,sans-serif',
            fontWeight: 500,
            fontSize: bodyFs,
            lineHeight: '18px',
            color: '#c5c4c8',
            margin: 0,
          }}>
            {item.description ?? description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TimelineSection({ event }: { event: LandingEvent }) {
  const items = (event.settings?.timeline ?? []) as TimelineItem[]

  if (items.length === 0) return null

  /* Split into left/right columns */
  const leftItems  = items.filter((_, i) => i % 2 === 0)  // 0,2,4
  const rightItems = items.filter((_, i) => i % 2 === 1)  // 1,3

  /* Compute absolute top positions dynamically so gap stays consistent */
  const leftTops: number[] = leftItems.reduce<number[]>((acc, item, i) => {
    if (i === 0) return [D_BASE_L]
    const prev = acc[i - 1]
    return [...acc, prev + estimateCardHeight(leftItems[i - 1].description) + GAP]
  }, [])

  const rightTops: number[] = rightItems.reduce<number[]>((acc, item, i) => {
    if (i === 0) return [D_BASE_R]
    const prev = acc[i - 1]
    return [...acc, prev + estimateCardHeight(rightItems[i - 1].description) + GAP]
  }, [])

  const lastL = leftTops.length
    ? leftTops[leftTops.length - 1] + estimateCardHeight(leftItems[leftItems.length - 1]?.description)
    : 0
  const lastR = rightTops.length
    ? rightTops[rightTops.length - 1] + estimateCardHeight(rightItems[rightItems.length - 1]?.description)
    : 0
  const D_BLOCK_H = Math.max(lastL, lastR) + 20

  /* Vertical line: spans from first dot to last dot */
  const firstDotY = Math.min(leftTops[0] ?? 0, rightTops[0] ?? 0) + 12
  const lastDotY  = Math.max(
    leftTops[leftTops.length - 1]   ?? 0,
    rightTops[rightTops.length - 1] ?? 0,
  ) + 12
  const V_LINE_H = Math.max(lastDotY - firstDotY + D_DOT_SZ, 0)

  return (
    <>
      {/* ══════ MOBILE — 2-column staggered (Figma 6126:7785) ══════ */}
      {(() => {
        /* Same split as desktop */
        const mLeftItems  = items.filter((_, i) => i % 2 === 0)
        const mRightItems = items.filter((_, i) => i % 2 === 1)

        const mLeftTops: number[] = mLeftItems.reduce<number[]>((acc, _item, i) => {
          if (i === 0) return [M_BASE_L]
          const prev = acc[i - 1]
          return [...acc, prev + estimateMobileCardHeight(mLeftItems[i - 1].description) + M_GAP]
        }, [])

        const mRightTops: number[] = mRightItems.reduce<number[]>((acc, _item, i) => {
          if (i === 0) return [M_BASE_R]
          const prev = acc[i - 1]
          return [...acc, prev + estimateMobileCardHeight(mRightItems[i - 1].description) + M_GAP]
        }, [])

        const mLastL = mLeftTops.length
          ? mLeftTops[mLeftTops.length - 1] + estimateMobileCardHeight(mLeftItems[mLeftItems.length - 1]?.description)
          : 0
        const mLastR = mRightTops.length
          ? mRightTops[mRightTops.length - 1] + estimateMobileCardHeight(mRightItems[mRightItems.length - 1]?.description)
          : 0
        const mBlockH = Math.max(mLastL, mLastR) + 20

        const mFirstDotY = Math.min(mLeftTops[0] ?? 0, mRightTops[0] ?? 0)
        const mLastDotY  = Math.max(
          mLeftTops[mLeftTops.length - 1]   ?? 0,
          mRightTops[mRightTops.length - 1] ?? 0,
        )
        const mVLineH = Math.max(mLastDotY - mFirstDotY + M_DOT_SZ, 0)

        return (
          <div className="flex flex-col md:hidden" style={{ paddingTop: 60, gap: 29 }}>
            <SectionTitle>Flow of the Event</SectionTitle>
            <div style={{ position: 'relative', width: M_CONT_W, height: mBlockH, margin: '0 auto' }}>

              {/* Vertical center line */}
              <div style={{
                position: 'absolute',
                left: M_DOT_X + M_DOT_SZ / 2,
                top: mFirstDotY,
                width: 1,
                height: mVLineH,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={V_LINE} loading="lazy" style={{ width: 1, height: '100%', display: 'block' }} />
              </div>

              {/* Left column cards */}
              {mLeftItems.map((item, i) => (
                <div key={i} style={{ position: 'absolute', left: 0, top: mLeftTops[i] }}>
                  <MobileTimelineCard item={item} defaultBg={CARD_BG[i * 2] ?? CARD_BG[0]} />
                </div>
              ))}

              {/* Right column cards */}
              {mRightItems.map((item, i) => (
                <div key={i} style={{ position: 'absolute', left: M_RIGHT_X, top: mRightTops[i] }}>
                  <MobileTimelineCard item={item} defaultBg={CARD_BG[i * 2 + 1] ?? CARD_BG[0]} />
                </div>
              ))}

              {/* Left column dots */}
              {mLeftTops.map((top, i) => mLeftItems[i] && (
                <div key={i} style={{ position: 'absolute', left: M_DOT_X, top }}>
                  <MobileDot />
                </div>
              ))}

              {/* Right column dots */}
              {mRightTops.map((top, i) => mRightItems[i] && (
                <div key={i} style={{ position: 'absolute', left: M_DOT_X, top }}>
                  <MobileDot />
                </div>
              ))}

              {/* Left horizontal connectors: right edge of left card → dot */}
              {mLeftTops.map((top, i) => mLeftItems[i] && (
                <div key={i} style={{
                  position: 'absolute', left: M_CARD_W, top: top + 7,
                  width: M_H_CONN_L, height: 1, overflow: 'hidden',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={H_CONN_L} loading="lazy" style={{ width: '100%', height: 1, display: 'block' }} />
                </div>
              ))}

              {/* Right horizontal connectors: dot right edge → left edge of right card */}
              {mRightTops.map((top, i) => mRightItems[i] && (
                <div key={i} style={{
                  position: 'absolute', left: M_DOT_X + M_DOT_SZ, top: top + 7,
                  width: M_H_CONN_R, height: 1, overflow: 'hidden',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={H_CONN_R} loading="lazy" style={{ width: '100%', height: 1, display: 'block' }} />
                </div>
              ))}

            </div>
          </div>
        )
      })()}

      {/* ══════ DESKTOP — 2-column zig-zag ══════ */}
      <div className="hidden md:flex flex-col items-center" style={{ paddingTop: 100, gap: 56 }}>
        <SectionTitle>Flow of the Event</SectionTitle>
        <div style={{ position: 'relative', width: D_CONT_W, height: D_BLOCK_H }}>

          {/* Vertical dashed center line */}
          <div style={{
            position: 'absolute',
            left: D_DOT_X + D_DOT_SZ / 2,
            top: firstDotY,
            width: 1,
            height: V_LINE_H,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={V_LINE} loading="lazy" style={{ width: 1, height: '100%', display: 'block' }} />
          </div>

          {/* Left column cards */}
          {leftItems.map((item, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, top: leftTops[i] }}>
              <TimelineCard
                item={item}
                defaultBg={CARD_BG[i * 2] ?? CARD_BG[0]}
                description={item.description}
              />
            </div>
          ))}

          {/* Right column cards */}
          {rightItems.map((item, i) => (
            <div key={i} style={{ position: 'absolute', left: D_RIGHT_X, top: rightTops[i] }}>
              <TimelineCard
                item={item}
                defaultBg={CARD_BG[i * 2 + 1] ?? CARD_BG[0]}
                description={item.description}
              />
            </div>
          ))}

          {/* Left column dots — at D_DOT_X, vertically at card top + offset */}
          {leftTops.map((top, i) => (
            leftItems[i] && (
              <div key={i} style={{ position: 'absolute', left: D_DOT_X, top: top + 12 }}>
                <Dot />
              </div>
            )
          ))}

          {/* Right column dots */}
          {rightTops.map((top, i) => (
            rightItems[i] && (
              <div key={i} style={{ position: 'absolute', left: D_DOT_X, top: top + 12 }}>
                <Dot />
              </div>
            )
          ))}

          {/* Left horizontal connectors: right edge of left card → dot */}
          {leftTops.map((top, i) => (
            leftItems[i] && (
              <div key={i} style={{
                position: 'absolute',
                left: D_CARD_W,
                top: top + 24,
                width: D_H_CONN_W,
                height: 1,
                overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={H_CONN_L} loading="lazy" style={{ width: '100%', height: 1, display: 'block' }} />
              </div>
            )
          ))}

          {/* Right horizontal connectors: dot right edge → left edge of right card */}
          {rightTops.map((top, i) => (
            rightItems[i] && (
              <div key={i} style={{
                position: 'absolute',
                left: D_DOT_X + D_DOT_SZ,
                top: top + 24,
                width: D_RIGHT_X - (D_DOT_X + D_DOT_SZ),
                height: 1,
                overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={H_CONN_R} loading="lazy" style={{ width: '100%', height: 1, display: 'block' }} />
              </div>
            )
          ))}

        </div>
      </div>
    </>
  )
}
