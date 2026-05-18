import { SectionTitle } from './SectionTitle'
import type { LandingEvent, ThingsToKnowItem } from './types'
import { ASSET_PEN_1, ASSET_PEN_2, ASSET_PEN_3, ASSET_PEN_4, ASSET_PEN_5, ASSET_PEN_6, ASSET_PEN_7 } from './assets'
import { renderText } from './renderText'
import { resolveMediaUrl } from './sanitizeUrl'

const PENS = [ASSET_PEN_1, ASSET_PEN_2, ASSET_PEN_3, ASSET_PEN_4, ASSET_PEN_5, ASSET_PEN_6, ASSET_PEN_7]

const DEFAULT_ITEMS: ThingsToKnowItem[] = [
  { text: 'There are only 15 tickets available for this event' },
  { text: 'Tickets are non-transferable. Entry will be denied if the names of the participant and +1 do not match the ticket' },
  { text: 'Tickets are priced ₹3,000 + GST. Each ticket includes the entry of the participant, the entry of a +1, and food and beverages for the duration of the event' },
  { text: 'Both the participant and +1 must be over 18 years of age and must carry a Government Photo ID to the event for verification' },
  { text: 'Sharp objects, prohibited substances, lighters, e-cigarettes, food items, etc. are prohibited' },
  { text: 'For any medication you wish to carry, please bring a doctor-signed prescription' },
  { text: 'Passes for Inner Circle events are non-cancellable and non-refundable' },
]

function Item({ item, index, size }: { item: ThingsToKnowItem; index: number; size: 'sm' | 'lg' }) {
  const iconSrc = resolveMediaUrl(item.iconUrl) || PENS[index % PENS.length]
  const iconSize = size === 'lg' ? 24 : 20
  const fs       = size === 'lg' ? 16 : 14
  const lh       = size === 'lg' ? '22px' : '20px'
  return (
    <div className="flex items-start" style={{ gap: 8 }}>
      <div style={{ width: iconSize, height: iconSize, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={iconSrc} loading="lazy" style={{ width: iconSize, height: iconSize, objectFit: 'contain', display: 'block' }} />
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: fs, lineHeight: lh, color: '#c5c4c8' }}>{renderText(item.text)}</p>
    </div>
  )
}

export function ThingsToKnow({ event }: { event: LandingEvent }) {
  const raw = event.settings?.thingsToKnow
  const items: ThingsToKnowItem[] = raw?.length
    ? raw.map(r => typeof r === 'string' ? { text: r } : r)
    : DEFAULT_ITEMS

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col px-4 md:hidden" style={{ gap: 24 }}>
        <SectionTitle>Things to know</SectionTitle>
        <div className="flex flex-col" style={{ gap: 15 }}>
          {items.map((item, i) => <Item key={i} item={item} index={i} size="sm" />)}
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col" style={{ gap: 32 }}>
        <SectionTitle>Things to know</SectionTitle>
        <div className="flex flex-col" style={{ gap: 24 }}>
          {items.map((item, i) => <Item key={i} item={item} index={i} size="lg" />)}
        </div>
      </div>
    </>
  )
}
