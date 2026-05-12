import type { LandingEvent } from './types'
import { ASSET_ZERO1_LOGO_NAV } from './assets'

/*
 * Desktop sticky nav (Figma 5768:2698):
 * Centered frosted-glass panel 1044×80px, backdrop-blur-[40px], rounded-[16px]
 * Left: Zero1 logo 119×36px  |  Right: gold CTA 205×53px rounded-[8px]
 * Sits at y=111 from top of page (inside the 678px hero area), STICKY on scroll.
 */
export function LandingNav({ event }: { event: LandingEvent }) {
  const missionUrl = event.settings?.missionFormUrl || '#'

  return (
    /* Only visible on desktop (md+) */
    <nav
      className="hidden md:flex fixed top-[26px] left-1/2 z-50 items-center justify-between px-[18px]"
      style={{
        width: 1044,
        height: 80,
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(40px)',
        borderRadius: 16,
      }}
    >
      <img alt="Zero1" src={ASSET_ZERO1_LOGO_NAV} style={{ width: 119, height: 36 }} />

      <a
        href={missionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-lg"
        style={{ width: 205, height: 53, background: '#f5bd34', border: '1px solid #f5bd34' }}
      >
        <span style={{ fontFamily: 'Satoshi,sans-serif', fontWeight: 500, fontSize: 18, color: '#000' }}>
          Start your mission
        </span>
      </a>
    </nav>
  )
}
