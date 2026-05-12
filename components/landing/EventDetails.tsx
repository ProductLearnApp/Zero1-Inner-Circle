import type { LandingEvent } from './types'
import {
  ASSET_ICON_DATE, ASSET_ICON_FLAT,
  ASSET_ICON_LOCATION,
  ASSET_ICON_TIME,
  ASSET_ICON_MONEY,
  ASSET_ICON_PASSES,
} from './assets'

/*
 * Mobile:  flex-col vertical list, gap-[16px], 14px Satoshi Medium
 * Desktop: 2-row grid — Row1: Date | Location | Time  Row2 (centred): Passes | Price — 18px Satoshi Medium
 */

function IconCircle({ src, innerSrc, innerSize = 20, innerOffset = 6 }: {
  src: string; innerSrc?: string; innerSize?: number; innerOffset?: number
}) {
  return (
    <div className="relative shrink-0" style={{ width: 32, height: 32 }}>
      <img alt="" src={src} className="absolute inset-0 w-full h-full" />
      {innerSrc && (
        <img alt="" src={innerSrc} className="absolute"
          style={{ left: innerOffset, top: innerOffset, width: innerSize, height: innerSize }} />
      )}
    </div>
  )
}

export function EventDetails({ event }: { event: LandingEvent }) {
  const S = { fontFamily: 'Satoshi,sans-serif', fontWeight: 500, color: '#fff' }
  const M = { ...S, fontSize: 14, lineHeight: '16px' }
  const D = { ...S, fontSize: 18, lineHeight: '24px' }
  const DIM = { ...D, color: '#807d85' }

  return (
    <>
      {/* ── Mobile — vertical ── */}
      <div className="flex flex-col md:hidden" style={{ gap: 16 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_FLAT} />
          <span style={M}>{event.date}</span>
        </div>
        <div className="flex items-start" style={{ gap: 8 }}>
          <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_LOCATION} innerSize={15} innerOffset={8} />
          <span style={M}>{event.city} <span style={{ color: '#807d85' }}>(the exact location will be mentioned on your ticket)</span></span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <IconCircle src={ASSET_ICON_TIME} />
          <span style={M}>{event.time}</span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_MONEY} innerSize={16} innerOffset={8} />
          <span style={M}>{event.price ?? '3000/- per head'}</span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_PASSES} innerSize={14} innerOffset={9} />
          <span style={M}>Only {event.maxCapacity} passes</span>
        </div>
      </div>

      {/* ── Desktop — 2-row grid ── */}
      <div className="hidden md:flex flex-col" style={{ gap: 0, width: 1000 }}>
        {/* Row 1 */}
        <div className="flex items-center" style={{ gap: 0 }}>
          <div className="flex items-center p-[10px]" style={{ gap: 8 }}>
            <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_FLAT} />
            <span style={D}>{event.date}</span>
          </div>
          <div className="flex items-center p-[10px]" style={{ gap: 8, marginLeft: 60 }}>
            <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_LOCATION} innerSize={15} innerOffset={8} />
            <span style={D}>{event.city}</span>
            <span style={DIM}>(the exact location will be mentioned on your ticket)</span>
          </div>
          <div className="flex items-center p-[10px]" style={{ gap: 8, marginLeft: 'auto' }}>
            <IconCircle src={ASSET_ICON_TIME} />
            <span style={D}>{event.time}</span>
          </div>
        </div>
        {/* Row 2 — centred */}
        <div className="flex items-center justify-center" style={{ gap: 147, marginTop: 0 }}>
          <div className="flex items-center p-[10px]" style={{ gap: 8 }}>
            <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_PASSES} innerSize={14} innerOffset={9} />
            <span style={D}>Only {event.maxCapacity} passes</span>
          </div>
          <div className="flex items-center p-[10px]" style={{ gap: 8 }}>
            <IconCircle src={ASSET_ICON_DATE} innerSrc={ASSET_ICON_MONEY} innerSize={16} innerOffset={8} />
            <span style={D}>{event.price ?? '3000/- per head'}</span>
          </div>
        </div>
      </div>
    </>
  )
}
