import { SectionTitle } from './SectionTitle'
import type { TimelineItem, LandingEvent } from './types'
import { sanitizeUrl } from './sanitizeUrl'

/*
 * Figma node 6055:4051 — "Flow of the Event" section.
 *
 * Each card: bg #1c1a1f, border-radius 36px, width 290px
 *   - Image at top: full-width, 243px tall
 *   - Time badge: overlaid on image, top-left, rgba(28,26,31,0.4) pill
 *   - Title: Satoshi Bold 18px white
 *   - Body: Satoshi Medium 13px #c5c4c8
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


/* ─── Desktop layout constants (matches Figma 6055:4051) ─────────────── */
const D_CARD_W  = 290   // card width
const D_CONT_W  = 760   // total section container width
const D_RIGHT_X = 470   // D_CONT_W - D_CARD_W — left edge of right column
const D_DOT_X   = 368   // left edge of center dot (center 380 - dot_size/2 12.5)
const D_DOT_SZ  = 25    // dot diameter
const D_H_CONN_W = D_DOT_X - D_CARD_W  // 78px — connector from card edge to dot
const D_BASE_L  = 0     // left column first card top
const D_BASE_R  = 123   // right column first card top (offset below left)
const D_STEP_L  = 406   // vertical step between left-column cards
const D_STEP_R  = 406   // vertical step between right-column cards

/* ─── Dot component ─────────────────────────────────────────────────── */
function Dot() {
  return (
    <div style={{ position: 'relative', width: D_DOT_SZ, height: D_DOT_SZ, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_OUTER} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={DOT_INNER} style={{ position: 'absolute', left: 5.36, top: 5.36, width: 14.29, height: 14.29 }} />
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
  const imgSrc = sanitizeUrl(item.imageUrl) || defaultBg
  const radius = mobile ? 24 : 36
  const imgH   = mobile ? 160 : 243
  const pad    = mobile ? '14px 18px 18px' : '16px 24px 24px'
  const titleFs = mobile ? 16 : 18
  const bodyFs  = mobile ? 12 : 13

  return (
    <div style={{
      background: '#1c1a1f',
      borderRadius: radius,
      overflow: 'hidden',
      width: mobile ? '100%' : D_CARD_W,
      flexShrink: 0,
    }}>
      {/* Image + time badge */}
      <div style={{ position: 'relative', height: imgH, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={imgSrc}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Time badge */}
        <div style={{
          position: 'absolute',
          top: mobile ? 10 : 12,
          left: mobile ? 10 : 12,
          background: 'rgba(28,26,31,0.4)',
          borderRadius: 31,
          padding: mobile ? '3px 10px' : '4px 12px',
        }}>
          <span style={{
            fontFamily: 'Satoshi,sans-serif',
            fontWeight: 700,
            fontSize: mobile ? 11 : 12,
            lineHeight: '16px',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}>
            {item.time}
          </span>
        </div>
      </div>

      {/* Title + body */}
      <div style={{ padding: pad }}>
        <p style={{
          fontFamily: 'Satoshi,sans-serif',
          fontWeight: 700,
          fontSize: titleFs,
          lineHeight: '22px',
          color: '#fff',
          marginBottom: mobile ? 4 : 6,
        }}>
          {item.title}
        </p>
        <p style={{
          fontFamily: 'Satoshi,sans-serif',
          fontWeight: 500,
          fontSize: bodyFs,
          lineHeight: '18px',
          color: '#c5c4c8',
        }}>
          {item.description ?? description}
        </p>
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

  /* Compute absolute top positions for each card */
  const leftTops  = leftItems.map((_,  i) => D_BASE_L + i * D_STEP_L)
  const rightTops = rightItems.map((_, i) => D_BASE_R + i * D_STEP_R)

  /* Approximate card height for block height calc */
  const CARD_H = 243 + 16 + 22 + 6 + 36 + 24  // ~347px

  const lastL = leftTops.length  ? leftTops[leftTops.length - 1]   + CARD_H : 0
  const lastR = rightTops.length ? rightTops[rightTops.length - 1] + CARD_H : 0
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
      {/* ══════ MOBILE — single column ══════ */}
      <div className="flex flex-col md:hidden" style={{ paddingTop: 60, gap: 32 }}>
        <SectionTitle>Flow of the Event</SectionTitle>
        <div className="flex flex-col px-4" style={{ gap: 16 }}>
          {items.map((item, i) => (
            <TimelineCard
              key={i}
              item={item}
              defaultBg={CARD_BG[i] ?? CARD_BG[0]}
              description={item.description}
              mobile
            />
          ))}
        </div>
      </div>

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
            <img alt="" src={V_LINE} style={{ width: 1, height: '100%', display: 'block' }} />
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
                <img alt="" src={H_CONN_L} style={{ width: '100%', height: 1, display: 'block' }} />
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
                <img alt="" src={H_CONN_R} style={{ width: '100%', height: 1, display: 'block' }} />
              </div>
            )
          ))}

        </div>
      </div>
    </>
  )
}
