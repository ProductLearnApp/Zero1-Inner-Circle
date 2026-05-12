import { SectionTitle } from './SectionTitle'
import type { LandingEvent } from './types'
import { ASSET_PEN_1, ASSET_PEN_2, ASSET_PEN_3, ASSET_PEN_4 } from './assets'

const PENS = [ASSET_PEN_1, ASSET_PEN_2, ASSET_PEN_3, ASSET_PEN_4]

const DEFAULT_ITEMS = [
  'There are only 15 tickets available for this event',
  'Tickets are priced at ₹3,000. Each ticket includes the entry of the participant, the entry of a +1, and food and beverages for the duration of the event',
  'Tickets are non-transferable. Entry will be denied if the names of the participant and +1 do not match the ticket',
  'Both the participant and +1 must be over 18 years of age and must carry a Government Photo ID to the event for verification',
  'Sharp objects, prohibited substances, lighters, e-cigarettes, food items, etc. are prohibited',
  'For any medication you wish to carry, please bring a doctor-signed prescription',
]

function Item({ text, size }: { text: string; size: 'sm' | 'lg' }) {
  const iconSize = size === 'lg' ? 24 : 20
  const gap      = size === 'lg' ? 8 : 8
  const fs       = size === 'lg' ? 16 : 14
  const lh       = size === 'lg' ? '22px' : '20px'
  return (
    <div className="flex items-start" style={{ gap }}>
      <img alt="" src={PENS[0]} className="shrink-0" style={{ width: iconSize, height: iconSize }} />
      <p style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: fs, lineHeight: lh, color: '#c5c4c8' }}>{text}</p>
    </div>
  )
}

export function ThingsToKnow({ event }: { event: LandingEvent }) {
  const items = event.settings?.thingsToKnow?.length ? event.settings.thingsToKnow : DEFAULT_ITEMS

  return (
    <>
      {/* ── Mobile ── */}
      <div className="flex flex-col px-4 md:hidden" style={{ gap: 24 }}>
        <SectionTitle>Things to know</SectionTitle>
        <div className="flex flex-col" style={{ gap: 15 }}>
          {items.map((item, i) => <Item key={i} text={item} size="sm" />)}
        </div>
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:flex flex-col" style={{ gap: 32, width: 650 }}>
        <SectionTitle>Things to know</SectionTitle>
        <div className="flex flex-col" style={{ gap: 24 }}>
          {items.map((item, i) => <Item key={i} text={item} size="lg" />)}
        </div>
      </div>
    </>
  )
}
